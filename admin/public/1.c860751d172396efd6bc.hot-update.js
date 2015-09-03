webpackHotUpdate(1,{

/***/ 30:
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

	var _auth = __webpack_require__(11);

	var Base = {
	  statics: {
	    willTransitionTo: function willTransitionTo(transition, params, query) {
	      _auth.auth.isLoggedIn(transition);
	    }
	  },
	  getInitialState: function getInitialState() {
	    return {
	      loading: true,
	      data: []
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    console.log('mounted');
	    (0, _reqwest2['default'])({
	      url: this.url,
	      method: 'get'
	    }).then((function (resp) {
	      console.log('got it');
	      if (!resp || typeof resp !== 'object') {
	        this.setState({
	          loading: false,
	          error: 'Error retrieving data'
	        });
	      } else if (resp.error) {
	        this.setState({
	          loading: false,
	          error: resp.error
	        });
	      } else {
	        console.log('got it');
	        this.setState({
	          loading: false,
	          data: resp
	        });
	      }
	    }).bind(this));
	  }
	};
	exports.Base = Base;

/***/ }

})