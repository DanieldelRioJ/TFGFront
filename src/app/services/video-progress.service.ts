import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class VideoProgressService {
/*  constructor(private socket: Socket) { }

    sendMessage(msg: string){
      console.log(msg)
        this.socket.emit("message", msg);
    }*/

  virtualSocket;
  videoSocket;

  constructor() {
    this.virtualSocket=io.connect("http://localhost:5000"+"/virtual")
    this.virtualSocket.on('connect', function() {
        console.log('Websocket connected!');
    });

    this.virtualSocket=io.connect("http://localhost:5000"+"/video")
    this.virtualSocket.on('connect', function() {
        console.log('Websocket connected!');
    });
  }

  listenToVirtualVideoProgress(virtual_id,func){
    this.virtualSocket.on("progress",func)
    this.virtualSocket.emit("subscribe",virtual_id)
  }

  stopListeningToVirtualVideoProgress(){
    this.virtualSocket.off("progress")
  }

  listenToVideoProgress(video_id,func){
    this.videoSocket.on("progress",func)
    this.videoSocket.emit("subscribe",video_id)
  }

  stopListeningToVideoProgress(){
    this.videoSocket.off("progress")
  }

}
