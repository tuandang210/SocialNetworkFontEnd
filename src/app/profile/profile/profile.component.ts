import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {StatusService} from '../../service/status/status.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  account: Account = {displayName: '', id: '', imageURL: '', name: '', rpDisplayName: ''};

  constructor(private authenticationService: AuthenticationService,
              private activatedRoute: ActivatedRoute,
              private statusService: StatusService) {
  }

  ngOnInit() {
    this.getAccountByUsername();
  }

  getAccountByUsername() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const username = paramMap.get('username');
      this.statusService.findAccountByUsername(username).subscribe(account => {
        this.account = account;
        console.log(account);
      });
    });
  }
}
