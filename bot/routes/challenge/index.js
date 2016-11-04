'use strict';
import guess from './guess';
import rule from 'config/rule';

module.exports = (params) => {
  if ( rule('clue').test(params.message) ) {
    console.info('challenge clue');
    return require('./clue')(params);
  } else if ( rule('help').test(params.message) ) {
    console.info('game help');
    return require('./help')(params);
  }

  return guess(params);
};
