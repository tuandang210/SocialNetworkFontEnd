import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Chat} from '../../model/chat';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {ChatService} from './chat/chat.service';
import {AccountToken} from '../../model/account/account-token';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: any;
  public message: Chat[] = [];
  account: AccountToken = JSON.parse(localStorage.getItem('account'));
  id2: number;

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
      this.stompClient.subscribe('/topic/products', data => {
        const jsonData = JSON.parse(data.body);
        this.message.push(jsonData);
      });
    });
  }

  sendMessage(message, id1, id2) {
    message.account1 = {
      id: id1
    };
    message.account2 = {
      id: id2
    };
    this.stompClient.send('/app/products', {}, JSON.stringify(message));
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.dissconnect();
    }
  }


}
