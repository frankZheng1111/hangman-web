'use strict'
import express from 'express';

const router = express.Router();

// 新用户注册页面
//
router.get('/new', (req, res, next) => {
  res.render('helloWorld', { info: JSON.stringify(req.query) });
});

// 注册新用户
//
router.post('/', (req, res, next) => {
  res.render('helloWorld', { info: req.body });
});

// 登录
//
router.post('/signin', (req, res, next) => {
  res.render('helloWorld', { info: JSON.stringify(req.body) });
});

// 登出
//
router.get('/signout', (req, res, next) => {
  res.render('helloWorld', { info: JSON.stringify(req.query) });
});

export default router;
