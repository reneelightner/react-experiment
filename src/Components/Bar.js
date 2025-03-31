import React from 'react';
import * as d3 from 'd3';
import { useD3 } from './useD3.js';


export default function Bar(props) {

    const ref = useD3(
        (svg) => {

            const margin = props.margin
            const width = (d3.select(`svg#${props.id}`).node().getBoundingClientRect().width) - margin.right - margin.left
            const height = props.height - margin.top  - margin.bottom

            d3.select(`svg#${props.id} g.plot`)
                .attr("transform", `translate(${margin.left},${margin.top})`)

            // x and y scales
            var x, y
            if (props.xscale == "linear") {

                x = d3.scaleLinear()
                    .domain(props.xdomain)
                    .range([0, width])

            } else if (props.xscale == "band") {

                x = d3.scaleBand()
                    .domain(props.xdomain)
                    .rangeRound([0, width])
                    .padding(0.2)
            } 

            if (props.yscale == "linear") {

                y = d3.scaleLinear()
                    .domain(props.ydomain)
                    .range([height, 0])

            } else if (props.yscale == "band") {

                y = d3.scaleBand()
                    .domain(props.ydomain)
                    .rangeRound([0, height])
                    .padding(0.2)
            }  

            // x and y axes
            const xAxis = d3.axisBottom(x)
                    .tickSize(-height)

            const yAxis = d3.axisLeft(y)
                    .tickSize(-width)
            
            svg.select(".x-axis")
                .attr("transform", `translate(${margin.left},${height + margin.top})`)
                .call(xAxis)

            svg.select(".y-axis")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .call(yAxis)


            // cleanup
            // hide vertical line for y axis
            d3.selectAll("g.y-axis path").style("display", "none")
            // hide horizontal line for x axis
            d3.selectAll("g.x-axis path").style("display", "none")

            if (props.orientation === "horizontal") {

                // hide ticks for individual y-axis items
                d3.selectAll("g.y-axis g.tick line").style("display", "none")
                // vertical x axis ticks have dash
                svg.selectAll("g.x-axis g.tick line").style("stroke-dasharray", "5 5").style("stroke", "#ccc")

            } else if (props.orientation === "vertical") {

                // hide ticks for individual x-axis items
                d3.selectAll("g.x-axis g.tick line").style("display", "none")
                // horizontal y-axis ticks have dash
                svg.selectAll("g.y-axis g.tick line").style("stroke-dasharray", "5 5").style("stroke", "#ccc")
            }
            

            // bar chart
            if (props.orientation === "horizontal") {

                svg.select(".plot").selectAll("rect")
                    .data(props.data)
                    .join("rect")
                    .attr("x", 0)
                    .attr("y", d => y(d[props.ykey]))
                    .attr("width", d => x(d[props.xkey]))
                    .attr("height", y.bandwidth())
                    .attr("fill", props.color)

            } else if (props.orientation === "vertical") { 

                svg.select(".plot").selectAll("rect")
                    .data(props.data)
                    .join("rect")
                    .attr("x", d => x(d[props.xkey])) 
                    .attr("y", d => y(d[props.ykey]))
                    .attr("width", x.bandwidth())
                    .attr("height", d => height - y(d[props.ykey]))
                    .attr("fill", props.color)
            } 

            // text labels
            if (props.orientation === "horizontal") {

                svg.select(".plot").selectAll(".text")        
                    .data(props.data)
                    .enter()
                    .append("text")
                    .attr("class","label")
                    .attr("x", d => x(d[props.xkey]) + 5)
                    .attr("y", d => y(d[props.ykey]))
                    .attr("dy", "1.5em")
                    .style("font-size", "10px")
                    .text(d => d[props.xkey])

            } else if (props.orientation === "vertical") {

                svg.select(".plot").selectAll(".text")        
                    .data(props.data)
                    .enter()
                    .append("text")
                    .attr("class","label")
                    .attr("x", d => x(d[props.xkey]) + (x.bandwidth()/2))
                    .attr("y", d => y(d[props.ykey]) - 5)
                    .attr("text-anchor", "middle")
                    .style("font-size", "10px")
                    .text(d => d[props.ykey])
            } 
            
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
                <g className='x-axis' />
                <g className='y-axis' />
                <g className='plot' />
            </svg>
        </div>
    )
}