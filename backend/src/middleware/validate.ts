import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const issue = result.error.issues[0]
      res.status(400).json({ error: issue.message, field: issue.path[0] })
      return
    }
    req.body = result.data
    next()
  }
}
