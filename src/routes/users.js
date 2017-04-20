'use strict'
import express from 'express';
import { checkLogin, checkNotLogin, checkResHeaderHtml } from '../middlewares/check';
import User from '../models/users';
import Hangman from '../models/hangmen';
import logger from '../libs/logger';

const router = express.Router();

// 登录
//
router.post('/signin', checkNotLogin, (req, res, next) => {
  User.signin(req.body.name, req.body.password)
  .then((user) => {
    if (!user) {
      return res.formatByRespContentType([
        ['application/json', function() { res.status(403).json({ status: 'fail', error: '用户名或密码错误' }); }],
        ['text/html', function() {
          req.flash('error', '用户名或密码错误');
          res.redirect('/users/signin');
        }]
      ]);
    }
    logger.info(`User ${user.name} signin`);
    req.session.user = user;
    res.formatByRespContentType([
      ['application/json', function() { res.json({ status: 'success' }); }],
      ['text/html', function() { res.redirect('/hangmen'); }]
    ]);
  })
  .catch(next)
});

// 登出
//
router.get('/signout', checkLogin, (req, res, next) => {
  logger.info(`User ${req.session.user.name} signout`);
  req.session.user = null;
  res.formatByRespContentType([
    ['application/json', function() { res.json({ status: 'success' }); }],
    ['text/html', function() { res.redirect('/users/signin'); }]
  ]);
});

//下方路由不被用于api
//
router.use(checkResHeaderHtml);

// 用户个人信息
//
router.get('/profile', checkLogin, (req, res, next) => {
  Promise.all([
    User.findById(req.session.user._id),
    Hangman.accuracyOfPlayer(req.session.user)
  ])
  .then(([user, accuracy]) => {
    res.render('./users/profile', { user: user, accuracy: accuracy });
  }).catch(next);
});

// 新用户注册页面
//
router.get('/new', checkNotLogin, (req, res, next) => {
  res.render('./users/signup');
});

// 注册新用户
//
router.post('/', checkNotLogin, (req, res, next) => {
  try {
    if (req.body.password.length < 6) { throw new Error ('密码不能少于6位'); }
    if (req.body.password !== req.body.repassword) { throw new Error('两次输入密码不一样'); }
  } catch(e) {
    req.flash('error', e.message)
    return res.redirect('/users/new');
  }
  User.signup(req.body)
  .then((user) => {
    delete user.password;
    req.session.user = user;
    res.redirect('/hangmen');
  })
  .catch((e) => {
    if (e.message.match('E11000 duplicate key')) {
      req.flash('error', '用户名已被占用');
      return res.redirect('/users/new');
    }

    if (e.name === 'ValidationError') {
      req.flash('error', e.toString().replace('ValidationError:', ''));
      return res.redirect('/users/new');
    }
    next(e);
  });
});

// 登录页面
//
router.get('/signin', checkNotLogin, (req, res, next) => {
  res.render('./users/signin');
});

export default router;
