'use strict';

const State = require('../handlers/state.js');
const Joi = require('joi');

const API_BASE_PATH = '/state';

const routes = [];

routes.push({
  method: 'GET',
  path: API_BASE_PATH,
  handler: State.getState,
});

routes.push({
  method: 'POST',
  path: `${API_BASE_PATH}/dirty`,
  handler: State.dirtyFudge,
});

module.exports = routes;
