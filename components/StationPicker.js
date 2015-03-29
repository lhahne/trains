var React = require('react-native')
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
} = React

var styles = StyleSheet.create({
  title: {
    fontSize: 30,
    backgroundColor: 'white',
    marginTop: 15
  },
})

module.exports = React.createClass({
  render: () => {
    return (
      <Text style={styles.title}>Tampere Arrivals</Text>
    )
  }
})
