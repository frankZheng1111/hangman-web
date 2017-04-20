'use strict'
import express from 'express';
import Hangman from '../models/hangmen';
import { checkResHeaderHtml } from '../middlewares/check';
import { HangmanSerializer } from '../serializers/hangman';

const router = express.Router();

// 获取指定用户的最近猜过的记录
//
router.get('/', checkResHeaderHtml, (req, res, next) => {
  const PAGE = 1;
  const PER = 2;
  Hangman.findAllByPlayer(req.session.user, PAGE, PER)
  .then((hangmen) => {
    res.render('./hangmen/index', { hangmen: hangmen });
  })
  .catch(next);
});

router.get('/state-data', (req, res, next) => {
  Hangman.countStateByPlayer(req.session.user)
  .then((stateData) => {
    res.json(stateData);
  })
  .catch(next);
});

// 获取指定用户的所有猜过的记录
//
router.get('/list', checkResHeaderHtml, (req, res, next) => {
  let per = 5;
  let page = parseInt(req.query.page || 1);
  page = page <= 0 ? 1 : page;
  Promise.all([Hangman.findAllByPlayer(req.session.user, page, per), Hangman.count()])
  .then(([hangmen, count]) => {
    let listParams = {
      totalCount: count,
      page: page,
      isFirstPage: 1 === page,
      isLastPage: Math.ceil(count / per) <= page,
      hangmen: hangmen
    };
    res.render('./hangmen/hangmenList', listParams);
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
    res.formatByRespContentType([
      ['application/json', function() {
        res.json(HangmanSerializer.serialize(hangman));
      }],
      ['text/html', function() {
        res.render('./hangmen/show', { hangman: hangman, currentWordStr: hangman.currentWordStr, letters: LETTERS });
      }]
    ]);
  })
  .catch(next);
});

// 开始一次猜词(创建一条记录)
//
router.post('/', (req, res, next) => {
  Hangman.newGame(req.session.user)
  .then((hangman) => {
    res.formatByRespContentType([
      ['application/json', function() {
        res.json(HangmanSerializer.serialize(hangman));
      }],
      ['text/html', function() {
        res.redirect(`/hangmen/${hangman._id}`);
      }]
    ]);
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
    res.formatByRespContentType([
      ['application/json', function() {
        res.json(HangmanSerializer.serialize(hangman));
      }],
      ['text/html', function() {
        res.redirect(`/hangmen/${hangman._id}`);
      }]
    ]);
  })
  .catch(next);
});

// 这轮游戏弃权
//
router.patch('/:id/giveup', checkResHeaderHtml, (req, res, next) => {
  let hangman = Hangman.findById(req.params.id)
  .then((hangman) => {
    if (!hangman) { throw new Error('hangman not exist'); }
    if (hangman.isFinished()) { return Promise.resolve(hangman); }
    return hangman.giveup();
  })
  .then((hangman) => {
    res.redirect(`/hangmen/${hangman._id}`);
  })
  .catch(next);
});

export default router;
