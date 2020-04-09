import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../services/video.service';
import { Video } from '../objects/video';
import { faFilter,faDownload ,faUsers} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
    filterIcon=faFilter;
    downloadIcon=faDownload;
    objectsIcon=faUsers;
    
    environment=environment;

    video:Video;

  constructor(private route:ActivatedRoute,
    private videoService:VideoService) { }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
        let video_id = params.get("video_id");
        this.videoService.getVideo(video_id).subscribe(video=>{
            this.video=video;
        })
      })
  }

}
