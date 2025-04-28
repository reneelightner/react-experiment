import React, {useState} from 'react'

// CHARTS -d3 charts
import Buttonset from './Buttonset';
import StackedBar from './StackedBarChart';
import Scatterplot from './Scatterplot';
import Line from './LineChart';
import Bar from './Bar';
import GroupedBar from './GroupedBar';
import MultipleLine from './MultipleLine';
import colorPalette from './colors';
import Legend from './Legend';
import Dropdown from './Dropdown';

import * as d3 from 'd3';

// DATA -d3 charts
import scatterplotJSON from '../data/dataScatterplot.json'
import barJSON from '../data/dataBarChart.json'
import stackedbarJSON from '../data/dataStackedBarChart.json'
import lineJSON from '../data/dataLineChart.json'
import groupedbarJSON from '../data/dataGroupedBar.json'
import multiplelinesJSON from '../data/dataMultipleLines.json'
import multiplelines2JSON from '../data/dataMultipleLines2.json'

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
            })
        })
    })

return transformedData;
}

// for scatterplot, parse each YEAR to date obj
const parseTime = d3.timeParse("%Y")
const formattedScatterplotData = scatterplotJSON.map(d => {
    const newObj = {...d} // shallow copy to avoid modifying the original object
    newObj.YEAR = parseTime(d.YEAR) // Convert string to actual Date object
    return newObj
})

// for line charts - format dates to date objects
const parseDate = d3.timeParse("%Y-%m-%d")
function formatDates(jsondata) {
    return jsondata.map(d => {
        const newObj = {...d} // shallow copy to avoid modifying the original object
        newObj.date = parseDate(d.date) // Convert string to actual Date object
        return newObj
    })
}
// for single line chart
const formattedLineChartData = formatDates(lineJSON)
// for multiple lines chart
const formattedMultipleLineChartData = formatDates(multiplelinesJSON)
const formattedMultipleLine2ChartData = formatDates(multiplelines2JSON)

// STACKED BAR
const formattedStackedBarData = transformDataForBarChart(stackedbarJSON, "category", "value")

