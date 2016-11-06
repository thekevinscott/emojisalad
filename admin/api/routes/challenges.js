'use strict';
const squel = require('squel');
const db = require('db');
const fetch = require('../../fetch');

const getPhoneNumber = (protocol, sender_id) => {
  return fetch('senders', 'get', {
    sender_id,
  }, protocol, manifest => {
    return manifest.senders.get.endpoint.substring(0, 22);
  }).then(result => {
    return result.sender;
  });
};

const getSenders = challenges => {
  const byProtocol = challenges.reduce((protocols, challenge) => {
    return Object.assign({}, protocols, {
      [challenge.protocol]: Object.assign({}, protocols[challenge.protocol], {
        [challenge.sender_id]: true,
      }),
    });
  }, {});

  const protocols = Object.keys(byProtocol);
  const getPhoneNumbers = (protocol, senderObj) => {
    const senderIds = Object.keys(senderObj);
    return senderIds.map((senderId) => {
      return getPhoneNumber(protocol, senderId).then(phoneNumber => {
        return {
          protocol,
          senderId,
          phoneNumber,
        };
      });
    }, []);
  };

  const promises = protocols.reduce((p, protocol) => {
    return p.concat(getPhoneNumbers(protocol, byProtocol[protocol]));
  }, []);

  return Promise.all(promises).then(result => {
    //console.log('result', result);
    return result.reduce((obj, r) => {
      return Object.assign({}, obj, {
        [r.protocol]: Object.assign({}, (obj[r.protocol] || {}), {
          [r.senderId]: r.phoneNumber,
        }),
      });
    }, {});
  });

  //return Object.keys(byProtocol).reduce((protocols, protocol) => {
  //}, {});
};

const getChallenges = () => {
  const query = squel
  .select({
    autoQuoteFieldNames: true,
  })
  .field('c.id')
  .field('c.created')
  .field('c.phrase_id')
  .field('c.sender_id')
  .field('c.protocol')
  .field('p.phrase')
  .field('prompt')
  .from('challenges', 'c')
  .left_join('phrases', 'p', 'c.phrase_id=p.id');

  return db.query(query).then(result => {
    return getSenders(result).then(senders => {
      //console.log('senders', senders);
      const challenges = result.map(challenge => {
        return Object.assign({}, challenge, {
          phone: senders[challenge.protocol][challenge.sender_id],
        });
      });

      return challenges;
    });
  });
};

const getPhrases = () => {
  const query = squel
  .select({
    autoQuoteFieldNames: true,
  })
  .field('p.phrase')
  .field('p.id')
  .from('phrases', 'p');

  return db.query(query);
};

module.exports = (app) => {
  app.get('/api/challenges', (req, res) => {
    return Promise.all([
      getChallenges(),
      getPhrases(),
    ]).then(result => {
      //console.log('result', result);
      const challenges = result[0];
      res.json({
        challenges,
        phrases: result[1],
      });
    }).catch(err => {
      console.log('err', err);
      res.json(err);
    });
  });

  app.put('/api/challenges/:challenge_id', (req, res) => {
    var query = squel
    .update({
      autoQuoteFieldNames: true,
    })
    .table('challenges')
    .where('id=?', req.params.challenge_id);

    [
      'phrase_id',
    ].map(key => {
      if (req.body[key]) {
        query = query.set(key, req.body[key])
      }
    });
    return db.query(query).then(() => {
      res.json({});
    });
  });
};

