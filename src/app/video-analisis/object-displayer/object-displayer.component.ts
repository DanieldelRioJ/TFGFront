import { Component, OnInit } from '@angular/core';
import { VideoObjectService } from 'src/app/services/video-object.service';
import { ActivatedRoute } from '@angular/router';
import { VideoObject } from 'src/app/objects/video-object';
import { environment } from 'src/environments/environment';
import { faGripLines} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-object-displayer',
  templateUrl: './object-displayer.component.html',
  styleUrls: ['./object-displayer.component.css']
})
export class ObjectDisplayerComponent implements OnInit {
  environment=environment;
  arrowIcon=faGripLines;
  video_id:string;
  object_id:string;

  obj:VideoObject;


  constructor(private videoObjectService:VideoObjectService,
    private route:ActivatedRoute) { }

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
    })
  }

}
