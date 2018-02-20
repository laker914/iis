import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyEditPage } from './my-edit';

@NgModule({
  declarations: [
    MyEditPage,
  ],
  imports: [
    IonicPageModule.forChild(MyEditPage),
  ],
})
export class MyEditPageModule {}
