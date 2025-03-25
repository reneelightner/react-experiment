import React from 'react';
import * as d3 from 'd3';
import { useD3 } from './useD3.js';


export default function HorizontalBar(props) {

    const ref = useD3(
        (svg) => {

            // replace this with props data
            const sampleBarChartData = [
                { "product": "Laptops", "sales": 120 },
                { "product": "Tablets", "sales": 80 },
                { "product": "Smartphones", "sales": 150 },
                { "product": "Smartwatches", "sales": 50 },
                { "product": "Monitors", "sales": 90 },
                { "product": "Keyboards", "sales": 60 }
              ];

            const width = d3.select(`svg#${props.id}`).node().getBoundingClientRect().width; //svg's width
            const height = 200;
            const margin = { top: 5, right: 20, bottom: 5, left: 80 };

            // x and y axes
            const xScale = d3.scaleLinear()
              .domain([0, d3.max(sampleBarChartData, d => d.sales)])
              .range([margin.left, width - margin.right]);
            
            const yScale = d3.scaleBand()
              .domain(sampleBarChartData.map(d => d.product))
              .rangeRound([0, height-margin.top-margin.bottom])
              .padding(0.3);
              
            const yAxis = g => g
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(yScale));

            svg.select(".y-axis").call(yAxis);

            // tooltip
/*             const tooltip = svg
                .select(".plot")
                .append("div")
                .style("position", "absolute")
                .style("padding", "8px")
                .style("background-color", "white")
                .style("border", "1px solid black")
                .style("visibility", "hidden"); */
            
            // bar chart
            const bars = svg.selectAll("rect")
              .data(sampleBarChartData)
              .join("rect")
              .attr("x", margin.left)
              .attr("y", d => yScale(d.product))
              .attr("width", d => xScale(d.sales) - margin.left)
              .attr("height", yScale.bandwidth())
              .attr("fill", "steelblue")
              .on("mouseover", (event, d) => {
   /*              tooltip.style("visibility", "visible")
                  .text(`Product: ${d.product}, Sales: ${d.sales}`)
                  .style("top", event.pageY + "px")
                  .style("left", event.pageX + "px"); */
              })
              .on("mouseout", () => {
                //tooltip.style("visibility", "hidden");
              });
            
        }, 
        [] //can pass a props here, like props.artist
    );

    return (
        <div>
            <svg
                id={props.id}
                ref={ref}
                style={{
                    height: props.height,
                    width: "100%"
                }}
            >
                <g className='plot' />
                <g className='x-axis' />
                <g className='y-axis' />
            </svg>
        </div>
    )
}