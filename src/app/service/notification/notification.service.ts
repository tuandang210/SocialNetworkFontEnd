import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Notification} from '../../model/notification/notification';
import {LikeStatus} from '../../model/likeStatus/like-status';
import {Comments} from '../../model/comment/comments';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {
  }

  /* truyền vào id lưu trong localStorage với 3 phương thức get
   */

  // tìm tất cả thông báo
  getAllNotificationByAccountId(id): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API_URL}/notification/account/${id}`);
  }

  // tìm các thông báo chưa đọc
  getAllUnreadNotification(id): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API_URL}/notification/account/unread/${id}`);
  }

  // tìm các thông báo đã đọc
  getAllReadNotification(id): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API_URL}/notification/account/read/${id}`);
  }

  // lưu thông báo khi bạn bè like status, nên gọi ngay sau khi gọi phương thức like
  saveLikeNotification(like: LikeStatus): Observable<Notification> {
    return this.http.post<Notification>(`${API_URL}/notification/like`, like);
  }

  // lưu thông báo khi bạn bè comment vào status, nên gọi ngay sau khi gọi phương thức comment
  saveCommentNotification(comment: Comments): Observable<Notification> {
    return this.http.post<Notification>(`${API_URL}/notification/comment`, comment);
  }

}
