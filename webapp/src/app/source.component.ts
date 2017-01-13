import { Component, OnInit } from '@angular/core';

import { Feed } from './feed';
import { FeedDetails } from './feedDetails';
import { FeedService } from './feed.service';
import { find } from 'lodash';

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
  selectedFeed: Feed = null;
  selectedDetails: FeedDetails = null;
  hideViewed: boolean = false;

  getFeeds(): void {
    this.feedService.getFeeds()
    .then(feeds => this.feeds = feeds)
    .then(() => {
      console.log('feeds', this.feeds);
    });
  }

  selectPodcast(foo): void {
    console.log('selectPodcast', foo);
    this.selectedFeed = find(this.feeds, {id: foo});
    if(this.selectedFeed) {
      this.feedService.getFeedDetails(this.selectedFeed)
      .then(details => {
        console.log('details', details);
        this.selectedDetails = details;
      });
    }
  }

  updateItem(item): void {
    console.log('update item', item);
    this.feedService.updateItem(item);
  }

  ngOnInit(): void {
    this.getFeeds();
  }
}
