import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LikeComment} from '../../model/likeComment/like-comment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class LikeCommentService {

  constructor(private http: HttpClient) {
  }

  // hien thi likeComment
  getAllLikeComment(id: number): Observable<LikeComment> {
    return this.http.get<LikeComment>(`${API_URL}/likeComment/${id}`);
  }

  // tao likeComment
  createLikeComment(likeComment: LikeComment): Observable<LikeComment> {
    likeComment.account = {
      id: likeComment.account
    };
    likeComment.comment = {
      id: likeComment.comment
    };
    return this.http.post<LikeComment>(`${API_URL}/likeComment`, likeComment);
  }

  // disLikeComment
  disLikeComment(id: number): Observable<LikeComment> {
    return this.http.delete<LikeComment>(`${API_URL}/likeComment/${id}`);
  }
}
