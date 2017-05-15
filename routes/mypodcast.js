'use strict';

const myPodcast = require('../handlers/mypodcast.js');
const Joi = require('joi');

const API_BASE_PATH = '/mypodcast';

const routes = [];

routes.push({
  method: 'GET',
  path: API_BASE_PATH,
  handler: myPodcast.getFeed
});

routes.push({
  method: 'PUT',
  path: API_BASE_PATH,
  handler: myPodcast.createFeed
});

module.exports = routes;
