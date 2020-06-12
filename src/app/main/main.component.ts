import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VideoService } from '../services/video.service';
import { Video } from '../objects/video';
import { RootComponentService } from '../services/root-component.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    panelOpenState = false;
    environment=environment
    videos:Video[];
    videos$:Observable<Video[]>;
    order:boolean=true;
    orderedBy="city"

    maxDate=new Date();

    constructor(
      private videoService:VideoService,
      private rootComponentService:RootComponentService){
    }

  ngOnInit(): void {
      /*this.videoService.getVideos().subscribe(videos=>{
          this.videos=videos;
          this.sortVideoBy('city');
      });*/
      this.videos$=this.rootComponentService.getVideos$();

  }

  reverse(){
    this.order=!this.order;
    this.sortVideoBy(this.orderedBy)
    this.videos$.pipe(map((data)=>{
      data.reverse();
    })).subscribe();
  }

  sortVideoBy(attr):void{
    this.videos$.pipe(map((data)=>{
      data.sort((a,b)=>{
          if (a[attr]>b[attr])
            return 1;
        else if (a[attr]==b[attr])
            return 0;
        return -1;
      })
      if(this.order) data.reverse();
    })).subscribe();

      /*this.videos.sort((a,b)=>{
          if (a[attr]>b[attr])
            return 1;
        else if (a[attr]==b[attr])
            return 0;
        return -1;
      });
      if(this.order) this.videos.reverse();*/
  }

}
