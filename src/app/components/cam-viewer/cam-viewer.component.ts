import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { HttpConfigService } from '../../services/http-config.service';

@Component({
  selector: 'app-cam-viewer',
  standalone: false,
  templateUrl: './cam-viewer.component.html',
  styleUrls: ['./cam-viewer.component.scss'],
})
export class CamViewerComponent implements OnInit {
   // Sidebar toggles
   depthModuleEnabled: boolean = false;
   rgbCameraEnabled: boolean = false;
 
   // Control panel visibility
   depthModuleVisible: boolean = false;
   rgbCameraVisible: boolean = false;
 
   // Stream settings
   showDepth: boolean = false;
   showRGB: boolean = false;
   depthImageUrl: string = '';
   colorImageUrl: string = '';
 
   // Control panel settings
   selectedDepthResolution: string = '640x480';
   selectedDepthFrameRate: string = '30';
   selectedRGBResolution: string = '640x480';
   selectedRGBFrameRate: string = '30';
 
  constructor(
    private webSocketService: WebSocketService,
    private httpConfigService: HttpConfigService
  ) {}

  ngOnInit(): void {
    this.webSocketService.startStream();
    this.webSocketService.getVideoStream().subscribe((frame) => {
      if (this.showRGB) {
        this.colorImageUrl = 'data:image/jpeg;base64,' + frame.color;
      } else {
        this.colorImageUrl = '';
      }
      if (this.showDepth) {
        this.depthImageUrl = 'data:image/jpeg;base64,' + frame.depth;
      } else {
        this.depthImageUrl = '';
      }
    });
  }

  // Toggle Depth Module
  toggleDepthModule(): void {
    this.depthModuleVisible = !this.depthModuleVisible;
    this.showDepth = this.depthModuleEnabled;
    console.log('Depth Module:', this.depthModuleEnabled ? 'Enabled' : 'Disabled');
  }

  // Toggle RGB Camera
  toggleRGBCamera(): void {
    this.rgbCameraVisible = !this.rgbCameraVisible;
    this.showRGB = this.rgbCameraEnabled;
    console.log('RGB Camera:', this.rgbCameraEnabled ? 'Enabled' : 'Disabled');
  }

  // Update Depth Resolution
  updateDepthResolution(): void {
    console.log('Updated Depth Resolution:', this.selectedDepthResolution);
    // Add logic to send resolution update to server
  }

  // Update Depth Frame Rate
  updateDepthFrameRate(): void {
    console.log('Updated Depth Frame Rate:', this.selectedDepthFrameRate);
    // Add logic to send frame rate update to server
  }

  // Update RGB Resolution
  updateRGBResolution(): void {
    console.log('Updated RGB Resolution:', this.selectedRGBResolution);
    // Add logic to send resolution update to server
  }

  // Update RGB Frame Rate
  updateRGBFrameRate(): void {
    console.log('Updated RGB Frame Rate:', this.selectedRGBFrameRate);
    // Add logic to send frame rate update to server
  }
}
