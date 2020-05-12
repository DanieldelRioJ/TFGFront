import { Component, OnInit, Input, ViewChild, ElementRef,AfterContentInit } from '@angular/core';
import { environment } from 'src/environments/environment';

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

  @Input() upperLeftLimit; //Uper left limit coordinates
  @Input() lowerRightLimit; //Lower right limit coordinates
  @Input() video;
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

  originalWidth=0;
  originalHeight=0;

  actualWidth=0;
  actualHeight=0;

  offsetX=0;
  offsetY=0;

  scale=0;

  objectHover="Nanai";


  constructor() { }

  ngOnInit() {
      this.originalWidth=Math.abs(this.lowerRightLimit[0]-this.upperLeftLimit[0])
      this.originalHeight=Math.abs(this.lowerRightLimit[1]-this.upperLeftLimit[1])

  }

  updateAppearanceCollisions(){


    if(this.appearances==undefined) return;



    /*for(let i=0;i<this.appearances.length-1;i++){
      let apA:any=this.appearances[i];

      for(let j=i+1;j<this.appearances.length;j++){
        let apB:any=this.appearances[j];
        if(this.distance(apA.real_coordinates[0],apA.real_coordinates[1],apB.real_coordinates[0],apB.real_coordinates[1])<this.pointsEachMeter){
          if(apA.collision==undefined){
            apA.collision=[]
          }
          if(apB.collision==undefined){
            apB.collision=[]
          }
          apA.collision.push(j);
        }
      }
    }*/



    if(this.canvasContext==undefined) {
      console.log("canvas context undefined")
      return;
    }
    //Draw lines between objects which doesnt keep distance
    this.canvasContext.clearRect(0,0,this.originalWidth,this.originalHeight)
    this.canvasContext.lineWidth = 6;
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
