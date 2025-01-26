import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../../app-routing.module';
import { CamViewerComponent } from '../cam-viewer/cam-viewer.component';
import { HttpConfigService } from '../../services/http-config.service';

@Component({
  selector: 'app-sidebar-controls',
  templateUrl: './sidebar-controls.component.html',
  styleUrls: ['./sidebar-controls.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule,
    MatExpansionModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,]
})
export class SidebarControlsComponent implements OnInit {
  // Module toggles
  depthModuleEnabled = false;
  rgbCameraEnabled = false;

  // Metadata toggles
  depthMetadataEnabled = false;
  rgbMetadataEnabled = false;

  // Resolutions
  selectedDepthResolution = '640x480';
  selectedDepthFrameRate = '30';
  selectedRGBResolution = '640x480';
  selectedRGBFrameRate = '30';

  // Exposures
  depthExposureValue = 1000;
  rgbExposureValue = 1000;

  // Camera info variables
  cameraName: string = '';
  cameraSerial: string = '';
  cameraFirmware: string = '';
  cameraUsb: string = '';


  // Outputs for toggles
  @Output() depthToggleChange = new EventEmitter<boolean>();
  @Output() rgbToggleChange = new EventEmitter<boolean>();
  @Output() depthResolutionChange = new EventEmitter<{ resolution: string; frameRate: string }>();
  @Output() rgbResolutionChange = new EventEmitter<{ resolution: string; frameRate: string }>();
  @Output() depthExposureChange = new EventEmitter<number>();
  @Output() rgbExposureChange = new EventEmitter<number>();
  // NEW events for metadata
  @Output() depthMetadataToggle = new EventEmitter<boolean>();
  @Output() rgbMetadataToggle   = new EventEmitter<boolean>();
  constructor(private httpConfigService: HttpConfigService) {}

  ngOnInit() {
    this.loadCameraInfo();
  }


  private loadCameraInfo() {
    this.httpConfigService.getCameraInfo().subscribe({
      next: (info) => {
        this.cameraName = info.name || '';
        this.cameraSerial = info.serial_number || '';
        this.cameraFirmware = info.firmware_version || '';
        this.cameraUsb = info.usb_type_descriptor || '';
      },
      error: (err) => {
        console.error('Error fetching camera info:', err);
      }
    });
  }

  // Depth module toggled
  onDepthToggle(newValue: boolean) {
    console.log('Depth Module toggled to:', newValue);
    this.depthToggleChange.emit(newValue);
  
    // If turned OFF, also turn OFF depth metadata if it's on
    if (!newValue && this.depthMetadataEnabled) {
      this.depthMetadataEnabled = false; // visually set toggle to off
      this.depthMetadataToggle.emit(false); // notify the parent
    }
  }
  // RGB module toggled
  onRgbToggle(newValue: boolean) {
    console.log('RGB Camera toggled to:', newValue);
    this.rgbToggleChange.emit(newValue);

    // If turned OFF, also turn OFF rgb metadata if it's on
    if (!newValue && this.rgbMetadataEnabled) {
      this.rgbMetadataEnabled = false;            // visually set toggle to off
      this.rgbMetadataToggle.emit(false);         // notify the parent
    }
  }

  onDepthMetadataToggle(newValue: boolean) {
    console.log('Depth Metadata toggled to:', newValue);
    this.depthMetadataToggle.emit(newValue);
  }

  onRgbMetadataToggle(newValue: boolean) {
    console.log('RGB Metadata toggled to:', newValue);
    this.rgbMetadataToggle.emit(newValue);
  }


  // Depth resolution/fps
  onDepthResolutionChange() {
    this.depthResolutionChange.emit({
      resolution: this.selectedDepthResolution,
      frameRate: this.selectedDepthFrameRate
    });
  }

  // RGB resolution/fps
  onRgbResolutionChange() {
    this.rgbResolutionChange.emit({
      resolution: this.selectedRGBResolution,
      frameRate: this.selectedRGBFrameRate
    });
  }

  // Depth exposure
  onDepthExposureChange() {
    this.depthExposureChange.emit(this.depthExposureValue);
  }

  // RGB exposure
  onRgbExposureChange() {
    this.rgbExposureChange.emit(this.rgbExposureValue);
  }
}