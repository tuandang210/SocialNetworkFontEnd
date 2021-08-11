import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {PageService} from '../../service/page/page.service';
import {AccountToken} from '../../model/account/account-token';
import {Page} from '../../model/page/page';
import {Status} from '../../model/status-model/status';
import {StatusDTO} from '../../model/page/status-dto';
import {finalize} from 'rxjs/operators';
import {ImageStatus} from '../../model/status-model/image-status';
import {AngularFireStorage} from '@angular/fire/storage';
import {Privacy} from '../../model/privacy/privacy';
import {PrivacyService} from '../../service/privacy/privacy.service';
import {StatusDto} from '../../model/status-model/status-dto';
import {StatusService} from '../../service/status/status.service';
import {StatusDTORequest} from '../../model/page/status-dtorequest';
import {LikeStatusService} from '../../service/likeStatus/like-status.service';
import {LikeStatus} from '../../model/likeStatus/like-status';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollFrame', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;
  private scrollContainer: any;
  private isNearBottom = true;
  private loadAmount = 3;
  accountId: number = JSON.parse(localStorage.getItem('account')).id;
  account: AccountToken = JSON.parse(localStorage.getItem('account'));
  pages: Page[] = [];
  page: Page = {};
  statusPage: StatusDTO[] = [];
  status: Status = {};
  status1: Status = {};
  selectedImg: any = null;
  imgSrc1 = '';
  image: ImageStatus = {};
  privacy: Privacy[] = [];
  likeStatus: LikeStatus = {};
  likeStatuses: any = [];

  constructor(private pageService: PageService,
              private angularFireStorage: AngularFireStorage,
              private privacyService: PrivacyService,
              private statusService: StatusService,
              private likeStatusService: LikeStatusService) {
    this.getAllPageByAccountId();
    this.showPrivacy();
  }

  ngOnInit() {
  }

  getAllLike(idStatus) {
    this.likeStatusService.getAllLikeStatus(idStatus).subscribe(likes => {
      this.likeStatuses = likes;
    });
  }

  createPage(page) {
    this.pageService.createNewPage(page.name, this.accountId).subscribe(() => {
      this.getAllPageByAccountId();
    });
  }

  getAllPageByAccountId() {
    this.pageService.getAllPageByAccountId(this.accountId).subscribe(pages => {
      this.pages = pages;
    });
  }

  goPage(pageId: number) {
    this.getPage(pageId);
    this.getAllStatusByPageId(pageId, 3);
  }

  getAllStatusByPageId(pageId, loadAmount) {
    this.pageService.getAllStatusByPageId(pageId, loadAmount).subscribe(status => this.statusPage = status);
  }

  getPage(pageId) {
    this.pageService.getPageByPageId(pageId).subscribe(page => this.page = page);
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
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

  scrolled(pageId): void {
    this.isNearBottom = this.isUserNearBottom();
    if (this.isNearBottom) {
      this.loadAmount += 3;
      this.getAllStatusByPageId(pageId, this.loadAmount);
    }
  }

  createComment(commentForm, id, id2: number) {
  }

  deleteLike(accountId, statusId) {
    this.likeStatusService.dislikeStatus(accountId, statusId).subscribe(() => {
      this.getAllStatusByPageId(this.page.id, this.loadAmount);
      // this.addIdStatus(statusId);
    });
  }
  createLike(userId, statusId) {
    this.getAllStatusByPageId(this.page.id, this.loadAmount);
    this.likeStatusService.createLikeStatus(this.likeStatus, userId, statusId).subscribe(() => {
      this.getAllStatusByPageId(this.page.id, this.loadAmount);
      // this.addIdStatus(statusId);
    });
  }

  checkIdAcc(account: AccountToken, likeStatus: any) {
    for (const x of likeStatus) {
      if (account.id === x.account.id) {
        return true;
      }
    }
    return false;
  }

  addIdStatus(id: number) {
    this.statusService.getById(id).subscribe(status => {
      this.status1 = status;
      // this.detailAvatar = status.account.avatar;
      // this.detailUsername = status.account.username;
      // this.detailIdUser = status.account.id;
      // this.getComment(id);
      // this.getAllLikeIn1Status(id);
    });
  }

  createStatus(statusForm, imgSrc1) {
    const statusDTORequest: StatusDTORequest = {};
    statusDTORequest.privacy = {
      id: statusForm.privacy
    };
    statusDTORequest.content = statusForm.content;
    statusDTORequest.page = {
      id: this.page.id
    };
    statusDTORequest.url = imgSrc1;
    statusDTORequest.account = {
      id: this.accountId
    };
    this.statusService.createStatusVS2(statusDTORequest).subscribe(() => {
      this.getAllStatusByPageId(this.page.id, this.loadAmount);
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

  showPrivacy() {
    this.privacyService.showPrivacy().subscribe(privacy => {
      this.privacy = privacy;
    });

  }
}
