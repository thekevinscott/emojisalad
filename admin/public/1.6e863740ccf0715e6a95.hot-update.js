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
	            debugger;

	            var basicType = {
	                connector: "StateMachine",
	                paintStyle: { strokeStyle: "red", lineWidth: 4 },
	                hoverPaintStyle: { strokeStyle: "blue" },
	                overlays: ["Arrow"]
	            };
	            instance.registerConnectionType("basic", basicType);

	            // this is the paint style for the connecting lines..
	            var connectorPaintStyle = {
	                lineWidth: 4,
	                strokeStyle: "#61B7CF",
	                joinstyle: "round",
	                outlineColor: "white",
	                outlineWidth: 2
	            },

	            // .. and this is the hover style.
	            connectorHoverStyle = {
	                lineWidth: 4,
	                strokeStyle: "#216477",
	                outlineWidth: 2,
	                outlineColor: "white"
	            },
	                endpointHoverStyle = {
	                fillStyle: "#216477",
	                strokeStyle: "#216477"
	            },

	            // the definition of source endpoints (the small blue ones)
	            sourceEndpoint = {
	                endpoint: "Dot",
	                paintStyle: {
	                    strokeStyle: "#7AB02C",
	                    fillStyle: "transparent",
	                    radius: 7,
	                    lineWidth: 3
	                },
	                isSource: true,
	                connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
	                connectorStyle: connectorPaintStyle,
	                hoverPaintStyle: endpointHoverStyle,
	                connectorHoverStyle: connectorHoverStyle,
	                dragOptions: {},
	                overlays: [["Label", {
	                    location: [0.5, 1.5],
	                    label: "Drag",
	                    cssClass: "endpointSourceLabel"
	                }]]
	            },

	            // the definition of target endpoints (will appear when the user drags a connection)
	            targetEndpoint = {
	                endpoint: "Dot",
	                paintStyle: { fillStyle: "#7AB02C", radius: 11 },
	                hoverPaintStyle: endpointHoverStyle,
	                maxConnections: -1,
	                dropOptions: { hoverClass: "hover", activeClass: "active" },
	                isTarget: true,
	                overlays: [["Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel" }]]
	            },
	                init = function init(connection) {
	                connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
	            };

	            var _addEndpoints = function _addEndpoints(toId, sourceAnchors, targetAnchors) {
	                for (var i = 0; i < sourceAnchors.length; i++) {
	                    var sourceUUID = toId + sourceAnchors[i];
	                    instance.addEndpoint("flowchart" + toId, sourceEndpoint, {
	                        anchor: sourceAnchors[i], uuid: sourceUUID
	                    });
	                }
	                for (var j = 0; j < targetAnchors.length; j++) {
	                    var targetUUID = toId + targetAnchors[j];
	                    instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
	                }
	            };

	            // suspend drawing and initialise.
	            instance.batch(function () {

	                _addEndpoints("Window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);
	                _addEndpoints("Window2", ["LeftMiddle", "BottomCenter"], ["TopCenter", "RightMiddle"]);
	                _addEndpoints("Window3", ["RightMiddle", "BottomCenter"], ["LeftMiddle", "TopCenter"]);
	                _addEndpoints("Window1", ["LeftMiddle", "RightMiddle"], ["TopCenter", "BottomCenter"]);

	                // listen for new connections; initialise them the same way we initialise the connections at startup.
	                instance.bind("connection", function (connInfo, originalEvent) {
	                    init(connInfo.connection);
	                });

	                // make all the window divs draggable
	                instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
	                // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
	                // method, or document.querySelectorAll:
	                //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

	                // connect a few up
	                instance.connect({ uuids: ["Window2BottomCenter", "Window3TopCenter"], editable: true });
	                instance.connect({ uuids: ["Window2LeftMiddle", "Window4LeftMiddle"], editable: true });
	                instance.connect({ uuids: ["Window4TopCenter", "Window4RightMiddle"], editable: true });
	                instance.connect({ uuids: ["Window3RightMiddle", "Window2RightMiddle"], editable: true });
	                instance.connect({ uuids: ["Window4BottomCenter", "Window1TopCenter"], editable: true });
	                instance.connect({ uuids: ["Window3BottomCenter", "Window1BottomCenter"], editable: true });
	                //

	                //
	                // listen for clicks on connections, and offer to delete connections on click.
	                //
	                instance.bind("click", function (conn, originalEvent) {
	                    // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
	                    //   instance.detach(conn);
	                    conn.toggleType("basic");
	                });

	                instance.bind("connectionDrag", function (connection) {
	                    console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
	                });

	                instance.bind("connectionDragStop", function (connection) {
	                    console.log("connection " + connection.id + " was dragged");
	                });

	                instance.bind("connectionMoved", function (params) {
	                    console.log("connection " + params.connection.id + " was moved");
	                });
	            });
	        });
	    },

	    render: function render() {
	        return React.createElement(
	            'div',
	            { className: 'script page', id: 'script', style: { height: '400px' } },
	            'here is script'
	        );
	    }
	});
	exports.Script = Script;

/***/ }

})