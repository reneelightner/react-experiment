import React, {useState} from 'react'
import Buttonset from './Components/Buttonset';
import StackedBar from './Components/StackedBarChart';
import Scatterplot from './Components/Scatterplot';
import Bar from './Components/Bar';
import * as d3 from 'd3';

// DATA
import scatterplotJSON from './data/dataScatterplot.json';
import barJSON from './data/dataBarChart.json';
import stackedbarJSON from './data/dataStackedBarChart.json';

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


// APP COMPONENT
function App() {
  // BUTTON GROUP
  // map of btn key to component
  const componentBtnMap = {
    "option1" : "Component 1",
    "option2" : "Component 2",
    "option3" : "Component 3",
    "option4" : "Component 4",
    "option5" : "Component 5"
  }
  const defaultBtnSelected = "option1"
  const [componentSelected, setcomponentSelected] = useState(componentBtnMap[defaultBtnSelected])
  const btnData = [
    {label: "Scatterplot", key: "option1"},
    {label: "Horizontal Bar Chart", key: "option2"},
    {label: "Vertical Bar Chart", key: "option3"},
    {label: "Horizontal Stacked Bar Chart", key: "option4"},
    {label: "Vertical Stacked Bar Chart", key: "option5"}
  ]
  const handleBtnSelection = (btnSelectedKey) => {
    setcomponentSelected(componentBtnMap[btnSelectedKey])
  }

  // SCATTERPLOT
  // parse each YEAR to date obj
  const parseTime = d3.timeParse("%Y")
  const formattedScatterplotData = scatterplotJSON.map(d => {
      const newObj = {...d} // shallow copy to avoid modifying the original object
      newObj.YEAR = parseTime(d.YEAR)
      return newObj
  })
  const ydomainscatterplot = findUnique(formattedScatterplotData, 'AWARD')
  const xdomainscatterplot = d3.extent(formattedScatterplotData, d => d.YEAR)   // min and max year for x axis domain

  // HORIZONTAL BAR
  const ydomainhorizbar = findUnique(barJSON, 'product')
  const xdomainhorizbar = [0, d3.max(barJSON, d => d.sales)]

  // VERTICAL BAR
  const ydomainvertbar = [0, d3.max(barJSON, d => d.sales)]
  const xdomainvertbar = findUnique(barJSON, 'product')

  // STACKED BAR
  const formattedStackedBarData = transformDataForBarChart(stackedbarJSON, "category", "value")
  const categoriesforcolor = findUnique(formattedStackedBarData, "Product")
  
  // STACKED HORIZONTAL BAR
  const ydomainhorizstackedbar = findUnique(formattedStackedBarData, "category")
  const xdomainhorizstackedbar = [0, d3.max(formattedStackedBarData, d => d.X1)]

  // STACKED VERTICAL BAR
  const ydomainvertstackedbar = [0, d3.max(formattedStackedBarData, d => d.X1)]
  const xdomainvertstackedbar = findUnique(formattedStackedBarData, "category")

  return (
    <div className="container">
      <p className={"label"}>Chart type:</p>
      <Buttonset btnData={btnData} defaultSelection={defaultBtnSelected} onSelect={handleBtnSelection} /> 
      <div className="componentWrapper row">
        {
          componentSelected === "Component 1" && 
          <div className='col-8'>
            <p>Scatterplot</p>
            <Scatterplot data={formattedScatterplotData} id={'scatterplot'} height={200} margin={{top: 1, right: 15, bottom: 20, left: 20}} ydomain={ydomainscatterplot} xdomain={xdomainscatterplot} ykey={'AWARD'} xkey={'YEAR'} ttkey={'ARTIST'} color={"#fc8d59"} />
            </div>
        }
        {
          componentSelected === "Component 2" && 
          <div className='col-6'>
            <p>Horizontal Bar Chart</p>
            <Bar data={barJSON} orientation={"horizontal"} xscale={"linear"} yscale={"band"} id={'horizontalbar'} height={200} margin={{top: 5, right: 25, bottom: 10, left: 70}} ydomain={ydomainhorizbar} xdomain={xdomainhorizbar} ykey={'product'} xkey={'sales'} color={"#fc8d59"}/>
            </div>
        }
        {
          componentSelected === "Component 3" && 
          <div className='col-6'>
            <p>Vertical Bar Chart</p>
            <Bar data={barJSON} orientation={"vertical"} xscale={"band"} yscale={"linear"} id={'verticalbar'} height={200} margin={{top: 5, right: 10, bottom: 10, left: 20}} ydomain={ydomainvertbar} xdomain={xdomainvertbar} ykey={'sales'} xkey={'product'} color={"#fc8d59"}/>
            </div>
        }
        {
          componentSelected === "Component 4" && 
          <div className='col-6'>
            <p>Horizontal Stacked Bar Chart</p>
            <StackedBar data={formattedStackedBarData} orientation={"horizontal"} xscale={"linear"} yscale={"band"} id={'stackedbarhoriz'} height={200} margin={{ top: 5, right: 5, bottom: 10, left: 20 }} ydomain={ydomainhorizstackedbar} xdomain={xdomainhorizstackedbar} ykey={"category"} xkey={'value'} categoriescolor={categoriesforcolor} colorkey={"Product"} stack={'X0'} textpos={'X1'}  />
            </div>
        }
        {
          componentSelected === "Component 5" && 
          <div className='col-6'>
            <p>Vertical Stacked Bar Chart</p>
            <StackedBar data={formattedStackedBarData} orientation={"vertical"} xscale={"band"} yscale={"linear"} id={'stackedbarvert'} height={200} margin={{ top: 5, right: 5, bottom: 10, left: 20 }} ydomain={ydomainvertstackedbar} xdomain={xdomainvertstackedbar} ykey={"value"} xkey={"category"} categoriescolor={categoriesforcolor} colorkey={"Product"} stack={'X1'} textpos={'X0'}  />
            </div>
        }
      </div>
    </div>
  );
}

export default App;
