webpackHotUpdate(1,{

/***/ 20:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var auth = (function () {
	  function auth() {
	    _classCallCheck(this, auth);
	  }

	  _createClass(auth, [{
	    key: "login",
	    value: function login() {}
	  }, {
	    key: "loggedIn",
	    value: function loggedIn() {
	      return false;
	    }
	  }, {
	    key: "logout",
	    value: function logout() {}
	  }]);

	  return auth;
	})();

	exports.auth = auth;

/***/ }

})