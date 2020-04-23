import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

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
import { VideoObjectsComponent } from './video/video-objects/video-objects.component';
import { ObjectDisplayerComponent } from './video-analisis/object-displayer/object-displayer.component';
import {MatSelectModule} from '@angular/material/select'
import {MatInputModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';

import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '/assets/i18n/', '-lang.json');
}

@NgModule({
  declarations: [
    AppComponent,
    VideoDisplayerComponent,
    MainComponent,
    VideoAnalisisComponent,
    VideoComponent,
    PathComponent,
    AreaComponent,
    VideoObjectsComponent,
    ObjectDisplayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
