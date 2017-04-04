'use strict'
import mongoose from 'mongoose';
import { userSchema as User } from './base'

User.statics = {
  // 注册一个用户
  //
  signup(user) {
    return this.create(user);
  },

  // 通过用户名获取用户信息
  //
  findByName(name) {
    return this
      .findOne({ name: name })
      .exec();
  },

  test() {
    return 'test';
  }
}

export default mongoose.model('User', User);

