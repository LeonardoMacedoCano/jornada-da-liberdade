import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'
import { ErrorCode } from '../lib/errors'

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password, username } = req.body

  if (!name || !email || !password || !username) {
    res.status(400).json({ error: ErrorCode.ALL_FIELDS_REQUIRED })
    return
  }

  const usernameRegex = /^[a-z0-9-]+$/
  if (!usernameRegex.test(username)) {
    res.status(400).json({ error: ErrorCode.INVALID_USERNAME_FORMAT })
    return
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })
  if (existingUser) {
    res.status(409).json({ error: existingUser.email === email ? ErrorCode.EMAIL_ALREADY_REGISTERED : ErrorCode.USERNAME_ALREADY_IN_USE })
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, passwordHash, username },
  })

  await prisma.userProgress.create({ data: { userId: user.id } })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' })
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, username: user.username, language: user.language } })
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: ErrorCode.EMAIL_PASSWORD_REQUIRED })
    return
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(401).json({ error: ErrorCode.INVALID_CREDENTIALS })
    return
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    res.status(401).json({ error: ErrorCode.INVALID_CREDENTIALS })
    return
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' })
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, username: user.username, language: user.language } })
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, username: true, avatarType: true, language: true, sharePublicProfile: true, showFinancialValues: true, createdAt: true },
  })
  if (!user) {
    res.status(404).json({ error: ErrorCode.USER_NOT_FOUND })
    return
  }
  res.json(user)
}
