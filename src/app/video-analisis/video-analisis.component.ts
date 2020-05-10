import { Component, OnInit, Renderer2, ElementRef, AfterViewInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Video } from '../objects/video';
import { VideoService } from '../services/video.service';
import { ActivatedRoute } from '@angular/router';
import { faVideo,faTachometerAlt,faRoad,faClock, faTshirt,faAngleUp} from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs/internal/Subject';
import { PathFilter } from '../objects/filter/path-filter';
import { TimeFilter } from '../objects/filter/time-filter';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { VelocityFilter } from '../objects/filter/velocity-filter';
import { Filter } from '../objects/filter/filter';
import { AreaFilter } from '../objects/filter/area-filter';
import { OutfitFilter } from '../objects/filter/outfit';

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
export class VideoAnalisisComponent implements OnInit,AfterViewInit{

    //Icons
    clothIcon=faTshirt;
    timeIcon=faClock;
    generateIcon=faVideo;
    pathIcon=faRoad;
    speedIcon=faTachometerAlt;
    angleIcon=faAngleUp;

    //environment
    environment=environment;

    //View
    @ViewChildren('dirArrowCheckbox') dirArrowCheckboxes: QueryList<ElementRef>;
    @ViewChild('erraticCheckbox',{static:true}) erraticCheckbox:ElementRef;

    //CallChilds
    resetPath:Subject<any> = new Subject();
    showGeneratedVideo:Subject<any> = new Subject();

    resetArea:Subject<any> = new Subject();
    stopArea:Subject<any> = new Subject();

    //objects
    video:Video;

    filterForm:FormGroup;

    //Filters
    pathFilter:PathFilter=new PathFilter();
    areaFilter:AreaFilter=new AreaFilter();
    timeFilter:TimeFilter=new TimeFilter();
    velocityFilter:VelocityFilter=new VelocityFilter();
    area;
    direction;
    action:string="original";

  constructor(private route:ActivatedRoute,
    private videoService:VideoService,
    private fb:FormBuilder,
  private renderer:Renderer2) { }

  ngAfterViewInit(): void {
    this.renderer.listen(this.erraticCheckbox.nativeElement,"change",this.erraticChange.bind(this))
    this.dirArrowCheckboxes.forEach(element=>this.renderer.listen(element.nativeElement,"change",this.dirCheckboxChange.bind(this)))
  }

    erraticChange(event){

      if(this.erraticCheckbox.nativeElement.checked){
      this.dirArrowCheckboxes.forEach((element)=>this.renderer.setProperty(element.nativeElement,"checked",false));
      }
      return true;
    }

    dirCheckboxChange(event){
     if(event.target.checked){
       this.renderer.setProperty(this.erraticCheckbox.nativeElement,"checked",false)
     }
     return true;

    }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        let video_id = params.get("video_id");
        this.videoService.getVideo(video_id).subscribe(video=>{
            this.video=video;
        })
      })
      this.filterForm = this.fb.group({
          velocity:this.fb.group({
              min:[null,Validators.min(0)],
              max:[null,Validators.min(0)],
              time:[null,Validators.min(0)]
          },{validator:RangeValidator}),
          time:this.fb.group({
              start:[null],
              end:[null]
          }),
          direction:this.fb.group({
            up_left:false,
            up:false,
            up_right:false,
            left:false,
            right:false,
            down_left:false,
            down:false,
            down_right:false,
            erratic:false
          }),
          speed:this.fb.group({
            very_slow:false,
            slow:false,
            normal:false,
            fast:false,
            very_fast:false
          }),
          outfit:this.fb.group({
            upper_color:'ffffff',
            lower_color:'ffffff',
            upper_valid:false,
            lower_valid:false
          })
  });
  }

  setPath(path){
      this.pathFilter.path=path;
      console.log(path)
  }

  setArea(area){
      console.log(area)
      this.areaFilter.area=area
  }

  setDirection(direction){
      //TODO:
  }

  acceptArea(){
      this.stopArea.next();
  }

  funcResetPath(){
      this.action="original"
      this.pathFilter.path=undefined;
      this.resetPath.next();
  }

  funcResetArea(){
      this.action="original"
      this.areaFilter.area=undefined;
      this.resetArea.next();
  }

  createPath(){
      this.action="path"
  }

  generateVideo(){
      if(!this.filterForm.valid) return;
      this.action="view"
      let f:Filter=new Filter();
      f.direction=this.filterForm.value.direction;
      f.velocity=this.filterForm.value.velocity;
      f.location=this.pathFilter
      f.area=this.areaFilter
      f.time=this.filterForm.value.time;
      f.speed=this.filterForm.value.speed;
      f.outfit=new OutfitFilter()
      f.outfit.upper_color=this.filterForm.value.outfit.upper_valid?this.filterForm.value.outfit.upper_color:null
      f.outfit.lower_color=this.filterForm.value.outfit.lower_valid?this.filterForm.value.outfit.lower_color:null
      console.log(this.filterForm.value)
      this.showGeneratedVideo.next(f);
  }

}
