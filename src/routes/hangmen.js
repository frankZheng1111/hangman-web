'use strict'
import express from 'express';

const router = express.Router();

// 获取所有或指定用户的猜过的记录
//
router.get('/', (req, res, next) => {
  res.render('helloWorld', { info: JSON.stringify(req.query) });
});

// 查看单条记录的详情
//
router.get('/:id', (req, res, next) => {
  res.render('helloWorld', { info: req.params.id });
});

// 开始一次猜词(创建一条记录)
//
router.post('/', (req, res, next) => {
  res.render('helloWorld', { info: JSON.stringify(req.body) });
});

// 猜一个字母
//
router.patch('/', (req, res, next) => {
  res.render('helloWorld', { info: JSON.stringify(req.body) });
});

export default router;
