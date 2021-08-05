import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {AccountToken} from '../../model/account/account-token';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  currentAccount: AccountToken = {};

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    this.authenticationService.currentAccountSubject.subscribe(account => {
      this.currentAccount = account;
    });
  }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
  }

  search(value: string) {
    this.router.navigate(['/profile/' + value]);
  }
}
