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

  @Input() upperLeftLimit; //Uper left limit coordinates
  @Input() lowerRightLimit; //Lower right limit coordinates
  @Input() appearances:[];
  @Input() video;

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
    debugger;
      this.originalWidth=Math.abs(this.lowerRightLimit[0]-this.upperLeftLimit[0])
      this.originalHeight=Math.abs(this.lowerRightLimit[1]-this.upperLeftLimit[1])
  }

  ngAfterContentInit(){
    this.actualWidth=300;
    let ratio=this.originalHeight/this.originalWidth;
    this.actualHeight=this.actualWidth*ratio;

    this.scale=this.actualWidth/this.originalWidth;

    this.offsetX=this.upperLeftLimit[0];
    this.offsetY=this.upperLeftLimit[1];
  }

  setObjectHover(appearance){
    this.objectHover=appearance;
  }

}
