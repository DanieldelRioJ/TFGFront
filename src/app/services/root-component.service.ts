import { Injectable } from '@angular/core';
import { Video } from '../objects/video';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RootComponentService {

  private videos:Subject<Video[]>=new BehaviorSubject<Video[]>([])

  constructor() { }

  getVideos$(){
    return this.videos.asObservable();
  }

  notifyChange(videos){
    this.videos.next(videos);
  }
}
