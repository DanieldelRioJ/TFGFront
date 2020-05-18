import { Component, OnInit, ViewChild,AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../services/video.service';
import { Video } from '../objects/video';
import { faFilter,faDownload ,faUsers,faCog,faPlay, faPause} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements AfterViewInit {

    filterIcon=faFilter;
    downloadIcon=faDownload;
    objectsIcon=faUsers;
    settingsIcon=faCog;
    playIcon=faPlay;
    pauseIcon=faPause;

    boundingBoxesActivated:boolean=true;

    environment=environment;

    @ViewChild('originalVideo',{static:true}) videoElement:ElementRef;
    @ViewChild('seek',{static:true}) seekElement:ElementRef;
    @ViewChild('canvas',{static:true}) canvas:ElementRef;
    canvasContext:CanvasRenderingContext2D;

    video:Video;

    frameMap;
    actualAppearances=[];
    actualFrame:number;
    playingVideo:boolean=false;
    meters:number=1;

  constructor(private route:ActivatedRoute,
    private videoService:VideoService,
  private renderer:Renderer2) { }


  ngAfterViewInit(): void {
    console.log(this.seekElement)
    this.renderer.listen(this.videoElement.nativeElement,'canplay',_=>{
      this.renderer.setAttribute(this.canvas.nativeElement,'width',this.videoElement.nativeElement.videoWidth)
      this.renderer.setAttribute(this.canvas.nativeElement,'height',this.videoElement.nativeElement.videoHeight)
      this.canvasContext=this.canvas.nativeElement.getContext("2d")
      this.canvasContext.moveTo(0,0)
      this.canvasContext.lineTo(500,500)

    })

    this.renderer.listen(this.videoElement.nativeElement,'ended',_=>this.playingVideo=false)
    this.route.paramMap.subscribe(params => {
      let video_id = params.get("video_id");
      this.videoService.getVideo(video_id).subscribe(video=>{
          this.video=video;
          console.log(video)
          this.videoService.getFrameMap(video.id).subscribe(frameMap=>{
            this.frameMap=frameMap;
            this.updateBirdEyeView();
          })
      })
    })
  }

  updateBirdEyeView(){
    setTimeout(this.updateBirdEyeView.bind(this),100);
    let currentTime=this.videoElement.nativeElement.currentTime;
    if(currentTime==undefined) return;
    let actualFrame=Math.round(currentTime*this.video.fps_adapted)+1;


    if(this.actualFrame!=actualFrame ){

      //Update relative coordinates (to div)
      let actualAppearances=this.frameMap[actualFrame]
      if(actualAppearances==undefined) return;
      this.actualFrame=actualFrame;
      let videoWidth=this.videoElement.nativeElement.offsetWidth;
      let videoHeight=this.videoElement.nativeElement.offsetHeight;
      actualAppearances.forEach((appearance: any)=>{
        appearance.relative_height=appearance.h*(videoHeight/this.video.height);
        appearance.relative_width=appearance.w*(videoWidth/this.video.width);
        appearance.relative_row=(appearance.row/this.video.height)*videoHeight;
        appearance.relative_col=(appearance.col/this.video.width)*videoWidth;
        return appearance;
      })
      this.actualAppearances=actualAppearances;

      //Check collisions
      if(this.video.perspective){
        actualAppearances.forEach(appearance=>appearance.collision=undefined) //clear old collisions

        for(let i=0;i<actualAppearances.length-1;i++){
          let apA:any=actualAppearances[i];

          for(let j=i+1;j<actualAppearances.length;j++){
            let apB:any=actualAppearances[j];
            if(this.distance(apA.real_coordinates[0],apA.real_coordinates[1],apB.real_coordinates[0],apB.real_coordinates[1])/this.video.perspective.one_meter-0.7<this.meters){
              if(apA.collision==undefined){
                apA.collision=[]
              }
              if(apB.collision==undefined){
                apB.collision=[]
              }
              apA.collision.push(j);
            }
          }
        }


        //Draw lines in canvas
        this.canvasContext.clearRect(0,0,this.video.width,this.video.height)
        let lineWidth=this.video.width*4/1000
        let fontSize=Math.round(this.video.width*25/1000)

        this.actualAppearances.forEach((appearance:any)=>{
          if(appearance.collision!=undefined){
            appearance.collision.forEach(index_collision=>{
              this.canvasContext.lineWidth=lineWidth
              this.canvasContext.strokeStyle='red'
              this.canvasContext.beginPath();
              this.canvasContext.moveTo(appearance.center_col,appearance.center_row)

              let collisionElement:any=this.actualAppearances[index_collision]
              this.canvasContext.lineTo(collisionElement.center_col,collisionElement.center_row)
              this.canvasContext.stroke();
              this.canvasContext.closePath();

              this.canvasContext.textAlign="center"
              this.canvasContext.shadowColor="black"
              this.canvasContext.fillStyle='white'
              this.canvasContext.font=fontSize+"px Arial"
              this.canvasContext.shadowBlur = 4;
              this.canvasContext.fillText(""+(this.distance(appearance.real_coordinates[0],appearance.real_coordinates[1],collisionElement.real_coordinates[0],collisionElement.real_coordinates[1])/this.video.perspective.one_meter-0.7).toFixed(2)
              ,(appearance.center_col+collisionElement.center_col)/2,(appearance.center_row+collisionElement.center_row)/2)
            })
          }
        })
      }
    }
  }
  distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))
  }

  togglePlay(){
    if(this.playingVideo) this.videoElement.nativeElement.pause()
    else this.videoElement.nativeElement.play()
    this.playingVideo=!this.playingVideo
  }

  updateDisplayer(event){

    let currentTime=this.video.frame_quantity_adapted*(event.offsetX/this.seekElement.nativeElement.clientWidth)/this.video.fps_adapted
    this.videoElement.nativeElement.currentTime=currentTime
  }

}
