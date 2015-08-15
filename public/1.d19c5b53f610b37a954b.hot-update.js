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

	var _auth = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./auth\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	function requireAuth(nextState, cb) {
	  console.log('require auth 2');
	  //if (0 && !auth.loggedIn()) {
	  if (true) {
	    console.log('redirect');
	    cb();
	    //Router.Navigation.transitionTo('/path').call(Router.Navigation);
	    //Router.transitionTo('/login', { nextPathname: nextState.pathname });
	  } else {
	      cb();
	    }
	}

	Router.run(_routes.routes, Router.HashLocation, function (Handler) {
	  React.render(React.createElement(Handler, null), document.body);
	});

/***/ },

/***/ 5:
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

	var _app = __webpack_require__(6);

	var _dashboard = __webpack_require__(13);

	var _notfound = __webpack_require__(14);

	var _account = __webpack_require__(15);

	var _auth = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./auth\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var DefaultRoute = Router.DefaultRoute;
	var NotFoundRoute = Router.NotFoundRoute;

	var Link = Router.Link;
	var Route = Router.Route;

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

/***/ },

/***/ 6:
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

	var _reactRouter = __webpack_require__(3);

	var Router = _interopRequireWildcard(_reactRouter);

	var _header = __webpack_require__(7);

	var _auth = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./auth\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	__webpack_require__(9);

	var RouteHandler = Router.RouteHandler;
	var Link = Router.Link;

	var App = (function (_React$Component) {
	  _inherits(App, _React$Component);

	  function App(props) {
	    _classCallCheck(this, App);

	    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this, props);
	    this.state = {
	      loggedIn: false
	      //auth.loggedIn()
	    };
	  }

	  _createClass(App, [{
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        { className: 'admin' },
	        React.createElement(_header.Header, { loggedIn: this.state.loggedIn }),
	        React.createElement(
	          'li',
	          null,
	          React.createElement(
	            Link,
	            { to: '/' },
	            'Dashboard'
	          ),
	          ' (authenticated)'
	        ),
	        React.createElement(RouteHandler, null)
	      );
	    }
	  }]);

	  return App;
	})(React.Component);

	exports.App = App;

/***/ },

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _reqwest = __webpack_require__(2);

	var _reqwest2 = _interopRequireDefault(_reqwest);

	var _auth = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../auth\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var Dashboard = React.createClass({
	  displayName: 'Dashboard',

	  statics: {
	    willTransitionTo: function willTransitionTo(transition, params, query, callback) {
	      _auth.auth.isLoggedIn(function (isLoggedIn) {
	        transition.abort();
	        callback();
	      });
	    }
	  },
	  render: function render() {
	    console.log('redner dashboard');
	    return React.createElement(
	      'div',
	      null,
	      'Dashboard Page'
	    );
	  }
	});
	exports.Dashboard = Dashboard;

/***/ }

})