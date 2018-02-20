import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common';
import REMOTE_API from '../../utils/api';

// import { ModalController } from 'ionic-angular';
/**
 * Generated class for the MyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my',
  templateUrl: 'my.html',
})
export class MyPage {
  up1: boolean = true;
  up2: boolean = true;
  user: any = {
    id:'', realName:'',phoneNo:'',idCard:'',insuranceNo: '',pic1: '', pic2: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,private camera: Camera,
    private http: HttpClient, private commonService: CommonService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyPage');
    // this.commonService.toastMsg('MyPage');
  }

  ionViewDidEnter(){
    let tokenP = this.commonService.getToken();
    tokenP.then((tokenId) => {
      if (tokenId === 'nologin') {
         this.navCtrl.push('LoginPage');
      } else {
          this.http.get(REMOTE_API + '/me?tokenId=' + tokenId)
              .subscribe((json) => {
                  if (json['success'] == 0) {
                     this.user = json['data'];
                     const IMAGE_API = REMOTE_API.replace('/api/v1','/filedav/');
                     if (this.user['pic1'] != null && this.user['pic1'] != '' ) {
                       this.up1 = false;
                       (<HTMLImageElement>document.getElementById('font-photo')).src = IMAGE_API + this.user['pic1'];
                     }
                     if (this.user['pic2'] != null && this.user['pic2'] != '') {
                       this.up2 = false;
                       (<HTMLImageElement>document.getElementById('backend-photo')).src = IMAGE_API + this.user['pic2'];
                     }
                  } else {
                     this.commonService.toastMsg(json['err_msg']);
                     this.navCtrl.pop({animate:true});
                  }
          });
        }
    });
  }

  edit() {
    this.navCtrl.push('MyEditPage',{
      id: this.user['id'],
      realName: this.user['realName'],
      idCard: this.user['idCard'],
      insuranceNo: this.user['insuranceNo']
    });
  }

  ngOnInit(){

  }

  getPicture(htmlId: string){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
       if (htmlId == 'font-photo') {
         this.up1 = false;
       } else {
         this.up2 = false;
       }
       let base64Image = 'data:image/jpeg;base64,' + imageData;
       (<HTMLImageElement>document.getElementById(htmlId)).src = base64Image;
       // 提交后台
       let jsonData = {
         token: this.user['id'],
         type: (htmlId == 'font-photo' ? 'front':'backend'),
         imgs: base64Image
       };
       this.http.post(REMOTE_API + "/uploadPic" , jsonData ,{
         headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded,charset=utf-8' })
       }).subscribe((json) => {
          if (json['success'] == '1') {
             this.commonService.toastMsg(json['err_msg']);
          } else {
             this.commonService.toastMsg('上传成功');
          }
       });
      }, (err) => {
       // Handle error
         if (htmlId == 'font-photo') {
           this.up1 = true;
         } else {
           this.up2 = true;
         }
     });
  }
}
