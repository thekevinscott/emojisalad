webpackHotUpdate(1,[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
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

	var _login = __webpack_require__(7);

	var _register = __webpack_require__(13);

	var Account = (function (_React$Component) {
	    _inherits(Account, _React$Component);

	    function Account(props) {
	        _classCallCheck(this, Account);

	        _get(Object.getPrototypeOf(Account.prototype), 'constructor', this).call(this, props);
	        this.onToggle = this.onToggle.bind(this);
	        this.state = { type: 'login' };
	    }

	    _createClass(Account, [{
	        key: 'onToggle',
	        value: function onToggle() {
	            this.setState({
	                type: this.state.type === 'login' ? 'register' : 'login'
	            });
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var page = undefined,
	                link = undefined;
	            if (this.state.type === 'register') {
	                page = React.createElement(_register.Register, null);
	                link = 'Login';
	            } else {
	                page = React.createElement(_login.Login, null);
	                link = 'Register';
	            }

	            //<a onClick={this.onToggle}>{link}</a>
	            return React.createElement(
	                'div',
	                { className: 'account' },
	                page
	            );
	        }
	    }]);

	    return Account;
	})(React.Component);

	exports.Account = Account;

/***/ },
/* 7 */
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

	var _form = __webpack_require__(8);

	var Login = (function (_Form) {
	    _inherits(Login, _Form);

	    function Login(props) {
	        _classCallCheck(this, Login);

	        _get(Object.getPrototypeOf(Login.prototype), 'constructor', this).call(this, props);
	        this.url = '/login';
	        this.submitValue = 'Login';
	        this.handleSuccess = this.handleSuccess.bind(this);
	    }

	    _createClass(Login, [{
	        key: 'handleSuccess',
	        value: function handleSuccess(resp) {
	            console.log('success logging in', resp);
	        }
	    }]);

	    return Login;
	})(_form.Form);

	exports.Login = Login;

/***/ },
/* 8 */
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

	__webpack_require__(9);

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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(10, function() {
				var newContent = __webpack_require__(10);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, ".error {\n  background: red;\n}\n", ""]);

	// exports


/***/ },
/* 11 */,
/* 12 */,
/* 13 */
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

	var _form = __webpack_require__(8);

	var Register = (function (_Form) {
	    _inherits(Register, _Form);

	    function Register(props) {
	        _classCallCheck(this, Register);

	        _get(Object.getPrototypeOf(Register.prototype), 'constructor', this).call(this, props);
	        this.url = '/register';
	        this.submitValue = 'Register';
	        this.handleSuccess = this.handleSuccess.bind(this);
	    }

	    _createClass(Register, [{
	        key: 'handleSuccess',
	        value: function handleSuccess(resp) {
	            console.log('success registering', resp);
	        }
	    }]);

	    return Register;
	})(_form.Form);

	exports.Register = Register;

/***/ },
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
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

	var _app = __webpack_require__(5);

	var _dashboard = __webpack_require__(17);

	var _notfound = __webpack_require__(18);

	var _account = __webpack_require__(6);

	var DefaultRoute = Router.DefaultRoute;
	var NotFoundRoute = Router.NotFoundRoute;

	var Link = Router.Link;
	var Route = Router.Route;

	var routes = React.createElement(
	  Route,
	  { handler: _app.App, path: '/' },
	  React.createElement(Route, { name: 'login', handler: _account.Account }),
	  React.createElement(Route, { name: 'logout', handler: Logout }),
	  React.createElement(DefaultRoute, { handler: _dashboard.Dashboard }),
	  React.createElement(NotFoundRoute, { handler: _notfound.NotFound })
	);
	exports.routes = routes;
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
])