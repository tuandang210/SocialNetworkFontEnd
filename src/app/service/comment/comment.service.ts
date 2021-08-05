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

  createComment(comment: Comments): Observable<Comments> {
    comment.account = {
      id: comment.account
    };
    comment.status = {
      id: comment.status
    };
    return this.http.post<Comments>(`${API_URL}/comment`, comment);
  }
}
