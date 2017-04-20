'use strict'
import { Serializer as JSONAPISerializer } from 'jsonapi-serializer';

export let HangmanSerializer = new JSONAPISerializer('hangmen', {
  attributes: ['state', 'hp', 'currentWordStr']
});
