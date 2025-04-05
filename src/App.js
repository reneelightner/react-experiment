import React, {useState} from 'react'
import Buttonset from './Components/Buttonset';
import StackedBar from './Components/StackedBarChart';
import Scatterplot from './Components/Scatterplot';
import Line from './Components/LineChart';
import Bar from './Components/Bar';
import GroupedBar from './Components/GroupedBar';
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
    {label: "Grouped Bar", key: "option7"}
  ]
  const handleBtnSelection = (btnSelectedKey) => {
    setcomponentSelected(btnSelectedKey)
  }

  // STACKED BAR
  const formattedStackedBarData = transformDataForBarChart(stackedbarJSON, "category", "value")
  const categoriesforcolor = findUnique(formattedStackedBarData, "Product")
  
  return (
    <div className="container">
      <p className={"label"}>Chart type:</p>
      <Buttonset btnData={btnData} defaultSelection={defaultBtnSelected} onSelect={handleBtnSelection} /> 
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
              color={"#fc8d59"} />
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
              yscale={"band"}
              ydomain={findUnique(barJSON, 'product')} 
              xscale={"linear"} 
              xdomain={[0, d3.max(barJSON, d => d.sales)]} 
              ykey={'product'} 
              xkey={'sales'} 
              color={"#fc8d59"}/>
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
              yscale={"linear"}
              ydomain={[0, d3.max(barJSON, d => d.sales)]}
              xscale={"band"} 
              xdomain={findUnique(barJSON, 'product')} 
              ykey={'sales'} 
              xkey={'product'} 
              color={"#fc8d59"}/>
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
              xscale={"linear"}
              xdomain={[0, d3.max(formattedStackedBarData, d => d.X1)]} 
              yscale={"band"}  
              ydomain={findUnique(formattedStackedBarData, "category")} 
              ykey={"category"} 
              xkey={'value'} 
              categoriescolor={categoriesforcolor} 
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
              xscale={"band"}
              xdomain={findUnique(formattedStackedBarData, "category")}  
              yscale={"linear"} 
              ydomain={[0, d3.max(formattedStackedBarData, d => d.X1)]} 
              ykey={"value"} 
              xkey={"category"} 
              categoriescolor={categoriesforcolor} 
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
            xscale={"time"}
            xdomain={d3.extent(formattedLineChartData, d => d.date)}
            yscale={"linear"}
            ydomain={[0, d3.max(formattedLineChartData, d => d.value)]}
            ykey={"value"} 
            xkey={"date"}
            color={"steelblue"}
          />
        </div>
        }
        {
        componentSelected === "option7" &&
        <div className='col-6'>
          <p>Grouped Bar Chart</p>
          <GroupedBar
            data={groupedbarJSON}
            id={'groupedbar'}
            height={400} 
            margin={{ top: 20, right: 30, bottom: 50, left: 50 }} 
          />
        </div>
        }
      </div>
    </div>
  );
}

export default App;
