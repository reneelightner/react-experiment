import React from 'react';
import * as d3 from 'd3';
import { useD3 } from './useD3.js';


export default function Line(props) {

    const ref = useD3(
        (svg) => {
            
            const margin = props.margin
            const height = props.height - margin.top - margin.bottom
            const width = (d3.select(`svg#${props.id}`).node().getBoundingClientRect().width) - margin.right - margin.left
            
            d3.select(`svg#${props.id} g.plot`)
                .attr("transform", `translate(${margin.left},${margin.top})`)

            // x and y axes
            const x = d3.scaleTime()
                .domain(props.xdomain)
                .range([0 + 10, width - 10]) // Add padding (10px on both sides)

            const y = d3.scaleLinear()
                .range([height, 0])
                .domain(props.ydomain)

            // x and y axes
            const xAxis = d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%b %e"))
                .tickSize(-height)

            const yAxis = d3.axisLeft(y)
                .tickSize(-width)
            
            svg.select(".x-axis")
                .attr("transform", `translate(${margin.left},${height + margin.top})`)
                .call(xAxis)

            svg.select(".y-axis")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .call(yAxis)

            // hide vertical line for y axis
            d3.selectAll("g.y-axis path").style("display", "none")
            // horizontal y axis ticks have dash
            svg.selectAll("g.y-axis g.tick line").style("stroke-dasharray", "5 5").style("stroke", "#ccc")
            // hide horizontal line for x axis
            d3.selectAll("g.x-axis path").style("display", "none")
            // vertical x axis ticks have dash
            svg.selectAll("g.x-axis g.tick line").style("stroke-dasharray", "5 5").style("stroke", "#ccc")

            const line = d3.line()
                .x(d => x(d[props.xkey]))
                .y(d => y(d[props.ykey]))

            // remove existing paths and text tooltips before drawing new ones
            svg.select(".plot").selectAll(`path.path-${props.id}`).remove()
            svg.select(".plot").selectAll(`text.tooltip-${props.id}`).remove()

            // line
            svg.select(".plot")
                .append("path")
                .attr("class", `path-${props.id}`)
                .datum(props.data)
                .attr("fill", "none")
                .attr("stroke", props.color)
                .attr("stroke-width", 2)
                .attr("d", line)

            // circles
            svg.select(".plot")
                .selectAll("circle")
                .data(props.data)
                .enter()
                .append("circle")
                .attr("class", "circle")
                .attr("cx", d => x(d[props.xkey]))
                .attr("cy", d => y(d[props.ykey]))
                .attr("i", (d,i) => i )
                .attr("r", 5)
                .attr("fill", props.color)
                .on("mouseover",function(d) {
                    // will text hover left or right
                    let index = d3.select(this).attr("i"); 
                    let cynum = d3.select(this).attr("cy");
                    let cxnum = d3.select(this).attr("cx");
                    let side;
                    if (index > props.data.length/2) {side = 'left';} else {side = 'right';}
                    // show and fill in tooltip
                    d3.select(`text.tooltip-${props.id}`)
                        .text(() => {
                            const formatDay = d3.timeFormat("%b %e");
                            return formatDay(props.data[index][props.xkey])+": "+props.data[index][props.ykey];
                        })
                        .attr("dy", () => {return +cynum-7})
                        .attr("dx", () => {if (side == "left") {return (+cxnum + 5)} else {return (+cxnum - 5)} })
                        .attr("text-anchor", () => { if (side == "left") {return "start"} else {return "end"} })
                        .style("opacity", 1);
                })
                .on("mouseout",function(d,i) {
                    d3.select(`text.tooltip-${props.id}`).style("opacity", 0);
                })

            // tooltip
            svg
                .select(".plot")
                .append("text")
                .attr("class", `tooltip-${props.id}`)
                .style("pointer-events", "none")
                .style("font-size", "10px")
                .style("font-weight", "bold")
                .style("opacity", 0) 
            
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