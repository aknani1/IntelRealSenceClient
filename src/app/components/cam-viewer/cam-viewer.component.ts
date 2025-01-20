import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { HttpConfigService } from '../../services/http-config.service';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


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
 

    // Exposure values
  depthExposureValue: number = 250; // Default exposure for Depth Module
  rgbExposureValue: number = 250; // Default exposure for RGB Camera

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

  // Update Depth Module Configuration
  updateDepthResolution(): void {
    console.log('Updating Depth Resolution:', this.selectedDepthResolution);
    this.sendConfigurationUpdate('depth', this.selectedDepthResolution, this.selectedDepthFrameRate);
  }

  updateDepthFrameRate(): void {
    console.log('Updating Depth Frame Rate:', this.selectedDepthFrameRate);
    this.sendConfigurationUpdate('depth', this.selectedDepthResolution, this.selectedDepthFrameRate);
  }

  // Update RGB Module Configuration
  updateRGBResolution(): void {
    console.log('Updating RGB Resolution:', this.selectedRGBResolution);
    this.sendConfigurationUpdate('rgb', this.selectedRGBResolution, this.selectedRGBFrameRate);
  }

  updateRGBFrameRate(): void {
    console.log('Updating RGB Frame Rate:', this.selectedRGBFrameRate);
    this.sendConfigurationUpdate('rgb', this.selectedRGBResolution, this.selectedRGBFrameRate);
  }

  // Helper method to send configuration updates to the server
  
  private sendConfigurationUpdate(module: string, resolution: string, frameRate: string): void {
    this.httpConfigService.updateConfiguration(module, resolution, frameRate)
      .pipe(
        // Wait for the HTTP response
        switchMap((response) => {
          console.log(`${module} Module Updated Successfully`, response);
          alert(`${module} Module Updated Successfully:\nResolution: ${resolution}\nFrame Rate: ${frameRate}`);
  
          // Start WebSocket stream after HTTP response
          this.webSocketService.startStream();
  
          // Return the video stream observable
          return this.webSocketService.getVideoStream();
        }),
        catchError((error) => {
          console.error(`Error updating ${module} Module`, error);
          alert(`Error updating ${module} Module:\n${error.message}`);
          return of(null); // Handle error gracefully
        })
      )
      .subscribe((frame) => {
        if (frame) {
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
        }
      });
  }
  
 // Method to update Depth Module Exposure
  updateDepthExposure(): void {
    console.log('Updating Depth Exposure:', this.depthExposureValue);
    this.httpConfigService.updateExposure('depth', this.depthExposureValue).subscribe(
      (response) => {
        console.log('Depth Exposure Updated Successfully', response);
      },
      (error) => {
        console.error('Error updating Depth Exposure', error);
      }
    );
  }

  // Method to update RGB Camera Exposure
  updateRGBExposure(): void {
    console.log('Updating RGB Exposure:', this.rgbExposureValue);
    this.httpConfigService.updateExposure('rgb', this.rgbExposureValue)
    .subscribe(
      // Wait for the HTTP response
      (response) => {
        console.log('RGB Exposure Updated Successfully', response);
      },
      catchError((error) => {
        console.error(`Error updating Module`, error);
        return of(null); // Handle error gracefully
      })
    )
  }
}