'use strict'
import express from 'express';

const router = express.Router();

// 新用户注册页面
//
router.get('/new', (req, res, next) => {
  res.render('./users/signup');
});

// 注册新用户
//
router.post('/', (req, res, next) => {
  res.redirect('/hangmen');
});

// 登录页面
//
router.get('/signin', (req, res, next) => {
  res.render('./users/signin');
});

// 登录
//
router.post('/signin', (req, res, next) => {
  res.redirect('/hangmen');
});

// 登出
//
router.get('/signout', (req, res, next) => {
  res.redirect('/users/signin');
});

export default router;
