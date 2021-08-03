import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {StatusService} from '../../service/status/status.service';
import {Status} from '../../model/status-model/status';
import {AccountService} from '../../service/account/account.service';
import {AccountRelationService} from '../../service/relation/account-relation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // @ts-ignore
  account: Account = {};
  mutualFriends = 0;
  statusPublic: Status[] = [];
  statusFriendOnlyAndPublic: Status[] = [];
  status: Status[] = [];
  totalFriend = 0;
  id2 = -1;
  mutualFriendsCheck = false;
  friendCheck = false;
  loginCheck = false;
  checkOnlyMe = false;

  constructor(private authenticationService: AuthenticationService,
              private activatedRoute: ActivatedRoute,
              private statusService: StatusService,
              private accountRelationService: AccountRelationService) {
  }

  ngOnInit() {
    this.getAccountByUsername();
  }

  getAccountByUsername() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const username = paramMap.get('username');
      this.statusService.findAccountByUsername(username).subscribe(account => {
        this.statusPublic = [];
        this.statusFriendOnlyAndPublic = [];
        this.status = [];
        this.mutualFriends = 0;
        // check xem đã đăng nhập chưa
        if (this.authenticationService.currentUserValue) {
          this.loginCheck = true;
          this.mutualFriendsCheck = true;
          this.id2 = this.authenticationService.currentUserValue.id;
          // hiện số bạn chung
          this.getMutualFriends(account.id, this.id2);
        }
        this.account = account;
        this.getStatusByAccount(account.id);

        // lấy ra status theo id
        // @ts-ignore
        if (account.id === this.id2) {
          this.mutualFriendsCheck = false;
          this.friendCheck = false;
          this.loginCheck = true;
          this.checkOnlyMe = true;
        } else {
          this.checkOnlyMe = false;
        }
        // lấy ra tổng số lương bạn theo id
        this.getTotalFriend(account.id);
      });
    });
  }

  getStatusByAccount(id) {
    this.statusService.getStatusByAccountId(id).subscribe(status => {
      // cá nhân profile
      this.status = status;
      // nếu chưa đăng nhập hay chưa kết bạn
      if (!this.loginCheck || !this.friendCheck) {
        for (const status1 of status) {
          if (status1.privacy.name === 'public') {
            this.statusPublic.push(status1);
          }
        }
      } else {
        // nếu đã đăng nhập và nếu đã là bạn
        for (const status1 of status) {
          if (status1.privacy.name === 'friend-only' || status1.privacy.name === 'public') {
            this.statusFriendOnlyAndPublic.push(status1);
          }
        }
      }
    });
  }

  getTotalFriend(id) {
    this.accountRelationService.getAllFriends(id).subscribe(accounts => {
      if (accounts !== null) {
        this.totalFriend = accounts.length;
      }
    });
  }

  getMutualFriends(id1, id2) {
    this.accountRelationService.getMutualFriends(id1, id2).subscribe(accounts => {
      if (accounts !== null) {
        this.mutualFriends = accounts.length;
      }
    });
  }

  deleteByStatus(id: number) {
  }
}
