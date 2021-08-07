import {Injectable} from '@angular/core';
import {ImageStatus} from '../../model/status-model/image-status';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class ImageStatusService {
  imageStatus: ImageStatus[] = [];

  constructor(private http: HttpClient) {
  }

  getImageStatus(id): Observable<ImageStatus> {
    return this.http.get<ImageStatus>(`${API_URL}/images/${id}`);
  }

  updateImage(id: number, image: ImageStatus): Observable<ImageStatus> {
    return this.http.put<ImageStatus>(`${API_URL}/images/${id}`, image);
  }

  createImage(image: ImageStatus): Observable<ImageStatus> {
    return this.http.post<ImageStatus>(`${API_URL}/images`, image);
  }
  deleteImage(id): Observable<ImageStatus> {
    return this.http.delete<ImageStatus>(`${API_URL}/images/${id}`);
  }
}
