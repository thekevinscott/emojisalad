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

	  render: function render() {
	    console.log('i am the dashboard');
	    return React.createElement(
	      'p',
	      null,
	      'Dashboard'
	    );
	  },
	  statics: {
	    willTransitionTo: function willTransitionTo(transition, params, query, callback) {
	      auth.isLoggedIn(function (isLoggedIn) {
	        transition.abort();
	        callback();
	      });
	    },

	    willTransitionFrom: function willTransitionFrom(transition, component) {
	      if (component.formHasUnsavedData()) {
	        if (!confirm('You have unsaved information,' + 'are you sure you want to leave this page?')) {
	          transition.abort();
	        }
	      }
	    }
	  }
	});

	module.exports = Dashboard;

/***/ }

})