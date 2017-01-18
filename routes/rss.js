'use strict';

const Rss = require('../handlers/rss.js');
const Joi = require('joi');

const API_BASE_PATH = '/rss';

const routes = [];

routes.push({
  method: 'GET',
  path: API_BASE_PATH,
  handler: Rss.getAllFeeds
});

routes.push({
  method: 'GET',
  path: `${API_BASE_PATH}/{feedId}`,
  handler: Rss.getFeed
});

routes.push({
  method: 'POST',
  path: `${API_BASE_PATH}/{feedId}/load`,
  handler: Rss.loadFeed
});

routes.push({
  method: 'POST',
  path: `${API_BASE_PATH}`,
  handler: Rss.addFeed,
  config: {
    validate: {
      payload: {
        feedUrl: Joi.string().required()
      }
    }
  }
});

routes.push({
  method: 'PUT',
  path: `${API_BASE_PATH}/{feedId}`,
  handler: Rss.updateFeed
});

routes.push({
  method: 'DELETE',
  path: `${API_BASE_PATH}/{feedId}`,
  handler: Rss.deleteFeed,
  config: {
    validate: {
      params: {
        feedId: Joi.string().min(1)
      }
    }
  }
});

routes.push({
  method: 'PUT',
  path: '/item/{itemId}',
  handler: Rss.updateItem,
  config: {
    validate: {
      payload: {
        viewed: Joi.number(),
        inMyFeed: Joi.number(),
      }
    }
  }
});

module.exports = routes;
