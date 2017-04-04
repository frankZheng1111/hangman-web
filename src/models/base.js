'use strict'
import  { baseSchema } from '../db/mongooseSchema';

function refreshUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
}

baseSchema.plugin((schema) => {
  schema.pre('save', refreshUpdatedAt)
});

export * from '../db/mongooseSchema';

