import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { Video } from 'src/app/objects/video';
import { Subject } from 'rxjs/internal/Subject';
import { Filter } from 'src/app/objects/filter/filter';
import { environment } from 'src/environments/environment';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-video-displayer',
  templateUrl: './video-displayer.component.html',
  styleUrls: ['./video-displayer.component.css']
})
export class VideoDisplayerComponent implements OnInit, AfterViewInit {
    environment=environment;

  @ViewChild('videoDisplayer', { static: false }) videoDisplayer: ElementRef;

  @Input() video:Video;
  @Input() settings:Subject<any>;

  videoUrl: string;
  virtualVideo;
  filter:Filter;
  mimeCodec = 'video/mp4; codecs="avc1.4d4020"';
  mediaSource = new MediaSource;
  sourceBuffer;
  actualTime:number=0;

  constructor(private renderer: Renderer2,
        private videoService:VideoService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
      this.settings.subscribe(filter=>{
          this.filter=filter
          this.videoService.generateVirtualVideo(this.video.id,filter).subscribe(json=>{
              console.log(json);
              this.virtualVideo=json;
              this.videoUrl=`${this.environment.apiUrl}/videos/${this.video.id}/virtual/${json.id}`
              this.init();
          })
      });
  }

  init(){
    if ('MediaSource' in window && MediaSource.isTypeSupported(this.mimeCodec)) {
      this.renderer.setProperty(this.videoDisplayer.nativeElement, 'src', URL.createObjectURL(this.mediaSource))
      this.mediaSource.addEventListener('sourceopen', ()=>{
          this.sourceOpen();
          this.getNextChunk();
      });
    } else {
      console.error('Unsupported MIME type or codec: ', this.mimeCodec);
    }
  }

  getNextChunk(){
      if(this.actualTime>this.virtualVideo.frame_list.length/this.video.fps) {
          this.sourceBuffer.onupdateend=(x)=>this.mediaSource.endOfStream(); //Por si está aún cargando
          if(!this.sourceBuffer.updating) this.mediaSource.endOfStream(); //Por si ya ha cargado
          return;
      }
      this.videoService.getVirtualVideoPiece(this.video.id, this.virtualVideo.id, this.actualTime).subscribe(buf=>{
          this.sourceBuffer.timestampOffset=this.actualTime;
        this.sourceBuffer.appendBuffer(buf);
        this.actualTime+=5;
        this.getNextChunk();
      });

  }

  sourceOpen() {
    this.mediaSource.duration=this.virtualVideo.frame_list.length/this.video.fps-1;
    this.sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeCodec);

  }
}
