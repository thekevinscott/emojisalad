webpackHotUpdate(1,{

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

/***/ }

})