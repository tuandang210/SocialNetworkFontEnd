import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Account} from '../model/account/account';
import {AccountService} from '../service/account/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  accountForm: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    email: new FormControl(),
    phone: new FormControl(),
    birthday: new FormControl(),
    confirmPassword: new FormControl()
  });
  accounts: Account[] = [];

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
  }


  submit() {
    this.accountService.getAllUser().subscribe(accounts => {
      let isAvailable = false;
      this.accounts = accounts;
      const account = this.accountForm.value;
      for (const x of this.accounts) {
        if (x.username === account.username) {
          isAvailable = true;
          alert('Username đã tồn tại');
          break;
        } else if (x.email === account.email) {
          isAvailable = true;
          alert('Email đã tồn tại');
          break;
        }
      }
      if (!isAvailable) {
        if (account.password === account.confirmPassword) {
          this.accountService.createAccount(account).subscribe(() => {
            this.accountForm.reset();
            alert('Tạo mới thành công!');
          });
        } else {
          alert('Mật khẩu không trùng nhau');
        }
      }
    });
  }
}
