'use strict';
import { checkLogin } from '../middlewares/check';
import { setMethodFormatByRespContentType } from '../middlewares/extendUtils';
import hangmen from './hangmen';
import users from './users';
import api from './api';

export default function (app) {
  // 添加扩展方法
  //
  app.use(setMethodFormatByRespContentType);

  // api功能路由
  //
  app.use('/api', api);
  app.get('/', (req, res) => {
    res.redirect('/users/signin');
  });

  // 全栈对应路由
  //
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
