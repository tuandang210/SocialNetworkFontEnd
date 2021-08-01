import {Component, OnInit} from '@angular/core';
import {Status} from '../../model/status-model/status';
import {StatusService} from '../../service/status/status.service';

@Component({
  selector: 'app-status-crate',
  templateUrl: './status-crate.component.html',
  styleUrls: ['./status-crate.component.css']
})
export class StatusCrateComponent implements OnInit {
  status: Status = {};
  isSubmitted = false;

  constructor(private statusService: StatusService) {
  }

  ngOnInit() {
  }

  createStatus(statusForm) {
    this.isSubmitted = true;
    if (statusForm.valid) {
      this.statusService.createStatus(statusForm.value).subscribe(() => {
        alert('success');
      });
    }
  }

}
