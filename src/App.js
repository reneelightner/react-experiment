import React, {useState} from 'react'
import Buttonset from './Components/Buttonset';
import StackedBar from './Components/StackedBarChart';
import Scatterplot from './Components/Scatterplot';
import Line from './Components/LineChart';
import Bar from './Components/Bar';
import GroupedBar from './Components/GroupedBar';
import colorPalette from './Components/colors';
import Legend from './Components/Legend';
import * as d3 from 'd3';

// DATA
import scatterplotJSON from './data/dataScatterplot.json';
import barJSON from './data/dataBarChart.json';
import stackedbarJSON from './data/dataStackedBarChart.json';
import lineJSON from './data/dataLineChart.json';
import groupedbarJSON from './data/dataGroupedBar.json';

// HELPER FUNCTIONS
// find unique for arr of objects (returns arr of unique items)
const findUnique = (arr, key) => {
  const unique = arr.reduce((a,c) => {
      if (!a.includes(c[key])) {
          a.push(c[key])
      }
      return a
  }, [])
  return unique
}

// for horizontal stacked bar, get XO and X1 values for each obj in the arr of data so that you can make the stack
function transformDataForBarChart(inputData, yKey, xKey) {
  const transformedData = [];
  const categoryGroups = {};

  // Group data by category
  inputData.forEach(item => {
    const category = item[yKey];
    if (!categoryGroups[category]) {
      categoryGroups[category] = [];
    }
    categoryGroups[category].push(item);
  });

  // Process each category separately
  Object.keys(categoryGroups).forEach(category => {
    let cumulativeValue = 0;

    categoryGroups[category].forEach(item => {
      let X0 = cumulativeValue;
      cumulativeValue += item[xKey];
      let X1 = cumulativeValue;

      transformedData.push({
        ...item,
        X0,
        X1
      });
    });
  });

  return transformedData;
}

// for scatterplot, parse each YEAR to date obj
const parseTime = d3.timeParse("%Y")
const formattedScatterplotData = scatterplotJSON.map(d => {
    const newObj = {...d} // shallow copy to avoid modifying the original object
    newObj.YEAR = parseTime(d.YEAR) // Convert string to actual Date object
    return newObj
})

// for line chart
const parseDate = d3.timeParse("%Y-%m-%d")
const formattedLineChartData = lineJSON.map(d => {
  const newObj = {...d} // shallow copy to avoid modifying the original object
  newObj.date = parseDate(d.date) // Convert string to actual Date object
  return newObj
})

