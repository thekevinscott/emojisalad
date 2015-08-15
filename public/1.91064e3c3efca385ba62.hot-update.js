webpackHotUpdate(1,{

/***/ 16:
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

	var _auth = __webpack_require__(12);

	var Link = Router.Link;

	var Dashboard = React.createClass({
	  displayName: 'Dashboard',

	  statics: {
	    willTransitionTo: function willTransitionTo(transition, params, query) {
	      debugger;
	      //auth.isLoggedIn(transition);
	    }
	  },
	  render: function render() {
	    console.log('redner dashboard 2');
	    return React.createElement(
	      'div',
	      { className: 'dashboard page' },
	      React.createElement(
	        'h1',
	        null,
	        'This is a Dashboard page'
	      ),
	      React.createElement(
	        'ul',
	        null,
	        React.createElement(
	          'li',
	          null,
	          React.createElement(
	            Link,
	            { to: 'games' },
	            'Games'
	          )
	        ),
	        React.createElement(
	          'li',
	          null,
	          React.createElement(
	            Link,
	            { to: 'players' },
	            'Players'
	          )
	        )
	      )
	    );
	  }
	});
	exports.Dashboard = Dashboard;

/***/ }

})