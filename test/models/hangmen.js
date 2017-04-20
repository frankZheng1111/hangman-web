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
  beforeEach((done) => {
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

  afterEach((done) => {
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
      Hangman.findAllByPlayer(user)
      .then((hangmen) => {
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
      hangman.guess('r')
      .then((hangman) => {
        (() => { hangman.guess('r') }).should.throw(Error, /input.guessed.letter/);
        return hangman.giveup();
      })
      .then((hangman) => {
        (() => { hangman.guess('r') }).should.throw(Error, /game.already.finished/);
        done();
      })
      .catch(done);
    });

    it('should guess a true letter', (done) => {
      let oldHp = hangman.hp;
      hangman.guess('t')
      .then((hangman) => {
        hangman.hp.should.equal(oldHp);
        hangman.state.should.equal("guessing");
        done();
      })
      .catch(done);
    });

    it('should guess a false letter', (done) => {
      let oldHp = hangman.hp;
      hangman.guess('a')
      .then((hangman) => {
        hangman.hp.should.equal(oldHp - 1);
        done();
      })
      .catch(done);
    });

    it('should win', (done) => {
      hangman.guess('t')
      .then((hangman) => {
        return hangman.guess('e');
      })
      .then((hangman) => {
        return hangman.guess('s');
      })
      .then((hangman) => {
        hangman.state.should.equal('win');
        done();
      })
      .catch(done);
    });
  });

  describe('test guess lose', () => {
    it('should guess lose', (done) => {
      hangman.hp = 1;
      hangman.save()
      .then((hangman) => {
        return hangman.guess('r');
      })
      .then((hangman) => {
        hangman.state.should.equal('lose');
        done();
      })
      .catch(done);
    });
  });

  describe('test giveup', () => {
    it('should guess lose', (done) => {
      hangman.giveup()
      .then((hangman) => {
        hangman.hp.should.equal(0);
        hangman.state.should.equal('giveup');
        done();
      })
      .catch(done);
    });
  });

  describe('test currentWordStr', () => {
    it('should return t**t', (done) => {
      hangman.guess('t')
      .then((hangman) => {
        hangman.currentWordStr.should.equal('t**t');
        done();
      })
      .catch(done);
    });
  });

  describe('test letterStatus', () => {
    it('should raise error', () => {
      (() => { hangman.letterStatus('R') }).should.throw(Error, /input.upper.case.letter/);
      (() => { hangman.letterStatus('rr') }).should.throw(Error, /input.multi.letters/);
      (() => { hangman.letterStatus('') }).should.throw(Error, /input.nothing/);
    });

    it('should return 0', () => {
      hangman.letterStatus('t').should.equal(0);
    });

    it('should return 1', (done) => {
      hangman.guess('t')
      .then((hangman) => {
        hangman.letterStatus('t').should.equal(1);
        done();
      })
      .catch(done);
    });

    it('should return 2', (done) => {
      hangman.guess('a')
      .then((hangman) => {
        hangman.letterStatus('a').should.equal(2);
        done();
      })
      .catch(done);
    });
  });
});
