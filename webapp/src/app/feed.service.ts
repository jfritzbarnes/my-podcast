import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Feed } from './feed';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class FeedService {
  private feedUrl = 'http://localhost:9090/rss'; // URL to web api

  constructor(private http: Http) { }

  getFeeds(): Promise<Feed[]> {
    return this.http.get(this.feedUrl)
    .toPromise()
    .then(response => response.json().data as Feed[])
    .catch(this.handleError);
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
