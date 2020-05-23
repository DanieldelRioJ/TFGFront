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
import {MatInputModule, MatToolbarModule,MatSidenavModule,MatListModule, MatDatepickerModule, MatNativeDateModule, MatCardModule, MatRippleModule, MatTabsModule, MatDialogModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { PerspectiveComponent } from './video/perspective/perspective.component';
import { SettingsComponent } from './video/settings/settings.component';
import { NotifierModule } from "angular-notifier";
import {PopoverModule} from "ngx-smart-popover";
import { BirdEyeViewComponent } from './video/bird-eye-view/bird-eye-view.component';
import { PaletteComponent } from './video-analisis/palette/palette.component';
import { UploadVideoModalComponent } from './modal/upload-video-modal/upload-video-modal.component';
import {MaterialFileInputModule} from 'ngx-material-file-input'

import { environment } from 'src/environments/environment';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

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
    ObjectDisplayerComponent,
    PerspectiveComponent,
    SettingsComponent,
    BirdEyeViewComponent,
    PaletteComponent,
    UploadVideoModalComponent
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
    MatTooltipModule,
    MatButtonModule,
    NotifierModule,
    PopoverModule,
    MatCheckboxModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatTabsModule,
    MaterialFileInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    DragDropModule,
    SocketIoModule.forRoot(config),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[UploadVideoModalComponent]
})
export class AppModule { }
