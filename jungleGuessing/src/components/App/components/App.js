import React from 'react';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

function App({
}) {
  return (
    <div className="app">
      Sup
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
