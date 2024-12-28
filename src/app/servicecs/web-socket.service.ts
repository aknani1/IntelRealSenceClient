import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

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

  getVideoStream(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('video_frame', (frame: string) => {
        observer.next(frame);
      });
    });
  }
}
