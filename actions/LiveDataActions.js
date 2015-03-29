'use strict'

var Bacon = require('baconjs')

module.exports = {
  station: new Bacon.Bus(),
  trainListDidMount: new Bacon.Bus()
}
