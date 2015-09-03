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

	//var plumb = require('imports?this=>window!script!./lib/jsPlumb/dist/js/dom.jsPlumb-1.7.8')
	//imports?$=jquery!
	//var plumb = require('imports?this=>window!script!./lib/jsPlumb/dist/js/dom.jsPlumb-1.7.8');

	var _base = __webpack_require__(27);

	var plumb = __webpack_require__(39);

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

/***/ },

/***/ 39:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*** IMPORTS FROM imports-loader ***/
	(function() {

	__webpack_require__(31)(__webpack_require__(36))}.call(global));
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }

})