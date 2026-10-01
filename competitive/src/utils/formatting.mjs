export const money=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v||0))
export const points=v=>Number(v||0).toFixed(1)
export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
export const menu=(title,items)=>`*${title}*\n\n${items.map(([n,t])=>`${n} - ${t}`).join('\n')}`
