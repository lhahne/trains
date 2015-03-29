var React = require('react-native')
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
} = React

Bacon = require('baconjs')

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
    Bacon.when([LiveDataActions.trainListDidMount], () => LiveDataActions.station.push('TPE')).onValue()
  },

  render: () => {
    return (
      <Text style={styles.title}>Tampere Arrivals</Text>
    )
  }
})
