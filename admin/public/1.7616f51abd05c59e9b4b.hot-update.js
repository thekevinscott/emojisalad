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

	var plumb = __webpack_require__(33);

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

/***/ 33:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/babel-loader/index.js!./dom.jsPlumb-1.7.8.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(13)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(34, function() {
				var newContent = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/babel-loader/index.js!./dom.jsPlumb-1.7.8.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }

})