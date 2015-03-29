'use strict'

var React = require('react-native')
var {
  StyleSheet,
  Text
} = React

var Bacon = require('baconjs')

var LiveDataActions  = require('../actions/LiveDataActions')

var styles = StyleSheet.create({
  title: {
    fontSize: 30,
    backgroundColor: 'white',
    marginTop: 15
  }
})

module.exports = React.createClass({

  componentDidMount: function() {
    // This is such a hack to wait for the handler to register
    LiveDataActions.trainListDidMount.onValue(() => LiveDataActions.station.push('TPE'))
  },

  render: () => {
    return (
      <Text style={styles.title}>Tampere Arrivals</Text>
    )
  }
})
