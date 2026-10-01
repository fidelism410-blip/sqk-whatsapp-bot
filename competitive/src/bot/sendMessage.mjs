export const sendText=(sock,jid,text)=>sock.sendMessage(jid,{text});export const sendImage=(sock,jid,buffer,caption='')=>sock.sendMessage(jid,{image:buffer,caption})
