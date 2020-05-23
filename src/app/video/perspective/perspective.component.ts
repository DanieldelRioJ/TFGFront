import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { Video } from 'src/app/objects/video';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perspective',
  templateUrl: './perspective.component.html',
  styleUrls: ['./perspective.component.css']
})
export class PerspectiveComponent implements OnInit {

  @Output() drawn: EventEmitter<{x:number,y:number}[]> = new EventEmitter();

  @Input() video:Video;
  @Input() reset:Subject<any>;

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('background', { static: true }) background: ElementRef<HTMLImageElement>;


  coordinates:{x:number,y:number}[];
  screenCoordinates;
  dragging:boolean=false;
  canvasContext:CanvasRenderingContext2D;

  strokeStyles=['red','green']

  mouseClickListener;
  isDone=false

  environment=environment;

  constructor(private renderer:Renderer2) { }

  ngOnInit() {
      if(this.video.perspective!=undefined){
        this.coordinates=this.video.perspective.original_points;
        this.convertCoordinatesFormat(this.coordinates);
        console.log(this.coordinates)
      }
      if(this.reset!=undefined) {
        this.reset.subscribe(_=>{this.coordinates=undefined;this.addScreenCoordinates();this.init()})
      }
  }


    init(){
        if(this.canvasContext!=undefined){ //reset
            this.canvasContext.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
            this.mouseClickListener()
        }



      this.canvasContext=this.canvas.nativeElement.getContext("2d");
      this.mouseClickListener=this.renderer.listen(this.canvas.nativeElement,"click",$event=>{this.clickFunction($event)});
      this.initCanvas();
      if(this.coordinates==undefined){
        this.coordinates=[]
        this.isDone=false;
      }
      else{

        this.isDone=true;
      }
      this.drawPolygon();
      this.addScreenCoordinates();

    }

  ngAfterViewInit(): void {
      this.background.nativeElement.onload=()=>this.init();
  }

  initCanvas():void{
      this.canvas.nativeElement.width=this.background.nativeElement.width;
      this.canvas.nativeElement.height=this.background.nativeElement.height;
      this.canvasContext.drawImage(this.background.nativeElement,0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height)
      this.canvasContext.lineWidth=7
      this.canvasContext.font = "30px Arial";
      this.canvasContext.strokeStyle="red"

  }

  clickFunction(e){
      if(this.isDone || this.coordinates.length>3){console.log("There is already 4 coordinates");return;}

      // tell the browser we're handling this event
      e.preventDefault();
      e.stopPropagation();
      console.log(e)

      let mouseX=parseInt(e.offsetX);
      let mouseY=parseInt(e.offsetY);
      let coordinate=this.getRealCanvasCoordinate(mouseX,mouseY)
      this.coordinates.push({x:Math.round(coordinate.x),y:Math.round(coordinate.y)});
      this.addScreenCoordinates() //Update screen coordinates. Used for dragging
      this.drawPolygon();
      if(this.coordinates.length==4){
        this.notifySelectedPoints();
      }
  }


  drawPolygon(){
    if(this.coordinates.length==0)return;
      //Reset canvas
      this.canvasContext.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.canvasContext.drawImage(this.background.nativeElement,0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height)

      this.canvasContext.fillRect(this.coordinates[0].x, this.coordinates[0].y,5,5); //First point, we use it to tell user that first point is marked
      this.canvasContext.beginPath();//ADD THIS LINE!<<<<<<<<<<<<<
      this.canvasContext.moveTo(this.coordinates[0].x, this.coordinates[0].y);
      for(let index=1; index<this.coordinates.length;index++) {
        this.canvasContext.lineTo(this.coordinates[index].x, this.coordinates[index].y);
      }



      if(this.coordinates.length==4){
        this.canvasContext.closePath();
      }

      this.canvasContext.stroke();

      this.coordinates.forEach((coordinate,index)=>{this.canvasContext.fillText(index+"",coordinate.x, coordinate.y)})
    }

  getRealCanvasCoordinate(x,y):{x:number,y:number}{
      x=this.canvas.nativeElement.width*x/this.canvas.nativeElement.clientWidth;
      y=this.canvas.nativeElement.height*y/this.canvas.nativeElement.clientHeight;
      return {x:x,y:y}
  }

  convertCoordinatesFormat(coordinates){
    coordinates.forEach(function(coordinate, index) {
        this[index] ={x:coordinate[0],y:coordinate[1]};
      }, coordinates);
  }

  dragged(event,i){

    let position=event.source.getFreeDragPosition()

    position=this.getRealCanvasCoordinate(position.x, position.y)

    this.coordinates[i].x=position.x
    this.coordinates[i].y=position.y

    this.drawPolygon();

  }

  dragReleased(event){

  }

  notifySelectedPoints(){
    if(this.coordinates.length==4){
      this.drawn.emit(this.coordinates)
    }
  }

  addScreenCoordinates(){
    let coordinates=[]
    if(this.coordinates==undefined) return coordinates
    this.coordinates.forEach(coordinate=>{
      let x=coordinate.x*this.canvas.nativeElement.clientWidth/this.canvas.nativeElement.width;
      let y=coordinate.y*this.canvas.nativeElement.clientHeight/this.canvas.nativeElement.height;
      coordinates.push({x:x,y:y})

    })
    this.screenCoordinates=coordinates;
  }

}
