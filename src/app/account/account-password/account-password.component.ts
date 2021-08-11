import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../service/account/account.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Account} from '../../model/account/account';

@Component({
  selector: 'app-account-password',
  templateUrl: './account-password.component.html',
  styleUrls: ['./account-password.component.css']
})
export class AccountPasswordComponent implements OnInit {

  accountForm: FormGroup = new FormGroup({
    oldPassword: new FormControl(),
    newPassword: new FormControl(),
    confirmPassword: new FormControl()
  });
  id: number;
  isDone = false;
  isError = false;
  account: Account = {};
  passwordType = 'password';
  passwordIcon = 'eye-off';


  constructor(private accountService: AccountService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = +paramMap.get('id');
      this.getAccount(this.id);
    });
  }

  ngOnInit() {
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    // this.passwordIcon = this.passwordIcon === 'hide' ? 'show' : 'hide';
  }

  public getAccount(id: number) {
    return this.accountService.findById(id).subscribe(account => {
      this.account = account;
      this.accountForm = new FormGroup({
        oldPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(32)])
      });
    });
  }

  updatePassword(id: number) {
    const changePassAcc = this.accountForm.value;
    this.accountService.updatePassword(changePassAcc, id).subscribe(() => {
      this.isDone = true;
      setTimeout(() => {
        this.isDone = false;
      }, 2000);
    }, error => {
      this.isError = true;
      setTimeout(() => {
        this.isError = false;
      }, 1500);
    });
  }

  get oldPassword() {
    return this.accountForm.get('oldPassword');
  }

  get newPassword() {
    return this.accountForm.get('newPassword');
  }

  get confirmPassword() {
    return this.accountForm.get('confirmPassword');
  }

}
