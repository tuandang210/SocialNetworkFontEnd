import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from '../service/websocket/websocket.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  constructor(public websocketService: WebsocketService) {
  }

  ngOnInit(): void {
    this.websocketService.connect();
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }

  createChat(chatForm) {
    this.websocketService.sendMessage(chatForm.value);
  }
}
