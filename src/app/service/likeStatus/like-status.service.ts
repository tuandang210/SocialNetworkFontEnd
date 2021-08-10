import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {LikeStatus} from '../../model/likeStatus/like-status';
import {HttpClient} from '@angular/common/http';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class LikeStatusService {

  constructor(private http: HttpClient) {
  }

  // hien thi like
  getAllLikeStatus(id: number): Observable<LikeStatus[]> {
    return this.http.get<LikeStatus[]>(`${API_URL}/likestatus/${id}`);
  }

  // like
  createLikeStatus(likeStatus, userId, statusId): Observable<LikeStatus> {
    likeStatus.account = {
      id: userId
    };
    likeStatus.status = {
      id: statusId
    };
    return this.http.post<LikeStatus>(`${API_URL}/likestatus`, likeStatus);
  }

  // dislike
  dislikeStatus(accountId, statusId): Observable<LikeStatus> {
    return this.http.delete<LikeStatus>(`${API_URL}/likestatus/${accountId}?statusId=${statusId}`);
  }

  updateLike(id, likeStatus): Observable<LikeStatus> {
    return this.http.put<LikeStatus>(`${API_URL}/likestatus/${id}`, likeStatus);
  }
}
