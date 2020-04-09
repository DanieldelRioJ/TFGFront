import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoObjectService } from 'src/app/services/video-object.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video-objects',
  templateUrl: './video-objects.component.html',
  styleUrls: ['./video-objects.component.css']
})
export class VideoObjectsComponent implements OnInit {
    environment=environment;

    video_id:string;
    objects:any;

  constructor(private route:ActivatedRoute,
    private videoObjectService:VideoObjectService) { }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.video_id = params.get("video_id");
        this.videoObjectService.getObjects(this.video_id).subscribe(video=>{
            this.objects=video;
        })
      })
  }

}
