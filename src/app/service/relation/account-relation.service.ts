import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Relation} from '../../model/relation/relation';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Account} from '../../model/account/account';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class AccountRelationService {
  accounts: Account[] = [];
  relations: Relation[] = [];

  constructor(private http: HttpClient) {
  }

  // Tìm mọi mọi quan hệ (không dùng)
  getAllRelations(): Observable<Relation[]> {
    return this.http.get<Relation[]>(`${API_URL}/relations`);
  }

  // Tìm tất cả bạn bè
  getAllFriends(id: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${API_URL}/relations/friends/${id}`);
  }

  // Tìm tất cả khách
  getAllGuests(id: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${API_URL}/relations/${id}/guests`);
  }

  // Tìm mối quan hệ giữa 2 tài khoản
  getRelation(id1: number, id2: number): Observable<Relation> {
    return this.http.get<Relation>(`${API_URL}/relations/${id1}/${id2}`);
  }

  // Tìm bạn chung
  getMutualFriends(id1: number, id2: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${API_URL}/relations/${id1}/${id2}/friends`);
  }

  /* Các phương thức sau đều truyền id lưu trong localStorage vào id1, id còn lại vào id2
  Nếu truyền biến ngược lại ném lỗi 400.
  Nếu chỉ có 1 biến thì lấy id lưu trong localStorage.
   */

  // Tìm danh sách lời mời kết bạn mình đã gửi
  findAllFriendRequestReceived(id: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${API_URL}/relations/${id}/sent`);
  }

  // Tìm danh sách lời mời kết bạn mình đã nhận
  findAllFriendRequestSent(id: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${API_URL}/relations/${id}/received`);
  }

  // Gửi lời mời kết bạn
  sendFriendRequest(id1: number, id2: number): Observable<Relation> {
    return this.http.put<Relation>(`${API_URL} / relations /${id1}/request/${id2}`, {});
  }

  // Xóa lời mời kết bạn đã gửi
  cancelFriendRequest(id1: number, id2: number): Observable<Relation> {
    return this.http.put<Relation>(`${API_URL} / relations /${id1}/cancel/${id2}`, {});
  }

  // Nhận lời mời kết bạn
  acceptFriendRequest(id1: number, id2: number): Observable<Relation> {
    return this.http.put<Relation>(`${API_URL} / relations /${id1}/accept/${id2}`, {});
  }

  // Từ chối lời mời kết bạn
  declineFriendRequest(id1: number, id2: number): Observable<Relation> {
    return this.http.put<Relation>(`${API_URL} / relations /${id1}/decline/${id2}`, {});
  }

  // Bỏ kết bạn
  unFriend(id1: number, id2: number): Observable<Relation> {
    return this.http.put<Relation>(`${API_URL} / relations /${id1}/unfriend/${id2}`, {});
  }
}
