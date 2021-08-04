import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

import {Observable} from 'rxjs';
import {Status} from '../../model/status-model/status';
import {HttpClient} from '@angular/common/http';


const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: HttpClient) {
  }

  getAllStatus(): Observable<Status[]> {
    return this.http.get<Status[]>(`${API_URL}/status/list`);
  }

  createStatus(status: Status): Observable<Status> {
    status.privacy = {
      id: status.privacy
    };
    return this.http.post<Status>(`${API_URL}/status`, status);
  }

  editStatus(status: Status, id: number): Observable<Status> {
    return this.http.put<Status>(`${API_URL}/status/${id}`, status);
  }

  getById(id: number): Observable<Status> {
    return this.http.get<Status>(`${API_URL}/status/${id}`);
  }

  deleteStatus(id: number): Observable<Status> {
    return this.http.delete<Status>(`${API_URL}/status/${id}`);
  }

  findAccountByUsername(username: string): Observable<Account> {
    return this.http.get<Account>(`${API_URL}/profile?username=${username}`);
  }

  getStatusByAccountId(id): Observable<Status[]> {
    return this.http.get<Status[]>(API_URL + '/status/account/' + id);
  }
}
