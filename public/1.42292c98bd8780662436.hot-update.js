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

	var _dashboard = __webpack_require__(16);

	var _notfound = __webpack_require__(17);

	var _account = __webpack_require__(18);

	var _accountLogout = __webpack_require__(24);

	var _games = __webpack_require__(25);

	var _players = __webpack_require__(26);

	var _messages = __webpack_require__(27);

	var _auth = __webpack_require__(12);

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
	  React.createElement(NotFoundRoute, { handler: _notfound.NotFound })
	);
	exports.routes = routes;

/***/ },

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _reactRouter = __webpack_require__(3);

	var Router = _interopRequireWildcard(_reactRouter);

	var _reqwest = __webpack_require__(2);

	var _reqwest2 = _interopRequireDefault(_reqwest);

	var _auth = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../auth\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _base = __webpack_require__(28);

	var Messages = React.createClass({
	  displayName: 'Messages',

	  mixins: [_base.Base], // Use the mixin
	  url: '/api/messages',
	  render: function render() {
	    var content;
	    if (this.state.loading) {
	      content = "Loading";
	    } else if (this.state.error) {
	      content = this.state.error;
	    } else {
	      var messages = this.state.data.map(function (message) {
	        return React.createElement(
	          'tr',
	          null,
	          React.createElement(
	            'td',
	            null,
	            message.key
	          ),
	          React.createElement(
	            'td',
	            null,
	            message.message
	          ),
	          React.createElement(
	            'td',
	            null,
	            'x'
	          )
	        );
	      });
	      content = React.createElement(
	        'table',
	        null,
	        React.createElement(
	          'thead',
	          null,
	          React.createElement(
	            'tr',
	            null,
	            React.createElement(
	              'td',
	              null,
	              'Key'
	            ),
	            React.createElement(
	              'td',
	              null,
	              'Message'
	            ),
	            React.createElement(
	              'td',
	              null,
	              'Delete'
	            )
	          )
	        ),
	        messages
	      );
	    }
	    return React.createElement(
	      'div',
	      { className: 'players page' },
	      content
	    );
	  }
	});
	exports.Messages = Messages;

/***/ },

/***/ 28:
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

	var _auth = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../auth\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var Base = {
	  statics: {
	    willTransitionTo: function willTransitionTo(transition, params, query) {
	      _auth.auth.isLoggedIn(transition);
	    }
	  },
	  getInitialState: function getInitialState() {
	    return {
	      loading: true,
	      data: []
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    reqwest({
	      url: this.url,
	      method: 'get'
	    }).then((function (resp) {
	      if (resp.error) {
	        this.setState({
	          loading: false,
	          error: resp.error
	        });
	      } else {
	        this.setState({
	          loading: false,
	          data: resp
	        });
	      }
	    }).bind(this));
	  }
	};
	exports.Base = Base;

/***/ }

})