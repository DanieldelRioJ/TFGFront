import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { Video } from 'src/app/objects/video';
import { Subject } from 'rxjs/internal/Subject';
import { Filter } from 'src/app/objects/filter/filter';
import { environment } from 'src/environments/environment';
import { VideoService } from 'src/app/services/video.service';
import { VideoProgressService } from 'src/app/services/video-progress.service';

@Component({
  selector: 'app-video-displayer',
  templateUrl: './video-displayer.component.html',
  styleUrls: ['./video-displayer.component.css']
})
export class VideoDisplayerComponent implements OnInit, AfterViewInit {
    environment=environment;

  @ViewChild('videoDisplayer') videoDisplayer: ElementRef;
  @ViewChild('videoContainer') videoContainer: ElementRef;

  @Input() video:Video;
  @Input() settings:Subject<any>;

  CHUNCK_TIME:number=10;

  boundingBoxActivated:boolean=true;
  downloadChunks:Array<Boolean>; //each position tell us if a chunk is donwloaded.

  virtualVideo; //MovieScript of the virtual videos
  movieScriptParts:Array<any>=new Array();

  virtualFrameAppearances;

  filter:Filter;
  mimeCodec = 'video/mp4; codecs="avc1.4d4020"';
  mediaSource:MediaSource;
  sourceBuffer:SourceBuffer;
  actualTime:number=0;

 loading:boolean=false;
 generationProgress:number=0


  constructor(private renderer: Renderer2,
        private videoService:VideoService,
        private videoProgress:VideoProgressService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.renderer.listen(this.videoDisplayer.nativeElement,'webkitfullscreenchange',this.onFullScreen);
    this.renderer.listen(this.videoDisplayer.nativeElement,'mozfullscreenchange',this.onFullScreen);
    this.renderer.listen(this.videoDisplayer.nativeElement,'fullscreenchange',this.onFullScreen);
      this.settings.subscribe(filter=>{
        this.generationProgress=0
        this.loading=true
          this.videoProgress.listenToVirtualVideoProgress(filter.id,(data)=>{console.log(data);this.generationProgress=data.progress});

          this.filter=filter
          this.videoService.generateVirtualVideo(this.video.id,filter).subscribe(json=>{
            this.loading=false
            this.videoProgress.stopListeningToVirtualVideoProgress()
              //Si ya hemos visualizado un resumen, limpiamos el buffer
              if(this.sourceBuffer!=undefined) {
                while(this.sourceBuffer.updating){}
                  if(this.mediaSource.readyState=="open"){
                    this.sourceBuffer.abort()
                }

              }
              this.actualTime=0
              this.virtualVideo=json;
              this.movieScriptParts=new Array()
              if (this.virtualVideo.objects_quantity==0) return;
              this.mediaSource=new MediaSource
              this.init();
          })
      });
  }

  init(){
    if ('MediaSource' in window && MediaSource.isTypeSupported(this.mimeCodec)) {
      this.renderer.setProperty(this.videoDisplayer.nativeElement, 'src', URL.createObjectURL(this.mediaSource))
      this.mediaSource.addEventListener('sourceopen', ()=>{
        this.updateBoundingBoxes();
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

  onFullScreen(event){
    let fullscreenElement = document.fullscreenElement;
  	if(fullscreenElement){
    	document.exitFullscreen();
    }else {
    	this.launchIntoFullscreen(this.videoContainer.nativeElement);
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // From https://davidwalsh.name/fullscreen
// Find the right method, call on correct element
launchIntoFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

  getNextChunk(){
      if(this.actualTime>this.mediaSource.duration) {
          this.sourceBuffer.onupdateend=(x)=>this.mediaSource.endOfStream(); //Por si está aún cargando
          if(!this.sourceBuffer.updating) this.mediaSource.endOfStream(); //Por si ya ha cargado
          return;
      }
      this.videoService.getMovieScriptPart(this.video.id,this.virtualVideo.id,this.actualTime/this.CHUNCK_TIME).subscribe(
        scriptPart=>{
          this.movieScriptParts.push(scriptPart)
        }
      );
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

  updateBoundingBoxes(){
    setTimeout(this.updateBoundingBoxes.bind(this),100);
    if(this.videoDisplayer==null) return;
    let actualFrame=Math.floor(this.videoDisplayer.nativeElement.currentTime*this.video.fps_adapted);
    let part=Math.floor(actualFrame/(this.video.fps_adapted*this.CHUNCK_TIME))
    if(this.movieScriptParts.length<=part) return;
    this.virtualFrameAppearances=this.movieScriptParts[part][Math.floor(actualFrame%(this.video.fps_adapted*this.CHUNCK_TIME))]

    let videoWidth=this.videoDisplayer.nativeElement.offsetWidth;
    let videoHeight=this.videoDisplayer.nativeElement.offsetHeight;
    this.virtualFrameAppearances.appearance_list.forEach((appearance: any)=>{
      appearance.relative_height=appearance.h*(videoHeight/this.video.height);
      appearance.relative_width=appearance.w*(videoWidth/this.video.width);
      appearance.relative_row=(appearance.row/this.video.height)*videoHeight;
      appearance.relative_col=(appearance.col/this.video.width)*videoWidth;
      return appearance;
    })
  }

  onVideoResize(event){
    console.log(event)
  }
}
