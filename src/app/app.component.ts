import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, App, NavController, ActionSheetController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';
import { HomePage } from '../pages/home/home';
// import { LoginPage } from '../pages/login/login';
import { CommonService } from '../services/common';
import { SlidesPage } from '../pages/slides/slides';
import REMOTE_API from '../utils/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  templateUrl: 'app.html',
   providers:[ CommonService ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  // 版本号
  VERSION: string = '0.0.2';
  rootPage:any = HomePage;
  //控制硬件返回按钮是否触发，默认false
  backButtonPressed: boolean = false;

  constructor(public platform: Platform,
      public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      private network: Network,
      private commonService: CommonService,
      private appCtrl: App,
      private toastCtrl: Toast,
      private http: HttpClient,
      public actionSheetCtrl: ActionSheetController
    ) {
    platform.setLang('zh',true);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is('ios')) {
        statusBar.styleDefault();
      } else {
        statusBar.styleLightContent();
      }
      splashScreen.hide();
      let connectSubscription = this.network.onConnect().subscribe(() => {
      //unknown, ethernet, wifi, 2g, 3g, 4g, cellular, none
        console.log('connect.......');
        setTimeout(()=>{
          let typeName: string;
          if (this.network.type === 'wifi') {
            typeName = "WIFI连接";
          } else if (this.network.type === 'unknown') {
            typeName = "未知网络";
          } else if (this.network.type === 'ethernet') {
            typeName = "以太网";
          } else if (this.network.type === '2g') {
            typeName = "2G网络";
          } else if (this.network.type === '3g') {
            typeName = "3G网络";
          } else if (this.network.type === '4g') {
            typeName = "4G网络";
          } else if (this.network.type === 'cellular') {
            typeName = "蜂窝网络";
          } else {
            typeName = "无网络连接";
          }
          this.commonService.toastMsgTop("已连接网络,正在使用:" + typeName);
        },3000);
      });
      // connectSubscription.unsubscribe();
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        this.commonService.toastMsgTop("无网络连接");
      });
      // disconnectSubscription.unsubscribe();
      platform.registerBackButtonAction(() => {
          let activeNav: NavController = this.appCtrl.getActiveNav();
          if (activeNav.canGoBack()) {
            activeNav.pop();
          } else {
            this.showExit();
          }
      });

      //检查新版本
      this.http.get(REMOTE_API + '/chkUpdate?v=' + this.VERSION).subscribe((json) => {
        if (json['success'] == 1) {
          let actionSheet = this.actionSheetCtrl.create({
            title: '有新版本可以下载',
            buttons: [{
              text: '下载',
              handler: () => {
                window.open("http://apps.dobii.com","_self");
              }
            },{
              text: '取消',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }]
          });
          actionSheet.present();
        }
      });
    });
  }
   ngOnInit() {
      // Let's navigate from TabsPage to Page1
      console.log('ionViewDidLoad');
   }

   private showExit(): void {
      if (this.backButtonPressed) {
        this.platform.exitApp();
      } else {
        this.toastCtrl.show('再按一次退出应用','2000','top');
        this.backButtonPressed = true;
        setTimeout(() => this.backButtonPressed = false,2000);
      }
   }
}
