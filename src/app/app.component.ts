import { Component, OnInit, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    @ViewChild('sidebar', { static: false }) sidebar: ElementRef;
    @ViewChild('sidebarCollapse', { static: false }) sidebarCollapse: ElementRef;

        iconCollapse=faAlignJustify;
        iconCollapse2=faChevronDown;
        environment=environment;
      constructor(private renderer:Renderer2) { }

      ngOnInit() {
      }

      ngAfterViewInit(): void {
         this.renderer.listen(this.sidebarCollapse.nativeElement, 'click', (event)=>{
             if(this.sidebar.nativeElement.classList.contains('active')){
                 this.renderer.removeClass(this.sidebar.nativeElement,'active');
             }else this.renderer.addClass(this.sidebar.nativeElement,'active');
         });
      }

}
