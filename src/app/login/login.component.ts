import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../service/authentication/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
  }

  submit() {
    this.authenticationService.login(this.loginForm.get('username').value, this.loginForm.get('password').value).subscribe(() => {
      if (this.authenticationService.currentUserValue.active) {
        alert('Đăng nhập thành công!!');
        if (this.loginForm.get('username').value === 'admin') {
          this.router.navigate(['/accounts/list']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        alert('Tài khoản của bạn bị khóa!');
        this.authenticationService.logout();
        this.router.navigate(['/']);
      }
    });
  }
}
