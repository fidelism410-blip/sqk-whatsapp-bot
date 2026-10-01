import crypto from 'node:crypto'
export const generateId = (prefix='id') => `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(5).toString('hex')}`
