'use strict'
import hangman from './hangman';
export default function (app) {
  app.use('/hangman', hangman);
  app.use((req, res) => {
    res.status(404).render('404',  { layout: false });
  });
}
