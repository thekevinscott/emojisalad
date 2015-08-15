webpackHotUpdate(1,{

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _reqwest = __webpack_require__(2);

	var _reqwest2 = _interopRequireDefault(_reqwest);

	/*
	export class Dashboard extends React.Component {
	  constructor(props) {
	    super(props);

	    this.statics = {
	      willTransitionFrom(transition) {
	        console.log('heyo');
	      },
	      willTransitionTo(transition) {
	        console.log('will trans');
	        if (!AuthStore.isAuthenticated()) {
	          transition.redirect('login', {}, {nextPath: transition.path});
	        }
	      }
	    }
	  }
	  render() {
	    console.log('i am the dashboard');
	    return (
	      <p>Dashboard</p>
	    );
	  }
	}
	*/
	var Dashboard = React.createClass({
	  displayName: 'Dashboard',

	  statics: {
	    willTransitionTo: function willTransitionTo(transition) {
	      console.log("intercepting transition path", transition.path);
	      console.log("verifying user logged in");
	    }
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      'Dashboard Page'
	    );
	  }
	});

/***/ }

})