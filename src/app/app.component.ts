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
       private videoProgress:VideoProgressService) {



      translate.setDefaultLang('es');

      const browserLang = translate.getBrowserLang();
      this.selectedLang=browserLang.match(/es|en|gl/) ? browserLang : 'en';
      this.selectLang(this.selectedLang)
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
    }


    selectLang(lang){
      //this.videoProgress.sendMessage(lang)

      this.selectedLang=lang;
      this.translate.use(lang);
    }

    ngOnInit() {
      let obseervable=this.videoService.getVideos().subscribe(videos=>{
        obseervable.unsubscribe();
        this.videos=videos;
      })
    }

    mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onUploadClick(){
    let uploadDialog=this.dialog.open(UploadVideoModalComponent)
    uploadDialog.afterClosed().subscribe(result=>{
      if(result==undefined) return;
      console.log(result)
      this.videoService.uploadVideo(result).subscribe(event=>{

        if(event.type===HttpEventType.UploadProgress){
          this.uploading=true;
          this.uploadPercentage=Math.round((event.loaded/event.total)*100)
        }else if(event.type===HttpEventType.Response){
          this.videos.push(event.body)
          this.uploading=false
        }

      },error=>console.log("ERROR UPLOAD VIDEO"))
    })
  }

}
