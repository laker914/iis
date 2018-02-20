import { FormControl,FormGroup } from '@angular/forms';
export class validators{
  equalValidator(group: FormGroup):any {
    let password: FormControl = group.get('password') as FormControl;
    let pwconfirm: FormControl = group.get("confirmPassword") as FormControl;
    let valid: boolean = (password.value === pwconfirm.value);
    return valid ? null : { passValidator:{descx: "两次输入的密码不一致"}};
  }
}
