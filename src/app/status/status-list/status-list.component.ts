import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {StatusService} from '../../service/status/status.service';
import {Status} from '../../model/status-model/status';
import {AccountToken} from '../../model/account/account-token';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {Privacy} from '../../model/privacy/privacy';
import {PrivacyService} from '../../service/privacy/privacy.service';
import {CommentService} from '../../service/comment/comment.service';
import {ImageStatusService} from '../../service/image-status/image-status.service';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';
import {ImageStatus} from '../../model/status-model/image-status';
import {StatusDto} from '../../model/status-model/status-dto';
import {StatusCommentDto} from '../../model/status-model/status-comment-dto';
import {Comment} from '@angular/compiler';
import {any} from 'codelyzer/util/function';


@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.css']
})
export class StatusListComponent implements OnInit, AfterViewInit {
  status: StatusCommentDto[] = [];
  status1: Status = {};
  check = false;
  account: AccountToken = JSON.parse(localStorage.getItem('account'));
  @ViewChild('scrollFrame', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;
  private scrollContainer: any;
  private isNearBottom = true;
  private loadAmount = 3;
  privacy: Privacy[] = [];
  id: number;
  selectedImg: any = null;
  imgSrc1 = '';
  image: ImageStatus = {};
  detailUsername = '';
  detailIdUser = '';
  comments: any = [];
  idFindComment = '';

  constructor(private statusService: StatusService,
              private privacyService: PrivacyService,
              private commentService: CommentService,
              public imageStatusService: ImageStatusService,
              private angularFireStorage: AngularFireStorage) {
  }

  ngOnInit() {
    this.getStatus(this.account.id);
    this.showPrivacy();
  }
  isCheck() {
    this.check = !this.check;
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

  scrolled(id): void {
    this.isNearBottom = this.isUserNearBottom();
    if (this.isNearBottom) {
      this.loadAmount += 3;
      this.getStatus(id);
    }
  }

  getStatus(id) {
    if (id !== -1 && id !== null) {
      this.statusService.getNewsfeedPagination(id, this.loadAmount).subscribe(status => {
        this.status = status;
        for (const i of this.status) {
            this.getComment1(i.id);
        }
      });
    }
  }

  saveStatus() {
    this.statusService.editStatus(this.status1, this.status1.id).subscribe(() => {
      this.getStatus(this.account.id);
    });
  }

  deleteByStatus(id: number) {
    this.statusService.deleteStatus(id).subscribe(() => {
      this.getStatus(this.account.id);
    });
  }

  createStatus(formStatus, imageUrl) {
    let status11: StatusDto = {};
    formStatus.value.url = imageUrl;
    status11 = formStatus.value;
    this.statusService.createStatus(status11).subscribe(() => {
    });
  }

  showPrivacy() {
    this.privacyService.showPrivacy().subscribe(privacy => {
      this.privacy = privacy;
    });

  }
  addIdStatus(id: number) {
    this.statusService.getById(id).subscribe(status => {
      this.status1 = status;
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

  getComment(id) {
    this.commentService.getCommentByStatusPagination(id, 20).subscribe(comments => {
      this.comments = comments;
    });
  }

  getComment1(id) {
    this.commentService.getCommentByStatusPagination(id, 3).subscribe(comments => {
      this.comments = comments;
    });
  }

  createComment(commentForm, id1, statusId) {
    this.commentService.createComment(commentForm.value, id1, statusId).subscribe(() => {
     this.getStatus(id1);
    });
  }
}
