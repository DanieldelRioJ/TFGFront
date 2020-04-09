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

  CHUNCK_TIME:number=10;

  downloadChunks:Array<Boolean>; //each position tell us if a chunk is donwloaded.

  videoUrl: string;
  virtualVideo;
  filter:Filter;
  mimeCodec = 'video/mp4; codecs="avc1.4d4020"';
  mediaSource;
  sourceBuffer:SourceBuffer;
  actualTime:number=0;



  constructor(private renderer: Renderer2,
        private videoService:VideoService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
      this.settings.subscribe(filter=>{

          this.filter=filter
          this.videoService.generateVirtualVideo(this.video.id,filter).subscribe(json=>{
              //Si ya hemos visualizado un resumen, limpiamos el buffer
              if(this.sourceBuffer!=undefined) {
                  debugger;
                  if(this.mediaSource.readyState=="open"){
                    this.sourceBuffer.abort()
                }
                  this.mediaSource.removeSourceBuffer(this.sourceBuffer)
              }
              this.mediaSource=new MediaSource
              this.actualTime=0
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

  addChunck(buf, time){
    this.sourceBuffer.timestampOffset=time;
    this.sourceBuffer.appendBuffer(buf);
    this.downloadChunks[Math.floor(this.actualTime/this.CHUNCK_TIME)]=true;
    this.actualTime+=this.CHUNCK_TIME;
  }

  getNextChunk(){
      if(this.actualTime>this.mediaSource.duration) {
          this.sourceBuffer.onupdateend=(x)=>this.mediaSource.endOfStream(); //Por si está aún cargando
          if(!this.sourceBuffer.updating) this.mediaSource.endOfStream(); //Por si ya ha cargado
          return;
      }
      this.videoService.getVirtualVideoPiece(this.video.id, this.virtualVideo.id, this.actualTime).subscribe(buf=>{
          if (!this.sourceBuffer.updating) {
              this.addChunck(buf, this.actualTime)
              this.getNextChunk();

        } else {
            this.sourceBuffer.onupdateend = () => {
                this.addChunck(buf,this.actualTime)
                this.getNextChunk();
            };
        }
      });

  }

  sourceOpen() {
    this.mediaSource.duration=this.virtualVideo.frame_quantity/this.video.fps_adapted;
    let chunkQuantity=Math.ceil(this.mediaSource.duration/this.CHUNCK_TIME);
    this.downloadChunks=new Array(chunkQuantity);
    for(var i=0;i<chunkQuantity;i++) this.downloadChunks[i]=false
    this.sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeCodec);

  }
}
