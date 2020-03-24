import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VideoService } from '../services/video.service';
import { Video } from '../objects/video';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    panelOpenState = false;
    environment=environment
    videos:[Video]
    order=0;

    constructor(private videoService:VideoService){
    }

  ngOnInit(): void {
      this.videoService.getVideos().subscribe(videos=>{
          this.videos=videos;
          this.sortVideoBy('city');
      });
  }

  sortVideoBy(attr):void{
      this.videos.sort((a,b)=>{
          if (a[attr]>b[attr])
            return 1;
        else if (a[attr]==b[attr])
            return 0;
        return -1;
      });
      if(this.order) this.videos.reverse();
  }

}
