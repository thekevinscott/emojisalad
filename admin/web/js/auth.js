var user = null;

import reqwest from 'reqwest';
import { RouterContainer } from './router';

if ( localStorage.user ) {
  user = localStorage.user;
}

export var auth = {
  login: (username, password, handleSuccess, handleError) => {
    reqwest({
      url: '/api/login',
      method: 'post',
      data: {
        username: username,
        password: password
      }
    })
    .then(function (resp) {
      if ( resp.error ) {
        if ( handleError ) {
          handleError(resp.error);
        }
      } else {
        user = resp;
        localStorage.user = user;
        handleSuccess(resp);
      }
    }.bind(this), function (err, msg) {
      if ( handleError ) {
        if ( err ) {
          handleError(err);
        } else {
          handleError('There was an unknown error');
        }
      }
    }.bind(this));
  },
  logout: () => {
    reqwest({
      url: '/api/logout',
      method: 'get',
    }).then(function() {
      clearUser();
    }).fail(function(err) {
      clearUser();
      console.error('error when logging out', err);
    });
  },
  isLoggedIn: (transition, cb) => {
    if ( user === null ) {
      if ( transition ) {
        transition.redirect('/login');
      }
      return false;
    } else {
      return true;
    }
  }
}

function clearUser() {
  user = null;
  delete localStorage.user;
  RouterContainer.transition('login');
}