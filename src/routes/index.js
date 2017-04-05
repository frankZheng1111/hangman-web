'use strict'
import hangmen from './hangmen';
import users from './users';
export default function (app) {
  app.use('/hangmen', hangmen);
  app.use('/users', users);
  app.use((req, res) => {
    res.status(404).render('404',  { layout: false });
  });
}
