import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { Angular2FlexModule } from 'angular2-flex';

import { AppComponent } from './app.component';
import { SourceComponent } from './source.component';
import { SystemComponent } from './system.component';
import { PodcastComponent } from './podcast.component';
import { FeedService } from './feed.service';

@NgModule({
  declarations: [
    AppComponent,
    PodcastComponent,
    SourceComponent,
    SystemComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    Angular2FlexModule.forRoot(),
  ],
  providers: [
    FeedService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
