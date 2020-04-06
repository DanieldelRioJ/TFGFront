import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { Video } from 'src/app/objects/video';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit, AfterViewInit {

  @Output() drawn: EventEmitter<{x:number,y:number}[]> = new EventEmitter();

  @Input() video:Video;
  @Input() reset:Subject<any>;
  @Input() stop:Subject<any>;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('background', { static: true }) background: ElementRef<HTMLImageElement>;
  canvasContext:CanvasRenderingContext2D;

  mouseClickListener;
  isDone=false

  coordinates:{x:number,y:number}[]=[]

  environment=environment;

  constructor(private renderer:Renderer2) { }

  ngOnInit() {
      this.reset.subscribe(_=>this.init())
      this.stop.subscribe(_=>{
          this.drawn.emit(this.coordinates);
          this.isDone=true
      })
  }


    init(){
        if(this.canvasContext!=undefined){ //reset
            this.canvasContext.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
            this.mouseClickListener()
        }
        this.isDone=false;
        this.coordinates=[]

      this.canvasContext=this.canvas.nativeElement.getContext("2d");
      this.mouseClickListener=this.renderer.listen(this.canvas.nativeElement,"click",$event=>{this.clickFunction($event)});
      this.initCanvas();
    }

  ngAfterViewInit(): void {
      this.background.nativeElement.onload=()=>this.init();

  }

  initCanvas():void{
      this.canvas.nativeElement.width=this.background.nativeElement.width;
      this.canvas.nativeElement.height=this.background.nativeElement.height;
      this.canvasContext.drawImage(this.background.nativeElement,0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height)
      this.canvasContext.lineWidth=10
      this.canvasContext.strokeStyle="red";

  }

  clickFunction(e){
      if(this.isDone || this.coordinates.length>10){return;}
      console.log(e)

      // tell the browser we're handling this event
      e.preventDefault();
      e.stopPropagation();

      let mouseX=parseInt(e.offsetX);
      let mouseY=parseInt(e.offsetY);
      let coordinate=this.getRealCanvasCoordinate(mouseX,mouseY)
      this.coordinates.push({x:coordinate[0],y:coordinate[1]});
      this.drawPolygon();
  }

  drawPolygon(){
      this.canvasContext.clearRect(0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height);
      this.canvasContext.drawImage(this.background.nativeElement,0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height)
      this.canvasContext.fillStyle="red"
      this.canvasContext.fillRect(this.coordinates[0].x, this.coordinates[0].y,5,5);
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(this.coordinates[0].x, this.coordinates[0].y);
      for(let index=1; index<this.coordinates.length;index++) {
        this.canvasContext.lineTo(this.coordinates[index].x, this.coordinates[index].y);
      }
      this.canvasContext.closePath();
      this.canvasContext.stroke();
    }

  getRealCanvasCoordinate(x,y){
      x=this.canvas.nativeElement.width*x/this.canvas.nativeElement.clientWidth;
      y=this.canvas.nativeElement.height*y/this.canvas.nativeElement.clientHeight;
      return [x,y]
  }

}
