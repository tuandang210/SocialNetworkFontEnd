import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Relation} from '../../model/relation/relation';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {Account} from "../../model/account/account";

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class AccountRelationService {
  accounts: Account[] = [];
  relations: Relation[] = [];

  constructor(private http: HttpClient) {
  }

  getAllRelations(): Observable<Relation[]> {
    return this.http.get<Relation[]>(`${API_URL}/relations`);
  }

  getAllFriends(id: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${API_URL}/relations/${id}/friends`);
  }

  getAllGuests(id: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${API_URL}/relations/${id}/guests`);
  }

  // getAllRequestSent(id: number): Observable<Relation[]> {
  //
  // }
  // getAllRequestReceived(id: number): Observable<Relation[]> {
  //
  // }
  getMutualFriends(id1: number, id2: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${API_URL}/relations/${id1}/${id2}/friends`);
  }
}
