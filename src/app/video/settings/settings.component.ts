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

          console.log(video)
          this.coordinates=video.perspective!=undefined?video.perspective.original_points:undefined;
          this.references=video.perspective?.references!=undefined?video.perspective.references:[];
          this.ratio=video.perspective?.ratio!=undefined?video.perspective.ratio:undefined;
          if(this.coordinates!=undefined){
            this.coordinates=this.convertCoordinatesFormat(this.coordinates)
          }
          this.video=video;
      })
    })
  }

  convertCoordinatesFormat(coordinates){
    if (coordinates[0].x!=undefined)
      return coordinates
    let list=[]
    for(let i=0;i<coordinates.length;i++){
      list.push({x:coordinates[i][0],y:coordinates[i][1]})
    }
    return list

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
    console.log(this.coordinates)
  }

  update(){
    //let subscriber=this.videoService.updateVideo(this.video.id,this.video).subscribe(_=>subscriber.unsubscribe())

      this.videoService.setPerspectivePoints(this.video.id,this.coordinates,this.references,this.ratio).subscribe(
        video=>{
          this.notifierService.notify("success","Vídeo actualizado")
          video.title=this.video.title
          video.city=this.video.city
          video.description=this.video.description
          this.video=video
          let subscriber=this.videoService.updateVideo(this.video.id,this.video).subscribe(_=>subscriber.unsubscribe())
        },
        error=>this.notifierService.notify("error","Vídeo actualizado"));

  }

}
