'use strict';
const ENV = process.env.NODE_ENV || 'dev';

export const server = require('../../config/server.json')[ENV];
export const mongo = require('../../config/mongo.json')[ENV];
export const logger = require('../../config/logger.json');
export const session = require('../../config/session.json')[ENV];
