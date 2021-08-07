import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {StatusService} from '../../service/status/status.service';
import {Status} from '../../model/status-model/status';
import {AccountToken} from '../../model/account/account-token';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Privacy} from '../../model/privacy/privacy';
import {PrivacyService} from '../../service/privacy/privacy.service';
import {CommentService} from '../../service/comment/comment.service';
import {ImageStatusService} from '../../service/image-status/image-status.service';


@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.css']
})
export class StatusListComponent implements OnInit, AfterViewInit {
  status: Status[] = [];
  status1: Status = {};
  check = false;
  account: AccountToken = JSON.parse(localStorage.getItem('account'));
  @ViewChild('scrollFrame', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;
  private scrollContainer: any;
  private isNearBottom = true;
  private loadAmount = 3;
  privacy: Privacy[] = [];

  constructor(private statusService: StatusService,
              private privacyService: PrivacyService,
              private commentService: CommentService,
              private imageStatusService: ImageStatusService) {
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

  createStatus(formStatus) {
    formStatus.value.account.id = this.account.id;
    this.statusService.createStatus(formStatus.value).subscribe(() => {
      this.getStatus(this.account.id);
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
}
