import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { CamViewerComponent } from '../components/cam-viewer/cam-viewer.component';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: any;

  constructor() {
    this.socket = io('http://localhost:5000');
  }

  startStream() {
    this.socket.emit('start_stream');
  }

  getVideoStream(): Observable<{ color: string; depth: string }> {
    return new Observable((observer) => {
      this.socket.on('video_frame', (frame: { color: string; depth: string }) => {
        observer.next(frame);
      });
    });
  }

  sendConfigurationUpdate(module: string, resolution: string, frameRate: string): void {
    const data = { module, resolution, frameRate };
    this.socket.emit('update_configuration', data);
    console.log(`Configuration update sent for ${module}: ${resolution} at ${frameRate} FPS`);
  }
}
