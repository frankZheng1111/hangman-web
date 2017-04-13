'use strict'
import express from 'express';
import Hangman from '../models/hangmen'

const router = express.Router();

// 获取所有或指定用户的猜过的记录
//
router.get('/', (req, res, next) => {
  Hangman.findAllByPlayer(req.session.user, 1, 2)
  .then((hangmen) => {
    res.render('./hangmen/index', { hangmen: hangmen });
  })
  .catch(next);
});

// 查看单条记录的详情
//
router.get('/:id', (req, res, next) => {
  let hangman = Hangman.findById(req.params.id)
  .then((hangman) => {
    if (!hangman) { throw new Error('hangman not exist'); }
    const LETTERS = 'abcdefghijklmnopqrstuvwxyz-'.split('');
    res.render('./hangmen/show', { hangman: hangman, currentWordStr: hangman.currentWordStr(), letters: LETTERS });
  })
  .catch(next);
});

// 开始一次猜词(创建一条记录)
//
router.post('/', (req, res, next) => {
  Hangman.newGame(req.session.user)
  .then((hangman) => {
    res.redirect(`/hangmen/${hangman._id}`)
  })
  .catch(next);
});

// 猜一个字母
//
router.patch('/:id', (req, res, next) => {
  let hangman = Hangman.findById(req.params.id)
  .then((hangman) => {
    if (!hangman) { throw new Error('hangman not exist'); }
    if (hangman.isFinished()) { return Promise.resolve(hangman); }
    return hangman.guess(req.body.letter.toLowerCase());
  })
  .then((hangman) => {
    res.redirect(`/hangmen/${hangman._id}`)
  })
  .catch(next);
});

// 这轮游戏弃权
//
router.patch('/:id/giveup', (req, res, next) => {
  let hangman = Hangman.findById(req.params.id)
  .then((hangman) => {
    if (!hangman) { throw new Error('hangman not exist'); }
    if (hangman.isFinished()) { return Promise.resolve(hangman); }
    return hangman.giveup();
  })
  .then((hangman) => {
    res.redirect(`/hangmen/${hangman._id}`)
  })
  .catch(next);
});

export default router;
