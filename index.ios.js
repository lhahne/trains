/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native')
var {
  AppRegistry,
  StyleSheet,
  View
} = React

var StationPicker = require('./components/StationPicker')
var TrainList     = require('./components/TrainList')

var AwesomeProject = React.createClass({

  render: function() {
    return (
      <View style={styles.container}>
        <StationPicker />
        <TrainList />
      </View>
    )
  }

})

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  }
})

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
