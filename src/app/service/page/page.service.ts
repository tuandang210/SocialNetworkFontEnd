import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Page} from '../../model/page/page';
import {environment} from '../../../environments/environment';
import {Status} from '../../model/status-model/status';
import {StatusDTO} from '../../model/page/status-dto';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private http: HttpClient) {
  }

  getAllPageByAccountId(accountId): Observable<Page[]> {
    return this.http.get<Page[]>(`${API_URL}/pages?accountId=${accountId}`);
  }

  createNewPage(pageName, accountId): Observable<Page> {
    return this.http.post<Page>(`${API_URL}/pages/${accountId}`, {name: pageName, privacy: '0'});
  }
  getAllStatusByPageId(pageId, loadAmount): Observable<StatusDTO[]> {
    return this.http.get<StatusDTO[]>(`${API_URL}/status/page/${pageId}?size=${loadAmount}`);
  }
  getPageByPageId(pageId): Observable<Page> {
    return this.http.get<Page>(`${API_URL}/pages/${pageId}`);
  }
}
