'use strict'
import mongoose from 'mongoose';
import { mongo } from '../config';
import extend from 'mongoose-schema-extend';

mongoose.connect(mongo.address);

export let baseSchema = mongoose.Schema({
  createdAt: { type : Date, default : Date.now },
  updatedAt: { type : Date, default : Date.now },
});

export let userSchema = baseSchema.extend({
  name: {
    type: String,
    minlength: [1, '名字请限制在 1-10 个字符'],
    maxlength: [10, '名字请限制在 1-10 个字符']
  },
  password: {
    type: String
    // 加密后长度肯定满足的==
    // minlength: [6, '密码至少 6 个字符']
  },
  gender: {
    type: String,
    enum: ['m', 'f', 'x']
  },
  intro: {
    type: String,
    minlength: [1, '个人简介请限制在 1-30 个字符'],
    maxlength: [30, '个人简介请限制在 1-30 个字符']
  }
});

userSchema.index({ name: 1 }, { unique: true });
