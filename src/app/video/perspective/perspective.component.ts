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
  canvasContext:CanvasRenderingContext2D;

  strokeStyles=['red','green']

  mouseClickListener;
  isDone=false

  environment=environment;

  constructor(private renderer:Renderer2) { }

  ngOnInit() {
      this.init()
      if(this.reset!=undefined) {
        this.reset.subscribe(_=>{this.init()})
      }
  }


    init(){
        if(this.canvasContext!=undefined){ //reset
            this.canvasContext.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
            this.mouseClickListener()
            this.coordinates=[]
        }
        this.isDone=false;


      this.canvasContext=this.canvas.nativeElement.getContext("2d");
      this.mouseClickListener=this.renderer.listen(this.canvas.nativeElement,"click",$event=>{this.clickFunction($event)});
      this.initCanvas();
      if(this.coordinates==undefined){
        this.coordinates=[]
      }
      else{
        this.drawPolygon();
      }


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
      if(this.isDone || this.coordinates.length>3){console.log("There is already have 4 coordinates");return;}

      // tell the browser we're handling this event
      e.preventDefault();
      e.stopPropagation();

      let mouseX=parseInt(e.offsetX);
      let mouseY=parseInt(e.offsetY);
      let coordinate=this.getRealCanvasCoordinate(mouseX,mouseY)
      this.coordinates.push({x:Math.round(coordinate[0]),y:Math.round(coordinate[1])});
      this.drawPolygon();
      if(this.coordinates.length==4){
        this.drawn.emit(this.coordinates)
      }
  }


  drawPolygon(){
    if(this.coordinates.length==0)return;
      //Reset canvas
      this.canvasContext.clearRect(0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height);
      this.canvasContext.drawImage(this.background.nativeElement,0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height)

      this.canvasContext.fillRect(this.coordinates[0].x, this.coordinates[0].y,5,5); //First point, we use it to tell user that first point is marked
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

  getRealCanvasCoordinate(x,y){
      x=this.canvas.nativeElement.width*x/this.canvas.nativeElement.clientWidth;
      y=this.canvas.nativeElement.height*y/this.canvas.nativeElement.clientHeight;
      return [x,y]
  }

}
