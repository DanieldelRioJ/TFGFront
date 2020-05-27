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

  @Output() drawn: EventEmitter<any> = new EventEmitter();

  @Input() video:Video;

  @Input() reset:Subject<any>;

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('background', { static: true }) background: ElementRef<HTMLImageElement>;




  coordinates:{x:number,y:number}[];
  referenceCoordinates:{x:number,y:number}[][]=[];
  screenCoordinates;
  dragging:boolean=false;
  canvasContext:CanvasRenderingContext2D;

  strokeStyles=['red','green']

  mouseClickListener;
  isDone=false

  environment=environment;

  mouseDownListener;
  mouseUpListener;
  mouseMoveListener;

  SAVE_ONE_POINT_EACH:number=10
  mouseMoveNumber:number=0

  constructor(private renderer:Renderer2) { }

  ngOnInit() {
      if(this.video.perspective!=undefined){
        this.coordinates=this.video.perspective.original_points;
        this.convertCoordinatesFormat(this.coordinates);
        if(this.video.perspective.references!=undefined){
          this.referenceCoordinates=this.video.perspective.references
        }

      }
      if(this.reset!=undefined) {
        this.reset.subscribe(what=>{
          if(what=='coordinates'){
            this.coordinates=undefined;
          }else if(what=='references'){
            this.referenceCoordinates=[];
            this.drawPolygon();
            return;
          }else{
            this.coordinates=undefined;
            this.referenceCoordinates=[];
          }
          this.addScreenCoordinates();
          this.init()
        })
      }
  }


    init(){
        if(this.canvasContext!=undefined){ //reset
            this.canvasContext.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
            this.mouseClickListener()
        }

        if(this.mouseDownListener){
          this.mouseDownListener();
        }
        if(this.mouseUpListener){
          this.mouseUpListener();
        }
        if(this.mouseMoveListener){
          this.mouseMoveListener();
        }



      this.canvasContext=this.canvas.nativeElement.getContext("2d");
      this.mouseClickListener=this.renderer.listen(this.canvas.nativeElement,"click",$event=>{this.clickFunction($event)});
      if(this.coordinates!=undefined && this.coordinates.length>3){
        console.log("There is already 4 coordinates");
        this.mouseClickListener();
        this.mouseDownListener=this.renderer.listen(this.canvas.nativeElement,"mousedown",$event=>{this.mouseDownFunction($event)});
        this.mouseUpListener=this.renderer.listen(this.canvas.nativeElement,"mouseup",$event=>{this.mouseUpFunction($event.offsetX,$event.offsetY)});

      }
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
      let fontSize=Math.round(this.video.width*35/1000)
      this.canvasContext.font = fontSize+"px Arial";
      this.canvasContext.strokeStyle="red"

  }

  clickFunction(e){

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

      if(this.isDone || this.coordinates.length>3){
        console.log("There is already 4 coordinates");
        this.mouseClickListener();
        this.mouseDownListener=this.renderer.listen(this.canvas.nativeElement,"mousedown",$event=>{this.mouseDownFunction($event)});
        this.mouseUpListener=this.renderer.listen(this.canvas.nativeElement,"mouseup",$event=>{this.mouseUpFunction($event.offsetX,$event.offsetY)});
        return;
      }
  }


  drawPolygon(){
    if(this.coordinates.length!=0){
        //Reset canvas
        this.canvasContext.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        this.canvasContext.drawImage(this.background.nativeElement,0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height)

        let lineWidth=Math.round(this.video.width*5/1000)

        this.canvasContext.lineWidth=lineWidth

        this.canvasContext.fillRect(this.coordinates[0].x, this.coordinates[0].y,5,5); //First point, we use it to tell user that first point is marked

        //Draw polygon
        this.canvasContext.strokeStyle="red"
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(this.coordinates[0].x, this.coordinates[0].y);
        for(let index=1; index<this.coordinates.length;index++) {
          this.canvasContext.lineTo(this.coordinates[index].x, this.coordinates[index].y);
        }

        if(this.coordinates.length==4){
          this.canvasContext.closePath();
        }

        this.canvasContext.stroke();

        //Write numbers
        let textSeparation=Math.round(this.video.width*10/1000)
        this.coordinates.forEach((coordinate,index)=>{this.canvasContext.fillText(index+"",coordinate.x+textSeparation, coordinate.y+textSeparation)})
      }
      //Draw line lastReferences
      this.canvasContext.strokeStyle="orange"
      this.referenceCoordinates.forEach(coordinates=>{
        if(coordinates.length==0) return;
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(coordinates[0].x, coordinates[0].y);
        for(let index=1; index<coordinates.length;index++) {
          this.canvasContext.lineTo(coordinates[index].x, coordinates[index].y);
        }
        this.canvasContext.stroke();
      });
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
    this.notifySelectedPoints()
  }

  notifySelectedPoints(){
    if(this.coordinates.length==4){
      this.drawn.emit({coordinates:this.coordinates,references:this.referenceCoordinates})
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

  mouseDownFunction(event){
    this.mouseMoveNumber=0
    this.referenceCoordinates.push([])
    this.mouseMoveFunction(event.offsetX,event.offsetY)
    if(this.mouseMoveListener!=undefined)
      this.mouseMoveListener()
    this.mouseMoveListener=this.renderer.listen(this.canvas.nativeElement,"mousemove",$event=>{this.mouseMoveFunction($event.offsetX,$event.offsetY)});
    this.renderer.listen(this.canvas.nativeElement,"mouseout",$event=>{this.mouseUpFunction($event.offsetX,$event.offsetY)});
  }

  mouseMoveFunction(x,y){
    this.mouseMoveNumber+=1
    if(this.mouseMoveNumber%this.SAVE_ONE_POINT_EACH!=1){
      return;
    }
    let lastReferences=this.referenceCoordinates[this.referenceCoordinates.length-1]
    let realCoordinates=this.getRealCanvasCoordinate(x,y)
    lastReferences.push(realCoordinates)
    this.drawPolygon();
  }

  mouseUpFunction(x,y){
    this.mouseMoveListener()
    this.mouseMoveListener==undefined;
    this.notifySelectedPoints()
  }

}
