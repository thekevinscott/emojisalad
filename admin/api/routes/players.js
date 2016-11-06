'use strict';
const squel = require('squel');
const db = require('db');
module.exports = function(app) {
  app.get('/api/players', function(req, res) {
    var query = squel
                .select()
                .field('u.id', 'user_id')
                .field('u.created')
                .field('u.entry_id')
                .field('u.state_id')
                .field('u.archived')
                .field('u.platform_id')
                .field('p.platform')
                .field('e.entry')
                .field('s.state')
                .from('users', 'u')
                .left_join('platforms', 'p', 'p.id=u.platform_id')
                .left_join('user_entries', 'e', 'e.id=u.entry_id')
                .left_join('user_states', 's', 's.id=u.state_id');
    return db.query(query).then(function(users) {
      var user_ids = users.map(function(user) {
        return user.user_id;
      });

      var attribute_query = squel
                            .select()
                            .field('a.user_id')
                            .field('a.created')
                            .field('a.attribute')
                            .field('k.key')

                            .from('user_attributes', 'a')
                            //.left_join('users', 'u', 'u.id=a.user_id')
                            .left_join('user_attribute_keys', 'k', 'a.attribute_id=k.id')
                            .where('a.user_id IN ?', user_ids);

      return db.query(attribute_query.toString()).then(function(attributes) {
        var users_by_id = {};
        for ( let i=0; i<attributes.length; i++ ) {
          let attribute = attributes[i];
          if ( !users_by_id[attribute.user_id] ) {
            users_by_id[attribute.user_id] = [];
          }
          users_by_id[attribute.user_id].push(attribute);
        }

        users.map(function(user) {
          let attributes = {};
          users_by_id[user.user_id].map(function(attribute) {
            attributes[attribute.key] = {
              value: attribute.attribute,
              created: attribute.created
            };
          });
          user.attributes = attributes;
        });
        //console.log('users', users);
        //attributes.map(function(attribute) {
          //user
        //});
        res.json(users);
      });
    }).catch(function(err) {
      res.json({error: err});
    });
  });
};
