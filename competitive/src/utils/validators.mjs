import { isValidPhone } from './phone.mjs'
import { SCRIM_MODES, MODE_PLAYERS } from '../config/constants.mjs'
export const validatePhone=isValidPhone
export const validateKeyword=v=>{const s=String(v||'').trim();return s.length>=4&&s.length<=50}
export const validateTeamName=v=>{const s=String(v||'').trim();return s.length>=2&&s.length<=60}
export const validatePlayerName=v=>{const s=String(v||'').trim();return s.length>=2&&s.length<=40}
export const validateKills=v=>Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<=999
export const validatePlacement=v=>Number.isInteger(Number(v))&&Number(v)>=1&&Number(v)<=200
export const validateMode=v=>Object.values(SCRIM_MODES).includes(String(v||'').toUpperCase())
export function validateLine(mode,players,reserves=[]){ const m=String(mode||'').toUpperCase(); return validateMode(m)&&Array.isArray(players)&&players.length===MODE_PLAYERS[m]&&players.every(validatePlayerName)&&Array.isArray(reserves)&&reserves.length<=3&&reserves.every(validatePlayerName) }
export const validatePixKey=v=>{const s=String(v||'').trim();return s.length>=3&&s.length<=255}
export const validateMaxTeams=v=>Number.isInteger(Number(v))&&Number(v)>=1&&Number(v)<=200
export const validateDrops=v=>Number.isInteger(Number(v))&&Number(v)>=1&&Number(v)<=20
export const validateEntryFee=v=>Number.isFinite(Number(v))&&Number(v)>=0&&Number(v)<=99999
