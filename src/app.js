'use strict';
import path from 'path';
import express from 'express';
import session from 'express-session';
import _connectMongo from 'connect-mongo';
import flash from 'connect-flash';
import log4js from 'log4js';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

import * as config from './config';
import routes from './routes';
import pkg from '../package';
import logger from './libs/logger';

const MongoStore = _connectMongo(session);
const app = express();

app.use(log4js.connectLogger(logger, {level:'debug', format:':method :url'}));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, '../public')));
app.use('/bower_components',  express.static(path.join(__dirname, '../bower_components')));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongoStore({
    url: config.mongo.address
  })
}));

app.use(flash());

app.locals.hangmanWeb = {
  title: pkg.name,
  description: '一个简单的hangman游戏',
};
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

app.use(methodOverride((req) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

routes(app);

app.use((err, req, res) => {
  logger.error(err);
  res.render('500', {
    layout: false,
    error: err
  });
});

function startServer() {
  app.listen(config.server.port, () => {
    logger.info(`${pkg.name} listening on port ${config.server.port}`);
  });
}

if (!module.parent) {
  startServer();
}
export default startServer;
