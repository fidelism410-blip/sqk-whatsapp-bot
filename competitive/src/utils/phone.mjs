function bareUser(value) {
  const beforeAt = String(value || '').trim().split('@')[0]
  return beforeAt.split(':')[0]
}
export function normalizePhone(value) {
  let d = bareUser(value).replace(/\D/g,'').replace(/^0+/,'')
  if (!d) return ''
  if (d.startsWith('55')) d = d.slice(2)
  if (![10,11].includes(d.length)) return ''
  const ddd = Number(d.slice(0,2))
  if (ddd < 11 || ddd > 99) return ''
  return `55${d}`
}
export const jidFromPhone = phone => { const p=normalizePhone(phone); return p ? `${p}@s.whatsapp.net` : '' }
export const phoneFromJid = jid => String(jid||'').endsWith('@s.whatsapp.net') ? normalizePhone(jid) : ''
export const isGroupJid = jid => String(jid||'').endsWith('@g.us')
export const isLidJid = jid => String(jid||'').endsWith('@lid')
export const isPrivateJid = jid => String(jid||'').endsWith('@s.whatsapp.net')
export const isValidPhone = phone => Boolean(normalizePhone(phone))
export function formatPhoneDisplay(phone){ const p=normalizePhone(phone); if(!p) return ''; const n=p.slice(2); return n.length===11?`+55 ${n.slice(0,2)} ${n.slice(2,7)}-${n.slice(7)}`:`+55 ${n.slice(0,2)} ${n.slice(2,6)}-${n.slice(6)}` }
