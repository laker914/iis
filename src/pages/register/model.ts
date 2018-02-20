export class RegisterModel{
	constructor(
		public realName: string,
		public password: string,
		public confirmPassword: string,
		public phoneNo: string,
		public idCard: string,
		public validCode: string
	){}

	toString(){
		 return "realName:" + this.realName+", phoneNo:" + this.phoneNo +", password:" + this.password + ",idCard:" + this.idCard;
	}
}
