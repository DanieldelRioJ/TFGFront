import { Component, OnInit, Input, ViewChild, ElementRef,AfterContentInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Video } from 'src/app/objects/video';

@Component({
  selector: 'app-bird-eye-view',
  templateUrl: './bird-eye-view.component.html',
  styleUrls: ['./bird-eye-view.component.css']
})
export class BirdEyeViewComponent implements OnInit,AfterContentInit {

  environment=environment;

  @ViewChild('birdEyeViewDiv',{static:true}) birdEyeViewDiv:ElementRef;
  @ViewChild('canvas',{static:true}) canvasElement:ElementRef;
  canvasContext:CanvasRenderingContext2D;

  upperLeftLimit=0;

  lowerRightLimit=0; //Lower right limit coordinates

  _video:Video;
  @Input() set video(video:Video){
    this.lowerRightLimit=video.perspective.lower_right_limit
    this.upperLeftLimit=video.perspective.upper_left_limit

    this._video=video;
    this.originalWidth=Math.abs(this.lowerRightLimit[0]-this.upperLeftLimit[0])
    this.originalHeight=Math.abs(this.lowerRightLimit[1]-this.upperLeftLimit[1])
    this.actualWidth=400;

    this.offsetX=this.upperLeftLimit[0];
    this.offsetY=this.upperLeftLimit[1];

    let ratio=this.originalHeight/this.originalWidth;
    this.actualHeight=this.actualWidth*ratio;

    this.scale=this.actualWidth/this.originalWidth;


    this._appearances=[]
    this.updateAppearanceCollisions();
  };
  get video():Video{
    return this._video;
  }

  @Input() meters:number;

  pointsEachMeter:number=50;

  _appearances: any;
  @Input() set appearances(apps:[]){
    this._appearances=apps;
    this.updateAppearanceCollisions();
  }

  get appearances():[]{
    return this._appearances;
  }


  @Input() references:any[];

  originalWidth=0;
  originalHeight=0;

  actualWidth=0;
  actualHeight=0;

  offsetX=0;
  offsetY=0;

  scale=0;

  objectHover:any="Nanai";


  constructor() { }

  ngOnInit() {
      this.originalWidth=Math.abs(this.lowerRightLimit[0]-this.upperLeftLimit[0])
      this.originalHeight=Math.abs(this.lowerRightLimit[1]-this.upperLeftLimit[1])

  }

  updateAppearanceCollisions(){


    if(this.appearances==undefined) return;
    if(this.canvasContext==undefined) {
      console.log("canvas context undefined")
      return;
    }
    //Draw lines between objects which doesnt keep distance
    this.canvasContext.clearRect(0,0,this.originalWidth,this.originalHeight)
    this.canvasContext.lineWidth = this.originalWidth/100
    this.canvasContext.strokeStyle = "red";

    this.appearances.forEach((appearance:any)=>{
      if(appearance.collision!=undefined){
        appearance.collision.forEach(index_collision=>{
          this.canvasContext.beginPath();
          this.canvasContext.moveTo(appearance.real_coordinates[0]-this.offsetX,appearance.real_coordinates[1]-this.offsetY)

          let collisionElement:any=this.appearances[index_collision]
          this.canvasContext.lineTo(collisionElement.real_coordinates[0]-this.offsetX,collisionElement.real_coordinates[1]-this.offsetY)
          this.canvasContext.stroke();
          this.canvasContext.closePath();
        })
      }
    })

    this.appearances.forEach((appearance:any)=>{
      //real cordinates adapted to fit on div keeping scale
        appearance.real_coordinates_adapted=[(appearance.real_coordinates[0]-this.offsetX)*this.scale-4,(appearance.real_coordinates[1]-this.offsetY)*this.scale-4]//-4, half of .object size
    })

    //Draw references
    this.canvasContext.strokeStyle='orange'
    if(this.references==undefined)
      return;
    this.references.forEach((coordinates,index)=>{
      this.canvasContext.beginPath();
      this.canvasContext.moveTo((coordinates[0].x-this.offsetX),(coordinates[0].y-this.offsetY))
      for(let index=1;index<coordinates.length;index++){
        this.canvasContext.lineTo((coordinates[index].x-this.offsetX),(coordinates[index].y-this.offsetY))
      }

      this.canvasContext.stroke();
    })
  }

  ngAfterContentInit(){
    this.actualWidth=400;
    let ratio=this.originalHeight/this.originalWidth;
    this.actualHeight=this.actualWidth*ratio;

    this.scale=this.actualWidth/this.originalWidth;

    this.offsetX=this.upperLeftLimit[0];
    this.offsetY=this.upperLeftLimit[1];

    this.canvasContext=this.canvasElement.nativeElement.getContext("2d")

  }

  setObjectHover(appearance){
    this.objectHover=appearance;
  }

  distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))
  }

}
