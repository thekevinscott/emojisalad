webpackHotUpdate(1,{

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _reactRouter = __webpack_require__(3);

	var Router = _interopRequireWildcard(_reactRouter);

	var _app = __webpack_require__(5);

	var _dashboard = __webpack_require__(17);

	var _notfound = __webpack_require__(18);

	var _routes = __webpack_require__(19);

	Router.run(_routes.routes, Router.HistoryLocation, function (Handler) {
	        React.render(React.createElement(Handler, null), document.body);
	});

/***/ },

/***/ 19:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	var _reactRouter = __webpack_require__(3);

	var Router = _interopRequireWildcard(_reactRouter);

	var routes = React.createElement(
	  Route,
	  { handler: App, path: "/" },
	  React.createElement(DefaultRoute, { handler: Dashboard }),
	  React.createElement(NotFoundRoute, { handler: NotFound })
	);

	exports.routes = routes;
	var DefaultRoute = Router.DefaultRoute;
	var NotFoundRoute = Router.NotFoundRoute;

	var Link = Router.Link;
	var Route = Router.Route;
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