import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../service/authentication/authentication.service';
import {Router} from '@angular/router';
import {AccountService} from '../service/account/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(this.accountService.username1),
    password: new FormControl(this.accountService.password1),
  });
  isLogin = false;
  isBlock = false;
  isError = false;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private accountService: AccountService) {
  }

  ngOnInit() {
  }

  submit() {
    this.authenticationService.login(this.loginForm.get('username').value, this.loginForm.get('password').value).subscribe(() => {
      if (this.authenticationService.currentUserValue.active) {
        // alert('Đăng nhập thành công!!');
        this.isLogin = true;
        if (this.loginForm.get('username').value === 'admin') {
          setTimeout(() => {
            this.router.navigate(['/accounts/list']);
          }, 1000);
        } else {
          setTimeout(() => {
            this.router.navigate(['/profile/' + this.loginForm.get('username').value]);
          }, 1000);
        }
      } else if (this.authenticationService.currentUserValue.active === false) {
        // alert('Tài khoản của bạn bị khóa!');
        this.isBlock = true;
        this.authenticationService.logout();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      }
    }, error => {
      this.isError = true;
      setTimeout(() => {
        this.isError = false;
      }, 5000);
    });
  }
}
