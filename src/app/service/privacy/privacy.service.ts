import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Privacy} from '../../model/privacy/privacy';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class PrivacyService {

  constructor(private http: HttpClient) {
  }

  showPrivacy(): Observable<Privacy[]> {
    return this.http.get<Privacy[]>(`${API_URL}/privacy`);
  }
}
