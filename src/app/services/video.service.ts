import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { Video } from '../objects/video';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private http:HttpClient) { }

  getVideos():Observable<[Video]>{
      return this.http.get<[Video]>(environment.apiUrl+"/videos");
  }

  getVideo(id:string):Observable<Video>{
      return this.http.get<Video>(environment.apiUrl+"/videos/"+id);
  }

  generateVirtualVideo(id,filter):Observable<any>{
      return this.http.post(`${environment.apiUrl}/videos/${id}/virtual`,filter);
  }

  getVirtualVideoPiece(video_id,virtual_id, time_start){
      return this.http.get(`${environment.apiUrl}/videos/${video_id}/virtual/${virtual_id}?start=${time_start}`,{responseType:"arraybuffer"})
  }

  getMovieScriptPart(video_id,virtual_id,part){
    return this.http.get(`${environment.apiUrl}/videos/${video_id}/virtual/${virtual_id}/${part}`);
  }
}
