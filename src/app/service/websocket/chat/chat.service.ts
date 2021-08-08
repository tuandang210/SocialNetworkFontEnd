import { Injectable } from '@angular/core';
import {Chat} from '../../../model/chat';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
const API_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Chat[]> {
    return this.http.get<Chat[]>(API_URL + '/products');
  }

  deleteProductById(id): Observable<Chat> {
    return this.http.delete(API_URL + '/products' + id);
  }

  creteProduct(product): Observable<Chat> {
    return this.http.post<Chat>(API_URL + '/products', product);
  }
}
