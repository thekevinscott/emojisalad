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

	function requireAuth(nextState, cb) {
	  console.log('require auth');
	  debugger;
	  if (!_auth.auth.loggedIn()) {
	    console.log('redirect');
	    Router.Redirect('/login', null, { nextPathname: nextState.location.pathname });
	  } else {
	    cb();
	  }
	}

	var routes = React.createElement(
	  Route,
	  { handler: _app.App, path: '/' },
	  React.createElement(Route, { name: 'login', handler: _account.Account }),
	  React.createElement(Route, { handler: _dashboard.Dashboard }),
	  React.createElement(NotFoundRoute, { handler: _notfound.NotFound })
	);

	exports.routes = routes;
	// a list of routes that are unauthenticated
	var unauthenticated = ['/login', '/logout'];
	exports.unauthenticated = unauthenticated;

/***/ }

})