'use strict'

var LiveDataActions = require('../actions/LiveDataActions')

var _      = require('lodash-node')
var Bacon  = require('baconjs')
var moment = require('moment')

var STATION_DATA_URL = 'http://rata.digitraffic.fi/api/v1/live-trains?station='
var ACCEPTED_TRAINS  = ['IC', 'S', 'P', 'H']

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

stationTrains.onError( e => console.log("crash and burn"))

// thanks guys. the api dataformat sucks
var stationArrivalView = station.zip(stationTrains, (station, trains) =>
    _(trains).map((train) => {
      var rows = train.timeTableRows.filter((row) => {
          return row.stationShortCode === station
        })
      var arrival   = _(rows).filter((row) => row.type === 'ARRIVAL').first()
      var departure = _(rows).filter((row) => row.type === 'DEPARTURE').first()

      arrival   = arrival || {}
      departure = departure || {}

      return {
        firstStation: _(train.timeTableRows).first().stationShortCode,
        lastStation: _(train.timeTableRows).last().stationShortCode,
        trainNumber: train.trainType + ' ' + train.trainNumber,
        arrivalTime: moment(arrival.scheduledTime || null),
        actualArrivalTime: moment(arrival.liveEstimateTime || null),
        departureTime: moment(departure.scheduledTime || null),
        actualDepartureTime: moment(departure.liveEstimateTime || null)
      }
    })
    .sortBy((element) => element.arrivalTime.isValid() ? element.arrivalTime : element.departureTime)
    .value()
  )


module.exports = {
  stationTrains: stationTrains,
  stationArrivalView: stationArrivalView
}
