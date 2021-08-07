import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Status} from '../../model/status-model/status';
import {StatusService} from '../../service/status/status.service';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {AccountToken} from '../../model/account/account-token';
import {PrivacyService} from '../../service/privacy/privacy.service';
import {Privacy} from '../../model/privacy/privacy';
import {ImageStatusService} from '../../service/image-status/image-status.service';

@Component({
  selector: 'app-status-crate',
  templateUrl: './status-crate.component.html',
  styleUrls: ['./status-crate.component.css']
})
export class StatusCrateComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter();
  currentAccount: AccountToken = {};
  status: Status = {};
  privacy: Privacy[] = [];
  isSubmitted = false;
  account: AccountToken = JSON.parse(localStorage.getItem('account'));

  constructor(private statusService: StatusService,
              private authenticationService: AuthenticationService,
              private privacyService: PrivacyService,
              private imageStatusService: ImageStatusService) {
    this.authenticationService.currentAccountSubject.subscribe(account => {
      this.currentAccount = account;
    });
  }

  ngOnInit() {
    this.showPrivacy();
    this.getFormatDate();
  }

  showPrivacy() {
    this.privacyService.showPrivacy().subscribe(privacy => {
      this.privacy = privacy;
    });
  }

  createStatus(statusForm) {
    this.isSubmitted = true;
    if (statusForm.valid) {
      this.statusService.createStatus(statusForm.value).subscribe(() => {
        alert('success');
        this.findAllStatus();
      });
    }
  }

  addNewItem(status) {
    this.newItemEvent.emit(status);
  }

  findAllStatus() {
    // this.statusService.getNewsfeedPagination(this.account.id).subscribe(status => {
    //   this.addNewItem(status);
    // });
  }

  getFormatDate() {
    const date = new Date().getTime();
  }
}
