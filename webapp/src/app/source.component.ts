import { Component, OnInit } from '@angular/core';

import { Feed } from './feed';
import { FeedService } from './feed.service';

@Component({
  selector: 'rss-sources',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.css'],
  providers: [FeedService],
})

export class SourceComponent implements OnInit {
  constructor(
    private feedService: FeedService
  ) {}

  feeds: Feed[];

  getFeeds(): void {
    this.feedService.getFeeds()
    .then(feeds => this.feeds = feeds);
  }

  ngOnInit(): void {
    this.getFeeds();
  }
}
