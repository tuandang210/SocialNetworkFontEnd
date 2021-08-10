import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AccountToken} from '../../model/account/account-token';
import {GroupService} from '../../service/group/group/group.service';
import {WebsocketService} from '../../service/websocket/websocket.service';
import {Group} from '../../model/group';
import {ChatService} from '../../service/websocket/chat/chat.service';
import {Chat} from '../../model/chat';
import {AccountRelationService} from '../../service/relation/account-relation.service';
import {AccountDTO} from '../../model/dtoacount/account-dto';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  account: AccountToken = JSON.parse(localStorage.getItem('account'));
  groups: Group[] = [];
  group: Group = {};
  message: Chat[] = [];
  friends: AccountDTO[] = [];
  accountOnGroup: AccountDTO[] = [];
  accountDTO: AccountDTO = {};
  groupId: number;
  checkButton = false;
  checkWebsocket = false;

  constructor(private groupService: GroupService,
              public websocketService: WebsocketService,
              private accountRelationService: AccountRelationService) {
    this.getAllGroupsByAccountId();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }

  createChat(message) {
    this.websocketService.sendMessageGroup(message.value, this.account.id, this.groupId);
  }

  getAllGroupsByAccountId() {
    this.groupService.getAllGroupsByAccountId(this.account.id).subscribe(groups => {
      this.groups = groups;
    });
  }

  createGroup(groupForm) {
    this.groupService.createGroup(groupForm, this.account.id).subscribe(() => {
      this.getAllGroupsByAccountId();
      this.group = {};
    });
  }

  search(value: string) {
    this.groupService.findGroupsByNameContaining(value, this.account.id).subscribe(groups => {
      this.groups = groups;
    });
  }

  addIdAccount(groupId: number) {
    if (this.checkWebsocket) {
      this.ngOnDestroy();
    } else {
      this.checkWebsocket = true;
    }
    if (this.checkWebsocket) {
      this.getAccountOnGroup(groupId);
    }
    this.checkButton = true;
    this.getFriends();
    this.groupId = groupId;
    this.websocketService.addId2(groupId, 2);
    this.websocketService.connect(2);
    this.groupService.getAll(groupId, 10).subscribe(message => {
      this.message = message;
    });
  }

  getFriends() {
    this.accountRelationService.getAllFriends(this.account.id).subscribe(accounts => {
      if (accounts !== null) {
        this.friends = [];
        for (const x of accounts) {
          let check = true;
          this.accountDTO = {};
          for (const y of this.accountOnGroup) {
            this.accountDTO = x;
            if (x.id === y.id) {
              check = false;
              break;
            }
          }
          if (check) {
            this.friends.push(this.accountDTO);
          }
        }
        if (this.friends.length === 0) {
          this.checkButton = false;
        }
      }
    });
  }

  addNewAccount(friendId) {
    this.accountDTO = {};
    this.accountDTO.id = friendId;
    this.accountOnGroup.push(this.accountDTO);
    const groupNew = {
      id: this.groupId,
      account: this.accountOnGroup
    };
    this.groupService.addNewAccount(groupNew).subscribe(() => {
      this.getFriends();
    });
  }

  getAccountOnGroup(groupId) {
    this.accountOnGroup = [];
    this.groupService.getAccountOnGroup(groupId).subscribe(account => {
      this.accountOnGroup = account;
    });
  }

  exitGroup() {
    this.groupService.exitGroup(this.groupId, this.account.id).subscribe(() => {
      this.getAllGroupsByAccountId();
      this.websocketService.deleteMessage(2);
      this.checkButton = false;
    });
  }
}
