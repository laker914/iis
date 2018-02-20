import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { CommonService } from '../../services/common';
import { FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Storage } from '@ionic/storage';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import REMOTE_API from '../../utils/api';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers:[ CommonService ]
})
export class LoginPage {

  loginForm: FormGroup;
  phoneNo: any;
  password: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public alertCtrl: AlertController, private formBuilder: FormBuilder,
    private storage: Storage, private http: HttpClient,
    private commonService: CommonService) {
      this.loginForm = this.formBuilder.group({
        phoneNo: ['',
            Validators.compose([
               Validators.required, Validators.pattern("^(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$")])],
        password: ['',
            Validators.compose([Validators.required, Validators.minLength(6)])]
      });
      this.phoneNo = this.loginForm.controls['phoneNo'];
      this.password = this.loginForm.controls['password'];
      this.phoneNo.value = this.navParams.get('phoneNo') || "";
      // console.log(this.phoneNo);
  }

  ngOnInit(){
    // this.loginForm.controls['phoneNo'] = '18662580567';
  }

  ionViewDidLoad() {
     console.log('ionViewDidLoad LoginPage');
  }

login(form) {
  if (form.phoneNo == '') {
    this.commonService.toastMsg('请输入手机号');
    return ;
  }
  if (form.password == '') {
    this.commonService.toastMsg('请输入密码');
    return ;
  }
  let jsonData = {
    phoneNo: form.phoneNo,
    password: form.password
  }
  this.http.post(REMOTE_API + "/login" , jsonData ,
    { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded,charset=utf-8' }) })
      .subscribe((json) => {
        if (json['success'] == 1) {
          this.commonService.toastMsg(json['err_msg']);
        } else {
          if (json['data'] != null) {
            let data = json['data'];
            this.storage.set('token' , data['token']);
            this.storage.set('realName' , data['realName']);
            this.storage.set('phoneNo' , data['phoneNo']);
            this.storage.set('idCard' , data['idCard']);
          }
          this.navCtrl.setRoot(HomePage,{},
            {'direction':'forward','animate':true});
        }
      });
  // this.storage.set('sessionid' , form.phoneNo);
  // this.navCtrl.setRoot(HomePage);
}

/**
* 进入注册页面
*/
registerTo(){
	this.navCtrl.push('RegisterPage');
}

forgetTo() {
	// 懒加载模式 用引号代替引入的对象
	this.navCtrl.push("ForgetPage");
}

showMsg(msg) {
	let alert = this.alertCtrl.create({
		title: msg, buttons:['确定']
	});
	alert.present();
}
}
