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
	  React.createElement(Route, { handler: _dashboard.Dashboard }),
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _reqwest = __webpack_require__(2);

	var _reqwest2 = _interopRequireDefault(_reqwest);

	/*
	export class Dashboard extends React.Component {
	  constructor(props) {
	    super(props);

	    this.statics = {
	      willTransitionFrom(transition) {
	        console.log('heyo');
	      },
	      willTransitionTo(transition) {
	        console.log('will trans');
	        if (!AuthStore.isAuthenticated()) {
	          transition.redirect('login', {}, {nextPath: transition.path});
	        }
	      }
	    }
	  }
	  render() {
	    console.log('i am the dashboard');
	    return (
	      <p>Dashboard</p>
	    );
	  }
	}
	*/
	var Dashboard = React.createClass({
	  displayName: 'Dashboard',

	  statics: {
	    willTransitionTo: function willTransitionTo(transition) {
	      console.log("intercepting transition path", transition.path);
	      console.log("verifying user logged in");
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