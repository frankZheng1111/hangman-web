'use strict'
import express from 'express';
import Hangman from '../models/hangmen'
import {  checkLogin } from '../middlewares/check';

const router = express.Router();

// 获取所有或指定用户的猜过的记录
//
router.get('/', checkLogin, (req, res, next) => {
  res.render('./hangmen/index');
});

// 查看单条记录的详情
//
router.get('/:id', checkLogin, (req, res, next) => {
  let hangman = Hangman.findById(req.params.id).then((hangman) => {
    if (!hangman) { throw new Error('hangman not exist'); }
    res.render('./hangmen/show', { hangman: hangman, currentWordStr: hangman.currentWordStr() });
  }).catch(next);

  // res.render('helloWorld', { info: req.params.id });
});

// 开始一次猜词(创建一条记录)
//
router.post('/', checkLogin, (req, res, next) => {
  Hangman.newGame(req.session.user).then((hangman) => {
    res.redirect(`/hangmen/${hangman._id}`)
  }).catch(next);
});

// 猜一个字母
//
router.patch('/:id', checkLogin, (req, res, next) => {
  let hangman = Hangman.findById(req.params.id).then((hangman) => {
    if (!hangman) { throw new Error('hangman not exist'); }
    return hangman.guess(req.body.letter.toLowerCase());
  }).then((hangman) => {
    res.redirect(`/hangmen/${hangman._id}`)
  }).catch(next);
});

export default router;
