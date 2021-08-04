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
    return this.http.get<Status[]>(`${API_URL}/status`);
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

  /* Các API hiển thị bảng tin
  */
  // lấy về danh sách các bài đăng public
  getAllPublicStatus(): Observable<Status[]> {
    return this.http.get<Status[]>(API_URL + '/status/public');
  }
  // lấy về danh sách các bài đăng của bạn bè, truyền vào id được lưu trong localStorage
  getAllFriendStatus(id): Observable<Status[]> {
    return this.http.get<Status[]>(API_URL + '/status/friends/' + id);
  }
  // Lấy về danh sách bài đăng của bạn bè và các bài đăng công khai, truyền vào id được lưu trong localStorage
  getNewsFeed(id): Observable<Status[]> {
    return this.http.get<Status[]>(API_URL + '/status/newsfeed/' + id);
  }
}
