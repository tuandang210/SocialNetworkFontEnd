import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {StatusService} from '../../service/status/status.service';
import {Status} from '../../model/status-model/status';
import {AccountRelationService} from '../../service/relation/account-relation.service';
import {Privacy} from '../../model/privacy/privacy';
import {PrivacyService} from '../../service/privacy/privacy.service';
import {AccountToken} from '../../model/account/account-token';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';
import {StatusDto} from '../../model/status-model/status-dto';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  // @ts-ignore
  account: Account = {};
  mutualFriends = 0;
  statusPublic: Status[] = [];
  statusFriendOnlyAndPublic: Status[] = [];
  status: Status[] = [];
  status1: Status = {};
  status2: Status = {};
  friends: AccountToken[] = [];
  totalFriend = 0;
  id2 = -1 + '';
  id1 = -1;
  mutualFriendsCheck = false;
  friendCheck = -1;
  loginCheck = false;
  checkOnlyMe = false;
  requestSent: AccountToken[] = [];
  privacy: Privacy[] = [];
  currentAccount: AccountToken = {};
  isGuest = false;
  @ViewChild('scrollFrame', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;
  private scrollContainer: any;
  private isNearBottom = true;
  private loadAmount = 3;
  selectedImg: any = null;
  imgSrc1 = '';
  constructor(private authenticationService: AuthenticationService,
              private activatedRoute: ActivatedRoute,
              private statusService: StatusService,
              private accountRelationService: AccountRelationService,
              private privacyService: PrivacyService,
              private angularFireStorage: AngularFireStorage) {
  }

  ngOnInit() {
    if (this.loginCheck) {
      this.findAllFriendRequestSent(this.id1);
    }
    // this.showPrivacy();
    this.getAccountByUsername();
    if (this.privacy.length === 0) {
      this.showPrivacy();
    }
  }

  getAccountByUsername() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const username = paramMap.get('username');
      this.statusService.findAccountByUsername(username).subscribe(account => {
        this.id2 = account.id;
        this.account = account;
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
          this.findAllFriendRequestSent(this.id1);
          this.getStatus(this.id1, this.id2);
        }
        this.getStatus(-1, this.id2);
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

  getTotalFriend(id) {
    this.accountRelationService.getAllFriends(id).subscribe(accounts => {
      if (accounts !== null) {
        this.friends = accounts;
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

  findAllFriendRequestSent(id) {
    this.requestSent = [];
    this.accountRelationService.findAllFriendRequestSent(id).subscribe(friends => {
      if (!this.loginCheck) {
        return;
      }
      this.requestSent = friends;
      this.checkFriendsSent(id, this.id2);

    });
  }

  addIdStatus(id: number) {
    this.statusService.getById(id).subscribe(status => {
      console.log(status);
      this.status1 = status;
    });
  }

  saveStatus(id1, id2) {
    this.statusService.editStatus(this.status1, this.status1.id).subscribe(() => {
      this.getStatus(id1, id2);
    });
  }

  deleteByStatus(id: number, id1, id2) {
    this.statusService.deleteStatus(id).subscribe(() => {
      this.getStatus(id1, id2);
    });
  }

  createStatus(formStatus, id1, id2, imageUrl) {
    let status12: StatusDto = {};
    formStatus.value.account.id = this.id1;
    formStatus.value.url = imageUrl;
    status12 = formStatus.value;
    this.statusService.createStatus(status12).subscribe(() => {
      this.getStatus(id1, id2);
    });
  }

  showPrivacy() {
    this.privacyService.showPrivacy().subscribe(privacy => {
      this.privacy = privacy;
    });

  }

  // scroll
  ngAfterViewInit() {
    this.statusPublic = [];
    this.statusFriendOnlyAndPublic = [];
    this.status = [];
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
    if (this.authenticationService.currentUserValue) {
      this.id1 = JSON.parse(localStorage.getItem('account')).id;
    }
  }

  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      bottom: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  private isUserNearBottom(): boolean {
    const threshold = 0;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(id1, id2): void {
    this.isNearBottom = this.isUserNearBottom();
    if (this.isNearBottom) {
      this.loadAmount += 3;
      this.getStatus(id1, id2);
    }
  }

  getStatus(id1, id2) {
    if (id1 !== -1 && id1 !== null) {
      this.statusService.getAllStatusOfMySelfPagination(id1, this.loadAmount).subscribe(status => {
        this.status = status;
      });
      this.statusService.getAllStatusOfFriendPagination(id2, this.loadAmount).subscribe(statusFriendOnlyAndPublic => {
        this.statusFriendOnlyAndPublic = statusFriendOnlyAndPublic;
      });
    }
    this.statusService.getAllPublicStatusOfGuestPagination(id2, this.loadAmount).subscribe(statusPublic => {
      this.statusPublic = statusPublic;
    });
  }

  checkId(id1, id2) {
    return id1 != null && id2 != null && id1 === id2;
  }

  checkFriendsSent(id1, id2) {
    this.isGuest = false;
    this.accountRelationService.findAllFriendRequestReceived(id2).subscribe(accounts => {
      if (accounts !== null) {
        for (const acc of accounts) {
          if (acc.id === id1) {
            this.friendCheck = 4;
            this.isGuest = true;
          }
        }
      }
    });
  }

  showImagePreview(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc1 = event.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImg = event.target.files[0];

      if (this.selectedImg != null) {
        const filePath = `${this.selectedImg.name.split('.').splice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.angularFireStorage.ref(filePath);
        this.angularFireStorage.upload(filePath, this.selectedImg).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              this.imgSrc1 = url;
            });
          })).subscribe();
      }

    } else {
      this.selectedImg = null;
    }
  }
}
