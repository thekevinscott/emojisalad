webpackHotUpdate(1,{

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

	var _auth = __webpack_require__(8);

	var DefaultRoute = Router.DefaultRoute;
	var NotFoundRoute = Router.NotFoundRoute;

	var Link = Router.Link;
	var Route = Router.Route;

	var routes = React.createElement(
	  Route,
	  { handler: _app.App, path: '/' },
	  React.createElement(Route, { name: 'login', handler: _account.Account }),
	  React.createElement(Route, { handler: _dashboard.Dashboard, onEnter: _dashboard.Dashboard.willTransitionTo }),
	  React.createElement(NotFoundRoute, { handler: _notfound.NotFound })
	);

	exports.routes = routes;
	// a list of routes that are unauthenticated
	var unauthenticated = ['/login', '/logout'];
	exports.unauthenticated = unauthenticated;

/***/ },

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _reqwest = __webpack_require__(2);

	var _reqwest2 = _interopRequireDefault(_reqwest);

	var Dashboard = (function (_React$Component) {
	  _inherits(Dashboard, _React$Component);

	  function Dashboard(props) {
	    _classCallCheck(this, Dashboard);

	    _get(Object.getPrototypeOf(Dashboard.prototype), 'constructor', this).call(this, props);

	    this.statics = {
	      willTransitionFrom: function willTransitionFrom(transition) {
	        console.log('heyo');
	      },
	      willTransitionTo: function willTransitionTo(transition) {
	        console.log('will trans');
	        if (!AuthStore.isAuthenticated()) {
	          transition.redirect('login', {}, { nextPath: transition.path });
	        }
	      }
	    };
	  }

	  _createClass(Dashboard, [{
	    key: 'render',
	    value: function render() {
	      console.log('i am the dashboard');
	      return React.createElement(
	        'p',
	        null,
	        'Dashboard'
	      );
	    }
	  }]);

	  return Dashboard;
	})(React.Component);

	exports.Dashboard = Dashboard;

/***/ }

})