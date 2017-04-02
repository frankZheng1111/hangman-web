'use strict'
import path from 'path';
import express from 'express';
import session from 'express-session';
import _connectMongo from 'connect-mongo';
import flash from 'connect-flash';
import * as config from './config';
import routes from './routes';
import pkg from '../package';

const MongoStore = _connectMongo(session)
const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));

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

app.locals.hangman = {
  title: pkg.name,
};
//
// // 添加模板必需的三个变量
// app.use((req, res, next) => {
//   res.locals.user = req.session.user;
//   res.locals.success = req.flash('success').toString();
//   res.locals.error = req.flash('error').toString();
//   next();
// });
//
routes(app);

app.use((err, req, res, next) => {
  res.render('500', {
    error: err
  });
});

if (!module.parent) {
  app.listen(config.server.port, () => {
    console.log(`${pkg.name} listening on port ${config.server.port}`);
  });
}
module.exports=app;
