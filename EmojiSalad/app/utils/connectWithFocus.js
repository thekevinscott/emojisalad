import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  AppState,
} from 'react-native';

function getWrappedComponent(
  component,
  [
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    options,
  ],
) {
  return connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    {
      ...options,
      withRef: true,
    },
  )(component);
}

const patchedConnect = (...args) => component => {
  const componentName = component.name;
  const mapStateToProps = ({ application }) => {
    const {
      scene,
    } = application.router;
    const {
      connected,
    } = application.connection;

    return {
      activeComponent: (scene || {}).title,
      websocketConnected: connected,
    };
  };

  const WrappedComponent = getWrappedComponent(component, args);

  class WrapperComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        handledMounted: false,
        appState: null,
      };
      this.refHandler = this.refHandler.bind(this);
      this.handleAppStateChange = this.handleAppStateChange.bind(this);
      this.componentWillAppear = this.componentWillAppear.bind(this);
    }

    componentWillMount() {
      this.componentWillAppear({
        type: 'COMPONENT_WILL_MOUNT',
      });
      AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillAppear(event) {
      if (this.instance) {
        if (!this.instance.componentWillAppear) {
          console.warn('You called connectFocus with a component that failed to implement componentWillAppear', this.instance);
        } else {
          this.instance.componentWillAppear(event);
        }
      }
    }

    componentWillUnmount() {
      AppState.removeEventListener('change', this.handleAppStateChange);
    }

    isComponentActive(activeComponent) {
      return activeComponent === componentName;
    }

    willComponentBecomeActive(nextProps) {
      return this.props.activeComponent !== nextProps.activeComponent && this.isComponentActive(nextProps.activeComponent);
    }

    willWebsocketBecomeActive(nextProps) {
      // make sure the component is active
      if (this.isComponentActive(this.props.activeComponent)) {
        // only focus if we're coming from a websocket-unconnected state
        // and we're going to a websocket-connected state
        const websocketWillBecomeActive = this.props.websocketConnected === false && nextProps.websocketConnected === true;
        //console.log('will websocket become active?', websocketWillBecomeActive);
        return websocketWillBecomeActive;
      }
      return false;
    }

    componentWillReceiveProps(nextProps) {
      if (this.willComponentBecomeActive(nextProps)) {
        this.componentWillAppear({
          type: 'COMPONENT_WILL_BECOME_ACTIVE',
        });
      } else if (this.willWebsocketBecomeActive(nextProps)) {
        this.componentWillAppear({
          type: 'WEBSOCKET_WILL_BECOME_ACTIVE',
        });
      }
    }

    handleAppStateChange(newAppState) {
      if (this.state.appState !== newAppState && newAppState === 'active' && this.isComponentActive(this.props.activeComponent)) {
        this.componentWillAppear({
          type: 'APP_STATE_CHANGED',
        });
      }
      this.setState({
        appState: newAppState,
      });
    }

    refHandler(c) {
      if (c) {
        this.instance = c.getWrappedInstance();
        if (!this.state.handleMounted) {
          this.setState({
            handleMounted: false,
          });
          this.componentWillAppear({
            type: 'COMPONENT_REF_APPEARED',
          });
        }
      }
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          ref={this.refHandler}
        />
      );
    }
  }

  return connect(
    mapStateToProps
  )(WrapperComponent);
};

export default patchedConnect;
