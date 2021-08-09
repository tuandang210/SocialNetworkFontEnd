import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AccountToken} from '../../model/account/account-token';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  account: AccountToken = JSON.parse(localStorage.getItem('account'));

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  createChat(message, id, id2) {
  }
}
