import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  AppState,
} from 'react-native';

// There's four ways componentWillFocus will get called:
// 1) componentWillMount
// 2) Websocket goes away, and then reconnects
// 3) AppState goes from background to active
// 4) push / shift in navigation stage
//
// For #1, we simply monkey patch componentWillMount, and call componentWillFocus
// For #3, we add listeners, in componentWillMount and unMount, to listen for AppState changes
// For #2 and #4, we need to set up reducers that listen for those changes, and monkey
// patch mapStateToProps to return those bits of state. Then, we need to listen to
// componentWillReceiveProps and determine whether either of those is changing.
//
export default function connectWithFocus(...args) {
  return component => {
    const mapStateToProps = ({ router }) => {
      const {
        //route,
        //websocketStatus,
      } = router;
      return {
        //route,
        //websocketStatus,
      };
    };

    const options = {
      withRef: true,
    };

    const WrappedComponent = connect(
      mapStateToProps,
      null,
      null,
      options
    )(component);

    class WrapperComponent extends Component {
      constructor(props) {
        super(props);
        this.state = {
          mounted: false,
          handledMounted: false,
          appState: null,
        };
        this.refHandler = this.refHandler.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        this.componentWillFocus = this.componentWillFocus.bind(this);
      }

      componentWillMount() {
        this.setState({
          mounted: true,
        });
        this.componentWillFocus();
        AppState.addEventListener('change', this.handleAppStateChange);
      }

      componentWillFocus() {
        if (this.instance) {
          if (!this.instance.componentWillFocus) {
            console.warn('You called connectFocus with a component that failed to implement componentWillFocus', this.instance);
          } else {
            this.instance.componentWillFocus();
          }
        }
      }
      componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
      }
      handleAppStateChange(newAppState) {
        //if (this.state.appState !== newAppState && newAppState === 'active') {
          //this.componentWillFocus();
        //}
        this.setState({
          appState: newAppState,
        });
      }

      refHandler(c) {
        this.instance = c.getWrappedInstance();
        // we might already be mounted
        if (this.state.mounted && !this.state.handleMounted) {
          this.setState({
            handleMounted: false,
          });
          this.componentWillFocus();
        }
      }
      render() {
        return (
          <WrappedComponent
            ref={this.refHandler}
          />
        );
      }
    }
    return connect(...args)(WrapperComponent);
  };
}
