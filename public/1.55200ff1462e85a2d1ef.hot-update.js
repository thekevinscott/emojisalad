webpackHotUpdate(1,[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
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

	var _accountLogout = __webpack_require__(22);

	var _auth = __webpack_require__(8);

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
	  React.createElement(NotFoundRoute, { handler: _notfound.NotFound })
	);
	exports.routes = routes;

/***/ },
/* 6 */
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

	var _auth = __webpack_require__(8);

	__webpack_require__(9);

	var RouteHandler = Router.RouteHandler;
	var Link = Router.Link;

	var App = (function (_React$Component) {
	  _inherits(App, _React$Component);

	  function App(props) {
	    _classCallCheck(this, App);

	    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this, props);
	    this.state = {
	      loggedIn: _auth.auth.isLoggedIn()
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
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _reqwest = __webpack_require__(2);

	var _reqwest2 = _interopRequireDefault(_reqwest);

	var user = null;

	if (localStorage.user) {
	  user = localStorage.user;
	}

	var auth = {
	  login: function login(username, password, handleSuccess, handleError) {
	    (0, _reqwest2['default'])({
	      url: '/api/login',
	      method: 'post',
	      data: {
	        username: username,
	        password: password
	      }
	    }).then((function (resp) {
	      if (resp.error) {
	        if (handleError) {
	          handleError(resp.error);
	        }
	      } else {
	        user = resp;
	        localStorage.user = user;
	        handleSuccess(resp);
	      }
	    }).bind(undefined), (function (err, msg) {
	      if (handleError) {
	        if (err) {
	          handleError(err);
	        } else {
	          handleError('There was an unknown error');
	        }
	      }
	    }).bind(undefined));
	  },
	  logout: function logout() {
	    (0, _reqwest2['default'])({
	      url: '/api/logout',
	      method: 'get'
	    }).then(function () {
	      user = null;
	      debugger;
	    }).fail(function (err) {
	      debugger;
	      console.error('error when logging out', err);
	    });
	  },
	  isLoggedIn: function isLoggedIn(transition, cb) {
	    if (user === null) {
	      if (transition) {
	        transition.abort();
	        transition.redirect('/login');
	      }
	      return false;
	    } else {
	      return true;
	    }
	  }
	};
	exports.auth = auth;

/***/ },
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
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

	var _auth = __webpack_require__(8);

	var Dashboard = React.createClass({
	  displayName: 'Dashboard',

	  statics: {
	    willTransitionTo: function willTransitionTo(transition, params, query) {
	      _auth.auth.isLoggedIn(transition);
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

/***/ },
/* 14 */,
/* 15 */,
/* 16 */
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

	var _form = __webpack_require__(17);

	var _auth = __webpack_require__(8);

	var _router = __webpack_require__(21);

	var Login = (function (_Form) {
	  _inherits(Login, _Form);

	  function Login(props) {
	    _classCallCheck(this, Login);

	    _get(Object.getPrototypeOf(Login.prototype), 'constructor', this).call(this, props);
	    this.url = '/api/login';
	    this.submitValue = 'Login';
	    this.handleSuccess = this.handleSuccess.bind(this);
	  }

	  _createClass(Login, [{
	    key: 'handleSuccess',
	    value: function handleSuccess(resp) {
	      _router.RouterContainer.get().transitionTo('/');
	    }
	  }, {
	    key: 'handleSubmit',
	    value: function handleSubmit(e) {
	      e.preventDefault();
	      var username = React.findDOMNode(this.refs.username).value.trim();
	      var password = React.findDOMNode(this.refs.password).value.trim();

	      if (!username) {
	        this.handleError('You must provide a username');
	      } else if (!password) {
	        this.handleError('You must provide a password');
	      }

	      _auth.auth.login(username, password, this.handleSuccess, this.handleError);
	      return;
	    }
	  }]);

	  return Login;
	})(_form.Form);

	exports.Login = Login;

/***/ },
/* 17 */
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

	var _auth = __webpack_require__(8);

	__webpack_require__(18);

	var Form = (function (_React$Component) {
	  _inherits(Form, _React$Component);

	  function Form(props) {
	    _classCallCheck(this, Form);

	    _get(Object.getPrototypeOf(Form.prototype), 'constructor', this).call(this, props);
	    // bind functions to self
	    ['handleSubmit', 'handleError'].map((function (fn) {
	      this[fn] = this[fn].bind(this);
	    }).bind(this));

	    this.state = {
	      error: null
	    };
	  }

	  _createClass(Form, [{
	    key: 'handleError',
	    value: function handleError(error) {
	      this.setState({
	        error: error
	      });
	    }
	  }, {
	    key: 'handleSubmit',
	    value: function handleSubmit(e) {
	      e.preventDefault();
	      var username = React.findDOMNode(this.refs.username).value.trim();
	      var password = React.findDOMNode(this.refs.password).value.trim();

	      if (!username) {
	        this.handleError('You must provide a username');
	      } else if (!password) {
	        this.handleError('You must provide a password');
	      }

	      (0, _reqwest2['default'])({
	        url: this.url,
	        method: 'post',
	        data: {
	          username: username,
	          password: password
	        }
	      }).then((function (resp) {
	        if (resp.error) {
	          this.handleError(resp.error);
	        } else {
	          this.handleSuccess(resp);
	        }
	      }).bind(this), (function (err, msg) {
	        if (err) {
	          this.handleError(err);
	        } else {
	          this.handleError('There was an unknown error');
	        }
	      }).bind(this));
	      return;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'form',
	        { onSubmit: this.handleSubmit },
	        React.createElement(
	          'div',
	          { className: 'error' },
	          this.state.error
	        ),
	        React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'label',
	            null,
	            'Username:'
	          ),
	          React.createElement('input', { type: 'text', name: 'username', ref: 'username' })
	        ),
	        React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'label',
	            null,
	            'Password:'
	          ),
	          React.createElement('input', { type: 'password', name: 'password', ref: 'password' })
	        ),
	        React.createElement(
	          'div',
	          null,
	          React.createElement('input', { type: 'submit', value: this.submitValue })
	        )
	      );
	    }
	  }]);

	  return Form;
	})(React.Component);

	exports.Form = Form;

/***/ },
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
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

	var _auth = __webpack_require__(8);

	var Logout = (function (_React$Component) {
	  _inherits(Logout, _React$Component);

	  function Logout() {
	    _classCallCheck(this, Logout);

	    _get(Object.getPrototypeOf(Logout.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(Logout, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      _auth.auth.logout();
	    }
	  }]);

	  return Logout;
	})(React.Component);

	exports.Logout = Logout;

/***/ }
])