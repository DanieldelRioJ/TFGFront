import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-video-displayer',
  templateUrl: './video-displayer.component.html',
  styleUrls: ['./video-displayer.component.css']
})
export class VideoDisplayerComponent implements OnInit, AfterViewInit {

  @ViewChild('videoDisplayer', { static: false }) videoDisplayer: ElementRef;
  videoUrl: string = 'http://localhost:5000/videos/converted2.mp4';
  mimeCodec = 'video/mp4; codecs="avc1.4d4020"';
  mediaSource = new MediaSource;
  sourceBuffer;
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    if ('MediaSource' in window && MediaSource.isTypeSupported(this.mimeCodec)) {
      this.renderer.setProperty(this.videoDisplayer.nativeElement, 'src', URL.createObjectURL(this.mediaSource))
      this.mediaSource.addEventListener('sourceopen', ()=>{this.sourceOpen()});
    } else {
      console.error('Unsupported MIME type or codec: ', this.mimeCodec);
    }
  }

  sourceOpen() {
        this.mediaSource.duration=130
        this.sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeCodec);
        //this.sourceBuffer.appendWindowEnd=130
        this.fetchAB(this.videoUrl,  (buf)=> {
            this.sourceBuffer.timestampOffset=60
          this.sourceBuffer.appendBuffer(buf);
          this.fetchAB(this.videoUrl,(buf)=>{
              this.sourceBuffer.timestampOffset=0
              this.sourceBuffer.appendBuffer(buf)
          })

        });
  }

  fetchAB (url, cb) {
        console.log(url);
        var xhr = new XMLHttpRequest;
        xhr.open('get', url);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
          cb(xhr.response);
        };
        xhr.send();
      };


}
