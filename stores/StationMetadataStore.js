'use strict'

var Bacon = require('baconjs')
var _     = require('lodash-node')

var METADATA_URL = 'http://rata.digitraffic.fi/api/v1/metadata/station'

var stations = Bacon.fromPromise(fetch(METADATA_URL))
  .flatMap((response) => Bacon.fromPromise(response.json()))
  .toProperty()

var stationsByCode = stations.map(stations =>
  _(stations)
    .map(station => {
      station.stationName = station.stationName.replace(' asema', '')
      return station
    })
    .indexBy('stationShortCode')
    .value()
)

module.exports = {
  stations: stations,
  stationsByCode: stationsByCode
}
