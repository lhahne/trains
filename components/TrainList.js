'use strict'

var React = require('react-native')
var {
  StyleSheet,
  Text,
  View,
  ListView,
} = React

var _ = require('lodash-node')

var StationDataStore = require('../stores/StationDataStore')
var LiveDataActions  = require('../actions/LiveDataActions')

var styles = StyleSheet.create({
  listView: {
    flex:1
  },
  trainRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
  },
  trainRowLeft: {
    flex: 1,
    backgroundColor: '#66FF66',
  },
  trainRowRight: {
    flex: 3,
    flexDirection: 'row'
  },
  trainText: {
    fontSize: 25
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
})

module.exports = React.createClass({

  componentDidMount: function() {
    this.unsubscribe = StationDataStore.stationArrivalView.onValue((stationView) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(stationView),
      })
    })
    LiveDataActions.trainListDidMount.push(true)
  },

  componentWillUnmount: function() {
    this.unsubscribe()
  },

  renderTrain: function(train) {
    var lateElement
    if (train.late) {
      lateElement = (<Text style={styles.trainText}>{'→'}{train.actualArrivalTime}</Text>)
    }
    return (
      <View style={styles.trainRow}>
        <View style={[styles.trainRowLeft, train.late && {backgroundColor: 'red'}]}>
          <Text style={styles.trainText}>{train.trainType} {train.trainNumber}</Text>
        </View>
        <View style={styles.trainRowRight}>
          <Text style={styles.trainText}>{train.arrivalTime}</Text>
          {lateElement}
        </View>
      </View>
    )
  },

  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => _.isEqual(row1, row2)
      })
    }
  },

  render: function() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        pageSize={10}
        renderRow={this.renderTrain}
        style={styles.listView}
      />
    )
  }
})
