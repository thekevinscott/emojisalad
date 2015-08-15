webpackHotUpdate(1,{

/***/ 8:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var loggedIn = false;

	var auth = {
	  login: function login() {},
	  logout: function logout() {},
	  isLoggedIn: function isLoggedIn(transition, cb) {
	    if (loggedIn) {} else {
	      transition.abort();
	    }
	    debugger;
	  }
	};
	exports.auth = auth;

/***/ }

})