import React, {useState, useEffect} from 'react'
import D3Charts from './Components/D3Charts'
import Buttonset from './Components/Buttonset'
import Test from './Components/test'

import lineJSON from './data/dataLineChart.json'
import scatterplotJSON from './data/dataScatterplot.json'

// stencil/highcharts line chart
const chartLine = {
  chart: {
    type: 'line',
  },
  title: {
    text: 'Line Chart',
  },
  xAxis: {
    type: 'datetime',
    title: {
      text: 'Date',
    },
  },
  yAxis: {
    title: {
      text: 'Value',
    },
  },
  series: [
    {
      name: 'Example Series',
      data: lineJSON.map(d => { // highcharts expecets an array of objects with x and y keys
        return {x: new Date(d.date).getTime(), y: d.value}
      }),
    },
  ],
}

const chartScatterplot = {
  chart: {
    type: 'scatter',
    zoomType: 'xy'
  },
  title: {
    text: 'Award Winners by Year'
  },
  xAxis: {
    title: {
      text: 'Year'
    }
  },
  yAxis: {
    title: {
      text: 'Award'
    },
    categories: ['A', 'B', 'C', 'D'], // maps index 0 = 'A', 1 = 'B', etc.
    reversed: true      // optional: makes A at the top
  },
  tooltip: {
    formatter: function () {
      return `<b>${this.point.name}</b><br>Award: ${['A', 'B', 'C', 'D'][this.point.y]}<br>Year: ${this.point.x}`;
    }
  },
  series: [{
    name: 'Artists',
    data:  scatterplotJSON.map(d => {
        return{
          x: parseInt(d.YEAR),                   // numeric year
          y: ['A', 'B', 'C', 'D'].indexOf(d.AWARD),           // convert award letter to index
          name: d.ARTIST
        }                        // for tooltip
    })
  }]
}


// APP COMPONENT
function App() {

  // BUTTON GROUP FOR ALL CHARTS
  const [componentSelectedChart, setcomponentSelectedChart] = useState("d3")
  const btnsAllCharts = [
    {label: "D3.JS Charts", key: "d3"},
    {label: "Highchart Charts", key: "highchart"}
  ]
  const handleBtnSelection = (btnSelectedKey) => {
    setcomponentSelectedChart(btnSelectedKey)
  }
 
  return (
    <div className="container">
      <div className="row">
        <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
          <Buttonset btnData={btnsAllCharts} selection={componentSelectedChart} onSelect={handleBtnSelection} />
        </div>
      </div>
      {
      componentSelectedChart === "highchart" && 
        <>
          <h3 className="pt-3">Highchart Charts</h3>
          <div className="stencil-chart-wrap row">
            <div className='col-6'>
              <custom-chart options={chartLine}></custom-chart>
            </div>
            <div className='col-8'>
              <custom-chart options={chartScatterplot}></custom-chart>
            </div>
          </div>
        </>
      }
      {
      componentSelectedChart === "d3" && 
        <D3Charts />
      }
    </div>
  );
}

export default App;
