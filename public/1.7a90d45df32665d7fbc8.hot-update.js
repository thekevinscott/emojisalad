webpackHotUpdate(1,{

/***/ 15:
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

	var _login = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./login\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _register = __webpack_require__(20);

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

/***/ }

})