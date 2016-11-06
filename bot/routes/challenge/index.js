'use strict';
import guess from './guess';
import rule from 'config/rule';

module.exports = (params) => {
  const message = params.message || '';
  if ( rule('clue').test(message) ) {
    console.info('challenge clue');
    return require('./clue')(params);
  } else if ( rule('help').test(message) ) {
    console.info('game help');
    return require('./help')(params);
  }

  return guess(params);
};
