import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpConfigService {
  private apiUrl = 'http://localhost:5000/api/configure'; // Flask server URL
  constructor(private http: HttpClient) { }
  updateConfiguration(module: string, resolution: string, frameRate: string): Observable<any> {
    const body = { module, resolution, frame_rate: frameRate };
    return this.http.post(this.apiUrl, body);
  }
}