webpackHotUpdate(1,{

/***/ 26:
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

	var _auth = __webpack_require__(12);

	var Players = React.createClass({
	  displayName: 'Players',

	  statics: {
	    willTransitionTo: function willTransitionTo(transition, params, query) {
	      _auth.auth.isLoggedIn(transition);
	    }
	  },
	  getInitialState: function getInitialState() {
	    return {
	      loading: true,
	      players: []
	    };
	  },
	  url: '/api/players',
	  componentDidMount: function componentDidMount() {
	    (0, _reqwest2['default'])({
	      url: this.url,
	      method: 'get'
	    }).then((function (resp) {
	      if (resp.error) {
	        this.setState({
	          loading: false,
	          error: resp.error
	        });
	      } else {
	        this.setState({
	          loading: false,
	          players: resp
	        });
	      }
	    }).bind(this));
	  },
	  render: function render() {
	    var content;
	    if (this.state.loading) {
	      content = "Loading";
	    } else if (this.state.error) {
	      content = this.state.error;
	    } else {
	      var players = this.state.players.map(function (player) {
	        return React.createElement(
	          'tr',
	          null,
	          React.createElement(
	            'td',
	            null,
	            player.number
	          ),
	          React.createElement(
	            'td',
	            null,
	            player.last_contacted
	          ),
	          React.createElement(
	            'td',
	            null,
	            player.created
	          ),
	          React.createElement(
	            'td',
	            null,
	            'x'
	          )
	        );
	      });
	      content = React.createElement(
	        'table',
	        null,
	        React.createElement(
	          'thead',
	          null,
	          React.createElement(
	            'tr',
	            null,
	            React.createElement(
	              'td',
	              null,
	              'Number'
	            ),
	            React.createElement(
	              'td',
	              null,
	              'Last Contacted'
	            ),
	            React.createElement(
	              'td',
	              null,
	              'Created'
	            ),
	            React.createElement(
	              'td',
	              null,
	              'Delete'
	            )
	          )
	        ),
	        players
	      );
	    }
	    return React.createElement(
	      'div',
	      { className: 'players page' },
	      content
	    );
	  }
	});
	exports.Players = Players;

/***/ }

})