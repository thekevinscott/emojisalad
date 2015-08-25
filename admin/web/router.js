// router.js
'use strict';

var _router;

export var RouterContainer = {
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
