import{downloadMediaMessage}from'@whiskeysockets/baileys'
export class MediaDownloader{constructor(sock){this.sock=sock}updateSocket(s){this.sock=s}async download(msg){return downloadMediaMessage(msg,'buffer',{}, {logger:this.sock?.logger,reuploadRequest:this.sock?.updateMediaMessage})}}export default MediaDownloader
