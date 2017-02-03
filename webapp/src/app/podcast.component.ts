import { Component } from '@angular/core';

import { Feed } from './feed';
import { FeedDetails } from './feedDetails';
import { FeedService } from './feed.service';

@Component({
  selector: 'podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.css'],
  providers: [FeedService],
})

export class PodcastComponent {
  constructor(
    private feedService: FeedService
  ) {}

  myRssFeed: string = '';
  items = [];

  getMyPodcast(): void {
    this.feedService.getMyPodcast()
    .then((data) => {
      this.items = data;
      this.myRssFeed = JSON.stringify(this.items, null, 2)
    });
  }
}
