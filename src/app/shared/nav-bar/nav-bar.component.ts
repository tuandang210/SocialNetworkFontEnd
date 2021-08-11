import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {AccountToken} from '../../model/account/account-token';
import {Router} from '@angular/router';
import {AccountDTO} from '../../model/dtoacount/account-dto';
import {AccountService} from '../../service/account/account.service';
import {StatusService} from '../../service/status/status.service';
import {Notification} from '../../model/notification/notification';
import {NotificationService} from '../../service/notification/notification.service';
import {Status} from '../../model/status-model/status';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  currentAccount: AccountToken = {};
  accountDTO: AccountDTO[] = [];
  notifications: Notification[] = [];
  unreadNotificationLength = 0;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private statusService: StatusService,
              private notificationService: NotificationService) {
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

  getAllNotification() {
    const account = JSON.parse(localStorage.getItem('account'));
    if (account == null) {
      return;
    }
    this.notificationService.getAllNotificationByAccountId(account.id).subscribe(
      notiList => {
        this.notifications = notiList;
        this.notificationService.getAllUnreadNotification(account.id).subscribe(
          unreadList => {
            if (unreadList == null) {
              this.unreadNotificationLength = 0;
            } else {
              this.unreadNotificationLength = unreadList.length;
            }
          }
        );
      },
      e => console.log(e)
    );
  }

  markAllAsRead() {
    const account: AccountToken = JSON.parse(localStorage.getItem('account'));
    if (account == null) {
      return;
    }
    this.notificationService.markAllAsRead(account.id).subscribe(
      () => this.getAllNotification(),
      e => console.log(e)
    );
  }

  markAsRead(notificationId) {
    this.notificationService.markAsRead(notificationId).subscribe(
      () => this.getAllNotification(),
      e => console.log(e)
    );
  }
}
