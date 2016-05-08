import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';
import { Base } from './base';

export const Phrases = React.createClass({
  mixins: [Base], // Use the mixin
  url: '/api/phrases',
  newPhrase: function () {
    if (this.state.data[0].id) {
      this.setState({
        data: [{}].concat(this.state.data)
      });
    }
  },
  keyDown: function(e) {
    if (e.keyCode === 13) {
      this.addPhrase();
    }
  },
  addPhrase: function() {
    const clue = document.getElementsByName('clue')[0];
    const phrase = document.getElementsByName('phrase')[0];
    const category_id = this.refs.category.getDOMNode();
    this.setState({
      addingPhrase: true
    });
    reqwest({
      url: this.url,
      method: 'post',
      data: {
        clue: clue.value,
        phrase: phrase.value,
        category_id: category_id.value
      }
    }).then(function (phrase) {
      const data = [phrase].concat(this.state.data.slice(1));
      this.setState({
        addingPhrase: false,
        data
      });
    }.bind(this)).fail(function() {
      this.setState({
        addingPhrase: false
      });
    }.bind(this));
  },
  render: function () {
    let content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      const phrases = this.state.data.map(phrase => {
        if (phrase.id) {
          return (
            <tr>
              <td>{phrase.id}</td>
              <td>{phrase.phrase}</td>
              <td>{phrase.clue}</td>
              <td>{phrase.category}</td>
              <td>{phrase.created}</td>
            </tr>
          );
        } else {
          const categories = this.state.data.reduce(function(categories, phrase) {
            if (phrase.category_id) {
              categories[phrase.category_id] = {
                category: phrase.category,
                latest: false
              };
            }
            return categories;
          }.bind(this), {});
          categories[this.state.data[1].category_id].latest = true;
          const disabled = this.state.addingPhrase;
          // this means we're adding a new phrase
          return (
            <tr>
              <td></td>
              <td>
                <input disabled={disabled}
                  ref={function(input) {
                    if (input != null) {
                      input.getDOMNode().focus();
                    }
                    return 'phrase';
                  }}
                  type="text" name="phrase" onKeyDown={this.keyDown} />
              </td>
              <td>
                <input disabled={disabled} ref="clue" type="text" name="clue" onKeyDown={this.keyDown} />
              </td>
              <td>
                <select disabled={disabled} ref="category">
                  {Object.keys(categories).map(category_id => {
                    const category = categories[category_id];
                    return (
                      <option value={category_id} selected={category.latest}>{category.category}</option>
                    );
                  })}
                </select>
              </td>
              <td>
                <button disabled={disabled} onClick={this.addPhrase}>
                  Add Phrase
                </button>
              </td>
            </tr>
          );
        }
      });
      content = (
        <div>
          <button className="add-phrase" onClick={this.newPhrase}>Add new phrase</button>
          <table><thead><tr><td>ID</td><td>Phrase</td><td>Clue</td><td>Category</td><td>Created</td></tr></thead>{phrases}</table>
        </div>
      );
    }
    return (
      <div className="phrases page">
        {content}
      </div>
    );
  }
});
