import { MyPodcastPage } from './app.po';

describe('my-podcast App', function() {
  let page: MyPodcastPage;

  beforeEach(() => {
    page = new MyPodcastPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
