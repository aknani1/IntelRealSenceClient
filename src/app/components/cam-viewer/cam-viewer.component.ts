// cam-viewer.component.ts
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { HttpConfigService } from '../../services/http-config.service';
import { SidebarControlsComponent } from '../sidebar-controls/sidebar-controls.component';
import { CamStreamsComponent } from '../cam-streams/cam-streams.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';

import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../../app-routing.module';

@Component({
  selector: 'app-cam-viewer',
  templateUrl: './cam-viewer.component.html',
  styleUrls: ['./cam-viewer.component.scss'],
  standalone: true,
  imports: [SidebarControlsComponent,CamStreamsComponent,    BrowserModule,
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
      MatButtonModule,
      MatToolbarModule
      ]
})
export class CamViewerComponent implements OnInit {
  // Stream toggles
  showDepth = false;
  showRGB = false;



  sidePanelOpen = true;
  isReconfiguring = false;
  public rgbMetadataLines: string[] = [];
  public depthMetadataLines: string[] = [];
  // Streamed images
  depthImageUrl: string = '';
  colorImageUrl: string = '';
  // Local copies of metadata booleans
  depthMetadataOn = false;
  rgbMetadataOn = false;
  constructor(
    private webSocketService: WebSocketService,
    private httpConfigService: HttpConfigService
  ) {}

  ngOnInit(): void {
    // Start streaming
    this.webSocketService.startStream();

    // Subscribe to incoming frames
    this.webSocketService.getVideoStream().subscribe(frame => {
      // Show images if toggles are on
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
    
      // If metadata is present, store it
      if (frame.metadata) {
        this.rgbMetadataLines = frame.metadata.rgb || [];
        this.depthMetadataLines = frame.metadata.depth || [];
      }
    });
  }

  // Called when depth toggle changes
  onDepthToggle(newValue: boolean) {
    this.showDepth = newValue;
    console.log('Depth Module:', newValue ? 'Enabled' : 'Disabled');
  }


  onRgbToggle(newValue: boolean) {
    this.showRGB = newValue;
    console.log('RGB Module:', newValue ? 'Enabled' : 'Disabled');
  }


  // Called when updating Depth config
  updateDepthConfig(event: { resolution: string; frameRate: string }) {
    this.isReconfiguring = true;
    this.httpConfigService.updateConfiguration('depth', event.resolution, event.frameRate)
      .subscribe(
        response => {
          console.log('Depth config updated', response);
          alert(`Depth Updated: ${event.resolution}@${event.frameRate}fps`);
          this.webSocketService.startStream();
          this.isReconfiguring = false;
        },
        error => {
          console.error('Error updating Depth config', error);
          alert(`Error updating Depth: ${error.message}`);
          this.isReconfiguring = false;
        }
      );
  }

  // Called when updating RGB config
  updateRGBConfig(event: { resolution: string; frameRate: string }) {
    this.isReconfiguring = true; // show overlay
    this.httpConfigService.updateConfiguration('rgb', event.resolution, event.frameRate)
      .subscribe(
        response => {
          console.log('RGB config updated', response);
          alert(`RGB Updated: ${event.resolution}@${event.frameRate}fps`);
          this.webSocketService.startStream();
          this.isReconfiguring = false; // hide overlay
        },
        error => {
          console.error('Error updating RGB config', error);
          alert(`Error updating RGB: ${error.message}`);
          this.isReconfiguring = false; // hide overlay
        }
      );
  }
  // Helper method to send configuration updates to the server
  private sendConfigurationUpdate(module: string, resolution: string, frameRate: string): void {
    this.httpConfigService.updateConfiguration(module, resolution, frameRate).subscribe(
      (response) => {
        console.log(`${module} Module Updated Successfully`, response);
        alert(`${module} Module Updated Successfully:\nResolution: ${resolution}\nFrame Rate: ${frameRate}`);
        this.webSocketService.startStream();
      },
      (error) => {
        console.error(`Error updating ${module} Module`, error);
        alert(`Error updating ${module} Module:\n${error.message}`);
      }
    );
  }
  updateDepthExposure(value: number) {
    console.log('Updating Depth Exposure:', value);
    this.httpConfigService.updateExposure('depth', value).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }

  updateRGBExposure(value: number) {
    console.log('Updating RGB Exposure:', value);
    this.httpConfigService.updateExposure('rgb', value).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }
  // Called when depth metadata toggle changes
  onDepthMetadataToggle(newValue: boolean) {
    this.depthMetadataOn = newValue;
    console.log('Depth Metadata toggled to:', newValue);

    // Call server to toggle metadata
    this.httpConfigService.toggleMetadata('depth').subscribe(
      (res) => console.log('[Depth Metadata]:', res),
      (err) => console.error(err)
    );
  }

  // Called when rgb metadata toggle changes
  onRgbMetadataToggle(newValue: boolean) {
    this.rgbMetadataOn = newValue;
    console.log('RGB Metadata toggled to:', newValue);

    // Call server to toggle metadata
    this.httpConfigService.toggleMetadata('rgb').subscribe(
      (res) => console.log('[RGB Metadata]:', res),
      (err) => console.error(err)
    );
  }
  toggleSidePanel() {
    this.sidePanelOpen = !this.sidePanelOpen;
  }

}
