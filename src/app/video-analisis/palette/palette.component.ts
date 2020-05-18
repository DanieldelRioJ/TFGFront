import { Component, OnInit, Renderer2, ViewChildren, QueryList, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.css']
})
export class PaletteComponent implements OnInit {

  @ViewChildren('colorDiv') colorDivs:QueryList<ElementRef>;
  @Output() change: EventEmitter<string> = new EventEmitter();

  paletteColors=['blue','purple','pink','red',/*'brown',*/'yellow','green','white','grey','black']

  chosenColor:string=undefined;
  chosenIndex:number=undefined;

  constructor(private renderer:Renderer2) { }

  ngOnInit() {
  }

  chooseColor(index,color){
    if(this.chosenIndex!=undefined){
      let div=this.colorDivs.toArray()[this.chosenIndex].nativeElement;
      this.renderer.removeClass(div,'active')
    }

    if(index==this.chosenIndex){ //deactivate
      this.chosenColor=undefined;
      this.chosenIndex=undefined;
      this.change.emit(undefined);
      return;
    }

    this.chosenColor=color;
    this.chosenIndex=index;

    let div=this.colorDivs.toArray()[index].nativeElement;
    this.renderer.addClass(div,'active')
    this.change.emit(this.chosenColor);

  }

}
