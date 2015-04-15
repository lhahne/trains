'use strict'

var React = require('react')
var Bacon = require('baconjs')

var StationDataStore     = require('../stores/StationDataStore')
var StationMetadataStore = require('../stores/StationMetadataStore')

var LiveDataActions = require('../actions/LiveDataActions')

var TrainList = React.createClass({

  getInitialState() {
    return {stationView: {}}
  },

  componentDidMount: function() {
    this.unsubscribe =
      Bacon.zipAsArray(StationDataStore.stationArrivalView, StationMetadataStore.stationsByCode)
      .onValues((stationView, stationCodes) => {
        console.log("got state")
        this.stationCodes = stationCodes
        this.setState({
          stationView: stationView
        })
      })

    LiveDataActions.trainListDidMount.onValue(() => LiveDataActions.station.push('TPE'))
    LiveDataActions.trainListDidMount.push(true)
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
