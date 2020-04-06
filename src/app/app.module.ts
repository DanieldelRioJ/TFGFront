import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { VideoDisplayerComponent } from './video-analisis/video-displayer/video-displayer.component';
import { MainComponent } from './main/main.component';
import { VideoAnalisisComponent } from './video-analisis/video-analisis.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';
import {FormsModule} from '@angular/forms';
import { VideoComponent } from './video/video.component';
import { PathComponent } from './video-analisis/path/path.component';
import {AreaComponent} from './video-analisis/area/area.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    VideoDisplayerComponent,
    MainComponent,
    VideoAnalisisComponent,
    VideoComponent,
    PathComponent,
    AreaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
