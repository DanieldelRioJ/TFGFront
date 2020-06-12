import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class VideoProgressService {

  virtualSocket;
  videoSocket;

  constructor() {

    this.videoSocket=io.connect("http://192.168.8.102:5000")
    this.videoSocket.on('connect', function() {
        console.log('Websocket1 connected!');
    });

    this.virtualSocket=io.connect("http://192.168.8.102:5000"+"/virtual")
    this.virtualSocket.on('connect', function() {
        console.log('Websocket2 connected!');
    });


  }

  listenToVirtualVideoProgress(virtual_id,func){
    this.virtualSocket.on("progress",func)
    this.virtualSocket.emit("subscribe",virtual_id)
  }

  stopListeningToVirtualVideoProgress(){
    this.virtualSocket.off("progress")
  }

  listenToVideoProgress(func){
    this.videoSocket.on("progress",func)
  }

  stopListeningToVideoProgress(){
    this.videoSocket.off("progress")
  }

}
