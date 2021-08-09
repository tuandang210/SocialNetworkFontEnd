import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WebsocketService} from '../service/websocket/websocket.service';
import {NgForm} from '@angular/forms';
import {AccountToken} from '../model/account/account-token';
import {AccountRelationService} from '../service/relation/account-relation.service';
import {AccountService} from '../service/account/account.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  account: AccountToken = JSON.parse(localStorage.getItem('account'));
  friends: any = [];
  friend: AccountToken = {};

  constructor(public websocketService: WebsocketService,
              private accountRelationService: AccountRelationService,
              private accountService: AccountService) {
    this.accountRelationService.getAllFriends(this.account.id).subscribe(accounts => {
      if (accounts !== null) {
        this.friends = accounts;
      }
    });
  }

  search(element) {
    this.accountRelationService.getAllFriendsByUsername(element, this.account.id).subscribe(friends => {
      if (friends !== null) {
        this.friends = friends;
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }

  createChat(chatForm, id1, id2) {
    this.websocketService.sendMessage(chatForm.value, id1, id2);
  }

  addIdFriend(id1, id2) {
    this.websocketService.addId2(id2);
    this.websocketService.connect();
    this.accountService.findById(id2).subscribe(friend => {
      this.friend = friend;
      this.scrollToBottom();
    });
  }


  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }
}
