webpackHotUpdate(1,{

/***/ 19:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _reactRouter = __webpack_require__(3);

	var Router = _interopRequireWildcard(_reactRouter);

	var _app = __webpack_require__(5);

	var _dashboard = __webpack_require__(17);

	var _notfound = __webpack_require__(18);

	var _account = __webpack_require__(6);

	var _auth = __webpack_require__(20);

	var DefaultRoute = Router.DefaultRoute;
	var NotFoundRoute = Router.NotFoundRoute;

	var Link = Router.Link;
	var Route = Router.Route;

	function requireAuth(nextState, redirectTo) {
	  if (!_auth.auth.loggedIn()) {
	    redirectTo('/login', null, { nextPathname: nextState.location.pathname });
	  }
	}

	var routes = React.createElement(
	  Route,
	  { handler: _app.App, path: '/' },
	  React.createElement(Route, { name: 'login', handler: _account.Account }),
	  React.createElement(DefaultRoute, { handler: _dashboard.Dashboard, onEnter: requireAuth }),
	  React.createElement(NotFoundRoute, { handler: _notfound.NotFound })
	);
	exports.routes = routes;
	/*
	 * const routes = (
	 <Route handler={App} path="/">
	 <DefaultRoute handler={Home} />
	 <Route name="about" handler={About} />
	 <Route name="users" handler={Users}>
	 <Route name="recent-users" path="recent" handler={RecentUsers} />
	 <Route name="user" path="/user/:userId" handler={User} />
	 <NotFoundRoute handler={UserRouteNotFound}/>
	 </Route>
	 <NotFoundRoute handler={NotFound}/>
	    <Redirect from="company" to="about" />
	  </Route>
	);
	*/

/***/ },

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
	    value: function loggedIn() {}
	  }, {
	    key: "logout",
	    value: function logout() {}
	  }]);

	  return auth;
	})();

	exports.auth = auth;

/***/ }

})