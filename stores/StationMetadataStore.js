'use strict'

var Bacon = require('baconjs')
var _     = require('lodash-node')

var METADATA_URL = 'http://rata.digitraffic.fi/api/v1/metadata/station'

var stations = Bacon.fromPromise(fetch(METADATA_URL))
  .flatMap((response) => Bacon.fromPromise(response.json()))
  .toProperty()

var stationsByCode = stations.map((stations) =>
  _.transform(stations, (result, station) => {
    station = _.clone(station)
    var stationCode = station.stationShortCode

    delete station.stationShortCode
    result[stationCode] = station
    
    return result
  }, {})
)

module.exports = {
  stations: stations,
  stationsByCode: stationsByCode
}
