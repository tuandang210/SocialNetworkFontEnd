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
  createLikeStatus(likeStatus: LikeStatus): Observable<LikeStatus> {
    likeStatus.account = {
      id: likeStatus.account
    };
    likeStatus.status = {
      id: likeStatus.status
    };
    return this.http.post<LikeStatus>(`${API_URL}/likestatus`, likeStatus);
  }

  // dislike
  dislikeStatus(id: number): Observable<LikeStatus> {
    return this.http.delete<LikeStatus>(`${API_URL}/likestatus`);
  }
}
