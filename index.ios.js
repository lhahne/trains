/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
} = React;

var _      = require('lodash-node')
var moment = require('moment')

var LiveDataActions  = require('./actions/LiveDataActions')
var StationDataStore = require('./stores/StationDataStore')

var AwesomeProject = React.createClass({
  componentDidMount: function() {
    StationDataStore.stationArrivalView.onValue((stationView) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(stationView),
        loaded: true
      })
    })

    LiveDataActions.station.push('TPE')
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
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false
    }
  },

  render: function() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Tampere Arrivals</Text>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderTrain}
            style={styles.listView}
          />
        </View>
      );
    }
    else {
      return(
        <Text>Loading</Text>
      )
    }
  }

});

var styles = StyleSheet.create({
  title: {
    fontSize: 30,
    backgroundColor: 'white',
    marginTop: 15
  },
  container: {
    flexDirection: 'column'
  },
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
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
