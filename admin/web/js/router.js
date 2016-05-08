/* globals window */
// router.js
'use strict';

let _router;

export const RouterContainer = {
  get: function() {
    return _router;
  },

  set: function(router) {
    _router = router;
  },

  transition: function(path) {
    if ( _router ) {
      _router.transitionTo(path);
    } else {
      window.location = '/#' + path;
    }
  }
};
