import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

import {Observable} from 'rxjs';
import {Status} from '../../model/status-model/status';
import {HttpClient} from '@angular/common/http';
import {StatusDto} from '../../model/status-model/status-dto';
import {StatusCommentDto} from '../../model/status-model/status-comment-dto';


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

  createStatus(status: StatusDto): Observable<Status> {
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

  /* Các API hiển thị trang cá nhân của người khác tuỳ theo quan hệ
   */

  // Nếu là trang của khách, truyền vào id của khách
  getAllPublicStatusOfGuestPagination(id, size): Observable<Status[]> {
    return this.http.get<Status[]>(`${API_URL}/status/public/${id}?size=${size}`);
  }

  // Nếu là trang của bạn bè, truyền vào id của bạn bè đó
  getAllStatusOfFriendPagination(id, size): Observable<Status[]> {
    return this.http.get<Status[]>(`${API_URL}/status/friends/${id}?size=${size}`);
  }

  // Nếu là trang chính mình, truyền vào id lưu trong localStorage
  getAllStatusOfMySelfPagination(id, size): Observable<Status[]> {
    return this.http.get<Status[]>(`${API_URL}/status/account/${id}?size=${size}`);
  }

  // Bảng tin có phân trang, truyền vào id lưu trong localStorage
  getNewsfeedPagination(id, size): Observable<StatusCommentDto[]> {
    return this.http.get<StatusCommentDto[]>(`${API_URL}/status/newsfeed/${id}?size=${size}`);
  }
}
