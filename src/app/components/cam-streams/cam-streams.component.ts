import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cam-streams',
  templateUrl: './cam-streams.component.html',
  styleUrls: ['./cam-streams.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSpinner
  ]
})
export class CamStreamsComponent {
  @Input() showDepth = false;
  @Input() showRGB = false;

  @Input() depthImageUrl: string | null = null;
  @Input() colorImageUrl: string | null = null;
  @Input() depthMetadataLines: string[] = [];
  @Input() rgbMetadataLines: string[] = [];

  depthImageLoaded = false;
  colorImageLoaded = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['depthImageUrl']) {
      this.depthImageLoaded = false;
    }
    if (changes['colorImageUrl']) {
      this.colorImageLoaded = false;
    }
  }

  onDepthImgLoad() {
    this.depthImageLoaded = true;
  }

  onColorImgLoad() {
    this.colorImageLoaded = true;
  }
}
