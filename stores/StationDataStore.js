'use strict'

var LiveDataActions = require('../actions/LiveDataActions')

var _      = require('lodash-node')
var Bacon  = require('baconjs')
var moment = require('moment')

var STATION_DATA_URL = 'http://rata.digitraffic.fi/api/v1/live-trains?station='
var ACCEPTED_TRAINS  = ['IC', 'S', 'P']
var TIME_FORMAT      = 'HH:mm'

var formatTime = (time) =>
  moment(time).format(TIME_FORMAT)

var station = LiveDataActions.station

var stationTrains = station
  .map((station) =>
    STATION_DATA_URL + station
  )
  .flatMap((url) =>
    Bacon.fromPromise(fetch(url))
  )
  .flatMap((response) =>
    Bacon.fromPromise(response.json())
  )
  .map((trains) =>
    trains.filter((train) =>
        _.contains(ACCEPTED_TRAINS, train.trainType))
  )

var stationArrivalView = stationTrains.zip(station, (st, s) => {
    return {
      station: s,
      stationTrains: st
    }
  })
  .map((stationData) => {
    var station = stationData.station
    var trains  = stationData.stationTrains

    return _(trains).map((train) => {
        var arrival = train.timeTableRows.filter((row) => {
            return row.stationShortCode === station
          })[0]

        return {
          trainNumber: train.trainType + ' ' + train.trainNumber,
          arrivalTime: formatTime(arrival.scheduledTime),
          actualArrivalTime: formatTime(arrival.liveEstimateTime),
          late: arrival.differenceInMinutes > 0
        }
      })
      .sortBy('arrivalTime')
      .value()

  })
  .onValue((v) => console.log(v))


module.exports = {
  stationTrains: stationTrains,
  //stationArrivalView: stationArrivalView
}
