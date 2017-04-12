'use strict'
import { should as _should } from 'chai';
import User from '../../src/models/users'
import Hangman from '../../src/models/hangmen'

const should = _should();

describe('Test HangMan Class', () => {
  const TEST_NAME_1 = 'testName1';
  let hangman = {}
  // 每个describe
  before((done) => {
    // 创建一个用户
    User.create({
      name: TEST_NAME_1,
      password: '123456',
      gender: 'x',
      intro: 'aa'
    })
    .then((user) => {
      return Hangman.newGame(user, 'test');
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
});
