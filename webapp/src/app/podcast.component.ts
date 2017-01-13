import { Component } from '@angular/core';

import { Feed } from './feed';
import { FeedDetails } from './feedDetails';
import { FeedService } from './feed.service';

@Component({
  selector: 'podcast',
  templateUrl: './podcast.component.html',
  styleUrls: [],
  providers: [FeedService],
})

export class PodcastComponent {
  constructor(
    private feedService: FeedService
  ) {}

  myRssFeed: string = '';
}
