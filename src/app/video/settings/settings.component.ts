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
  ratio:number;

  resetPerspective:Subject<any> = new Subject();
  references: any;

  constructor(private route:ActivatedRoute,
    private videoService:VideoService,
    private notifierService: NotifierService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let video_id = params.get("video_id");
      this.videoService.getVideo(video_id).subscribe(video=>{
          this.video=video;
          this.coordinates=this.video.perspective!=undefined?this.video.perspective.original_points:undefined;
          this.references=this.video.perspective?.references!=undefined?this.video.perspective.references:[];
          //this.references=this.video.perspective!=undefined?this.video.perspective.references:undefined;
      })
    })
  }

  removePerspectivePoints(){
    this.coordinates=undefined;
    this.resetPerspective.next('coordinates');
  }

  removeReferencePoints(){
    this.references=[]
    this.resetPerspective.next('references');
  }

  newPerspective(coordinates){
    this.coordinates=coordinates.coordinates;
    this.references=coordinates.references
  }

  update(){
    let subscriber=this.videoService.updateVideo(this.video.id,this.video).subscribe(_=>subscriber.unsubscribe())

      this.videoService.setPerspectivePoints(this.video.id,this.coordinates,this.references,this.ratio).subscribe();
    this.notifierService.notify("success","Vídeo actualizado")
  }

}
