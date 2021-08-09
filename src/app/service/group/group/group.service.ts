import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Chat} from '../../../model/chat';
import {environment} from '../../../../environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  getAll(groupId, size): Observable<Chat[]> {
    this.http.get<Chat[]>(`${API_URL}/groups/${groupId}?size=${size}`);
  }
}
