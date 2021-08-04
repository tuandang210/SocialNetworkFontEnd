import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {StatusService} from '../../service/status/status.service';
import {Status} from '../../model/status-model/status';
import {AccountRelationService} from '../../service/relation/account-relation.service';
import {Privacy} from '../../model/privacy/privacy';
import {PrivacyService} from '../../service/privacy/privacy.service';
import {AccountToken} from '../../model/account/account-token';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter();
  // @ts-ignore
  account: Account = {};
  mutualFriends = 0;
  statusPublic: Status[] = [];
  statusFriendOnlyAndPublic: Status[] = [];
  status: Status[] = [];
  status1: Status = {};
  totalFriend = 0;
  id2 = -1 + '';
  id1 = -1;
  mutualFriendsCheck = false;
  friendCheck = -1;
  loginCheck = false;
  checkOnlyMe = false;
  checkShowStatusForm = false;
  requestSent: Account[] = [];
  privacyS: Privacy[] = [];

  constructor(private authenticationService: AuthenticationService,
              private activatedRoute: ActivatedRoute,
              private statusService: StatusService,
              private accountRelationService: AccountRelationService,
              private privacyService: PrivacyService) {
  }

  ngOnInit() {
    this.getAccountByUsername();
    this.showPrivacy();
  }

  getAccountByUsername() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const username = paramMap.get('username');
      this.statusService.findAccountByUsername(username).subscribe(account => {
        this.id2 = account.id;
        this.statusPublic = [];
        this.statusFriendOnlyAndPublic = [];
        this.status = [];
        this.mutualFriends = 0;
        // check xem đã đăng nhập chưa
        if (this.authenticationService.currentUserValue) {
          this.loginCheck = true;
          this.mutualFriendsCheck = true;
          this.id1 = this.authenticationService.currentUserValue.id;
          // hiện số bạn chung
          this.getMutualFriends(account.id, this.id1);
          // trạng thái quan hệ
          this.checkFriend(account.id, this.id1);
          // danh sách lời mời kết bạn đã nhan
          this.findAllFriendRequestSent();
        }
        this.account = account;
        this.getStatusByAccount(account.id);

        // lấy ra status theo id
        // @ts-ignore
        if (this.id2 === this.id1) {
          this.mutualFriendsCheck = false;
          this.friendCheck = 2;
          this.loginCheck = true;
          this.checkOnlyMe = true;
        } else {
          this.checkOnlyMe = false;
        }
        // lấy ra tổng số lương bạn theo id
        this.getTotalFriend(this.id2);
      });
    });
  }

  getStatusByAccount(id) {
    this.statusService.getStatusByAccountId(id).subscribe(status => {
      // cá nhân profile
      this.status = status;
      // nếu chưa đăng nhập hay chưa kết bạn
      for (const status1 of status) {
        if (status1.privacy.name === 'public') {
          this.statusPublic.push(status1);
        }
      }
      // nếu đã đăng nhập và nếu đã là bạn
      for (const status1 of status) {
        if (status1.privacy.name === 'friend-only' || status1.privacy.name === 'public') {
          this.statusFriendOnlyAndPublic.push(status1);
        }
      }
    });
  }

  checkRequestSent() {
    // check xem account này đã nằm trong danh sách bạn hay chưa
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

  checkFriend(id1, id2) {
    if (id2 !== id1) {
      this.accountRelationService.getRelation(id1, id2).subscribe(relation => {
        if (relation.friendStatus.status === 'FRIEND') {
          this.friendCheck = 1;
        }
        if (relation.friendStatus.status === 'GUEST') {
          this.friendCheck = -1;
        }
        if (relation.friendStatus.status === 'PENDING') {
          this.friendCheck = 0;
        }
      }, error => {
        this.friendCheck = -1;
      });
    }
  }

  // gửi lời mời kết bạn
  sendFriend() {
    this.accountRelationService.sendFriendRequest(this.id1, this.id2).subscribe(() => {
      this.friendCheck = 0;
    });
  }

  // hủy lời mời đã gửi
  cancelRequest() {
    this.accountRelationService.cancelFriendRequest(this.id1, this.id2).subscribe(() => {
      this.friendCheck = -1;
    });
  }

  // hủy kết bạn
  deleteFriend() {
    this.accountRelationService.unFriend(this.id1, this.id2).subscribe(() => {
      this.friendCheck = -1;
    });
  }

  // chấp nhận lời mời
  acceptFriend(id) {
    console.log('ok');
    this.accountRelationService.acceptFriendRequest(this.id1, id).subscribe(() => {
      this.friendCheck = 1;
    });
  }

  // từ chối lời mời
  declineFriend(id) {
    this.accountRelationService.declineFriendRequest(this.id1, id).subscribe(() => {
      this.friendCheck = -1;
    });
  }

  acceptFriend1() {
    this.accountRelationService.acceptFriendRequest(this.id1, this.id2).subscribe(() => {
      this.friendCheck = 1;
    });
  }

  // từ chối lời mời
  declineFriend1() {
    this.accountRelationService.declineFriendRequest(this.id1, this.id2).subscribe(() => {
      this.friendCheck = -1;
    });
  }

  findAllFriendRequestSent() {
    this.accountRelationService.findAllFriendRequestSent(this.id1).subscribe(friends => {
      for (const friend of friends) {
        // @ts-ignore
        this.requestSent.push(friend);
      }
      for (const friend of this.requestSent) {
        // @ts-ignore
        if (friend.id === this.id2) {
          this.friendCheck = 4;
          break;
        }
      }
    });
  }

  addIdStatus(id: number) {
    this.statusService.getById(id).subscribe(status => {
      this.status1 = status;
    });
  }

  saveStatus() {
    this.statusService.editStatus(this.status1, this.status1.id).subscribe(() => {
      this.getStatusByAccount(this.id2);
      console.log('edit ok');
    });
  }

  deleteByStatus(id: number) {
    this.statusService.deleteStatus(id).subscribe(() => {
      this.getStatusByAccount(this.id2);
      console.log('delete ok');
    });
  }

  createStatus() {
    this.getStatusByAccount(this.id2);
    this.showFormStatus();
  }

  showPrivacy() {
    this.privacyService.showPrivacy().subscribe(privacy => {
      this.privacyS = privacy;
    });
  }

  showFormStatus() {
    this.checkShowStatusForm = !this.checkShowStatusForm;
  }
}
