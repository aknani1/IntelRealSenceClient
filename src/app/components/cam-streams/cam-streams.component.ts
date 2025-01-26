import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cam-streams',
  templateUrl: './cam-streams.component.html',
  styleUrls: ['./cam-streams.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    // plus anything else you need
  ]
})
export class CamStreamsComponent {
  @Input() showDepth = false;
  @Input() showRGB = false;

  @Input() depthImageUrl: string | null = null;
  @Input() colorImageUrl: string | null = null;
  @Input() depthMetadataLines: string[] = [];
  @Input() rgbMetadataLines: string[] = [];
}
