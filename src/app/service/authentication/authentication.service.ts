import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {AccountToken} from '../../model/account/account-token';
import {map} from 'rxjs/operators';
import firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {AccountService} from '../account/account.service';
import {Router} from '@angular/router';
import {Account} from '../../model/account/account';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentAccountSubject: BehaviorSubject<AccountToken>;
  public currentAccount: Observable<AccountToken>;
  accounts: Account[] = [];
  username = '';
  password = '';
  avatar = '';
  fullName = '';
  email = '';

  constructor(private http: HttpClient,
              private angularFireAuth: AngularFireAuth,
              private accountService: AccountService,
              private router: Router) {
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


  /* Sign in */
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider)
      .then(value => {
        this.username = value.user.email;
        this.password = value.user.uid;
        this.avatar = value.user.photoURL;
        this.email = value.user.email;
        this.fullName = value.user.displayName;
        this.submit();
        console.log(value);
      })
      .catch(error => {
        console.log('Something went wrong: ', error);
      });
  }

  private oAuthLogin(provider) {
    return this.angularFireAuth.signInWithPopup(provider);
  }

  submit() {
    this.accountService.getAllUser().subscribe(accounts => {
      this.accounts = accounts;
      const account: AccountToken = {};
      account.username = this.username;
      account.password = this.password;
      account.avatar = this.avatar;
      account.email = this.email;
      account.fullName = this.fullName;
      account.birthday = '';
      console.log(account);
      let isAvailable = false;
      for (const x of this.accounts) {
        if (x.username === account.username) {
          isAvailable = true;
          break;
        }
      }
      if (isAvailable) {
        this.login(account.username, account.password).subscribe(() => {
          console.log('Dang nhap!');
          this.router.navigate(['/profile/' + this.username]);
        });
      } else {
        this.accountService.createAccount(account).subscribe(() => {
          this.login(account.username, account.password).subscribe(() => {
            console.log('Dang ky!');
            this.router.navigate(['/profile/' + this.username]);
          });
        });
      }
    });
  }
}



