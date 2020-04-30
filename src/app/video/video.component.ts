import { Component, OnInit, ViewChild,AfterViewInit, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../services/video.service';
import { Video } from '../objects/video';
import { faFilter,faDownload ,faUsers,faCog} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements AfterViewInit {

    filterIcon=faFilter;
    downloadIcon=faDownload;
    objectsIcon=faUsers;
    settingsIcon=faCog;

    environment=environment;

    @ViewChild('originalVideo',{static:true}) videoElement:ElementRef;

    video:Video;

    frameMap;
    actualAppearances=[];

  constructor(private route:ActivatedRoute,
    private videoService:VideoService) { }


  ngAfterViewInit(): void {
    this.route.paramMap.subscribe(params => {
      let video_id = params.get("video_id");
      this.videoService.getVideo(video_id).subscribe(video=>{
          this.video=video;
          this.videoService.getFrameMap(video.id).subscribe(frameMap=>{
            this.frameMap=frameMap;
            this.updateBirdEyeView();
          })
      })
    })
  }

  updateBirdEyeView(){
    setTimeout(this.updateBirdEyeView.bind(this),100);
    let currentTime=this.videoElement.nativeElement.currentTime;
    if(currentTime==undefined) return;
    let actualFrame=Math.round(currentTime*this.video.fps_adapted);

    this.actualAppearances=this.frameMap[actualFrame]
    console.log(this.actualAppearances)
  }

}
