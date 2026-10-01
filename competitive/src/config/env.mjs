import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(here, '../../.env')
if (fs.existsSync(envPath)) {
  for (const raw of fs.readFileSync(envPath,'utf8').split(/\r?\n/)) {
    const line=raw.trim(); if(!line||line.startsWith('#')||!line.includes('=')) continue
    const i=line.indexOf('='); const k=line.slice(0,i).trim(); let v=line.slice(i+1).trim();
    if ((v.startsWith('\"')&&v.endsWith('\"'))||(v.startsWith("'")&&v.endsWith("'"))) v=v.slice(1,-1)
    if (process.env[k]===undefined) process.env[k]=v
  }
}

const bool = (v, fallback=false) => v == null ? fallback : ['1','true','yes','on'].includes(String(v).toLowerCase())
const int = (v, fallback) => Number.isFinite(Number(v)) ? Number(v) : fallback

export const env = {
  ownerPhone: process.env.OWNER_PHONE || '',
  ownerName: process.env.OWNER_NAME || 'FideliisNX',
  ownerKeyword: process.env.OWNER_KEYWORD || '',
  keywordSecret: process.env.KEYWORD_SECRET || '',
  databaseUrl: process.env.DATABASE_URL || '',
  databaseSsl: bool(process.env.DATABASE_SSL, false),
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
  dataDir: path.resolve(process.env.DATA_DIR || './data'),
  authDir: path.resolve(process.env.AUTH_DIR || './auth'),
  uploadsDir: path.resolve('./uploads'),
  sessionHours: int(process.env.SESSION_HOURS, 12),
  allowGroups: bool(process.env.ALLOW_GROUPS, false),
  botName: process.env.BOT_NAME || 'SQK Competitive',
  tz: process.env.TZ || 'America/Sao_Paulo',
  port: int(process.env.PORT, 10000),
  nodeEnv: process.env.NODE_ENV || 'development'
}

Object.defineProperties(env, {
  usePostgres: { get(){ return Boolean(env.databaseUrl) } },
  isProduction: { get(){ return env.nodeEnv === 'production' } }
})

export function validateEnv() {
  const missing = ['ownerPhone','ownerKeyword','keywordSecret'].filter(k => !env[k])
  if (missing.length) throw new Error(`Variáveis obrigatórias ausentes: ${missing.join(', ')}`)
  if (env.keywordSecret.length < 16) throw new Error('KEYWORD_SECRET deve ter pelo menos 16 caracteres')
  if (env.isProduction && !env.databaseUrl) throw new Error('DATABASE_URL é obrigatório em produção')
  return true
}
