import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import REMOTE_API from '../utils/api';

@Injectable()
export class CommonService {

	constructor(public alertCtrl: AlertController, private toast: Toast,
		private platform: Platform, private storage: Storage,private http: HttpClient ){

	}

	getToken(): Promise<string> {
		return this.storage.get('token').then((val) => { return val;});
	}

	removeSession(): void{
		this.storage.remove('token');
		this.storage.remove('phoneNo');
		this.storage.remove('realName');
		this.storage.remove('idCard');
	}

	//发送短信验证码
	sendSms(phoneNo) : void {
		console.log("send sms code....");
		this.http.post(REMOTE_API + "/sendSms?phoneNo="+ phoneNo , {} ,
      { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded,charset=utf-8' }) })
        .subscribe((data) => {
          if (data['success'] == 1) {
            this.toastMsg(data['err_msg']);
          }
        });
	}
	/**
	* 验证手机号码
	*/
	validPhoneNo(phoneNo: string): Boolean {
		let regex = /^[1][3,4,5,7,8][0-9]{9}$/;
		phoneNo = phoneNo.trim();
		return regex.test(phoneNo);
	}
	/**
	* 验证身份证号码
	*/
	validIdCard(idCard: string): any {
			var rtnInfo = {
				isTrue : false,
				year: null,
				month: null,
				day: null,
				isMale: false,
				isFemale: false
			};
			if (!idCard && idCard.length != 15 && idCard.length != 18) {
				rtnInfo.isTrue = false;
				return rtnInfo;
			}
			if (15 === idCard.length) {
				let year: string = idCard.substring(6,8);
				let month: string = idCard.substring(8,10);
				let day: string = idCard.substring(10,12);
				let sex: string = idCard.substring(14,15);
				let birthday: Date = new Date(parseFloat(year),parseFloat(month) - 1,parseFloat(day));
				if (birthday.getFullYear() != (parseFloat(year) - 1900)
						|| birthday.getMonth() != (parseFloat(month) - 1)
						|| birthday.getDate() != parseFloat(day)) {
						rtnInfo.isTrue = false;
				} else {
					rtnInfo.isTrue = true;
					rtnInfo.year = birthday.getFullYear();
					rtnInfo.month = birthday.getMonth() + 1;
					rtnInfo.day = birthday.getDate();
					let vv: number = (parseInt(sex) % 2);
					if (vv == 0) {
						rtnInfo.isFemale = true;
						rtnInfo.isMale = false;
					} else {
						rtnInfo.isFemale = false;
						rtnInfo.isMale = true;
					}
				}
				return rtnInfo;
			}
			if (18 == idCard.length) {
				let year = idCard.substring(6,10);
				let month = idCard.substring(10,12);
				let day:number = parseFloat(idCard.substring(12,14));
				let p = idCard.substring(14,17);
				let birthday: Date = new Date(parseFloat(year),parseFloat(month) - 1, day);
				if (birthday.getFullYear() != parseFloat(year)
						|| birthday.getMonth() != (parseFloat(month) - 1)
						|| birthday.getDate() != day){
					rtnInfo.isTrue = false;
					return rtnInfo;
				}
				const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];// 加权因子
        const Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];// 身份证验证位值.10代表X
				let sum = 0 ;
				let _cardNo = idCard.split("");
				if (_cardNo[17].toLowerCase() == 'x') {
					_cardNo[17] = '10'; //将最后位为X的验证码替换成10
				}
				for(let i = 0 ; i < 17; i++) {
					sum += Wi[i] * parseInt(_cardNo[i]); //加权求和
				}
				let j = sum % 11;
				if (parseInt(_cardNo[17]) != Y[j]) {
					rtnInfo.isTrue = false;
					return rtnInfo;
				}
				rtnInfo.isTrue = true;
				rtnInfo.year = birthday.getFullYear();
				rtnInfo.month = birthday.getMonth() + 1;
				rtnInfo.day = birthday.getDate();
				let vv: Number = (parseFloat(p) % 2);
				if (vv == 0) {
					rtnInfo.isFemale = true;
					rtnInfo.isMale = false;
				} else {
					rtnInfo.isFemale = false;
					rtnInfo.isMale = true;
				}
				return rtnInfo;
			}
			return rtnInfo;
	}

	alertMsg(msg:string){
		let alert = this.alertCtrl.create({
			title: msg, buttons:['确定']
		});
		alert.present();
	}

	toastMsg(msg:string) {
		if (this.platform.is('android') || this.platform.is('ios') || this.platform.is('windows') || this.platform.is('ipad')) {
			this.toast.showShortCenter(msg).subscribe();
		} else {
			this.alertMsg(msg);
		}
	}

	toastMsgTop(msg: string) {
		this.toast.showShortTop(msg).subscribe();
	}

	countDown(validCode : HTMLDivElement) {
		console.log(validCode);
	}
}
