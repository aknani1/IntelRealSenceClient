import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { WebSocketService } from '../../services/web-socket.service';
import { NgIf } from '@angular/common';
import { HttpConfigService } from '../../services/http-config.service';

@Component({
  selector: 'app-cam-viewer',
  standalone: false,
  templateUrl: './cam-viewer.component.html',
  styleUrl: './cam-viewer.component.scss'
})
export class CamViewerComponent implements OnInit{
  colorImageUrl: string = '';
  depthImageUrl: string = '';
  showRGB: boolean = true;
  showDepth: boolean = true;
  depthResolution = '640x480';
  depthFrameRate = '30';
  rgbResolution = '640x480';
  rgbFrameRate = '30';



  stereoModuleEnabled = false;
  rgbCameraEnabled = false;

  // Control table settings
  selectedResolution = '640x480';
  selectedFrameRate = '30';
  exposureValue = '8500';

  // Stream state
  streamActive = false;
  // Controls data for the table
  controls = [
    {
      name: 'Resolution',
      options: ['640x480', '1280x720'],
      currentValue: this.selectedResolution,
    },
    {
      name: 'Frame Rate (FPS)',
      options: ['15', '30'],
      currentValue: this.selectedFrameRate,
    },
    {
      name: 'Exposure',
      options: null, // Exposure uses a slider, so no dropdown options are needed
      currentValue: this.exposureValue,
    },
  ];

  displayedColumns = ['name', 'currentValue', 'options'];


  // Selected settings
  selectedDepthResolution = this.depthResolution;
  selectedDepthFrameRate = this.depthFrameRate;
  selectedRGBResolution = this.rgbResolution;
  selectedRGBFrameRate = this.rgbFrameRate;
  constructor(private WebSocketService :WebSocketService,
              private httpConfigService:HttpConfigService

  ){}

  ngOnInit() {
    this.WebSocketService.startStream();
    this.WebSocketService.getVideoStream().subscribe(frame => {
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
    toggleRGB() {
      this.showRGB = !this.showRGB; // Toggle RGB stream
    }
  
    toggleDepth() {
      this.showDepth = !this.showDepth; // Toggle Depth stream
    }
 // Methods to update settings
 updateResolution(): void {
  console.log('Resolution updated to:', this.selectedResolution);
  this.controls[0].currentValue = this.selectedResolution;
  // Add logic to send resolution update to server
}

updateFrameRate(): void {
  console.log('Frame rate updated to:', this.selectedFrameRate);
  this.controls[1].currentValue = this.selectedFrameRate;
  // Add logic to send frame rate update to server
}

updateExposure(): void {
  console.log('Exposure updated to:', this.exposureValue);
  this.controls[2].currentValue = this.exposureValue;
  // Add logic to send exposure update to server
}
 updateDepthConfiguration(): void {
  this.httpConfigService.updateConfiguration(
    'depth',
    this.selectedDepthResolution,
    this.selectedDepthFrameRate
  ).subscribe(
    (response) => {
      console.log('Depth Configuration Updated:', response);
      this.depthResolution = response.resolution;
      this.depthFrameRate = response.frame_rate;
    },
    (error) => console.error('Error updating depth configuration:', error)
  );
}

updateRGBConfiguration(): void {
  this.httpConfigService.updateConfiguration(
    'rgb',
    this.selectedRGBResolution,
    this.selectedRGBFrameRate
  ).subscribe(
    (response) => {
      console.log('RGB Configuration Updated:', response);
      this.rgbResolution = response.resolution;
      this.rgbFrameRate = response.frame_rate;
    },
    (error) => console.error('Error updating RGB configuration:', error)
  );
}
}
