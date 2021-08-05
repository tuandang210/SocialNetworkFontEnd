import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {StatusService} from '../../service/status/status.service';
import {Status} from '../../model/status-model/status';
import {AccountRelationService} from '../../service/relation/account-relation.service';
import {Privacy} from '../../model/privacy/privacy';
import {PrivacyService} from '../../service/privacy/privacy.service';
import {AccountToken} from '../../model/account/account-token';

declare var $: any;

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
  status1: Status = {};
  status2: Status = {};
  totalFriend = 0;
  id2 = -1 + '';
  id1 = -1;
  mutualFriendsCheck = false;
  friendCheck = -1;
  loginCheck = false;
  checkOnlyMe = false;
  requestSent: Account[] = [];
  privacy: Privacy[] = [];
  currentAccount: AccountToken = {};
  size = 0;

  constructor(private authenticationService: AuthenticationService,
              private activatedRoute: ActivatedRoute,
              private statusService: StatusService,
              private accountRelationService: AccountRelationService,
              private privacyService: PrivacyService) {
  }

  ngOnInit() {
    if (this.loginCheck) {
      this.findAllFriendRequestSent();
    }
    this.getAccountByUsername();
    this.showPrivacy();
    this.totalFunction();
  }

  getAccountByUsername() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const username = paramMap.get('username');
      this.statusService.findAccountByUsername(username).subscribe(account => {
        this.id2 = account.id;
        this.mutualFriends = 0;
        this.totalFriend = 0;
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
        this.totalFunction();
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
    this.accountRelationService.acceptFriendRequest(this.id1, id).subscribe(() => {
      this.ngOnInit();
      this.friendCheck = 1;
    });
  }

  // từ chối lời mời
  declineFriend(id) {
    this.accountRelationService.declineFriendRequest(this.id1, id).subscribe(() => {
      this.ngOnInit();
      this.friendCheck = -1;
    });
  }

  // chấp nhận lời mời
  acceptFriend1() {
    this.accountRelationService.acceptFriendRequest(this.id1, this.id2).subscribe(() => {
      this.ngOnInit();
      this.friendCheck = 1;
    });
  }

  // từ chối lời mời
  declineFriend1() {
    this.accountRelationService.declineFriendRequest(this.id1, this.id2).subscribe(() => {
      this.ngOnInit();
      this.friendCheck = -1;
    });
  }

  findAllFriendRequestSent() {
    this.requestSent = [];
    this.accountRelationService.findAllFriendRequestSent(this.id1).subscribe(friends => {
      if (!this.loginCheck) {
        return;
      }
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
      this.totalFunction();
    });
  }

  deleteByStatus(id: number) {
    this.statusService.deleteStatus(id).subscribe(() => {
      this.totalFunction();
    });
  }

  createStatus(formStatus) {
    formStatus.value.account.id = this.id1;
    this.statusService.createStatus(formStatus.value).subscribe(() => {
      this.totalFunction();
    });
  }

  showPrivacy() {
    this.privacyService.showPrivacy().subscribe(privacy => {
      this.privacy = privacy;
    });

  }

  totalFunction() {
    this.statusPublic = [];
    this.statusFriendOnlyAndPublic = [];
    this.status = [];
    // tslint:disable-next-line:only-arrow-functions
    $(document).ready(function() {
      // tslint:disable-next-line:only-arrow-functions
      $(window).scroll(function() {
        // tslint:disable-next-line:radix
        const scrollTop = parseInt($(window).scrollTop() + 1);
        if (scrollTop === $(document).height() - $(window).height()) {

      }
      });
    });
  }

}
