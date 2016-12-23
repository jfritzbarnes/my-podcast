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
  path: `${API_BASE_PATH}`,
  handler: Rss.addFeed
});

routes.push({
  method: 'PUT',
  path: `${API_BASE_PATH}/{feedId}`,
  handler: Rss.updateFeed
});

module.exports = routes;
