import React from 'react';
import { connect } from 'react-redux';

function App({
}) {
  return (
    <div className="main-app-container">
      Sup
    </div>
  );
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
