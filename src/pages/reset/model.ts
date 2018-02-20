export class ResetModel{
	constructor(
		public password: string,
		public confirmPassword: string
	) { }

	toString(){
		return "password:" + this.password + ",confirmPassword:" + this.confirmPassword;
	}
}