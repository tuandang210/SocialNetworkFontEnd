import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../service/account/account.service';
import {Account} from '../../model/account/account';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  isCheck: boolean;

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.accountService.getAll().subscribe(accounts => {

        this.accounts = accounts.splice(-1, 1);
        for (const account of this.accounts) {
          console.log(account);
          if (account.isActive === 1) {
            this.isCheck = true;
          } else if (account.isActive !== 1) {
            this.isCheck = false;
          }
        }
      }
    );
  }
}
