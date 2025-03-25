import React, {useState} from 'react'
import Buttonset from './Components/Buttonset';
import Component3 from './Components/Component3';
import Scatterplot from './Components/Scatterplot';
import HorizontalBar from './Components/HorizontalBar';
import * as d3 from 'd3';

// DATA
import scatterplotJSON from './data/dataScatterplot.json';
import horizontalbarJSON from './data/dataBarChartHorizontal.json';

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

// APP COMPONENT
function App() {
  // BUTTON GROUP
  // map of btn key to component
  const componentBtnMap = {
    "option1" : "Component 1",
    "option2" : "Component 2",
    "option3" : "Component 3"
  }
  const defaultBtnSelected = "option1"
  const [componentSelected, setcomponentSelected] = useState(componentBtnMap[defaultBtnSelected])
  const btnData = [
    {label: "Scatterplot", key: "option1"},
    {label: "Horizontal Bar Chart", key: "option2"},
    {label: "Option 3", key: "option3"}
  ]
  const handleBtnSelection = (btnSelectedKey) => {
    setcomponentSelected(componentBtnMap[btnSelectedKey])
  }

  // SCATTERPLOT
  // clean up data for chart, parse each YEAR, return formattedData
  const parseTime = d3.timeParse("%Y")
  const formattedData = scatterplotJSON.map(d => {
      const newObj = {...d} // shallow copy to avoid modifying the original object
      newObj.YEAR = parseTime(d.YEAR)
      return newObj
  })
  // use formattedData to find x and y domains
  // arr of unique awards for y axis domain
  const ydomain = findUnique(formattedData, 'AWARD')
  // min and max year for x axis domain
  const xdomain = d3.extent(formattedData, d => d.YEAR)
  const scatterplotmargin = {top: 1, right: 15, bottom: 20, left: 20}

  return (
    <div className="container">
      <p className={"label"}>Choose a chart type:</p>
      <Buttonset btnData={btnData} defaultSelection={defaultBtnSelected} onSelect={handleBtnSelection} /> 
      <div className="componentWrapper row">
        <div className='col-8'>
          {
            componentSelected === "Component 1" && 
            <>
              <p>Scatterplot</p>
              <Scatterplot data={formattedData} id={'scatterplot'} height={200} ydomain={ydomain} ykey={'AWARD'} xdomain={xdomain} xkey={'YEAR'} ttkey={'ARTIST'} margin={scatterplotmargin} />
            </>
          }
        </div>
        <div className='col-6'>
          {componentSelected === "Component 2" && <HorizontalBar id={'horizontalbar'} height={200} />}
        </div>
        {componentSelected === "Component 3" && <Component3 />}
      </div>
    </div>
  );
}

export default App;
