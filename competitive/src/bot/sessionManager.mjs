export class SessionManager{constructor(service){this.service=service}get(phone){return this.service.get(phone)}setFlow(...a){return this.service.setFlow(...a)}patch(...a){return this.service.patch(...a)}cancel(...a){return this.service.cancel(...a)}logout(...a){return this.service.logout(...a)}}
export default SessionManager
