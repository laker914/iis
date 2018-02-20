import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ResetModel } from './model';
import { CommonService } from '../../services/common';
import { LoginPage } from '../login/login';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import REMOTE_API from '../../utils/api';
/**
 * Generated class for the ResetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html',
  providers:[ CommonService ]
})
export class ResetPage {

  model = new ResetModel('','');
  phoneNo: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private commonService: CommonService, private http: HttpClient) {
        this.phoneNo = this.navParams.get('phoneNo');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPage');
  }

  commitTo(){
  	console.log(this.model.toString());
    if (this.model.password == "") {
      this.commonService.toastMsg("请输入密码");
      return ;
    }
    if (this.model.password.length < 6){
      this.commonService.toastMsg("密码长度至少6位");
      return ;
    }
    if (this.model.confirmPassword == "") {
      this.commonService.toastMsg("请输入确认密码");
      return ;
    }
    if (this.model.password === this.model.confirmPassword) {
      // ok
    } else {
       this.commonService.toastMsg("两次输入的密码不一致");
       return ;
    }
    let jsonData = {
      phoneNo: this.phoneNo,
      password: this.model.password,
      confirmPassword: this.model.confirmPassword
    } ;
    this.http.post(REMOTE_API + "/reset" , jsonData ,{
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded,charset=utf-8' })
      }).subscribe((data) => {
          if (data['success'] == 1) {
            this.commonService.toastMsg(data['err_msg']);
          } else {
            this.commonService.toastMsg('密码重置成功');
            this.navCtrl.setRoot(LoginPage,{ phoneNo: this.phoneNo });
          }
        });
  }
}
