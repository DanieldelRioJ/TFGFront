import { Component, OnInit, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Video } from '../objects/video';
import { VideoService } from '../services/video.service';
import { ActivatedRoute } from '@angular/router';
import { faVideo,faTachometerAlt,faRoad,faClock, faTshirt} from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs/internal/Subject';
import { PathFilter } from '../objects/filter/path-filter';
import { TimeFilter } from '../objects/filter/time-filter';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { VelocityFilter } from '../objects/filter/velocity-filter';
import { Filter } from '../objects/filter/filter';

const RangeValidator: ValidatorFn = (fg: FormGroup) => {
  const start = fg.get('min').value;
  const end = fg.get('max').value;
  if(start==undefined || start=="") return null;
  if(end==undefined || end=="") return null;
  return start < end
    ? null
    : { range: true };
};

@Component({
  selector: 'app-video-analisis',
  templateUrl: './video-analisis.component.html',
  styleUrls: ['./video-analisis.component.css']
})
export class VideoAnalisisComponent implements OnInit{

    //Icons
    clothIcon=faTshirt;
    timeIcon=faClock;
    generateIcon=faVideo;
    pathIcon=faRoad;
    speedIcon=faTachometerAlt;

    //environment
    environment=environment;

    //View
    @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('background', { static: true }) background: ElementRef<HTMLImageElement>;

    //CallChilds
    resetPath:Subject<any> = new Subject();
    showGeneratedVideo:Subject<any> = new Subject();

    //canvas
    canvasContext:CanvasRenderingContext2D;

    //objects
    video:Video;

    filterForm:FormGroup;

    //Filters
    pathFilter:PathFilter=new PathFilter();
    timeFilter:TimeFilter=new TimeFilter();
    velocityFilter:VelocityFilter=new VelocityFilter();
    area;
    direction;

  constructor(private route:ActivatedRoute,
    private videoService:VideoService,
    private fb:FormBuilder) { }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        let video_id = params.get("video_id");
        this.videoService.getVideo(video_id).subscribe(video=>{
            this.video=video;
        })
      })
      this.filterForm = this.fb.group({
          velocity:this.fb.group({
              min:['',Validators.min(0)],
              max:['',Validators.min(1)]
          },{validator:RangeValidator}),
          time:this.fb.group({

          })
  });
  }

  setPath(path){
      this.pathFilter.path=path;
      console.log(path)
  }

  setArea(area){
      //TODO:
  }

  setDirection(direction){
      //TODO:
  }

  funcResetPath(){
      this.pathFilter.path=undefined;
      this.resetPath.next();
  }

  generateVideo(){
      //TODO:generate video
      if(!this.filterForm.valid) return;
      let f:Filter=new Filter();
      f.velocity=this.filterForm.value.velocity;
      f.time=this.filterForm.value.time;
      console.log(this.filterForm.value)
      this.showGeneratedVideo.next(f);
  }

  getVirtualVideoPiece(video_id,virtual_id, time_start){
      
  }


}
