import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Comments} from '../../model/comment/comments';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

// hien thi comment theo status
  getCommentByStatusId(id): Observable<Comments> {
    return this.http.get<Comments>(`${API_URL}/comment/${id}`);
  }

  getCommentByStatusPagination(id, size): Observable<Comments[]> {
    return this.http.get<Comments[]>(`${API_URL}/comment/page/${id}?size=${size}`);
  }

// tao moi comment
  createComment(comment, id1, statusId): Observable<Comments> {
    comment.account = {
      id: id1
    };
    comment.status = {
      id: statusId
    };
    return this.http.post<Comments>(`${API_URL}/comment`, comment);
  }

  // cap nhat
  editComment(comment, id1): Observable<Comments> {
    return this.http.put<Comments>(`${API_URL}/comment/${id1}`, {content: comment});
  }

  // xoa
  deleteComment(id: number): Observable<Comments> {
    return this.http.delete<Comments>(`${API_URL}/comment/${id}`);
  }
}
