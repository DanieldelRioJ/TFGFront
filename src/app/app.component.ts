import { Component, OnInit, Renderer2, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';

import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { VideoService } from './services/video.service';
import { MatDialog } from '@angular/material/dialog';
import { UploadVideoModalComponent } from './modal/upload-video-modal/upload-video-modal.component';
import { HttpEventType } from '@angular/common/http';

import { VideoProgressService } from './services/video-progress.service';
import { RootComponentService } from './services/root-component.service';
import { Video } from './objects/video';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    selectedLang="gl";
    iconCollapse=faAlignJustify;
    iconCollapse2=faChevronDown;
    environment=environment;

    videos;

    uploading=false;
    uploadPercentage=0;



    constructor(private dialog: MatDialog,
      changeDetectorRef: ChangeDetectorRef,
       media: MediaMatcher,private renderer:Renderer2,
       private translate: TranslateService,
       private videoService:VideoService,
       private videoProgress:VideoProgressService,
        private rootComponentService:RootComponentService,
      private videoProgressService:VideoProgressService) {



      translate.setDefaultLang('es');
      if(sessionStorage.getItem("lang")!=undefined){
        this.selectLang(sessionStorage.getItem("lang"))
      }else{
        const browserLang = translate.getBrowserLang();
        this.selectedLang=browserLang.match(/es|en|gl/) ? browserLang : 'en';
        this.selectLang(this.selectedLang)
      }

      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
    }


    selectLang(lang){
      //this.videoProgress.sendMessage(lang)

      this.selectedLang=lang;
      this.translate.use(lang);
    }

    selectLangByUser(lang){
      sessionStorage.setItem("lang",lang);
      this.selectLang(lang)
    }

    ngOnInit() {
      let obseervable=this.videoService.getVideos().subscribe(videos=>{
        obseervable.unsubscribe();
        this.videos=videos;
        this.rootComponentService.notifyChange(videos)
        this.videoProgressService.listenToVideoProgress(this.updateVideoData.bind(this));
      })
    }

    mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  updateVideoData(data){
    let video:Video=JSON.parse(data.video);
    video.progress=data.progress
    let index=undefined;
    for(let i=0;i<this.videos.length;i++){
      if((this.videos[i].id && video.id==this.videos[i].id) ||
      (video.title==this.videos[i].title && !this.videos[i].processed)){
          if(this.videos[i].progress<video.progress){
            index=i;
          }
          break;
      }
    }
    if(index!=undefined){
      this.videos[index]=video
      if(video.progress==100){
        video.processed=true;
      }
    }
  }

  onUploadClick(){
    let uploadDialog=this.dialog.open(UploadVideoModalComponent)
    uploadDialog.afterClosed().subscribe(result=>{
      if(result==undefined) return;
      console.log(result)
      this.videoService.uploadVideo(result).subscribe(event=>{
        if(event.type===HttpEventType.UploadProgress){
          this.uploading=true;
          let uploadPercentage=Math.round((event.loaded/event.total)*100)
          if (uploadPercentage>this.uploadPercentage) this.uploadPercentage=uploadPercentage
          if(this.uploadPercentage==100 && this.uploading){
            this.uploading=false
            let video=new Video();
            video.title=result.title
            video.processed=false
            this.videos.push(video)
          }
        }else if(event.type===HttpEventType.Response){
          //this.videos.push(event.body)
          this.uploading=false
        }

      },error=>console.log("ERROR UPLOAD VIDEO"))
    })
  }

}
