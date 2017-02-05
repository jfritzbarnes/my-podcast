import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Feed } from './feed';
import { FeedDetails } from './feedDetails';
import { FeedService } from './feed.service';
import { LoggingService } from './logging.service';

import { forEach } from 'lodash';

var Dropbox: any = require('dropbox');

@Component({
  selector: 'system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css'],
  providers: [FeedService],
})

export class SystemComponent implements OnInit {
  constructor(
    private feedService: FeedService,
    private loggingService: LoggingService,
    private activatedRoute: ActivatedRoute,
  ) {
    //console.log('constructor ls', localStorage.accessToken);
    if(localStorage.getItem('accessToken')) {
      this.isInitializeEnabled = true;
    }
  }

  feeds: Feed[] = [];
  lastLoaded: string = 'never';
  feedsLoaded: number = 0;
  //loadStatus: string[] = [];
  logs: string[] = [];
  isInitializeEnabled: boolean = false;

  getFeeds(): void {
    this.feedService.getFeeds()
    .then(feeds => this.feeds = feeds);
  }

  loadFeeds(): void {
    let p = Promise.resolve(true);
    forEach(this.feeds, (f) => {
      this.loggingService.appendLog(`configuring... ${f.name}`);
      //this.loadStatus.push(`configuring... ${f.name}`);
      p = p.then(() => {
        this.loggingService.appendLog(`loading... ${f.name}`);
        //this.loadStatus.push(`loading... ${f.name}`);
        return this.feedService.loadFeed(f)
        .then((resp) => {
          this.feedsLoaded++;
          console.log('got back: ', resp);
          this.loggingService.appendLog(`finishing... ${f.name}`);
          //this.loadStatus.push(`finishing... ${f.name}`);
        });
      });
    });
  }

  clickLoadFeeds(): void {
    const d = new Date();
    this.lastLoaded = d.toLocaleString();
    this.feedsLoaded = 0;
    //this.loadStatus = [];
    this.loadFeeds();
  }

  authorizeDropbox(): void {
    // dropbox support
    const dropbox = new Dropbox({clientId: 'wn1w3gfvtx2gn26'});
    const authUrl = dropbox.getAuthenticationUrl('http://localhost:4200/system');
    //this.location.go(authUrl);
    window.location.href = authUrl;
  }

  initializeServer(): void {
    const token = localStorage.getItem('accessToken');
    this.feedService.initializeServer(token)
    .then((r) => {
      const msg = JSON.stringify(r);
      //this.loadStatus.push(`initialize: ${msg}`)
      this.loggingService.appendLog(`initialize: ${msg}`);
    });
  }

  shutdownServer(): void {
    this.feedService.shutdownServer()
    .then((r) => {
      const msg = JSON.stringify(r);
      //this.loadStatus.push(`shutdown: ${msg}`)
      this.loggingService.appendLog(`shutdown: ${msg}`);
    });
  }

  ngOnInit(): void {
    console.log('system component init');
    this.getFeeds();

    this.logs = this.loggingService.getLogs();

    this.activatedRoute.fragment.subscribe((data: string) => {
      console.log('fragment data', data);
      if(data) {
        const params = new URLSearchParams(data);
        console.log('params', params);
        console.log('token', params.get('access_token'));
        localStorage.setItem('accessToken', params.get('access_token'));
        this.isInitializeEnabled = true;
      }
      //let token = params['#access_token'];
      //console.log('token', token, params);
    });
  }
}
