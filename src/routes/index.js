'use strict'
import {  checkLogin } from '../middlewares/check';
import hangmen from './hangmen';
import users from './users';
import api from './api';
export default function (app) {
  app.use('/api', api);
  app.get('/', (req, res) => {
    res.redirect('/users/signin');
  });
  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    next();
  });
  app.use('/users', users);
  app.use(checkLogin);
  app.use('/hangmen', hangmen);
  app.get('*', (req, res) => {
    res.redirect('/hangmen');
  });
  app.use((req, res) => {
    res.status(404).render('404',  { layout: false });
  });
}
