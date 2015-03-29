'use strict'

var LiveDataActions = require('../actions/LiveDataActions')

var _ = require('lodash-node')

var STATION_DATA_URL = 'http://rata.digitraffic.fi/api/v1/live-trains?station='

LiveDataActions.station.map((station) => {
  console.log(station)
  return STATION_DATA_URL + station
})


// 
// fetch('TPE')
//   .then((response) => response.json())
//   .then((responseData) => {
//     var trains =_(responseData)
//                   .filter((t) => _.contains(['IC', 'S', 'P'], t.trainType))
//                   .value()
//     this.setState({
//       dataSource: this.state.dataSource.cloneWithRows(trains),
//       loaded: true
//     })
//   })
//   .done()
