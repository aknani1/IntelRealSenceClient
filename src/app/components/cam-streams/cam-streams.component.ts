// File: cam-streams.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cam-streams',
  templateUrl: './cam-streams.component.html',
  styleUrls: ['./cam-streams.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class CamStreamsComponent {
  @Input() showDepth = false;
  @Input() showRGB = false;

  @Input() depthImageUrl: string | null = null;
  @Input() colorImageUrl: string | null = null;
  @Input() depthMetadataLines: string[] = [];
  @Input() rgbMetadataLines: string[] = [];

  // Removed all "loaded" booleans and overlay logic
}
