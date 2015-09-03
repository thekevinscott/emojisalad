webpackHotUpdate(1,{

/***/ 32:
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

	var _base = __webpack_require__(30);

	var instance = jsPlumb.getInstance({

	  PaintStyle: {
	    lineWidth: 6,
	    strokeStyle: "#567567",
	    outlineColor: "black",
	    outlineWidth: 1
	  },
	  Connector: ["Bezier", { curviness: 30 }],
	  Endpoint: ["Dot", { radius: 5 }],
	  EndpointStyle: { fillStyle: "#567567" },
	  Anchor: [0.5, 0.5, 1, 1],
	  Container: 'script'

	});

	var Script = React.createClass({
	  displayName: 'Script',

	  mixins: [_base.Base], // Use the mixin
	  url: '/api/script',
	  componentDidMount: function componentDidMount() {
	    jsPlumb.bind("ready", function () {
	      var divone = document.getElementsByClassName('someDiv');
	      jsPlumb.connect({ source: divone, target: document.getElementsByClassName('someDiv2') });
	      jsPlumb.draggable(divone);
	    });
	  },

	  render: function render() {
	    console.log('render');
	    return React.createElement(
	      'div',
	      { className: 'script page', id: 'script', style: { height: '400px', position: 'relative' } },
	      React.createElement('div', { className: 'someDiv', style: { height: '200px', width: '200px', position: 'absolute', background: 'red' } }),
	      React.createElement('div', { className: 'someDiv2', style: { height: '100px', width: '100px', left: '200px', position: 'absolute', background: 'blue' } })
	    );
	  }
	});
	exports.Script = Script;

/***/ }

})