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
	  return false;
	  //if (!auth.loggedIn()) {
	  //redirectTo('/login', null, { nextPathname: nextState.location.pathname });
	  //}
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

/***/ }

})