webpackHotUpdate(1,{

/***/ 21:
/***/ function(module, exports) {

	// router.js
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var _router;

	var RouterContainer = {
	  get: function get() {
	    return _router;
	  },

	  set: function set(router) {
	    _router = router;
	  },

	  transition: function transition(path) {
	    if (_router) {
	      _router.transitionTo(path);
	    } else {
	      window.location = '/#' + path;
	    }
	  }
	};
	exports.RouterContainer = RouterContainer;

/***/ }

})