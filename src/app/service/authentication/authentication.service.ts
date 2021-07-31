import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {AccountToken} from '../../model/account/account-token';
import {map} from 'rxjs/operators';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentAccountSubject: BehaviorSubject<AccountToken>;
  public currentAccount: Observable<AccountToken>;

  constructor(private http: HttpClient) {
    this.currentAccountSubject = new BehaviorSubject<AccountToken>(JSON.parse(localStorage.getItem('account')));
    this.currentAccount = this.currentAccountSubject.asObservable();
  }

  login(username: string, password: string): Observable<AccountToken> {
    return this.http.post<any>(`${API_URL}/login`, {username, password})
      .pipe(map(account => {
        localStorage.setItem('account', JSON.stringify(account));
        this.currentAccountSubject.next(account);
        return account;
      }));
  }

  logout() {
    localStorage.removeItem('account');
    this.currentAccountSubject.next(null);
  }

  get currentUserValue() {
    return this.currentAccountSubject.value;
  }
}
