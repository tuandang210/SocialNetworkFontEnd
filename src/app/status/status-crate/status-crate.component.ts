import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Status} from '../../model/status-model/status';
import {StatusService} from '../../service/status/status.service';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {AccountToken} from '../../model/account/account-token';
import {PrivacyService} from '../../service/privacy/privacy.service';
import {Privacy} from '../../model/privacy/privacy';

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
              private privacyService: PrivacyService) {
    this.authenticationService.currentAccountSubject.subscribe(account => {
      this.currentAccount = account;
    });
  }

  ngOnInit() {
    this.showPrivacy();
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
    console.log(status);
  }

  findAllStatus() {
    this.statusService.getNewsFeed(this.account.id).subscribe(status => {
      this.addNewItem(status);
    });
  }
}
