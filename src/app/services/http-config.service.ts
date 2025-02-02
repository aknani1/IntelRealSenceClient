import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class HttpConfigService {
  private apiUrl = 'http://localhost:5000/api/configure'; // Flask server URL
  private exposureApiUrl = 'http://localhost:5000/api/exposure'; // Endpoint for exposure updates
  private setMetaDataUrl = 'http://localhost:5000/api/set_metadata'; // endpoint for metadata
  private cameraInfoUrl = 'http://localhost:5000/api/camera_info';
  private hardResetUrl = 'http://localhost:5000/api/hard_reset';

  constructor(private http: HttpClient, private webSocketService: WebSocketService) {}

  updateConfiguration(module: string, resolution: string, frameRate: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        this.http.post(this.apiUrl, { module, resolution, frame_rate: frameRate })
          .subscribe({
            next: (res) => {
              this.webSocketService.startStream();
              observer.next(res);
            },
            error: (err) => observer.error(err)
          });
      }, 500); // Wait for stream stop
    });
  }

  updateExposure(module: string, exposureValue: number): Observable<any> {
    const body = { module, exposure: exposureValue };
    return this.http.post(this.exposureApiUrl, body);
  }

  setMetadata(module: string, state: boolean): Observable<any> {
    return this.http.post(this.setMetaDataUrl, { module, state });
  }

  getCameraInfo(): Observable<any> {
    return this.http.get(this.cameraInfoUrl);
  }

  hardReset(): Observable<any> {
    return this.http.post(this.hardResetUrl, {});
  }

  getDefaults(): Observable<any> {
    return this.http.get('http://localhost:5000/api/defaults');
  }
}
