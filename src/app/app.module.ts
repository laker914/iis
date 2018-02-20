import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Toast } from '@ionic-native/toast';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { HTTP } from '@ionic-native/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

// import { LoginPage } from '../pages/login/login';
// import { RegisterPage } from '../pages/register/register';
// import { SlidesPage } from '../pages/slides/slides';

import { AuthInterceptor } from '../utils/AuthInterceptor';
import { CommonService } from '../services/common';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    // LoginPage,
    // RegisterPage,
    // SlidesPage
    // ,ForgetPage
  ],
  imports: [
    BrowserModule,HttpClientModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: '',
      backButtonIcon: 'arrow-back',
      // iconMode:'ios',  //  在整个应用程序中为所有图标使用的模式。可用选项："ios"，"md"
      // mode:'ios'
    }),
    IonicStorageModule.forRoot({
      name: '__mydb', driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    // LoginPage,
    // RegisterPage,
    // SlidesPage
    // ,ForgetPage
  ],
  providers: [
    StatusBar,CommonService,
    SplashScreen,Toast,Camera,Network,HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // }
  ]
})
export class AppModule {}
