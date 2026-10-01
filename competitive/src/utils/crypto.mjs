import crypto from 'node:crypto'
export function hashKeyword(keyword, secret){ if(!keyword||!secret) throw new Error('Keyword e secret obrigatórios'); return crypto.createHmac('sha256',secret).update(String(keyword).trim()).digest('hex') }
export function verifyKeyword(keyword, expected, secret){ try { const a=Buffer.from(hashKeyword(keyword,secret),'hex'); const b=Buffer.from(String(expected||''),'hex'); return a.length===b.length && crypto.timingSafeEqual(a,b) } catch { return false } }
export const sha256 = buffer => crypto.createHash('sha256').update(buffer).digest('hex')
export const generateToken = (bytes=24) => crypto.randomBytes(bytes).toString('hex')
