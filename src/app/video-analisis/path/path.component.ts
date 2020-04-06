import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs/internal/Subject';
import { Video } from 'src/app/objects/video';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css']
})
export class PathComponent implements OnInit, AfterViewInit {

  @Output() drawn: EventEmitter<{x:number,y:number}[]> = new EventEmitter();
  @Input() reset:Subject<any>;
  @Input() video:Video;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('background', { static: true }) background: ElementRef<HTMLImageElement>;
  canvasContext:CanvasRenderingContext2D;

  mouseMoveListener;
  mouseDownListener;

  pointerMoveListener;
  pointerDownListener;

  coordinates:{x:number,y:number}[]=[]
  mouseMoveCallsNumber=0

  environment=environment;

  constructor(private renderer:Renderer2) { }

  ngOnInit() {
      this.reset.subscribe(_=>this.init())
  }

  getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
}

    drawCanvasArrow(fromx, fromy, tox, toy, headlen) {
      let dx = tox - fromx;
      let dy = toy - fromy;
      let angle = Math.atan2(dy, dx);
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(fromx, fromy);
      this.canvasContext.lineTo(tox, toy);
      this.canvasContext.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
      this.canvasContext.moveTo(tox, toy);
      this.canvasContext.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
      this.canvasContext.stroke();
    }

    init(){
        if(this.canvasContext!=undefined){ //reset
            this.canvasContext.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        }

        this.coordinates=[]
        this.mouseMoveCallsNumber=0;

      this.canvasContext=this.canvas.nativeElement.getContext("2d");
      this.mouseDownListener=this.renderer.listen(this.canvas.nativeElement,"mousedown",$event=>{this.mouseDownFunction()});
      this.pointerDownListener=this.renderer.listen(this.canvas.nativeElement,"touchstart",$event=>{this.mouseDownFunction()});
      this.renderer.listen(this.canvas.nativeElement,"mouseup",$event=>{this.mouseUpFunction()});
      this.renderer.listen(this.canvas.nativeElement,"touchend",$event=>{this.mouseUpFunction()});
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

  getRealCanvasCoordinate(x,y){
      x=this.canvas.nativeElement.width*x/this.canvas.nativeElement.clientWidth;
      y=this.canvas.nativeElement.height*y/this.canvas.nativeElement.clientHeight;
      return [x,y]
  }

  mouseDownFunction(){
      if(this.coordinates.length==0){
          this.mouseMoveListener=this.renderer.listen(this.canvas.nativeElement,"mousemove",$event=>{this.mouseMoveFunction($event.offsetX,$event.offsetY)});
          this.pointerMoveListener=this.renderer.listen(this.canvas.nativeElement,"touchmove",$event=>{this.mouseMoveFunction($event.touches[0].screenX,$event.touches[0].screenY)});
      }
  }

  mouseMoveFunction(x,y){
      if(this.mouseMoveCallsNumber%10==0){
          let realCoordinates=this.getRealCanvasCoordinate(x,y)
          this.canvasContext.beginPath();
          if(this.mouseMoveCallsNumber==0)
              this.canvasContext.moveTo(realCoordinates[0],realCoordinates[1])
          else
              this.canvasContext.moveTo(this.coordinates[this.coordinates.length-1].x,this.coordinates[this.coordinates.length-1].y)
          this.canvasContext.lineTo(realCoordinates[0],realCoordinates[1])
          this.coordinates.push({x:Math.round(realCoordinates[0]),y:Math.round(realCoordinates[1])});
          this.canvasContext.stroke();
      }
      this.mouseMoveCallsNumber++;
  }

  mouseUpFunction(){
      console.log("UP")
      if(this.coordinates.length==0) return; //If we have already drawn, stop
      console.log("first")
      this.mouseMoveListener();
      this.mouseDownListener();
      this.pointerMoveListener();
      this.pointerDownListener();
      let from=this.coordinates[this.coordinates.length-1];
      let to=this.coordinates[this.coordinates.length-2];
      this.drawCanvasArrow( to.x, to.y,from.x, from.y,30);
      this.drawn.emit(this.coordinates);
  }

}
