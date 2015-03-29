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

var _ = require('lodash-node')
var moment = require('moment')

var LiveDataActions = require('./actions/LiveDataActions')
require('./stores/StationDataStore')
LiveDataActions.station.push('TPE')

var AwesomeProject = React.createClass({
  componentDidMount: function() {
    this.fetchData()
  },

  renderTrain: function(train) {
    var tampereArrival = train.timeTableRows.filter((row) => {
      return row.stationShortCode == 'TPE'
    })[0]
    var arrivalTime = moment(tampereArrival.scheduledTime).format('hh:mm')
    var actualArrivalTime = moment(tampereArrival.liveEstimateTime).format('hh:mm')
    var late = tampereArrival.differenceInMinutes > 0
    var lateElement
    if (late) {
      lateElement = (<Text style={styles.trainText}>{' -> '}{actualArrivalTime}</Text>)
    }
    return (
      <View style={styles.trainRow}>
        <View style={[styles.trainRowLeft, late && {backgroundColor: 'red'}]}>
          <Text style={styles.trainText}>{train.trainType} {train.trainNumber}</Text>
        </View>
        <View style={styles.trainRowRight}>
          <Text style={styles.trainText}>{arrivalTime}</Text>
          {lateElement}
        </View>
      </View>
    )
  },

  fetchData: function () {
    fetch('http://rata.digitraffic.fi/api/v1/live-trains?station=TPE')
      .then((response) => response.json())
      .then((responseData) => {
        var trains =_(responseData)
                      .filter((t) => _.contains(['IC', 'S', 'P'], t.trainType))
                      .value()
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(trains),
          loaded: true
        })
      })
      .done()
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
    //justifyContent: 'flex-start',
    //alignItems: 'center',
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
