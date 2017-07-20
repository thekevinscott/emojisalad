import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getWrappedComponent from './getWrappedComponent';
import { connect } from 'react-redux';
import {
  AppState,
} from 'react-native';

const getActiveComponent = (scene = {}) => {
  if (!scene.key) {
    console.warn('Not providing an explicit key for scene could cause errors in connectWithFocus; we\'ll fall back to using title for now but you should provide a key', scene);
  }
  return scene.key || scene.title;
};

const patchedConnect = (...args) => component => {
  const componentKey = component.key || component.name;
  if (!component.key) {
    console.warn('Not providing an explicit static key for your component could cause errors in connectWithFocus; we\'ll fall back to using title for now but you should provide a key', component);
  }
  const mapStateToProps = ({ application }) => {
    const {
      scene,
    } = application.router;

    const {
      connected,
    } = application.connection;

    return {
      activeComponent: getActiveComponent(scene),
      websocketConnected: connected,
    };
  };

  const WrappedComponent = getWrappedComponent(component, args);

  class WrapperComponent extends Component {
    static navigationOptions = component.navigationOptions || {};

    static propTypes = {
      activeComponent: PropTypes.any,
      websocketConnected: PropTypes.bool.isRequired,
    };

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
      return activeComponent === componentKey;
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
