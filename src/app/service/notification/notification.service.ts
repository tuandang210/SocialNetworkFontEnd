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

  /* truyền vào id lưu trong localStorage với 4 phương thức
   */

  // tìm tất cả thông báo
  getAllNotificationByAccountId(accountId): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API_URL}/notification/account/${accountId}`);
  }

  // tìm các thông báo chưa đọc
  getAllUnreadNotification(accountId): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API_URL}/notification/account/unread/${accountId}`);
  }

  // tìm các thông báo đã đọc
  getAllReadNotification(accountId): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API_URL}/notification/account/read/${accountId}`);
  }

  // đánh dấu đã đọc tất cả thông báo
  markAllAsRead(accountId): Observable<Notification[]> {
    return this.http.put<Notification[]>(`${API_URL}/notification/readAll/${accountId}`, {});
  }

  /* 2 API dưới đây truyền vào id của thông báo
   */

  // đánh dấu đã đọc một thông báo
  markAsRead(notificationId): Observable<Notification> {
    return this.http.put<Notification>(`${API_URL}/notification/read/${notificationId}`, {});
  }

  // đánh dấu chưa đọc một thông báo
  markAsUnread(notificationId): Observable<Notification> {
    return this.http.put<Notification>(`${API_URL}/notification/unread/${notificationId}`, {});
  }
}
