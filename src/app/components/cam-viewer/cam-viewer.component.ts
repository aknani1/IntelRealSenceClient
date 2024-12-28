import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { WebSocketService } from '../../servicecs/web-socket.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-cam-viewer',
  standalone: false,

  templateUrl: './cam-viewer.component.html',
  styleUrl: './cam-viewer.component.scss'
})
export class CamViewerComponent implements OnInit{
  imageUrl: string = '';

  constructor(private WebSocketService :WebSocketService){}

  ngOnInit() {
    this.WebSocketService.startStream();
    this.WebSocketService.getVideoStream().subscribe(frame => {
      this.imageUrl = 'data:image/jpeg;base64,' + frame;
    });
  }
}
