import { Component, OnInit } from '@angular/core';
import { VideoObjectService } from 'src/app/services/video-object.service';
import { ActivatedRoute } from '@angular/router';
import { VideoObject } from 'src/app/objects/video-object';
import { environment } from 'src/environments/environment';
import { faArrowRight} from '@fortawesome/free-solid-svg-icons';
import { Video } from 'src/app/objects/video';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-object-displayer',
  templateUrl: './object-displayer.component.html',
  styleUrls: ['./object-displayer.component.css']
})
export class ObjectDisplayerComponent implements OnInit {
  environment=environment;
  arrowIcon=faArrowRight;
  video_id:string;
  object_id:string;
  video:Video;
  obj:VideoObject;


  constructor(private videoObjectService:VideoObjectService,
    private route:ActivatedRoute,
  private videoService:VideoService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.video_id = params.get("video_id");
      let object_id = params.get("object_id");
      this.videoObjectService.getObject(this.video_id,parseInt(object_id)).subscribe(obj=>{
        if(obj.angle!=null){
          obj.angle_degrees=obj.angle*180/Math.PI;
        }
        this.obj=obj;
        console.log(obj)
      })
      this.videoService.getVideo(this.video_id).subscribe(video=>{
        this.video=video;
      })
    })
  }

}
