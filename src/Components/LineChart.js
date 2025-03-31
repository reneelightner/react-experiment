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
            var x, y
            if (props.xscale === "time") {
                x = d3.scaleTime()
                    .domain(props.xdomain)
                    .range([0 + 10, width - 10]) // Add padding (10px on both sides)
            }

            if (props.yscale === "linear") {
                y = d3.scaleLinear()
                    .range([height, 0])
                    .domain(props.ydomain)
            }

            // x and y axes
            const xAxis = d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%d"))
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
                .x(d => x(d.date))
                .y(d => y(d.value))

            // line
            svg.select(".plot")
                .append("path")
                .datum(props.data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2)
                .attr("d", line)

            // circles
            svg.select(".plot")
                .selectAll("circle")
                .data(props.data)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.date))
                .attr("cy", d => y(d.value))
                .attr("r", 4)
                .attr("fill", "steelblue")
            
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