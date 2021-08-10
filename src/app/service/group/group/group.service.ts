import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Chat} from '../../../model/chat';
import {environment} from '../../../../environments/environment';
import {Group} from '../../../model/group';
import {AccountDTO} from '../../../model/dtoacount/account-dto';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {
  }

  getAll(groupId, size: number): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${API_URL}/groups/${groupId}?size=${size}`);
  }

  getAllGroupsByAccountId(id1): Observable<Group[]> {
    return this.http.get<Group[]>(`${API_URL}/groups/account/${id1}`);
  }

  createGroup(element, id1): Observable<Group> {
    element.account = [
      {
        id: id1
      }
    ];
    return this.http.post<Group>(`${API_URL}/groups`, element);
  }

  addNewAccount(group): Observable<Group> {
    return this.http.put<Group>(`${API_URL}/groups`, group);
  }

  getAccountOnGroup(groupId): Observable<AccountDTO[]> {
    return this.http.get<AccountDTO[]>(`${API_URL}/groups/${groupId}/account`);
  }

  exitGroup(groupId, id): Observable<Group> {
    return this.http.put<Group>(`${API_URL}/groups/${groupId}/exit/${id}`, {});
  }
  findGroupsByNameContaining(name, id): Observable<Group[]> {
    return this.http.get<Group[]>(`${API_URL}/groups/search/${id}?name=${name}`);
  }
}
