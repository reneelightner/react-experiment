import React from 'react';
import * as d3 from 'd3';
import { useD3 } from './useD3.js';


export default function GroupedBar(props) {

    const ref = useD3(
        (svg) => {

            const margin = props.margin
            const width = (d3.select(`svg#${props.id}`).node().getBoundingClientRect().width) - margin.right - margin.left
            const height = props.height - margin.top  - margin.bottom

            d3.select(`svg#${props.id} g.plot`)
                .attr("transform", `translate(${margin.left},${margin.top})`)

            // x and y scales
            var x0, x1, y, x, y0, y1
            if (props.orientation === "vertical") {

                x0 = d3.scaleBand()
                    .domain(props.xdomain)
                    .range([0, width])
                    .padding(0.2)

                x1 = d3.scaleBand()
                    .domain(props.groupdomain)
                    .range([0, x0.bandwidth()])
                    .padding(0.05)

                y = d3.scaleLinear()
                    .domain(props.ydomain)
                    .nice()
                    .range([height, 0])

            } else if (props.orientation === "horizontal") {

                x = d3.scaleLinear()
                    .domain(props.xdomain)
                    .nice()
                    .range([0, width])

                y0 = d3.scaleBand()
                    .domain(props.ydomain)
                    .range([height,0])
                    .padding(0.2)

                y1 = d3.scaleBand()
                    .domain(props.groupdomain)
                    .range([y0.bandwidth(), 0])
                    .padding(0.05)
            }

            // x and y axes
            var xAxis, yAxis
            if (props.orientation === "vertical") {

                xAxis = d3.axisBottom(x0)
                    .tickSize(-height)

                yAxis = d3.axisLeft(y)
                    .tickSize(-width)

            } else if (props.orientation === "horizontal") {

                xAxis = d3.axisBottom(x)
                    .tickSize(-height)

                yAxis = d3.axisLeft(y0)
                    .tickSize(-width)

            }
            
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

            const categoryGroups = svg.select(".plot")
                .selectAll(".category-group")
                .data(props.data)
                .enter()
                .append("g")
                .attr("transform", d => {
                    return props.orientation === "vertical" ? `translate(${x0(d[props.groupkey])},0)` : `translate(0,${y0(d[props.groupkey])})`
                })

            const color = d3.scaleOrdinal()
                .domain(props.groupdomain)
                .range(props.groupcolors)
                .unknown("#ccc")

            // draw bars
            if (props.orientation === "vertical") {
            
                categoryGroups.selectAll(".bar")
                    .data(d => 
                        props.groupdomain.map(key => ({
                            key,
                            value: d[key]
                        }))
                    )
                    .enter()
                    .append("rect")
                    .attr("x", d => x1(d.key))
                    .attr("y", d => y(d.value))
                    .attr("width", x1.bandwidth())
                    .attr("fill", d => color(d.key))
                    .attr("height", d => height - y(d.value))

                // add text
                categoryGroups.selectAll(".label")
                    .data(d => 
                        props.groupdomain.map(key => ({
                            key,
                            value: d[key]
                        }))
                    )
                    .enter().append("text")
                    .style("font-size", "10px")
                    .attr("x", d => x1(d.key) + x1.bandwidth() / 2)
                    .attr("y", d => y(d.value) - 5)
                    .attr("text-anchor", "middle")
                    .text(d => d.value)

            } else if (props.orientation === "horizontal") {

                categoryGroups.selectAll(".bar")
                    .data(d => 
                        props.groupdomain.map(key => ({
                            key,
                            value: d[key]
                        }))
                    )
                    .enter()
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", d => y1(d.key))
                    .attr("width", d => x(d.value))
                    .attr("fill", d => color(d.key))
                    .attr("height", y1.bandwidth()) 

                // add text
                categoryGroups.selectAll(".label")
                    .data(d => 
                        props.groupdomain.map(key => ({
                            key,
                            value: d[key]
                        }))
                    )
                    .enter().append("text")
                    .style("font-size", "10px")
                    .attr("x", d => x(d.value)+ 10)
                    .attr("y", d => y1(d.key) + (y1.bandwidth() / 2) + 3)
                    .attr("text-anchor", "middle")
                    .text(d => d.value)
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