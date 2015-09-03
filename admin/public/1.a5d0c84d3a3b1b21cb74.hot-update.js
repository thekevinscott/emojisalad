webpackHotUpdate(1,{

/***/ 29:
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

	var _base = __webpack_require__(27);

	var Script = React.createClass({
	  displayName: 'Script',

	  mixins: [_base.Base], // Use the mixin
	  url: '/api/script',
	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'script page' },
	      'here is script'
	    );
	  }
	});
	exports.Script = Script;

/***/ }

})