import fs from 'node:fs/promises'
import path from 'node:path'
import { env } from '../config/env.mjs'
export async function ensureAllDirs(){ for(const d of [env.dataDir,env.authDir,path.join(env.uploadsDir,'logos'),path.join(env.uploadsDir,'payments'),path.join(env.uploadsDir,'results'),path.join(env.uploadsDir,'cards')]) await fs.mkdir(d,{recursive:true}) }
export const getDataPath=name=>path.join(env.dataDir,name)
export async function atomicWrite(file,content){ await fs.mkdir(path.dirname(file),{recursive:true}); const tmp=`${file}.${process.pid}.tmp`; await fs.writeFile(tmp,content); await fs.rename(tmp,file) }
export async function readText(file){ try{return await fs.readFile(file,'utf8')}catch(e){if(e.code==='ENOENT')return null;throw e} }
