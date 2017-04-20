'use strict'
import moment from 'moment';
import { baseSchema } from '../db/mongooseSchema';
import mongoose from 'mongoose';

const Model = mongoose.Model;

// 自动更新时间戳
// mongoose-schema-extend 仅继承 pre save 事件
//
function refreshUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
}
baseSchema.plugin((schema) => {
  schema.pre('save', refreshUpdatedAt);
});

class Base extends Model {

  // 转换时间戳常见格式
  //
  strfCreatedAt(formatStr = 'YYYY-MM-DD HH:mm') {
    return moment(this.createdAt).format(formatStr);
  }

  strfUpdatedAt(formatStr = 'YYYY-MM-DD HH:mm') {
    return moment(this.updatedAt).format(formatStr);
  }
}

export default mongoose.model(Base, baseSchema);