const D3Charts = () => {

    // BUTTON GROUP FOR D3 CHARTS
    const [componentSelectedD3, setcomponentSelectedD3] = useState("option9")
    const btnsD3Charts = [
        {label: "Scatterplot", key: "option1"},
        {label: "Horizontal Bar", key: "option2"},
        {label: "Vertical Bar", key: "option3"},
        {label: "Horizontal Stacked Bar", key: "option4"},
        {label: "Vertical Stacked Bar", key: "option5"},
        {label: "Line", key: "option6"},
        {label: "Horizontal Grouped Bar", key: "option7"},
        {label: "Vertical Grouped Bar", key: "option8"},
        {label: "Multiple Line", key: "option9"}
    ]
    const handleBtnSelectionD3Charts = (btnSelectedKey) => {
        setcomponentSelectedD3(btnSelectedKey)
    }

    // Multiple Lines Chart
    // button group for multiple lines chart
    const [dataSelected, setDataSelected] = useState("data1")
    const btnsMultipleLinesCharts = [
        {label: "Data1", key: "data1"},
        {label: "Data2", key: "data2"}
    ]
    const handleDataSelecteed = (dataSelected) => {
        setDataSelected(dataSelected)
    }
    // data for multiple lines chart
    const chartDataMultipleLines = dataSelected === "data1"  // this is passed as the data to the chart component
        ? formattedMultipleLineChartData 
        : formattedMultipleLine2ChartData
    // x domain for multiple lines chart
    const xdomain = dataSelected === "data1"
        ? d3.extent(formattedMultipleLineChartData, d => d.date)
        : d3.extent(formattedMultipleLine2ChartData, d => d.date)
    // y domain for multiple lines chart
    const ydomainmax = dataSelected === "data1"
        ? d3.max(formattedMultipleLineChartData, d => Math.max(d.value1, d.value2, d.value3))
        : d3.max(formattedMultipleLine2ChartData, d => Math.max(d.value1, d.value2, d.value3))
    // for multiple lines dropdown -items selected and way to update items selected
    const [itemsSelected, setItemsSelected] = useState(["value1", "value2", "value3"])
    const handleDDSelected = (itemSelected) => {
        let currItemsSelected = [...itemsSelected]
        if (currItemsSelected.includes(itemSelected)) {
            currItemsSelected = currItemsSelected.filter((d) => {return d != itemSelected})
        } else {
            currItemsSelected.push(itemSelected)
        }
        setItemsSelected(currItemsSelected)
    }
    // line/legend color lookup
    const multipleLineLookup = {
        "Value 1": colorPalette["Lime"],
        "Value 2": colorPalette["Green"],
        "Value 3": colorPalette["Purple"]
    }
    // key lookup 
    const keyLookup = {
        "value1" : "Value 1",
        "value2" : "Value 2",
        "value3" : "Value 3"
    }
    // legend items - built on items selected from the dropdown
    let legendItems = itemsSelected.map((key) => {
        return { label: keyLookup[key], color: multipleLineLookup[keyLookup[key]] }
    })
    // filtered data based on items selected from dropdown
    let filteredMultipleLinesData = chartDataMultipleLines.map((d) => {
        const newObj = {date: d.date}
        itemsSelected.forEach((item) => {
            newObj[item] = d[item]
        })
        return newObj
    })
    // colors based on items selected from dropdown
    let colorsForItems = itemsSelected.map((d) => {
        return multipleLineLookup[keyLookup[d]]
    })

    return (
    <>
        <h3 className="pt-3">d3 charts</h3>
        <div className="row">
            <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
                <p className='label'>Chart type:</p>
                <Buttonset btnData={btnsD3Charts} selection={componentSelectedD3} onSelect={handleBtnSelectionD3Charts} /> 
            </div>
        </div>
        <div className="row">
        {
        componentSelectedD3 === "option1" && 
            <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
            <p>Scatterplot</p>
            <Scatterplot 
                data={formattedScatterplotData} 
                id={'scatterplot'} 
                height={350} 
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
        componentSelectedD3 === "option2" && 
            <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
            <p>Horizontal Bar Chart</p>
            <Bar 
                data={barJSON} 
                id={'horizontalbar'}
                height={350}
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
        componentSelectedD3 === "option3" && 
            <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
            <p>Vertical Bar Chart</p>
            <Bar 
                data={barJSON} 
                id={'verticalbar'} 
                height={350}
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
        componentSelectedD3 === "option4" && 
            <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
            <p>Horizontal Stacked Bar Chart</p>
            <StackedBar 
                data={formattedStackedBarData} 
                id={'stackedbarhoriz'}
                height={350}
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
        componentSelectedD3 === "option5" && 
            <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
            <p>Vertical Stacked Bar Chart</p>
            <StackedBar 
                data={formattedStackedBarData} 
                id={'stackedbarvert'}
                height={350} 
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
        componentSelectedD3 === "option6" &&
            <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
                <p>Line Chart</p>
                <Line 
                data={formattedLineChartData}
                id={'line'}
                height={350} 
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
        componentSelectedD3 === "option7" &&
            <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
                <p>Grouped Bar Chart Horizontal</p>
                <Legend items={[
                    { label: "Women", color: colorPalette["Pink"] },
                    { label: "Men", color: colorPalette["Indigo"] }
                ]} />
                <GroupedBar
                data={groupedbarJSON}
                id={'groupedbarvert'}
                height={350}
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
        componentSelectedD3 === "option8" &&
            <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
                <p>Grouped Bar Chart Vertical</p>
                <Legend items={[
                    { label: "Women", color: colorPalette["Pink"] },
                    { label: "Men", color: colorPalette["Indigo"] }
                ]} />
                <GroupedBar
                data={groupedbarJSON}
                id={'groupedbarhoriz'}
                height={350} 
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
        {
        componentSelectedD3 === "option9" &&
            <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
                <p>Multiple Lines Chart</p>
                <Buttonset btnData={btnsMultipleLinesCharts} selection={dataSelected} onSelect={handleDataSelecteed} />
                <Legend items={legendItems} />
                <Dropdown items={[
                    { label: "Value 1", key: "value1" },
                    { label: "Value 2", key: "value2" },
                    { label: "Value 3", key: "value3" }
                ]} selectedItems={itemsSelected} onSelect={handleDDSelected}/>
                <MultipleLine
                data={filteredMultipleLinesData}
                id={'multipleline'}
                height={350} 
                margin={{ top: 10, right: 10, bottom: 20, left: 20 }} 
                xdomain={xdomain}
                ydomain={[0, ydomainmax]}
                ykeys={itemsSelected} 
                xkey={"date"}
                colors={colorsForItems}
                />
            </div>
        }
        </div>
    </>
    )
}

export default D3Charts