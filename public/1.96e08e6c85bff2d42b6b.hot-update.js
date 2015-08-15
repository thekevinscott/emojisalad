webpackHotUpdate(1,{

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _app = __webpack_require__(5);

	var _routes = __webpack_require__(17);

	Router.run(_routes.routes, Router.HistoryLocation, function (Handler) {
	        React.render(React.createElement(_app.App, null), document.body);
	});

/***/ },

/***/ 17:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Router = __webpack_require__(3); // or var Router = ReactRouter; in browsers

	var DefaultRoute = Router.DefaultRoute;
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

	var routes = React.createElement(Route, { handler: App, path: "/" });
	exports.routes = routes;

/***/ }

})