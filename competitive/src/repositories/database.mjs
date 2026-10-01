import { env } from '../config/env.mjs'
import { ensureAllDirs, getDataPath, readText, atomicWrite } from '../utils/files.mjs'
import { logInfo } from '../utils/logger.mjs'
import Migrations from './migrations.mjs'

const TABLE_MAP={users:'users',captains:'captains',scrims:'scrims',teams:'teams',registrations:'registrations',payments:'payments',results:'results',result_players:'resultPlayers',rules:'rules',bans:'bans',audit:'audit',media:'media',whatsapp_auth:'whatsappAuth',app_sessions:'appSessions',processed_messages:'processedMessages',schema_migrations:'schemaMigrations'}
const META={
 users:['id','phone','name','role','keywordHash','active','createdAt','updatedAt'],
 captains:['id','userId','organization','active','createdAt','updatedAt'],
 scrims:['id','name','date','time','mode','maxTeams','entryFee','pixKey','drops','status','scoringConfig','disallowDuplicatePlayers','createdBy','createdAt','updatedAt'],
 teams:['id','captainId','name','logoMediaId','createdAt','updatedAt'],
 registrations:['id','scrimId','teamId','captainId','teamName','players','playerKeys','reserves','logoMediaId','slot','status','createdAt','updatedAt'],
 payments:['id','registrationId','proofMediaId','status','amount','duplicate','suspicious','duplicateOfPaymentId','duplicateOfMediaId','approvedBy','approvedAt','createdAt','updatedAt'],
 results:['id','scrimId','registrationId','drop','placement','kills','multiplier','points','screenshotMediaId','aiConfidence','status','approvedBy','approvedAt','createdAt','updatedAt'],
 result_players:['id','resultId','registrationId','playerName','playerKey','kills','createdAt','updatedAt'],
 rules:['id','content','createdBy','createdAt','updatedAt'], bans:['id','phone','reason','active','createdBy','createdAt','updatedAt','expiresAt'],
 audit:['id','action','actor','targetType','targetId','changes','metadata','createdAt'], media:['id','category','filename','mimeType','sha256','data','createdAt','updatedAt'],
 whatsapp_auth:['id','authKey','authValue','createdAt','updatedAt'], app_sessions:['id','phone','userId','role','flow','step','tempData','expiresAt','createdAt','updatedAt'],
 processed_messages:['id','messageId','senderPhone','kind','processedAt','expiresAt'], schema_migrations:['id','name','executedAt']
}
const NUMERIC=new Set(['maxTeams','entryFee','drops','slot','amount','drop','placement','kills','multiplier','points','aiConfidence'])
const IMMUTABLE=new Set(['audit','processed_messages','schema_migrations'])
const snake=s=>s.replace(/([A-Z])/g,'_$1').toLowerCase(); const camel=s=>s.replace(/_([a-z])/g,(_,c)=>c.toUpperCase())
export class Database{
 constructor(){this.pool=null;this.usePostgres=env.usePostgres;this.initialized=false;this.initializing=false;this.jsonData=null;this.queue=Promise.resolve()}
 tableKey(table){ if(!TABLE_MAP[table]) throw new Error(`Tabela não permitida: ${table}`); return TABLE_MAP[table] }
 validateColumn(table,col){ const c=camel(col); if(!META[table]?.includes(c)) throw new Error(`Coluna não permitida: ${table}.${col}`); return c }
 fromRow(row){ if(!row)return row; const out={}; for(const [k,v] of Object.entries(row)){ const c=camel(k); out[c]=NUMERIC.has(c)&&v!==null?Number(v):v } return out }
 toRow(obj){ const out={}; for(const [k,v] of Object.entries(obj||{})) out[snake(k)]=v; return out }
 async init(){await ensureAllDirs(); if(this.usePostgres)return this.initPostgres(); return this.initJson()}
 async initPostgres(){const { Pool } = await import('pg');this.pool=new Pool({connectionString:env.databaseUrl,ssl:env.databaseSsl?{rejectUnauthorized:false}:false,max:10,idleTimeoutMillis:30000,connectionTimeoutMillis:15000}); this.initializing=true; try{await this.pool.query('SELECT 1'); this.migrations=new Migrations(this); await this.migrations.runAll(); this.initialized=true;logInfo('PostgreSQL pronto');return true}finally{this.initializing=false}}
 empty(){return Object.fromEntries(Object.values(TABLE_MAP).map(k=>[k,[]]))}
 async initJson(){this.jsonData=this.empty(); const t=await readText(getDataPath('db.json')); if(t){const loaded=JSON.parse(t);this.jsonData={...this.empty(),...loaded}} this.initialized=true;return true}
 async saveJson(){const body=JSON.stringify(this.jsonData,null,2);const task=this.queue.catch(()=>{}).then(()=>atomicWrite(getDataPath('db.json'),body));this.queue=task.catch(()=>{});return task}
 async query(sql,params=[],client=null){if(!this.usePostgres)throw new Error('SQL indisponível no fallback JSON'); if(!this.initialized&&!this.initializing)throw new Error('Database não inicializado'); return client?client.query(sql,params):this.pool.query(sql,params)}
 async queryOne(sql,params=[],client=null){const r=await this.query(sql,params,client);return this.fromRow(r.rows[0]||null)}
 async queryAll(sql,params=[],client=null){const r=await this.query(sql,params,client);return r.rows.map(x=>this.fromRow(x))}
 async insert(table,data,ctx=null){this.tableKey(table); for(const k of Object.keys(data))this.validateColumn(table,k); if(this.usePostgres){const row=this.toRow(data),ks=Object.keys(row),vals=Object.values(row);const q=`INSERT INTO ${table} (${ks.join(',')}) VALUES (${ks.map((_,i)=>`$${i+1}`).join(',')}) RETURNING *`;return this.queryOne(q,vals,ctx)} const target=(ctx?.jsonData||this.jsonData)[this.tableKey(table)]; const obj={...data}; target.push(obj); if(!ctx)await this.saveJson(); return structuredClone(obj)}
 async update(table,id,data,ctx=null){this.tableKey(table); if(IMMUTABLE.has(table))throw new Error(`${table} é imutável`); for(const k of Object.keys(data))this.validateColumn(table,k); const patch={...data,updatedAt:new Date().toISOString()}; if(this.usePostgres){const row=this.toRow(patch),ks=Object.keys(row),vals=Object.values(row);const q=`UPDATE ${table} SET ${ks.map((k,i)=>`${k}=$${i+1}`).join(',')} WHERE id=$${ks.length+1} RETURNING *`;return this.queryOne(q,[...vals,id],ctx)} const target=(ctx?.jsonData||this.jsonData)[this.tableKey(table)], obj=target.find(x=>x.id===id); if(!obj)return null;Object.assign(obj,patch);if(!ctx)await this.saveJson();return structuredClone(obj)}
 async delete(table,id,ctx=null){this.tableKey(table);if(IMMUTABLE.has(table))throw new Error(`${table} é imutável`);if(this.usePostgres)return this.queryOne(`DELETE FROM ${table} WHERE id=$1 RETURNING *`,[id],ctx);const arr=(ctx?.jsonData||this.jsonData)[this.tableKey(table)],i=arr.findIndex(x=>x.id===id);if(i<0)return null;const [o]=arr.splice(i,1);if(!ctx)await this.saveJson();return structuredClone(o)}
 async find(table,id,ctx=null){this.tableKey(table);if(this.usePostgres)return this.queryOne(`SELECT * FROM ${table} WHERE id=$1`,[id],ctx);return structuredClone((ctx?.jsonData||this.jsonData)[this.tableKey(table)].find(x=>x.id===id)||null)}
 async findBy(table,column,value,ctx=null){this.tableKey(table);const c=this.validateColumn(table,column);if(this.usePostgres)return this.queryOne(`SELECT * FROM ${table} WHERE ${snake(c)}=$1`,[value],ctx);return structuredClone((ctx?.jsonData||this.jsonData)[this.tableKey(table)].find(x=>x[c]===value)||null)}
 async findAllBy(table,column,value,ctx=null){this.tableKey(table);const c=this.validateColumn(table,column);if(this.usePostgres)return this.queryAll(`SELECT * FROM ${table} WHERE ${snake(c)}=$1`,[value],ctx);return structuredClone((ctx?.jsonData||this.jsonData)[this.tableKey(table)].filter(x=>x[c]===value))}
 async findAll(table,limit=1000,ctx=null){this.tableKey(table);if(this.usePostgres)return this.queryAll(`SELECT * FROM ${table} LIMIT $1`,[limit],ctx);return structuredClone((ctx?.jsonData||this.jsonData)[this.tableKey(table)].slice(0,limit))}
 async transaction(fn){if(this.usePostgres){const c=await this.pool.connect();try{await c.query('BEGIN');const r=await fn(c);await c.query('COMMIT');return r}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}} const task=this.queue.catch(()=>{}).then(async()=>{const snapshot=structuredClone(this.jsonData),ctx={jsonData:structuredClone(this.jsonData)};try{const r=await fn(ctx);this.jsonData=ctx.jsonData;await atomicWrite(getDataPath('db.json'),JSON.stringify(this.jsonData,null,2));return r}catch(e){this.jsonData=snapshot;throw e}});this.queue=task.catch(()=>{});return task}
 async health(){try{if(this.usePostgres){await this.pool.query('SELECT 1');return true}return Boolean(this.jsonData)}catch{return false}}
 async close(){if(this.pool)await this.pool.end();if(this.queue)await this.queue}
}
export default Database
