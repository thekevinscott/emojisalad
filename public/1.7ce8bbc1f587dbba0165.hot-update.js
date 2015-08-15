webpackHotUpdate(1,{

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _app = __webpack_require__(5);

	//import { routes } from './routes';
	//
	var Router = __webpack_require__(3); // or var Router = ReactRouter; in browsers

	var DefaultRoute = Router.DefaultRoute;
	var Link = Router.Link;
	var Route = Router.Route;

	var routes = React.createElement(Route, { handler: _app.App, path: '/' });

	Router.run(routes, Router.HistoryLocation, function (Handler) {
	  React.render(React.createElement(_app.App, null), document.body);
	});

/***/ }

})