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

	__webpack_require__(33);

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

	var Config = React.createClass({
	  displayName: 'Config',

	  render: function render() {
	    console.log(this.props.data);
	    if (this.props.data) {
	      var content = Object.keys(this.props.data).map((function (key) {
	        var state = this.props.data[key];
	        var style = {
	          height: '200px',
	          width: '200px',
	          position: 'absolute',
	          background: 'red',
	          left: state.left || 0,
	          top: state.top || 0
	        };
	        return React.createElement('div', { className: 'state', style: style });
	      }).bind(this));
	      var style = {
	        height: '20px',
	        width: '20px',
	        position: 'absolute',
	        background: 'black',
	        left: 400,
	        top: 0
	      };
	      content.push(React.createElement('div', { className: 'state incoming', style: style }));
	    } else {
	      var content = React.createElement('div', null);
	    }

	    var transform = 'translate(20px, 0)';
	    return React.createElement(
	      'div',
	      { className: 'map-container', onMouseDown: this.handleMouseDown },
	      React.createElement(
	        'div',
	        { className: 'map', style: { transform: transform } },
	        content
	      )
	    );
	  }
	});

	var Script = React.createClass({
	  displayName: 'Script',

	  mixins: [_base.Base], // Use the mixin
	  url: '/api/script',
	  componentDidUpdate: function componentDidUpdate() {
	    jsPlumb.bind("ready", function () {
	      var divone = document.getElementsByClassName('state');
	      //jsPlumb.connect({ source: divone, target: divone});
	      jsPlumb.draggable(divone);
	    });
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'script page', id: 'script' },
	      this.state.loading ? React.createElement('div', null) : React.createElement(Config, { data: this.state.data })
	    );
	  },

	  handleMouseDown: function handleMouseDown() {
	    debugger;
	  }
	});
	exports.Script = Script;

/***/ }

})