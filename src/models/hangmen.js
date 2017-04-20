'use strict'
import fs from 'fs';
import mongoose from 'mongoose';
import { hangmanSchema } from '../db/mongooseSchema'
import Base from './base'
import logger from '../libs/logger';

const HANGMAN_FINSIHED_STATES = [ 'win', 'lose', 'giveup' ];

class Hangman extends Base {
  // 开始猜一个新词
  //
  static newGame(user, word) {
    let hangman = { state: 'init', player: user._id }
    let _dictionary = [];
    if (!word) { _dictionary = fs.readFileSync('config/dictionary.txt').toString().split('\n'); }
    hangman.protoWord = (word || _dictionary[Math.floor(Math.random() * _dictionary.length)]).toLowerCase();
    logger.debug(`hangman insert ${JSON.stringify(hangman)}`);
    return this.create(hangman);
  }

  static accuracyOfPlayer(player) {
    return Promise.all([
      this.count({ player: player._id }),
      this.count({ player: player._id, state: 'win' })
    ])
    .then(([total, win]) => {
      return win / total
    });
  }
  static countStateByPlayer(player) {
    let stateValues = this.schema.path('state').enumValues;
    return Promise.all(
      stateValues.map((stateValue) => {
        return this.count({ state: stateValue });
      })
    )
    .then((stateCounts) => {
      let countResult = {};
      stateValues.forEach((stateValue, index) => {
        countResult[stateValue] = stateCounts[index]
      });
      return countResult;
    });
  }
  static findAllByPlayer(player, page = 1, per = 10) {
    let query = {};
    if (player) {
      query.player = player._id;
   }
    return this
      .find(query)
      .skip((page-1) * per)
      .limit(per)
      .populate({ path: 'player', model: 'User' })
      .sort({ _id: -1 })
      .exec();
  }

  guess(letter) {
    if (this.isFinished()) { throw new Error('game.already.finished'); }
    if (letter !== letter.toLowerCase()) { throw new Error('input.upper.case.letter'); }
    if (letter.length > 1) { throw new Error('input.multi.letters'); }
    if (letter.length < 1) { throw new Error('input.nothing'); }
    if (this.guessedLetters.includes(letter)) { throw new Error('input.guessed.letter'); }
    this.guessedLetters.push(letter);
    if (!this.protoWord.split('').includes(letter)) { this.hp--; }
    this.state = 'guessing';
    if (this.hp == 0) { this.state = 'lose'; }
    if (this.currentWordStr === this.protoWord) { this.state = 'win'; }
    return this.save();
  }

  // 弃权
  //
  giveup() {
    if (this.isFinished()) { throw new Error('game.already.finished'); }
    this.hp = 0;
    this.state = 'giveup';
    return this.save();
  }

  // 当前的猜测状态：由*和猜出的字母构成
  //
  get currentWordStr() {
    if (this.state === 'init') { return '== ??? =='; }
    return this.protoWord.replace(new RegExp(`[^${this.guessedLetters.join('').replace('-', '\\-')}]`, 'g'), '*')
  }

  isFinished() {
    return HANGMAN_FINSIHED_STATES.includes(this.state);
  }

  // 获取字母的状态
  // 0: 未猜过
  // 1: 猜对了
  // 2: 猜错了
  //
  letterStatus(letter) {
    if (letter !== letter.toLowerCase()) { throw new Error('input.upper.case.letter'); }
    if (letter.length > 1) { throw new Error('input.multi.letters'); }
    if (letter.length < 1) { throw new Error('input.nothing'); }
    if (!this.guessedLetters.includes(letter)) { return 0; }
    if (this.protoWord.split('').includes(letter)) { return 1; }
    return 2;
  }
}

export default mongoose.model(Hangman, hangmanSchema);

