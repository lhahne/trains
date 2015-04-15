'use strict'

var React = require('react')
var Bacon = require('baconjs')

var StationDataStore     = require('../stores/StationDataStore')
var StationMetadataStore = require('../stores/StationMetadataStore')

var TrainList = React.createClass({

  getInitialState() {
    return {stationView: {}}
  },

  componentDidMount: function() {
    this.unsubscribe =
      Bacon.zipAsArray(StationDataStore.stationArrivalView, StationMetadataStore.stationsByCode)
      .onValues((stationView, stationCodes) => {
        this.stationCodes = stationCodes
        this.setState({
          stationView: stationView,
        })
      })
  },

  componentWillUnmount: function() {
    this.unsubscribe()
  },

  render() {
    if (this.state.stationView.firstStation) {
      return <h1>profit</h1>
    }
    else {
      return <h1>sakfjh</h1>
    }
  }

})

React.render(<TrainList/>, document.getElementById('appRoot'))
