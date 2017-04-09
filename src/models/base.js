'use strict'
import moment from 'moment';
import  { baseSchema } from '../db/mongooseSchema';

// 转换时间戳常见格式
//
export function strfTimestamp (schema) {
  schema.add({ strfCreatedAt: String })
  schema.add({ strfUpdatedAt: String })

  schema.post('findOne', (item) => {
    if (item) {
      item.strfCreatedAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm');
      item.strfUpdatedAt = moment(item.updatedAt).format('YYYY-MM-DD HH:mm');
    }
    return item;
  });
  schema.post('find', (items) => {
    return items.map((item) => {
      item.strfCreatedAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm');
      item.strfUpdatedAt = moment(item.updatedAt).format('YYYY-MM-DD HH:mm');
      return item;
    });
  });
}

// 自动更新时间戳
// mongoose-schema-extend 仅继承 pre save 事件
//
function refreshUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
}

baseSchema.plugin((schema) => {
  schema.pre('save', refreshUpdatedAt)
});

export * from '../db/mongooseSchema';

