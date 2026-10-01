import { env } from '../config/env.mjs'
export const nowIso = () => new Date().toISOString()
export const addHoursIso = (iso,h) => new Date(new Date(iso).getTime()+h*3600000).toISOString()
export function formatDateTime(value, locale='pt-BR'){ return new Intl.DateTimeFormat(locale,{timeZone:env.tz,dateStyle:'short',timeStyle:'short'}).format(new Date(value)) }
export function localDateParts(value=new Date()){ const parts=new Intl.DateTimeFormat('en-CA',{timeZone:env.tz,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(value); return Object.fromEntries(parts.map(p=>[p.type,p.value])) }
export function isToday(value){ const a=localDateParts(new Date(value)), b=localDateParts(new Date()); return a.year===b.year&&a.month===b.month&&a.day===b.day }
export function isExpired(iso){ return !iso || new Date(iso).getTime() <= Date.now() }
