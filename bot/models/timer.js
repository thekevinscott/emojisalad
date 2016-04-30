'use strict';
const squel = require('squel');
const Message = require('models/message');
const sprintf = require('sprintf');
const _ = require('lodash');
const Promise = require('bluebird');
const db = require('db');
const registry = require('microservice-registry');

const Timer = {
  get: () => {
    const query = squel
                  .select()
                  .from('timers')
                  .where('execution_time < NOW()')
                  .where('active=1')
                  .where('cleared=0');
    return db.query(query).then((timers) => {
      console.info('timers found and need to be filtered to ari, kevin, and schloo', timers);
      return timers.map((timer) => {
        timer.messages = JSON.parse(timer.payload);
        delete timer.payload;
        return timer;
      }).map((timer) => {
        //console.info('timer to evaluate', timer);
        return Object.assign({}, timer, {
          messages: timer.messages.filter((message) => {
            return [
              'kevin',
              'Ari',
              'Schloo'
            ].indexOf(message.player.nickname) !== -1;
          })
        });
      });
    });
  },
  set: (key, game_id, messages, timeout_length) => {
    const messages_with_protocol = messages.filter((message) => {
      return registry.get(message.protocol) || process.env.ENVIRONMENT === 'test';
    });

    timeout_length = timeout_length / 30 / 60;

    const execution_time = parseInt((new Date()).getTime() / 1000, 10) + timeout_length;

    return Message.parse(messages_with_protocol).then((parsed_messages) => {
      const set_query = squel
                        .insert({ autoQuoteFieldNames: true })
                        .into('timers')
                        .setFields({
                          key,
                          game_id,
                          payload: JSON.stringify(parsed_messages),
                          timeout_length,
                          execution_time: squel.fval( `FROM_UNIXTIME(${execution_time})`)
                        });
      return db.query(set_query);
    });
  },
  clear: (keys, game_ids) => {
    if (!_.isArray(keys)) {
      keys = [keys];
    }
    if (!_.isArray(game_ids)) {
      game_ids = [game_ids];
    }
    const clear_timer_query = squel
                              .update()
                              .table('timers')
                              .set('cleared', 1)
                              .where('`key` IN (?)', keys.join(','))
                              .where('game_id IN (?)', game_ids.join(','));

    return db.query(clear_timer_query);
  },
  use: (keys, game_ids) => {
    if (!_.isArray(keys)) {
      keys = [keys];
    }
    if (!_.isArray(game_ids)) {
      game_ids = [game_ids];
    }
    const clear_timer_query = squel
                              .update()
                              .table('timers')
                              .set('active', 0)
                              .where('`key` IN (?)', keys.join(','))
                              .where('game_id IN (?)', game_ids.join(','));

    return db.query(clear_timer_query);
  }
};

module.exports = Timer;

