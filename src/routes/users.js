'use strict'
import express from 'express';
import {  checkLogin, checkNotLogin } from '../middlewares/check';
import User from '../models/users';
import logger from '../libs/logger';

const router = express.Router();

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
  User.signup(req.body).then((user) => {
    delete user.password;
    req.session.user = user;
    res.redirect('/hangmen');
  }).catch((e) => {
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

// 登录
//
router.post('/signin', checkNotLogin, (req, res, next) => {
  User.signin(req.body.name, req.body.password).then((user) => {
    if (!user) {
      req.flash('error', '用户名或密码错误');
      return res.redirect('/users/signin');
    }
    logger.info(`User ${user.name} signin`);
    req.session.user = user;
    res.redirect('/hangmen');
  }).catch(next)
});

// 登出
//
router.get('/signout', checkLogin, (req, res, next) => {
  logger.info(`User ${req.session.user.name} signout`);
  req.session.user = null;
  res.redirect('/users/signin');
});

export default router;
