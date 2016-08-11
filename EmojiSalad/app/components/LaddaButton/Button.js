import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';

const originalState = function(){
  return {
    borderRadius: 20,
  };
};

const spinnerSize = 40;
const padding = 20;

const loadingState = function(){
  return {
    width: 60,
    borderRadius: 500,
  };
};

const CustomLayoutSpring = {
  duration: 300,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7,
  },
};

export default class Button extends Component {
  constructor() {
    this.state = {
      style: originalState(),
      spinnerStyle: { opacity: 0 },
      loading: false,
    };
  }

  _updateState {
    LayoutAnimation.configureNext(CustomLayoutSpring);
    const loading = !this.state.loading;
    this.setState({
      style: loading ? loadingState() : originalState(),
      spinnerStyle: loading? { opacity: 1 } : { opacity : 0 },
      loading: loading
    });
  },

  _onPress {
    if (!this.state.loading) {
      // Animate the update
      this._updateState();

      setTimeout(function() {
        this._updateState();  
      }.bind(this), 2000);
    }
  },

  render {
    const left = parseInt((this.state.style.width / 2) - (spinnerSize / 2) - (padding), 10);
    const opacity = this.state.loading? 1 : 0;

    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={1} onPress={this._onPress} style={[styles.box, { ... this.state.style }]}>
          <View style={{ justifyContent : 'center', flex: 1,
            flexDirection: 'row', }} >
            <Text style={{ textAlign: 'center' }}>{!this.state.loading ? 'Load Earlier Messages' : null}</Text>


            <Image
              source={{uri: 'http://scottdesignllc.com/loadingaaa.gif'}}
              style={[this.state.spinnerStyle, { width: spinnerSize, height: spinnerSize, top: 0 - (spinnerSize / 2) + (padding/2), position: 'absolute', left: left,  }]}

            />
          </View>
        </TouchableOpacity>

      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#AAA',
    padding: padding,
    height: 60,
    overflow: 'hidden',
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
