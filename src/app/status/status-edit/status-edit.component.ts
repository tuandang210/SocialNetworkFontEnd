import {Component, OnInit} from '@angular/core';
import {Status} from '../../model/status-model/status';
import {StatusService} from '../../service/status/status.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-status-edit',
  templateUrl: './status-edit.component.html',
  styleUrls: ['./status-edit.component.css']
})
export class StatusEditComponent implements OnInit {
  status: Status = {};

  constructor(private statusService: StatusService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const id = paramMap.get('id');
      this.getById(id);
    });
  }

  ngOnInit() {
  }

  getById(id) {
    this.statusService.getById(id).subscribe(status => this.status = status);
  }

  updateStatus(id) {
    this.statusService.editStatus(this.status, id).subscribe(() => alert('success'));
  }
}
