'use strict'
import mongoose from 'mongoose';
import sha1 from 'sha1';
import logger from '../libs/logger';
import { userSchema as User } from './base'

User.statics = {
  // 注册一个用户
  //
  signup(user) {
    let userParams = Object.assign({}, user);
    delete userParams.repassword
    userParams.password = sha1(userParams.password)
    logger.debug(`Insert users ${JSON.stringify(userParams)}`);
    return this.create(userParams);
  },

  // 通过用户名获取用户信息
  //
  signin(name, password) {
    return this
      .findOne({
        name: name,
        password: sha1(password)
      }).exec();
  },

  test() {
    return 'test';
  }
}

export default mongoose.model('User', User);

