import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { VideoAnalisisComponent } from './video-analisis/video-analisis.component';
import { VideoComponent } from './video/video.component';


const routes: Routes = [
    { path: '', component: MainComponent ,pathMatch:'full'},
    { path: 'videos/:video_id', component: VideoComponent},
    { path: 'videos/:video_id/filter', component: VideoAnalisisComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
