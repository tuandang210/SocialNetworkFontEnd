import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Account} from '../model/account/account';
import {AccountService} from '../service/account/account.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  accountForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
    email: new FormControl('', [Validators.pattern('^[a-z0-9]+@[a-z]+\\.[a-z]{2,6}$')]),
    phone: new FormControl('', [Validators.pattern('^0+[0-9]{9}$')]),
    birthday: new FormControl('', [Validators.pattern('^(0?[1-9]|[12][0-9]|3[01])[\\/\\-](0?[1-9]|1[012])[\\/\\-]\\d{4}$')]),
    confirmPassword: new FormControl()
  });
  accounts: Account[] = [];
  isDone = false;
  isUsername = false;
  isPassword = false;
  isEmail = false;
  message = '';
  passwordType = 'password';

  constructor(private accountService: AccountService,
              private router: Router) {
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
          this.message = 'Tên tài khoản đã tồn tại';
          this.isUsername = true;
          // alert('Username đã tồn tại');
          break;
        } else if (x.email === account.email) {
          isAvailable = true;
          this.message = 'Email đã tồn tại';
          this.isEmail = true;
          // alert('Email đã tồn tại');
          break;
        }
      }
      if (!isAvailable) {
        if (account.password === account.confirmPassword) {
          this.accountService.username1 = this.accountForm.value.username;
          this.accountService.password1 = this.accountForm.value.password;
          this.accountService.createAccount(account).subscribe(() => {
            this.isDone = true;
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000);
          });
        } else {
          this.message = 'Xác nhận mật khẩu không trùng';
          this.isPassword = true;
          // alert('Mật khẩu không trùng nhau');
        }
      }
    });
  }

  get username() {
    return this.accountForm.get('username');
  }

  get password() {
    return this.accountForm.get('password');
  }

  get email() {
    return this.accountForm.get('email');
  }

  get birthday() {
    return this.accountForm.get('birthday');
  }

  get phone() {
    return this.accountForm.get('phone');
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    // this.passwordIcon = this.passwordIcon === 'hide' ? 'show' : 'hide';
  }
}
