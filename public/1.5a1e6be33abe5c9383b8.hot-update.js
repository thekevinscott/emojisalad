webpackHotUpdate(1,{

/***/ 17:
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

/***/ }

})