'use strict'

var React = require('react-native')
var {
  StyleSheet,
  Text,
  View,
  ListView,
} = React

var _      = require('lodash-node')
var moment = require('moment')

var StationDataStore = require('../stores/StationDataStore')
var StationMetadataStore = require('../stores/StationMetadataStore')
var LiveDataActions  = require('../actions/LiveDataActions')

var TIME_FORMAT = 'HH:mm'

var formatTime = (time) =>
  time.isValid() ? time.format(TIME_FORMAT) : null

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
    flex: 0.9,
    backgroundColor: '#66FF66'
  },
  rightColumn: {
    flex: 3,
    flexDirection: 'column'
  },
  trainRowRight: {
    flex: 3,
    flexDirection: 'row'
  },
  trainText: {
    flex: 0.8,
    fontSize: 21
  },
  trainTextOffTime: {
    flex: 1.0,
    fontSize: 21
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

var stationCodes

module.exports = React.createClass({

  componentDidMount: function() {
    this.unsubscribe = StationDataStore.stationArrivalView
      .zip(StationMetadataStore.stationsByCode, (stationView, stationCodes) => {return {stationView: stationView, stationCodes: stationCodes}})
      .onValue( (param) => {
        stationCodes = param.stationCodes
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(param.stationView),
        })
      })
    LiveDataActions.trainListDidMount.push(true)
  },

  componentWillUnmount: function() {
    this.unsubscribe()
  },

  renderTrain: function(train) {
    var trainTextElement = (time, displayArrow = false) =>
      <Text style={styles.trainText}>{displayArrow ? '→' : ''}{formatTime(time)}</Text>

    var arrivesLate = train.arrivalTime.isBefore(train.actualArrivalTime, 'minute')
    var departsLate = train.departureTime.isBefore(train.actualDepartureTime, 'minute')
    var isLate      = arrivesLate || departsLate

    if (arrivesLate) {
      var arriveLateElement = (<Text style={styles.trainTextOffTime}>{'→'}{formatTime(train.actualArrivalTime)}</Text>)
    }
    else {
      var arriveLateElement = <Text style={styles.trainTextOffTime}></Text>
    }
    if (departsLate) {
      var departLateElement = (<Text style={styles.trainTextOffTime}>{'→'}{formatTime(train.actualDepartureTime)}</Text>)
    }
    else {
      var departLateElement = <Text style={styles.trainTextOffTime}></Text>
    }

    var firstStation = stationCodes[train.firstStation].stationName
    var lastStation  = stationCodes[train.lastStation].stationName

    return (
      <View style={styles.trainRow}>
        <View style={[styles.trainRowLeft, arrivesLate && {backgroundColor: 'yellow'}, departsLate && {backgroundColor: 'red'}]}>
          <Text style={styles.trainText}>{train.trainType} {train.trainNumber}</Text>
        </View>
        <View style={styles.rightColumn}>
          <View>
            <Text style={styles.trainText}>{firstStation} - {lastStation}</Text>
          </View>
          <View style={styles.trainRowRight}>
            {trainTextElement(train.arrivalTime)}
            {arriveLateElement}
            {trainTextElement(train.departureTime)}
            {departLateElement}
          </View>
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
