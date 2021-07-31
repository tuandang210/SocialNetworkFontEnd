import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Account} from '../../model/account/account';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  accounts: Account[] = [];

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Account[]> {
    return this.http.get<Account[]>(`${API_URL}/accounts`);
  }

  createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(`${API_URL}/accounts`, account);
  }

  findById(id: number): Observable<Account> {
    return this.http.get<Account>(`${API_URL}/accounts/${id}`);
  }

  updateAccount(id: number, account: Account): Observable<Account> {
    return this.http.put<Account>(`${API_URL}/accounts/${id}`, account);
  }

  blockAccount(id: number, account: Account): Observable<Account> {
    return this.http.put<Account>(`${API_URL}/accounts/admin/${id}`, account);
  }
}
