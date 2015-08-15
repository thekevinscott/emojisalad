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

	var routes = React.createElement(
	  Route,
	  { handler: _app.App, path: '/' },
	  React.createElement(DefaultRoute, { handler: _dashboard.Dashboard }),
	  React.createElement(NotFoundRoute, { handler: _notfound.NotFound })
	);
	Router.run(routes, Router.HistoryLocation, function (Handler) {
	  React.render(React.createElement(_app.App, null), document.body);
	});

/***/ },

/***/ 18:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var NotFound = (function (_React$Component) {
	    _inherits(NotFound, _React$Component);

	    function NotFound() {
	        _classCallCheck(this, NotFound);

	        _get(Object.getPrototypeOf(NotFound.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(NotFound, [{
	        key: 'render',
	        value: function render() {
	            return React.createElement(
	                'div',
	                null,
	                '404'
	            );
	        }
	    }]);

	    return NotFound;
	})(React.Component);

	exports.NotFound = NotFound;

/***/ }

})