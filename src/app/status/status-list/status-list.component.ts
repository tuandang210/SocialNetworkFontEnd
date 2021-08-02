import {Component, OnInit} from '@angular/core';
import {StatusService} from '../../service/status/status.service';
import {Status} from '../../model/status-model/status';


@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.css']
})
export class StatusListComponent implements OnInit {
  status: Status[] = [];
  check = false;

  constructor(private statusService: StatusService) {
  }

  ngOnInit() {
    this.showStatus();
  }

  showStatus() {
    this.statusService.getAllStatus().subscribe(status => {
      this.status = status;
    });
  }

  getAllStatus(status) {
    this.status = status;
  }

  isCheck() {
    this.check = !this.check;
  }
}
