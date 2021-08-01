import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../service/account/account.service';
import {Account} from '../../model/account/account';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.accountService.getAll().subscribe(accounts => {
        accounts.shift();
        this.accounts = accounts;
      }
    );
  }
}
