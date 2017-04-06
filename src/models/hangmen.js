'use strict'
import fs from 'fs';
import mongoose from 'mongoose';
import { hangmanSchema as Hangman } from './base'
import logger from '../libs/logger';

Hangman.statics = {
  // 开始猜一个新词
  //
  newGame(user, word) {
    let hangman = { state: 'guessing', player: user._id }
    let _dictionary = [];
    if (!word) { _dictionary = fs.readFileSync("config/dictionary.txt").toString().split("\n"); }
    hangman.protoWord = (word || _dictionary[Math.floor(Math.random() * _dictionary.length)]).toLowerCase();
    logger.debug(`hangman insert ${JSON.stringify(hangman)}`);
    return this.create(hangman);
  }
}

Hangman.methods = {
  guess(letter) {
    this.guessedLetters.push(letter);
    return this.save();
  }
}

export default mongoose.model('Hangman', Hangman);

