import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {AccountToken} from '../../model/account/account-token';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  currentAccount: AccountToken = {};
  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentAccountSubject.subscribe(account => {
      this.currentAccount = account;
    });
  }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
  }
}
