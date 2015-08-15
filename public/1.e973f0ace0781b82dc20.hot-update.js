webpackHotUpdate(1,{

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _reactRouter = __webpack_require__(3);

	var Router = _interopRequireWildcard(_reactRouter);

	var _routes = __webpack_require__(5);

	var _auth = __webpack_require__(8);

	function requireAuth(nextState, cb) {
	  console.log('require auth 2');
	  if (false) {
	    console.log('redirect');
	    Router.Redirect('/login', null, { nextPathname: nextState.location.pathname });
	  } else {
	    cb();
	  }
	}
	Router.run(_routes.routes, function (Handler, state) {
	  if (_routes.unauthenticated.indexOf(state.path) !== -1) {
	    // render an unauthenticated route
	    React.render(React.createElement(Handler, null), document.body);
	  } else {
	    requireAuth(state, function () {
	      React.render(React.createElement(Handler, null), document.body);
	    });
	    // check for login
	  }
	});

/***/ }

})