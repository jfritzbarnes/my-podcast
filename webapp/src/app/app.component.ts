import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { findIndex } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app works!';
  tabLinks = [
    {label: 'Sources', link: 'source'},
    {label: 'My Podcast', link: 'mypodcast'},
    {label: 'System', link: 'system'},
  ];
  activeLinkIndex = 0;

  constructor(private router: Router) {
    const isInUrl = tab => router.url.indexOf(tab.link) !== -1;
    this.activeLinkIndex = findIndex(this.tabLinks, isInUrl);
  }
}
