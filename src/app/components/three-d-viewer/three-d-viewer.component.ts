import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { NgtCanvasModule, NgtBeforeRenderEvent, NgtRenderState, NgtStore } from '@angular-three/core';
import { NgtPerspectiveCameraModule, NgtOrbitControlsModule } from '@angular-three/soba';
import { NgtBufferGeometryModule, NgtBufferAttributeModule } from '@angular-three/core';
import { NgtPointsMaterialModule, NgtPointsModule } from '@angular-three/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-three-d-viewer',
  standalone: true,
  imports: [
    CommonModule,
    NgtCanvasModule,
    NgtPerspectiveCameraModule,
    NgtOrbitControlsModule,
    NgtBufferGeometryModule,
    NgtBufferAttributeModule,
    NgtPointsMaterialModule,
    NgtPointsModule,
  ],
  templateUrl: './three-d-viewer.component.html',
  styleUrls: ['./three-d-viewer.component.scss']
})
export class ThreeDViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  pointCloud: { vertices: Float32Array; texcoords: Float32Array; intrinsics: any} | null = null;
  // Add a flag to check whether the point cloud has been initialized
  pointCloudInitialized = false;
  // Use ViewChild to access the ngt-points element
  @ViewChild('points') points!: ElementRef;
    @ViewChild('ngtCanvas') canvasRef?: ElementRef<HTMLCanvasElement>;

  private pointCloudSubscription!: Subscription;
  constructor(private webSocketService: WebSocketService, private store: NgtStore) {}

  ngOnInit(): void {
      this.webSocketService.start3DStream();
      this.pointCloudSubscription = this.webSocketService.getPointCloudStream().subscribe((data: any) => {
        const parsedData = JSON.parse(data);
        // Check if parsedData.vertices and parsedData.texcoords are arrays
        if (Array.isArray(parsedData.vertices) && Array.isArray(parsedData.texcoords)) {
          this.pointCloud = {
            vertices: new Float32Array(parsedData.vertices.flat()),
            texcoords: new Float32Array(parsedData.texcoords.flat()),
            intrinsics: parsedData.intrinsics
          };
          // Set the flag to true when the point cloud data is available
          this.pointCloudInitialized = true;
        } else {
          console.error("parsedData.vertices or parsedData.texcoords is not an array");
        }
      });
    }
  ngAfterViewInit() {
      // This code will now execute only after the view has been fully initialized
      if (this.pointCloudInitialized && this.points) {
          console.log("The Point Cloud rendering initiated and successful");
      }
  }

  ngOnDestroy(): void {
      if (this.pointCloudSubscription) {
          this.pointCloudSubscription.unsubscribe();
      }
  }
  onBeforeRender($event: NgtBeforeRenderEvent<NgtRenderState>) {
      if (this.store.get('scene') && this.store.get('camera')) {
          const { scene, camera } = this.store.get()
          camera.updateProjectionMatrix()
      }
  }
}
