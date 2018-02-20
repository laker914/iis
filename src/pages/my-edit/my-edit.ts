import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from '../../services/common';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import REMOTE_API from '../../utils/api';
/**
 * Generated class for the MyEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-edit',
  templateUrl: 'my-edit.html',
})
export class MyEditPage {
  updateForm: FormGroup;

  realName: any;
  idCard: any;
  insuranceNo: any;
  pk: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private storage: Storage,
    ) {
      this.updateForm = this.formBuilder.group({
        realName: ['',Validators.compose([Validators.required])],
        idCard: ['', Validators.compose([Validators.required]) ],
        insuranceNo : ['', Validators.compose([Validators.required]) ]
      });
      this.realName = this.updateForm.controls['realName'];
      this.idCard = this.updateForm.controls['idCard'];
      this.insuranceNo = this.updateForm.controls['insuranceNo'];

      let tokenPromise = this.commonService.getToken();
      this.pk = this.navParams.get('id');

      this.realName.value = this.navParams.get('realName');
      this.idCard.value = this.navParams.get('idCard');
      this.insuranceNo.value = this.navParams.get('insuranceNo');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyEditPage');
  }

  update(form){
    if (form.realName == '') {
      this.commonService.toastMsg('请输入姓名');
      return ;
    }
    if (form.idCard == '') {
      this.commonService.toastMsg('请输入身份证');
      return ;
    }
    if (form.insuranceNo == '') {
      this.commonService.toastMsg('请输入社保编号');
      return ;
    }
    let jsonData = {
      id: this.pk,
      realName: form.realName,
      idCard: form.idCard,
      insuranceNo: form.insuranceNo
    };
    this.http.post(REMOTE_API + "/modify", jsonData , {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded,charset=utf-8' })
    }).subscribe( (json) => {
      if (json['success'] == 1) {
        this.commonService.toastMsg(json['err_msg']);
      } else {
        let data = json['data'];
        this.storage.set('realName', data['realName']);
        this.storage.set('idCard', data['idCard']);
        this.storage.set('insuranceNo', data['insuranceNo']);
        this.storage.set('pci1', data['pic1']);
        this.storage.set('pci2', data['pic2']);
        this.commonService.toastMsgTop('修改成功');
        this.navCtrl.pop();
      }
    });
  }

}
