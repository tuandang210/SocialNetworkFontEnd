import {Component, OnInit} from '@angular/core';
import {StatusService} from '../../service/status/status.service';
import {Status} from '../../model/status-model/status';
import {AccountToken} from '../../model/account/account-token';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.css']
})
export class StatusListComponent implements OnInit {
  status: Status[] = [];
  check = false;
  account: AccountToken = JSON.parse(localStorage.getItem('account'));

  constructor(private statusService: StatusService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const id = paramMap.get('id');
    });
  }

  ngOnInit() {
    this.showStatus();
  }

  showStatus() {
    this.statusService.getAllStatus().subscribe(status => {
      for (const s of status) {
        if (s.privacy.name !== 'only-me') {
          this.status.push(s);
        }
      }
    });
  }

  getAllStatus(status) {
    this.status = status;
  }

  isCheck() {
    this.check = !this.check;
  }

  showStatus1() {
    this.statusService.getAllStatus().subscribe(status1 => {
      this.status = status1;
    });
  }

  deleteByStatus(id) {
    this.statusService.deleteStatus(id).subscribe(() => {
      this.showStatus1();
      alert('success');
    });
  }
}
