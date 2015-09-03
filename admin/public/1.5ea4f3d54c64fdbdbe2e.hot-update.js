webpackHotUpdate(1,{

/***/ 8:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _reactRouter = __webpack_require__(3);

	var Router = _interopRequireWildcard(_reactRouter);

	var _app = __webpack_require__(9);

	var _dashboard = __webpack_require__(19);

	var _notfound = __webpack_require__(20);

	var _account = __webpack_require__(21);

	var _accountLogout = __webpack_require__(27);

	var _games = __webpack_require__(28);

	var _players = __webpack_require__(29);

	var _messages = __webpack_require__(31);

	var _script = __webpack_require__(32);

	var _auth = __webpack_require__(11);

	var DefaultRoute = Router.DefaultRoute;
	var NotFoundRoute = Router.NotFoundRoute;

	var Link = Router.Link;
	var Route = Router.Route;

	var routes = React.createElement(
	  Route,
	  { handler: _app.App, path: '/' },
	  React.createElement(Route, { name: 'login', handler: _account.Account }),
	  React.createElement(Route, { name: 'logout', handler: _accountLogout.Logout }),
	  React.createElement(Route, { handler: _dashboard.Dashboard }),
	  React.createElement(Route, { handler: _games.Games, name: 'games' }),
	  React.createElement(Route, { handler: _players.Players, name: 'players' }),
	  React.createElement(Route, { handler: _messages.Messages, name: 'messages' }),
	  React.createElement(Route, { handler: _script.Script, name: 'script' }),
	  React.createElement(NotFoundRoute, { handler: _notfound.NotFound })
	);
	exports.routes = routes;

/***/ },

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
	              left: userState.left || 0,
	              top: userState.top || 0
	            };
	            return React.createElement('div', { className: 'state', style: style });
	          });
	        } else {
	          children = null;
	        }
	        var content = React.createElement(
	          'div',
	          null,
	          React.createElement('div', { className: 'state', style: style }),
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
	    this.setState({
	      dragging: true,
	      origin: {
	        x: e.pageX - this.state.translate.x,
	        y: e.pageY - this.state.translate.y
	      }
	    });
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
	  }
	});
	exports.Script = Script;

/***/ },

/***/ 33:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(34);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(16)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(34, function() {
				var newContent = __webpack_require__(34);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 34:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(15)();
	// imports


	// module
	exports.push([module.id, ".script {\n  height: 100%;\n}\n.map-container {\n  border: 1px solid #CCC;\n  cursor: move;\n  cursor: -moz-grab;\n  cursor: -webkit-grab;\n  position: relative;\n  height: 600px;\n  width: 100%;\n  overflow: hidden;\n  background: white;\n}\n.state {\n  border-radius: 10px;\n  position: absolute;\n}\n.incoming {\n  height: 20px;\n  width: 20px;\n  position: absolute;\n  background: black;\n}\n", ""]);

	// exports


/***/ }

})