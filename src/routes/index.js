'use strict'
import {  checkLogin } from '../middlewares/check';
import hangmen from './hangmen';
import users from './users';
export default function (app) {
  app.get('/', (req, res) => {
    res.redirect('/users/signin');
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
