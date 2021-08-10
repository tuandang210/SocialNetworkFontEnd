import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {AccountToken} from '../../model/account/account-token';
import {Router} from '@angular/router';
import {AccountDTO} from '../../model/dtoacount/account-dto';
import {AccountService} from '../../service/account/account.service';
import {StatusService} from '../../service/status/status.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  currentAccount: AccountToken = {};
  accountDTO: AccountDTO[] = [];

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private statusService: StatusService) {
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
    this.statusService.findAccountsByUsernameContaining(value).subscribe(accountDTO => {
      this.accountDTO = accountDTO;
      if (value === '') {
        this.accountDTO = [];
      }
    });
  }

  routerLink(username: string) {
    this.accountDTO = [];
    this.router.navigate(['/profile/' + username]);
  }
}
