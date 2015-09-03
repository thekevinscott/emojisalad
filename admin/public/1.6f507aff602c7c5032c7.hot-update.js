webpackHotUpdate(1,{

/***/ 8:
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

	var _app = __webpack_require__(9);

	var _dashboard = __webpack_require__(19);

	var _notfound = __webpack_require__(20);

	var _account = __webpack_require__(21);

	var _accountLogout = __webpack_require__(27);

	var _games = __webpack_require__(28);

	var _players = __webpack_require__(29);

	var _messages = __webpack_require__(31);

	var _script = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./script\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _auth = __webpack_require__(11);

	var DefaultRoute = Router.DefaultRoute;
	var NotFoundRoute = Router.NotFoundRoute;

	var Link = Router.Link;
	var Route = Router.Route;

	var routes = React.createElement(
	  Route,
	  { handler: _app.App, path: '/' },
	  React.createElement(Route, { name: 'login', handler: _account.Account }),
	  React.createElement(Route, { name: 'logout', handler: _accountLogout.Logout }),
	  React.createElement(Route, { handler: _dashboard.Dashboard }),
	  React.createElement(Route, { handler: _games.Games, name: 'games' }),
	  React.createElement(Route, { handler: _players.Players, name: 'players' }),
	  React.createElement(Route, { handler: _messages.Messages, name: 'messages' }),
	  React.createElement(Route, { handler: _script.Script, name: 'script' }),
	  React.createElement(NotFoundRoute, { handler: _notfound.NotFound })
	);
	exports.routes = routes;

/***/ }

})