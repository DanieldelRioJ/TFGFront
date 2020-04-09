import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { VideoObject } from '../objects/video-object';

@Injectable({
  providedIn: 'root'
})
export class VideoObjectService {

  constructor(private http:HttpClient) { }

  getObjects(video_id:string):Observable<any>{
      return this.http.get(`${environment.apiUrl}/videos/${video_id}/objects`);
  }
}
