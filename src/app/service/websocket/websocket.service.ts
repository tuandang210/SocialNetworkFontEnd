import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Chat} from '../../model/chat';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {ChatService} from './chat/chat.service';
import {AccountToken} from '../../model/account/account-token';
import {ChatComponent} from '../../chat/chat.component';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: any;
  public message: Chat[] = [];
  account: AccountToken = JSON.parse(localStorage.getItem('account'));
  id2: number;
  public group: Chat[] = [];

  constructor(private chatService: ChatService) {
  }

  addId2(id2) {
    this.id2 = id2;
    this.getAllMessage(this.account.id, this.id2);
  }

  getAllMessage(id1, id2) {
    this.message = [];
    this.chatService.getAll(id1, id2).subscribe(message => {
      this.message = message;
    });
  }

  connect() {
    const ws = new SockJS(`${API_URL}/ws`);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, frame => {
      this.frameMessage();
      // if (client === 1) {
      //   this.frameMessage();
      // }
      // if (client === 2) {
      //   this.frameGroup();
      // }
    });
  }

  frameGroup() {
    this.stompClient.subscribe('/topic/message', data => {
      const jsonData = JSON.parse(data.body);
      this.group.push(jsonData);
    });
  }

  frameMessage() {
    this.stompClient.subscribe('/topic/message', data => {
      const jsonData = JSON.parse(data.body);
      this.message.push(jsonData);
    });
  }

  sendMessage(message, id1, id2) {
    message.account1 = {
      id: id1
    };
    message.account2 = {
      id: id2
    };
    message.date = this.getDateFormat();
    this.stompClient.send('/app/message', {}, JSON.stringify(message));
  }

  sendMessageGroup(message, id1, groupId) {
    message.account1 = {
      id: id1
    };
    message.group = {
      id: groupId
    };
    this.stompClient.send('/app/message', {}, JSON.stringify(message));
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  getDateFormat(): string {
    const date = new Date();
    return '' + date.getHours() + ':' + date.getMinutes();
  }
}
