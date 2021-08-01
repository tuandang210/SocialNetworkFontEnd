import {Component, OnInit} from '@angular/core';
import {StatusService} from '../../service/status/status.service';
import {Status} from '../../model/status-model/status';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {AccountToken} from '../../model/account/account-token';

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.css']
})
export class StatusListComponent implements OnInit {
  account: AccountToken = {};
  status: Status[] = [];
  check = false;

  constructor(private statusService: StatusService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.showStatus();
    this.account = this.authenticationService.currentUserValue;
    console.log(this.account);
  }

  showStatus() {
    this.statusService.getAllStatus().subscribe(status => {
      this.status = status;
    });
  }

  isCheck() {
    this.check = !this.check;
  }
}
