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
  accounts11: Account[] = [];
  offset = 0;
  total: number;
  page = 0;

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    this.getAll();
    this.getRealAll();
  }

  getRealAll() {
    this.accountService.getAllUser().subscribe(accounts1 => {
      this.accounts11 = accounts1;
      this.total = (this.accounts11.length - this.accounts11.length % 2) / 2;
    });
  }

  getAll() {
    this.accountService.getAll(this.offset).subscribe(accounts => {
        // accounts.shift();
        this.accounts = accounts;
      }
    );
  }

  block(id: number) {
    this.accountService.blockAccount(id).subscribe(() => {
      alert('Đã block!');
      this.ngOnInit();
      // this.getAll();
    });
  }

  previous() {
    if (this.page > 0) {
      this.page = this.page - 1;
      this.offset -= 2;
      this.getAll();
    }
  }

  next() {
    // this.page = this.page + 1;
    if (this.page < this.total - 1) {
      this.page = this.page + 1;
      this.offset += 2;
      this.accountService.getAll((this.page + 1) * 2 - 2).subscribe((accounts) => {
        this.accounts = accounts;
      });
    }
  }
}
