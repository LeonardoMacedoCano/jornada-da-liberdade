import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password, username } = req.body

  if (!name || !email || !password || !username) {
    res.status(400).json({ error: 'Todos os campos são obrigatórios' })
    return
  }

  const usernameRegex = /^[a-z0-9-]+$/
  if (!usernameRegex.test(username)) {
    res.status(400).json({ error: 'Username deve conter apenas letras minúsculas, números e hífens' })
    return
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })
  if (existingUser) {
    res.status(409).json({ error: existingUser.email === email ? 'E-mail já cadastrado' : 'Username já em uso' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, passwordHash, username },
  })

  await prisma.userProgress.create({ data: { userId: user.id } })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' })
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, username: user.username } })
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'E-mail e senha são obrigatórios' })
    return
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(401).json({ error: 'Credenciais inválidas' })
    return
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    res.status(401).json({ error: 'Credenciais inválidas' })
    return
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' })
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, username: user.username } })
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, username: true, avatarType: true, sharePublicProfile: true, showFinancialValues: true, createdAt: true },
  })
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' })
    return
  }
  res.json(user)
}
