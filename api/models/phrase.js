'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const levenshtein = require('levenshtein');
const autosuggest = require('autosuggest');
import setKey from 'setKey';

const Phrase = {
  create: (params) => {
    const query = squel
                  .insert()
                  .into('phrases')
                  .setFields({
                    phrase: params.phrase.toUpperCase(),
                    category_id: params.category_id
                  });
    return db.query(query).then(result => {
      if (result.insertId) {
        return setKey('phrases', {
          ...params,
          id: result.insertId,
        }).then(() => {
          const phrase_id = result.insertId;
          const insert_clue = squel
          .insert()
          .into('clues')
          .setFields({
            clue: params.clue.toUpperCase(),
            phrase_id
          });
          return db.query(insert_clue).then((clueResult) => {
            return setKey('clues', {
              clue: params.clue,
              phrase_id,
              id: clueResult.insertId,
            }).then(() => {
              return Phrase.find({ id: phrase_id}).then((phrases) => {
                return phrases.pop();
              });
            });
          });
        });
      } else {
        return {
          error: 'Could not add to database'
        };
      }
    });
  },
  find: (params) => {
    let query = squel
                .select()
                .field('phrase')
                .field('p.key')
                .field('p.created')
                .field('p.id')
                .field('nickname', 'admin')
                .field('category')
                .field('category_id')
                .field('clue')
                .from('phrases', 'p')
                .left_join('categories', 'c', 'c.id=p.category_id')
                .left_join('clues', 'e', 'e.phrase_id=p.id')
                .left_join('users', 'u', 'u.id=p.admin_id')
                .order('p.id', false);

    if (params.id) {
      query = query.where('p.id=?', params.id);
    }

    return db.query(query).then((phrase) => {
      return phrase;
    });
  },
  contains: (phrase = '', guess = '') => {
    return guess.toLowerCase().indexOf(phrase.toLowerCase()) !== -1;
  },
  parsePhrase: (phrase = '') => {
    const ignored_words = [
      'the',
      'of',
      'a',
      'an',
      'for',
      'and'
    ];

    const translate_words = {
      dr: 'doctor',
      mr: 'mister',
      mrs: 'missus',
      ms: 'miss'
    };
    return phrase.toLowerCase().replace(/[^\w\s]|_/g, '').split(' ').filter((word = '') => {
      return ignored_words.indexOf(word.toLowerCase()) === -1 && word;
    }).map((word) => {
      if (translate_words[word]) {
        return translate_words[word];
      } else {
        return word;
      }
    }).join(' ');
  },
  checkPhrase: (phrase, guess) => {
    console.info('phrase and guess', phrase, guess);
    // check distance of phrase
    //const levenshtein_distance = levenshtein(phrase, guess);
    const distance = levenshtein(phrase, guess) / phrase.length;
    //const acceptable_distance = 6;
    //return levenshtein_distance <= acceptable_distance;
    return distance <= 0.31 ? 1 : 0;
  },
  guess: (original_guess, original_phrase) => {
    const phrase = Phrase.parsePhrase(original_phrase);
    const guess = Phrase.parsePhrase(original_guess);

    if ( Phrase.checkPhrase(phrase, guess) ) {
      console.info('basic check pass');
      return Promise.resolve(1);
    } else if ( Phrase.checkPhrase(original_phrase.split(' ').join('').toLowerCase(), guess) ) {
      console.info('split check pass');
      return Promise.resolve(1);
    } else if (Phrase.contains(phrase, guess)) {
      console.info('contains pass');
      return Promise.resolve(1);
    } else {
      console.info('round check phrase, failed, next check', autosuggest, guess);
      const autosuggest_timeout_length = (process.env.ENVIRONMENT === 'test') ? 5 : 1000;
      // could also check bing here
      //
      // finally, ping google and see what they say about this phrase
      // only check the first result though.
      return autosuggest(guess).then((suggested_results) => {
        console.info('suggested results', suggested_results);
        if ( suggested_results.length ) {
          const top_result = Phrase.parsePhrase(suggested_results[0].result);
          return Phrase.checkPhrase(phrase, top_result);
        } else {
          return 0;
        }
      }).timeout(autosuggest_timeout_length).then((result) => {
        console.info('the final result of our guess', result);
        return result;
      }).catch(Promise.TimeoutError, () => {
        console.info(`timed out at auto suggest at ${autosuggest_timeout_length} milliseconds`);
        return 0;
      }).catch((err) => {
        console.info('some other issue with autosuggest', err);
        // swallow this silently
        return 0;
      });
    }
  },
};

module.exports = Phrase;

