import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpConfigService {
  private apiUrl = 'http://localhost:5000/api/configure'; // Flask server URL
  private exposureApiUrl = 'http://localhost:5000/api/exposure'; // Endpoint for exposure updates
  private toggleMetadataUrl = 'http://localhost:5000/api/toggle_metadata'; // endpoint for metadata
  constructor(private http: HttpClient) { }
  updateConfiguration(module: string, resolution: string, frameRate: string): Observable<any> {
    const body = { module, resolution, frame_rate: frameRate };
    return this.http.post(this.apiUrl, body);
  }

  updateExposure(module: string, exposureValue: number): Observable<any> {
    const body = { module, exposure: exposureValue };
    return this.http.post(this.exposureApiUrl, body);
  }
toggleMetadata(module: string): Observable<any> {
  return this.http.post('http://localhost:5000/api/toggle_metadata', { module });
}
}