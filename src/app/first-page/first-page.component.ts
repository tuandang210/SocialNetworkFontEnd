import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../service/authentication/authentication.service';
import {AccountToken} from '../model/account/account-token';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent implements OnInit {
  constructor(public authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

}