// APP COMPONENT
function App() {
  // BUTTON GROUP
  const defaultBtnSelected = "option7"
  const [componentSelected, setcomponentSelected] = useState(defaultBtnSelected)
  const btnData = [
    {label: "Scatterplot", key: "option1"},
    {label: "Horizontal Bar Chart", key: "option2"},
    {label: "Vertical Bar Chart", key: "option3"},
    {label: "Horizontal Stacked Bar Chart", key: "option4"},
    {label: "Vertical Stacked Bar Chart", key: "option5"},
    {label: "Line Chart", key: "option6"},
    {label: "Horizontal Grouped Bar", key: "option7"},
    {label: "Vertical Grouped Bar", key: "option8"}
  ]
  const handleBtnSelection = (btnSelectedKey) => {
    setcomponentSelected(btnSelectedKey)
  }

  // STACKED BAR
  const formattedStackedBarData = transformDataForBarChart(stackedbarJSON, "category", "value")

  // stencil chart
  const chartOptions = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'My Line Chart',
    },
    series: [
      {
        name: 'Example Series',
        data: [1, 2, 3, 4, 5],
      },
    ],
  }
  
  return (
    <div className="container">
      <div className="stencil-chart-wrap row">
        <div className='col-6'>
          <custom-chart options={chartOptions}></custom-chart>
        </div>
      </div>
      <div className="row">
        <div className='col-12'>
          <p className={"label"}>Chart type:</p>
          <Buttonset btnData={btnData} defaultSelection={defaultBtnSelected} onSelect={handleBtnSelection} /> 
        </div>
      </div>
      <div className="componentWrapper row">
        {
        componentSelected === "option1" && 
          <div className='col-10'>
            <p>Scatterplot</p>
            <Scatterplot 
              data={formattedScatterplotData} 
              id={'scatterplot'} 
              height={200} 
              margin={{top: 0, right: 5, bottom: 20, left: 20}} 
              yscale={'band'}
              ydomain={findUnique(formattedScatterplotData, 'AWARD')} 
              xscale={'time'}
              xdomain={d3.extent(formattedScatterplotData, d => d.YEAR)}
              ykey={'AWARD'} 
              xkey={'YEAR'} 
              ttkey={'ARTIST'} 
              color={colorPalette["Orange"]} />
          </div>
        }
        {
        componentSelected === "option2" && 
          <div className='col-6'>
            <p>Horizontal Bar Chart</p>
            <Bar 
              data={barJSON} 
              id={'horizontalbar'}
              height={200}
              margin={{top: 0, right: 25, bottom: 10, left: 70}} 
              orientation={"horizontal"} 
              ydomain={findUnique(barJSON, 'product')} 
              xdomain={[0, d3.max(barJSON, d => d.sales)]} 
              ykey={'product'} 
              xkey={'sales'} 
              color={colorPalette["Orange"]}/>
          </div>
        }
        {
        componentSelected === "option3" && 
          <div className='col-6'>
            <p>Vertical Bar Chart</p>
            <Bar 
              data={barJSON} 
              id={'verticalbar'} 
              height={200}
              margin={{top: 15, right: 5, bottom: 10, left: 20}} 
              orientation={"vertical"} 
              ydomain={[0, d3.max(barJSON, d => d.sales)]}
              xdomain={findUnique(barJSON, 'product')} 
              ykey={'sales'} 
              xkey={'product'} 
              color={colorPalette["Orange"]}/>
          </div>
        }
        {
        componentSelected === "option4" && 
          <div className='col-6'>
            <p>Horizontal Stacked Bar Chart</p>
            <StackedBar 
              data={formattedStackedBarData} 
              id={'stackedbarhoriz'}
              height={200}
              margin={{ top: 5, right: 5, bottom: 10, left: 20 }} 
              orientation={"horizontal"} 
              xdomain={[0, d3.max(formattedStackedBarData, d => d.X1)]} 
              ydomain={findUnique(formattedStackedBarData, "category")} 
              ykey={"category"} 
              xkey={'value'} 
              colordomain={findUnique(formattedStackedBarData, "Product")} 
              colorrange={[colorPalette["Pink"],colorPalette["Turquoise"],colorPalette["Indigo"]]}
              colorkey={"Product"} 
              stack={'X0'} 
              textpos={'X1'} />
          </div>
        }
        {
        componentSelected === "option5" && 
          <div className='col-6'>
            <p>Vertical Stacked Bar Chart</p>
            <StackedBar 
              data={formattedStackedBarData} 
              id={'stackedbarvert'}
              height={200} 
              margin={{ top: 5, right: 5, bottom: 10, left: 20 }}
              orientation={"vertical"} 
              xdomain={findUnique(formattedStackedBarData, "category")}  
              ydomain={[0, d3.max(formattedStackedBarData, d => d.X1)]} 
              ykey={"value"} 
              xkey={"category"} 
              colordomain={findUnique(formattedStackedBarData, "Product")}
              colorrange={[colorPalette["Orange"],colorPalette["Turquoise"],colorPalette["Indigo"]]} 
              colorkey={"Product"} 
              stack={'X1'} 
              textpos={'X0'}  />
          </div>
        }
        {
        componentSelected === "option6" &&
        <div className='col-6'>
          <p>Line Chart</p>
          <Line 
            data={formattedLineChartData}
            id={'line'}
            height={200} 
            margin={{ top: 5, right: 5, bottom: 10, left: 15 }} 
            xdomain={d3.extent(formattedLineChartData, d => d.date)}
            ydomain={[0, d3.max(formattedLineChartData, d => d.value)]}
            ykey={"value"} 
            xkey={"date"}
            color={colorPalette["Teal"]}
          />
        </div>
        }
        {
        componentSelected === "option7" &&
        <div className='col-7'>
          <p>Grouped Bar Chart Horizontal</p>
          <Legend items={[
              { label: "Women", color: colorPalette["Pink"] },
              { label: "Men", color: colorPalette["Indigo"] }
          ]} />
          <GroupedBar
            data={groupedbarJSON}
            id={'groupedbarvert'}
            height={300}
            margin={{ top: 10, right: 20, bottom: 10, left: 70 }}
            orientation={"horizontal"}
            xdomain={[0, d3.max(groupedbarJSON, d => Math.max(d.Men, d.Women))]}
            ydomain={groupedbarJSON.map(d => d.category)}
            groupKey={"category"}
            groupdomain={["Men", "Women"]}
            groupkey={"category"}
            groupcolors={[colorPalette["Indigo"], colorPalette["Pink"]]} 
          />
        </div>
        }
        {
        componentSelected === "option8" &&
        <div className='col-6'>
          <p>Grouped Bar Chart Vertical</p>
          <Legend items={[
              { label: "Women", color: colorPalette["Pink"] },
              { label: "Men", color: colorPalette["Indigo"] }
          ]} />
          <GroupedBar
            data={groupedbarJSON}
            id={'groupedbarhoriz'}
            height={400} 
            margin={{ top: 10, right: 10, bottom: 30, left: 20 }} 
            orientation={"vertical"} 
            xdomain={groupedbarJSON.map(d => d.category)}
            ydomain={[0, d3.max(groupedbarJSON, d => Math.max(d.Men, d.Women))]}
            groupKey={"category"}
            groupdomain={["Women", "Men"]}
            groupkey={"category"}
            groupcolors={[colorPalette["Pink"],colorPalette["Indigo"]]} 
          />
        </div>
        }
      </div>
    </div>
  );
}

export default App;
