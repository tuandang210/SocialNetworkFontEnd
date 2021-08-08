import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Chat} from '../../model/chat';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {ChatService} from './chat/chat.service';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: any;
  public chats: Chat[] = [];

  constructor(private chatService: ChatService) {
    this.getAllProduct();
  }

  getAllProduct() {
    this.chatService.getAll().subscribe(products => {
      this.chats = products;
    });
  }

  connect() {
    const ws = new SockJS(`${API_URL}/ws`);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, frame => {
      this.stompClient.subscribe('/topic/products', data => {
        const jsonData = JSON.parse(data.body);
        this.chats.push(jsonData);
      });
    });
  }

  sendMessage(product) {
    this.stompClient.send('/app/products', {}, JSON.stringify(product));
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.dissconnect();
    }
  }


}
