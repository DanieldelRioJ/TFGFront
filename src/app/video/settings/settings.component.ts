import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';
import { Video } from 'src/app/objects/video';
import { Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  video: Video;
  coordinates:[];

  resetPerspective:Subject<any> = new Subject();

  constructor(private route:ActivatedRoute,
    private videoService:VideoService,
    private notifierService: NotifierService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let video_id = params.get("video_id");
      this.videoService.getVideo(video_id).subscribe(video=>{
          this.video=video;
          this.coordinates=this.video.perspective!=undefined?this.video.perspective.original_points:undefined;
      })
    })
  }

  removePerspectivePoints(){
    this.coordinates=undefined;
    this.resetPerspective.next();
  }

  newPerspective(coordinates){
    this.coordinates=coordinates;
  }

  update(){
    let subscriber=this.videoService.updateVideo(this.video.id,this.video).subscribe(_=>subscriber.unsubscribe())
    if(this.coordinates!=undefined){
      this.videoService.setPerspectivePoints(this.video.id,this.coordinates).subscribe();
    }
    this.notifierService.notify("success","Vídeo actualizado")
  }

}
