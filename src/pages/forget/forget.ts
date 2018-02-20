import { Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonService } from '../../services/common';

import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import REMOTE_API from '../../utils/api';
/**
 * Generated class for the ForgetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
  providers:[ CommonService ]
})
export class ForgetPage {

  isUnchanged = true;
  isReadOnly = false;
  forgetForm = new FormGroup({
    'idCard': new FormControl(),
    'phoneNo': new FormControl(),
    'validCode': new FormControl()
  });

  constructor(public navCtrl: NavController, public navParams: NavParams
  		,private commonService: CommonService,public el: ElementRef,
    private http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPage');
  }

  showBtn() {
  	  let phone = this.forgetForm.get('phoneNo').value;
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
    let phone = this.forgetForm.get('phoneNo').value;
  	this.commonService.sendSms(phone);
    let time = 60;
    let timer = null;
    this.isUnchanged = true;
    timer = setInterval(() => {
      time--;
      this.el.nativeElement.querySelector("#sendBtn").querySelector(".button-inner").innerText = "  " + time + " (s) ";
      if (time <= 0) {
        this.el.nativeElement.querySelector("#sendBtn").querySelector(".button-inner").innerText = "重新获取验证码";
        clearInterval(timer);
        this.isUnchanged = false;
      }
    },1000);
  }

  doCommit(){
    console.log(this.forgetForm.value);
    let form = this.forgetForm.value;
    // if (form.idCard == null || form.idCard == '') {
    //   this.commonService.toastMsg('请输入身份证');
    //   return ;
    // }
    // form.idCard = form.idCard.trim();
    // var validConfig = this.commonService.validIdCard(form.idCard);
    // if (!validConfig.isTrue) {
    //   this.commonService.toastMsg('请输入正确的身份证号码');
    //   return ;
    // }
    if (form.phoneNo == null || form.phoneNo == '') {
      this.commonService.toastMsg('请输入手机号');
      return ;
    }
    if (form.validCode == null || form.validCode == '') {
      this.commonService.toastMsg('请输入验证码');
      return ;
    }
    let jsonData = {
      phoneNo: form.phoneNo,
      validCode: form.validCode
    }
    this.http.post(REMOTE_API + "/forget" , jsonData ,
      { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded,charset=utf-8' }) })
        .subscribe((data) => {
          if (data['success'] == 1) {
            this.commonService.toastMsg(data['err_msg']);
          } else {
            this.navCtrl.push('ResetPage',{
              phoneNo: form.phoneNo
            });
          }
        });
  }
}
