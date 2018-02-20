import { Component } from '@angular/core';
import { NavController ,AlertController} from 'ionic-angular';
// import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { CommonService } from '../../services/common';
import REMOTE_API from '../../utils/api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController , private storage: Storage,private alertCtrl: AlertController
      ,private commonService: CommonService) {

  }
  ngOnInit(){
    // 此处判断session，若无登录则进入登录页面
  	// this.navCtrl.push(LoginPage);
    this.commonService.getToken().then((val) => {
      if (val == null || val == '') {
        this.navCtrl.push('LoginPage');
      }
    })
  }

  searchInsurance(nIndex: number){

  }

  goToMy() {
    this.navCtrl.push('MyPage');
  }

  logout(){
    let alert =  this.alertCtrl.create({
      title: '确定要退出?',
      buttons: [
        {
          text: '取消', role: 'cancel'
        }, {
          text: '退出', handler: () => {
            this.storage.get('token').then((val) => {
              if (val != null && val != '') {
                this.storage.remove('token').then((v) => {
                  this.commonService.removeSession();
                  this.navCtrl.setRoot('LoginPage',{},{'animate':true});
                });
              }
            });
          }
        }]
    });
    alert.present();
  }
}
