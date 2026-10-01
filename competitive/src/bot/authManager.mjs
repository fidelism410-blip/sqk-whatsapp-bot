export class AuthManager{constructor(service){this.service=service}authenticate(phone,keyword){return this.service.authenticate(phone,keyword)}bootstrapOwner(){return this.service.bootstrapOwner()}}
export default AuthManager
