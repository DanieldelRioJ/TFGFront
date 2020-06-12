import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { Video } from '../objects/video';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private http:HttpClient) { }

  getVideos():Observable<Video[]>{
      return this.http.get<Video[]>(environment.apiUrl+"/videos");
  }

  removeVideos():Observable<any>{
    return this.http.delete(environment.apiUrl+"/videos");
  }

  removeVideo(id):Observable<any>{
    return this.http.delete(environment.apiUrl+"/videos/"+id);
  }


  getVideo(id:string):Observable<Video>{
      return this.http.get<Video>(environment.apiUrl+"/videos/"+id);
  }

  getFrameMap(id:string):Observable<any>{
    return this.http.get(`${environment.apiUrl}/videos/${id}/frame_map`);
  }

  updateVideo(id:string,video):Observable<any>{
      return this.http.put(`${environment.apiUrl}/videos/${id}`,video);
  }

  uploadVideo(video):Observable<any>{
    let formData=new FormData()
    formData.append("video",video.video._files[0])
    formData.append("annotations",video.annotations._files[0])
    formData.append("title",video.title)
    formData.append("recorded_date",video.recorded_date)
    formData.append("description",video.description)
    formData.append("city",video.city)

    const req=new HttpRequest('POST',`${environment.apiUrl}/videos`,formData,{reportProgress:true})
    return this.http.request(req);
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

  setPerspectivePoints(video_id,points,references,ratio){
    let body={ratio:ratio,references:references,points:points}
    return this.http.post<Video>(`${environment.apiUrl}/videos/${video_id}/perspective`,body);
  }
}
