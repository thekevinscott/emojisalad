import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

import { Base } from '../base';
//const Link = Router.Link;

const url = '/api/challenges';
export const Challenges = React.createClass({
  mixins: [Base], // Use the mixin
  url,
  update: (challenge_id, params) => {
    return reqwest({
      url: `${url}/${challenge_id}`,
      method: 'put',
      data: params,
    });
  },

  render: function() {
    let content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      const challenges = this.state.data.challenges.map((challenge) => {
        return (
          <tr>
            <td>{challenge.id}</td>
            <td>
              <select
                onChange={e => {
                  this.update(challenge.id, {
                    phrase_id: e.target.value,
                  });
                }}
              >
                {this.state.data.phrases.map(({
                  id: phraseID,
                  phrase,
                }) => {
                  const checked = phraseID === challenge.phrase_id;

                  return (
                    <option
                      key={phraseID}
                      value={phraseID}
                      selected={checked}
                    >
                      {phrase}
                    </option>
                    );
                })}
              </select>
            </td>
            <td>
              {challenge.prompt}
            </td>
            <td>{challenge.phone}</td>
            <td>{challenge.protocol}</td>
            <td>{challenge.created}</td>
          </tr>
        );
      });
      content = (
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>Phrase</td>
              <td>Prompt</td>
              <td>Phone Number</td>
              <td>Protocol</td>
              <td>Created</td>
            </tr>
          </thead>
          {challenges}
        </table>
      );
    }
    return (
      <div className="challenges page">
        {content}
      </div>
    );
  },
});
