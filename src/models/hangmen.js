'use strict'
import mongoose from 'mongoose';
import { hangmanSchema as Hangman } from './base'

Hangman.statics = {
  // 开始猜一个新词
  //
  newGame(word) {
    let hangman = { state: 'guessing' }
    hangman.protoWord = word || 'laevatein'
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

