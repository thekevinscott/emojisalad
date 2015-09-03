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

	  getInitialState: function getInitialState() {
	    return {
	      dragging: false,
	      origin: {},
	      translate: {
	        x: 0,
	        y: 0
	      },
	      scale: 2
	    };
	  },
	  render: function render() {
	    console.log(this.props.data);
	    if (this.props.data) {
	      var content = Object.keys(this.props.data).map((function (key) {
	        var userState = this.props.data[key];
	        var style = {
	          height: '200px',
	          width: '200px',
	          background: 'red',
	          left: userState.left || 0,
	          top: userState.top || 0
	        };
	        if (userState.scenarios.length) {
	          var children = userState.scenarios.map(function (scenario) {

	            var style = {
	              height: '200px',
	              width: '200px',
	              background: 'red',
	              left: scenario.left || 0,
	              top: scenario.top || 0
	            };
	            return React.createElement('div', { className: 'state child', style: style });
	          });
	        } else {
	          children = null;
	        }
	        var content = React.createElement(
	          'div',
	          null,
	          React.createElement('div', { className: 'state parent', style: style }),
	          children
	        );
	        return content;
	      }).bind(this));

	      var style = {
	        left: 400,
	        top: 0
	      };
	      content.push(React.createElement('div', { className: 'state incoming', style: style }));
	    } else {
	      var content = React.createElement('div', null);
	    }

	    var transform = 'translate(' + this.state.translate.x + 'px, ' + this.state.translate.y + 'px)';
	    return React.createElement(
	      'div',
	      { className: 'map-container', onMouseMove: this.handleMouseMove, onMouseDown: this.handleMouseDown, onMouseUp: this.handleMouseUp },
	      React.createElement(
	        'div',
	        { className: 'map', style: { transform: transform } },
	        content
	      )
	    );
	  },

	  handleMouseDown: function handleMouseDown(e) {
	    //this.setState({
	    //dragging: true,
	    //origin: {
	    //x: e.pageX - this.state.translate.x,
	    //y: e.pageY - this.state.translate.y
	    //}
	    //});
	  },
	  handleMouseUp: function handleMouseUp() {
	    this.setState({
	      dragging: false
	    });
	  },
	  handleMouseMove: function handleMouseMove(e) {
	    if (this.state.dragging) {
	      this.setState({
	        translate: {
	          x: e.pageX - this.state.origin.x,
	          y: e.pageY - this.state.origin.y
	        }
	      });
	    }
	  }

	});

	var Script = React.createClass({
	  displayName: 'Script',

	  mixins: [_base.Base], // Use the mixin
	  url: '/api/script',
	  componentDidUpdate: function componentDidUpdate() {
	    jsPlumb.bind("ready", function () {
	      var parent = document.getElementsByClassName('parent');
	      var child = document.getElementsByClassName('parent');
	      jsPlumb.connect({ source: parent, target: child });
	      jsPlumb.draggable(divone);
	    });
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'script page', id: 'script' },
	      this.state.loading ? React.createElement('div', null) : React.createElement(Config, { data: this.state.data })
	    );
	  }
	});
	exports.Script = Script;

/***/ }

})