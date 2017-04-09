'use strict'
import fs from 'fs';
import mongoose from 'mongoose';
import { hangmanSchema } from '../db/mongooseSchema'
import Base from './base'
import logger from '../libs/logger';

class Hangman extends Base {
  // 开始猜一个新词
  //
  static newGame(user, word) {
    let hangman = { state: 'init', player: user._id }
    let _dictionary = [];
    if (!word) { _dictionary = fs.readFileSync("config/dictionary.txt").toString().split("\n"); }
    hangman.protoWord = (word || _dictionary[Math.floor(Math.random() * _dictionary.length)]).toLowerCase();
    logger.debug(`hangman insert ${JSON.stringify(hangman)}`);
    return this.create(hangman);
  }

  static findAllByPlayer(player) {
    let query = {};
    if (player) {
      query.player = player;
   }
    return this
      .find(query)
      .populate({ path: 'player', model: 'User' })
      .sort({ _id: -1 })
      .exec();
  }

  guess(letter) {
    if (letter !== letter.toLowerCase()) { throw new Error("input.upper.case.letter"); }
    if (letter.length > 1) { throw new Error("input.multi.letters"); }
    if (letter.length < 1) { throw new Error("input.nothing"); }
    if (this.guessedLetters.includes(letter)) { throw new Error("input.guessed.letter"); }
    this.guessedLetters.push(letter);
    if (!this.protoWord.split('').includes(letter)) { this.hp--; }
    this.state = 'guessing';
    if (this.hp == 0) { this.state = 'lose'; }
    if (this.currentWordStr() === this.protoWord) { this.state = 'win'; }
    return this.save();
  }

  currentWordStr() {
    return this.protoWord.replace(new RegExp(`[^${this.guessedLetters.join('').replace('-', '\\-')}]`, 'g'), "*")
  }
}

export default mongoose.model(Hangman, hangmanSchema);

