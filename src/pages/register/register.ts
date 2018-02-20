import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonService } from '../../services/common';
import { validators } from '../../services/validators';
// import { RegisterModel } from './model';
import { FormBuilder, Validators, FormGroup} from '@angular/forms';
import { HTTP } from '@ionic-native/http';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import REMOTE_API from '../../utils/api';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers:[ CommonService , validators ]
})
export class RegisterPage {

  isUnchanged: boolean;
  isRead: boolean;

  registerForm: FormGroup;
  realName: any;
  phoneNo: any;
  password: any;
  confirmPassword: any;
  validCode: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  		private commonService: CommonService, private formBuilder: FormBuilder,
      private validators: validators, public el: ElementRef, private http: HttpClient) {
      this.registerForm = this.formBuilder.group({
        realName: ['',Validators.compose([Validators.required])],
        phoneNo: ['', Validators.compose([ Validators.required, Validators.pattern("^(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$")])],
        passwordGroup: this.formBuilder.group({
          password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
          confirmPassword: ['',Validators.compose([Validators.required])]
        },{ validator: this.validators.equalValidator }),
        validCode: ['',Validators.compose([Validators.required])]
      });
      this.realName = this.registerForm.controls['realName'];
      this.phoneNo = this.registerForm.controls['phoneNo'];
      this.password = this.registerForm.controls['password'];
      this.confirmPassword = this.registerForm.controls['confirmPassword'];
      this.validCode = this.registerForm.controls['validCode'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.isUnchanged = true;
  }

  showBtn(phoneNo: HTMLInputElement) {
  	  let phone = phoneNo.value	;
  	  if(phone == '') {
  	  	this.isUnchanged = true;
  	  	return ;
  	  }
  	  let ok = this.commonService.validPhoneNo(phone);
  	  if (ok) {
		      this.isUnchanged = false;
  	  } else {
  	  	  this.isUnchanged = true;
  	  }
  }

  sendSms() {
  	this.commonService.sendSms(this.phoneNo.value);
  	let time = 60;
  	let timer = null;
  	//隐藏发送按钮
    this.isUnchanged = true;
  	timer = setInterval(() => {
  		time--;
  		this.el.nativeElement.querySelector("#sendValidCodeBtn").querySelector(".button-inner").innerText ="  " + time + " (s) ";
  		if (time <= 0) {
  			this.el.nativeElement.querySelector("#sendValidCodeBtn").querySelector(".button-inner").innerText="重新获取验证码";
        this.isUnchanged = false;
  			clearInterval(timer);
  		}
  	},1000);
  }

  register(form) {
    console.log("进入注册.....");
    // {"realName":"胡畔","phoneNo":"18662580567","passwordGroup":{"password":"123456","confirmPassword":"123456"},"validCode":"1234"}
    let jsonData = {
      realName: form.realName,
      phoneNo: form.phoneNo,
      password: form.passwordGroup.password,
      validCode: form.validCode
    };
    this.http.post(REMOTE_API + "/register" , jsonData ,
      { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded,charset=utf-8' }) })
        .subscribe((data) => {
          if (data['success'] == 1) {
            this.commonService.toastMsg(data['err_msg']);
          } else {
            this.commonService.toastMsg('注册成功,等待审核');
            this.navCtrl.setRoot('LoginPage',{phoneNo: form.phoneNo});
          }
        });
  }
}
