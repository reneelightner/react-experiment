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

  const fullData = [
    { id: 1, name: "Bruno Mars", award: 'A' },
    { id: 2, name: "Olivia Rodrigo", award: 'B' },
    { id: 3, name: "Jon Batiste", award: 'C' },
    { id: 4, name: "Anderson .Paak", award: 'A' },
    { id: 5, name: "Anderson .Paak", award: 'B' },
    { id: 6, name: "Anderson .Paak", award: 'C' }
  ]

  const [testData, setTestData] = useState(fullData)
  //no selections on default
  const [artistSelections, setArtistSelections] = useState([])
  const [awardSelections, setAwardSelections] = useState([])
  
  function filterArray(filterArray1, filterArray2) {
    if (!filterArray1.length && !filterArray2.length) {
      return testData
    }
  
    return testData.filter(item => {
      const condition1 = filterArray1.length === 0 || filterArray1.includes(item.name);
      const condition2 = filterArray2.length === 0 || filterArray2.includes(item.award);
      return condition1 && condition2;
    });
  }

  const filteredData = filterArray(artistSelections, awardSelections)

  const uniqueartists = filteredData.reduce((a,c) => {
    if (!a.includes(c.name)) {
      a.push(c.name)
    } 
    return a
  }, [])

  const uniqueawards = filteredData.reduce((a,c) => {
    if (!a.includes(c.award)) {
      a.push(c.award)
    } 
    return a
  }, [])

 
  return (
    <div className="container">
      <button onClick={() => {setArtistSelections([]); setAwardSelections([])}}>Reset</button>
      <Test selections={uniqueartists} setSelections={setArtistSelections}/>
      <Test selections={uniqueawards} setSelections={setAwardSelections}/>
      <div className="row">
        <div className='col-12'>
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
