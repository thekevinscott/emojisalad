webpackHotUpdate(1,{

/***/ 8:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _reqwest = __webpack_require__(2);

	var _reqwest2 = _interopRequireDefault(_reqwest);

	var user = null;

	if (localStorage.user) {
	  user = localStorage.user;
	}

	var auth = {
	  login: function login(username, password, handleSuccess, handleError) {
	    (0, _reqwest2['default'])({
	      url: '/api/login',
	      method: 'post',
	      data: {
	        username: username,
	        password: password
	      }
	    }).then((function (resp) {
	      if (resp.error) {
	        if (handleError) {
	          handleError(resp.error);
	        }
	      } else {
	        user = resp;
	        localStorage.user = user;
	        handleSuccess(resp);
	      }
	    }).bind(undefined), (function (err, msg) {
	      if (handleError) {
	        if (err) {
	          handleError(err);
	        } else {
	          handleError('There was an unknown error');
	        }
	      }
	    }).bind(undefined));
	  },
	  logout: function logout() {
	    (0, _reqwest2['default'])({
	      url: '/api/logout',
	      method: 'get'
	    }).then(function () {
	      user = null;
	      RouterContainer.get().transitionTo('/login');
	    }).fail(function (err) {
	      user = null;
	      RouterContainer.get().transitionTo('/login');
	      console.error('error when logging out', err);
	    });
	  },
	  isLoggedIn: function isLoggedIn(transition, cb) {
	    if (user === null) {
	      if (transition) {
	        transition.abort();
	        transition.redirect('/login');
	      }
	      return false;
	    } else {
	      return true;
	    }
	  }
	};
	exports.auth = auth;

/***/ }

})