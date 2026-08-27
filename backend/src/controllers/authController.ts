import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'
import { ErrorCode } from '../lib/errors'
import { verifyGoogleIdToken } from '../lib/googleAuth'

const DIACRITIC_MARKS_REGEX = /[\u0300-\u036f]/g

function slugifyUsername(base: string): string {
  const slug = base
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITIC_MARKS_REGEX, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'user'
}

async function generateUniqueUsername(base: string): Promise<string> {
  const slug = slugifyUsername(base)
  let candidate = slug
  let suffix = 0
  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    suffix += 1
    candidate = `${slug}-${suffix}`
  }
  return candidate
}

export async function getAuthConfig(_req: Request, res: Response): Promise<void> {
  res.json({ googleClientId: process.env.GOOGLE_CLIENT_ID ?? null })
}

export async function googleAuth(req: Request, res: Response): Promise<void> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    res.status(500).json({ error: ErrorCode.GOOGLE_LOGIN_NOT_CONFIGURED })
    return
  }

  const { credential } = req.body

  let googleUser
  try {
    googleUser = await verifyGoogleIdToken(credential, clientId)
  } catch {
    res.status(401).json({ error: ErrorCode.INVALID_GOOGLE_CREDENTIAL })
    return
  }

  let user = await prisma.user.findUnique({ where: { googleId: googleUser.sub } })

  if (!user) {
    const username = await generateUniqueUsername(googleUser.name || googleUser.email)
    user = await prisma.user.create({
      data: { googleId: googleUser.sub, email: googleUser.email, name: googleUser.name || googleUser.email, username },
    })
    await prisma.userProgress.create({ data: { userId: user.id } })
  } else if (user.name !== googleUser.name || user.email !== googleUser.email) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { name: googleUser.name || user.name, email: googleUser.email || user.email },
    })
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
    res.status(404).json({ error: ErrorCode.USER_NOT_FOUND })
    return
  }
  res.json(user)
}
