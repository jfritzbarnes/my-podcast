import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Feed } from './feed';
import { FeedDetails } from './feedDetails';
import { LoggingService } from './logging.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class FeedService {
  private feedUrl = 'http://localhost:9090/rss'; // URL to web api
  private itemUrl = 'http://localhost:9090/item'; // URL to items
  private mypodcastUrl = 'http://localhost:9090/mypodcast'; // URL to curated podcast
  private systemUrl = 'http://localhost:9090/system'; // URL to system

  constructor(private http: Http, private loggingService: LoggingService) { }

  getFeeds(): Promise<Feed[]> {
    return this.http.get(this.feedUrl)
    .toPromise()
    .then((response) => {
      const obj = response.json();
      if(obj.status === 'success') {
        return obj.data as Feed[];
      } else {
        // this case returned
        return [] as Feed[];
      }
    })
    .catch(this.handleError);
  }

  getFeedDetails(feed: Feed): Promise<FeedDetails> {
    return this.http.get(this.feedUrl + '/' + feed.id)
    .toPromise()
    .then(response => response.json().data as FeedDetails)
    .catch(this.handleError);
  }

  loadFeed(feed: Feed): Promise<any> {
    return this.http.post(this.feedUrl + '/' + feed.id + '/load', '', {})
    .toPromise()
    .then(response => response.json() as any);
  }

  updateItem(item): void {
    const body = JSON.stringify({viewed: item.viewed, inMyFeed: item.in_my_feed});
    const headers = new Headers({'Content-Type': 'application/json'});
    this.http.put(this.itemUrl + '/' + item.id, body, headers)
    .toPromise()
    .then((resp) => {
      console.log('response', resp);
    });
  }

  addFeed(feedUrl: string): void {
    const body = JSON.stringify({feedUrl});
    const headers = new Headers({'Content-Type': 'application/json'});
    this.http.post(this.feedUrl, body, headers)
    .toPromise()
    .then((resp) => {
      const msg = 'addFeed: url=' + feedUrl + ', success=' + (resp.json().status === 'success');
      this.loggingService.appendLog(msg);
    });
  }

  getMyPodcast(): Promise<any[]> {
    return this.http.get(this.mypodcastUrl)
    .toPromise()
    .then(response => response.json().data as any[]);
  }

  writeMyPodcast(): Promise<string> {
    return this.http.put(this.mypodcastUrl, {}, {})
    .toPromise()
    .then((resp) => {
      const jsonResp = resp.json();
      const msg = 'writeMyPodcast: success=' + (jsonResp.status === 'success');
      this.loggingService.appendLog(msg);
      return (jsonResp.data && jsonResp.data.xml) || jsonResp.status;
    });
  }

  initializeServer(token): Promise<any> {
    console.log('sending dbinit: ' + this.systemUrl + '/dbinit/' + token);
    return this.http.post(`${this.systemUrl}/dbinit/${token}`, '', {})
    .toPromise()
    .then(response => response.json() as any);
  }

  shutdownServer(): Promise<any> {
    return this.http.post(`${this.systemUrl}/shutdown`, '', {})
    .toPromise()
    .then(response => response.json() as any);
  }

  /*getFeed(id: string): Promise<Feed> {
    return this.getHeroes()
    .then(heroes => heroes.find(hero => hero.id === id));
  }*/

  /*private headers = new Headers({'Content-Type': 'application/json'});
  update(hero: Hero): Promise<Hero> {
    const url = `${this.heroesUrl}/${hero.id}`;
    return this.http
    .put(url, JSON.stringify(hero), {headers: this.headers})
    .toPromise()
    .then(() => hero)
    .catch(this.handleError);
  }*/

  /*create(name: string): Promise<Hero> {
    return this.http
    .post(this.heroesUrl, JSON.stringify({name: name}), {headers: this.headers})
    .toPromise()
    .then(res => res.json().data)
    .catch(this.handleError);
  }*/

  /*delete(id: number): Promise<void> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete(url, {headers: this.headers})
    .toPromise()
    .then(() => null)
    .catch(this.handleError);
  }*/

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
