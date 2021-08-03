import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {StatusService} from '../../service/status/status.service';
import {Status} from '../../model/status-model/status';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // @ts-ignore
  account: Account = {};
  MutualFriends = 0;
  MutualFriendsCheck = false;
  friendCheck = false;
  statusPublic: Status[] = [];
  statusOnlyMe: Status[] = [];
  statusFriendOnly: Status[] = [];
  loginCheck = false;

  constructor(private authenticationService: AuthenticationService,
              private activatedRoute: ActivatedRoute,
              private statusService: StatusService) {
  }

  ngOnInit() {
    this.getAccountByUsername();
  }

  getAccountByUsername() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const username = paramMap.get('username');
      this.statusService.findAccountByUsername(username).subscribe(account => {
        if (this.authenticationService.currentUserValue) {
          this.loginCheck = true;
        }
        this.account = account;
        this.getStatusByAccount(account.id);
      });
    });
  }

  getStatusByAccount(id) {
    this.statusService.getStatusByAccountId(id).subscribe(status => {
    });
  }
}
