'use strict'
import { should as _should } from 'chai';
import User from '../../src/models/users'
import Hangman from '../../src/models/hangmen'

const should = _should();

describe('Test HangMan Class', () => {
  const TEST_NAME_1 = 'testName1';
  let hangman = {};
  let user = {};
  // 每个describe
  before((done) => {
    // 创建一个用户
    User.create({
      name: TEST_NAME_1,
      password: '123456',
      gender: 'x',
      intro: 'aa'
    })
    .then((u) => {
      user = u
      return Hangman.newGame(u, 'test');
    })
    .then((h) => {
      hangman = h;
      done();
    })
    .catch(done);
  });

  after((done) => {
    // 删除测试用户和游戏
    User.remove({ name: { $in: [TEST_NAME_1] } })
      .exec()
      .then(() => {
        return Hangman.remove({}).exec();
      })
      .then(() => {
        done();
      })
    .catch(done);
  });

  describe('test newGame', () => {
    it('should return test word', () => {
      hangman.protoWord.should.equal('test');
    });

    it('should return hp', () => {
      hangman.hp.should.equal(10);
    });

    it('should return guessedLetters', () => {
      hangman.guessedLetters.length.should.equal(0);
    });

    it('should return guessedLetters', () => {
      hangman.state.should.equal('init');
    });
  });

  describe('test findAllByPlayer', () => {
    it('should return hangmen', (done) => {
      Hangman.findAllByPlayer(user).then((hangmen) => {
        hangmen.length.should.equal(1);
        done();
      }).catch(done);
    });
  });

  describe('test guess win', () => {
    it('should raise error', (done) => {
      (() => { hangman.guess('R') }).should.throw(Error, /input.upper.case.letter/);
      (() => { hangman.guess('rr') }).should.throw(Error, /input.multi.letters/);
      (() => { hangman.guess('') }).should.throw(Error, /input.nothing/);
      hangman.guess('r').then((hangman) => {
        (() => { hangman.guess('r') }).should.throw(Error, /input.guessed.letter/);
        done();
      }).catch(done);
    });

    it('should guess a true letter', (done) => {
      let oldHp = hangman.hp;
      hangman.guess('t').then((hangman) => {
        hangman.hp.should.equal(oldHp);
        hangman.state.should.equal("guessing");
        done();
      }).catch(done);
    });

    it('should guess a false letter', (done) => {
      let oldHp = hangman.hp;
      hangman.guess('a').then((hangman) => {
        hangman.hp.should.equal(oldHp - 1);
        done();
      }).catch(done);
    });

    it('should win', (done) => {
      hangman.guess('e').then((hangman) => {
        return hangman.guess('s');
      }).then((hangman) => {
        hangman.state.should.equal('win');
        done();
      }).catch(done);
    });
  });
});
