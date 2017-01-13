import { Component, OnInit } from '@angular/core';

import { Feed } from './feed';
import { FeedDetails } from './feedDetails';
import { FeedService } from './feed.service';
import { forEach } from 'lodash';

@Component({
  selector: 'system',
  templateUrl: './system.component.html',
  styleUrls: [],
  providers: [FeedService],
})

export class SystemComponent implements OnInit {
  constructor(
    private feedService: FeedService
  ) {}

  feeds: Feed[] = [];
  lastLoaded: string = 'never';
  feedsLoaded: number = 0;
  loadStatus: string[] = [];

  getFeeds(): void {
    this.feedService.getFeeds()
    .then(feeds => this.feeds = feeds);
  }

  loadFeeds(): void {
    let p = Promise.resolve(true);
    forEach(this.feeds, (f) => {
      this.loadStatus.push(`configuring... ${f.name}`);
      p = p.then(() => {
        this.loadStatus.push(`loading... ${f.name}`);
        return this.feedService.loadFeed(f)
        .then((resp) => {
          console.log('got back: ', resp);
          this.loadStatus.push(`finishing... ${f.name}`);
        });
      });
    });
  }

  clickLoadFeeds(): void {
    const d = new Date();
    this.lastLoaded = d.toLocaleString();
    this.loadStatus = [];
    this.loadFeeds();
  }

  ngOnInit(): void {
    console.log('system component init');
    this.getFeeds();
  }
}
