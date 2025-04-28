import React from 'react';
import * as d3 from 'd3';
import { useD3 } from './useD3.js';
import { useContainerSize } from './Containersize.js'; //hook to find window width

export default function MultipleLine(props) {

    const isFirstRender = React.useRef(true)

    const [containerRef, size] = useContainerSize()

    const d3ref = useD3(
        (svg) => {
            
            const margin = props.margin
            const height = props.height - margin.top - margin.bottom
            const width = size.width - margin.right - margin.left //use size.width from useContainerSize hook
            console.log(size.width)

            if (!width || width <= 0) return; // guard against weird first renders

            d3.select(`svg#${props.id} g.plot`)
                .attr("transform", `translate(${margin.left},${margin.top})`)

            // x and y scales
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
            
            svg.select(".x-axis")
                .attr("transform", `translate(${margin.left},${height + margin.top})`)
                .call(xAxis)

            const yAxis = d3.axisLeft(y)
                .tickSize(-width)

            // y-axis -- tracking whether it's the first render and only applying the transition on updates
            const yAxisGroup = svg.select(".y-axis")
                .attr("transform", `translate(${margin.left},${margin.top})`)
            
            if (isFirstRender.current) { //first render, just call y axis
                yAxisGroup
                    .call(yAxis)
                isFirstRender.current = false
            } else {
                yAxisGroup
                    .transition()
                    .duration(800)
                    .call(yAxis)
            }

            // hide vertical line for y axis
            d3.selectAll("g.y-axis path").style("display", "none")
            // horizontal y axis ticks have dash
            svg.selectAll("g.y-axis g.tick line").style("stroke-dasharray", "5 5").style("stroke", "#ccc")
            // hide horizontal line for x axis
            d3.selectAll("g.x-axis path").style("display", "none")
            // vertical x axis ticks have dash
            svg.selectAll("g.x-axis g.tick line").style("stroke-dasharray", "5 5").style("stroke", "#ccc")

            // using D3's data join pattern (.selectAll().data().join()) for lines, circles so that they can animate

            // Clear old lines (if ykeys and data have changed)
            svg.select(".plot")
                .selectAll("path.line") // selecting all the existing path.line elements inside .plot
                .filter(function() { // in this callback, return an array of the paths that you want to delete
                    return !props.ykeys.includes(d3.select(this).attr("ykey"))
                })
                .remove() // delete them

            // lines
            svg.select(".plot")
                .selectAll("path.line")
                .data(props.ykeys) //one line for each props.ykeys
                .join("path")
                .attr("class", (d) => `line line-${d}`)
                .attr("fill", "none")
                .attr("stroke", (d, i) => props.colors[i])
                .attr("stroke-width", 2)
                .attr("ykey", (ykey) => ykey)
                .transition()
                .duration(800)
                .attr("d", (ykey) => {
                    const line = d3.line()
                        .x(d => x(d[props.xkey]))
                        .y(d => y(d[ykey]));
                    return line(props.data);
                })

            // Clear old circles (if ykeys and data have changed)
            svg.select(".plot")
                .selectAll("circle") //selecting all the existing circle elements inside .plot
                .filter(function() { // in this callback, return an array of the circles that you want to delete 
                    return !props.ykeys.includes(d3.select(this).attr("ykey"))
                })
                .remove() //remove the circles from that returned array

            // make each circle
            props.ykeys.forEach((ykey, i) => {

                // circles
                svg.select(".plot")
                    .selectAll(`circle.circle-${ykey}`)
                    .data(props.data)
                    .join(
                        (enter) => {
                            // to prevent fly-in from corner on enter, set the circles including their cx and cy before the transition
                            // enter represents new elements that are being added to the DOM
                            return enter
                                .append("circle")
                                .attr("class", `circle-${ykey}`)
                                .attr("i", (d, i) => i)
                                .attr("ykey", ykey)
                                .attr("r", 5)
                                .attr("fill", props.colors[i])
                                .attr("cx", d => x(d[props.xkey]))
                                .attr("cy", d => y(d[ykey]))
                        },
                        (update) => {
                            // update represents existing elements that are already in the DOM and are now being re-bound to new data
                            return update
                                .on("mouseover", function () {
                                    let index = d3.select(this).attr("i")
                                    let cynum = d3.select(this).attr("cy")
                                    let cxnum = d3.select(this).attr("cx")
                                    let side = index > props.data.length / 2 ? 'left' : 'right'
                                    d3.select(`text.tooltip-${props.id}`)
                                        .text(() => {
                                            const formatDay = d3.timeFormat("%b %e")
                                            return formatDay(props.data[index][props.xkey]) + ": " + props.data[index][ykey]
                                        })
                                        .attr("dy", +cynum - 7)
                                        .attr("dx", side === "left" ? +cxnum + 5 : +cxnum - 5)
                                        .attr("text-anchor", side === "left" ? "start" : "end")
                                        .style("opacity", 1)
                                })
                                .on("mouseout", function () {
                                    d3.select(`text.tooltip-${props.id}`).style("opacity", 0)
                                })
                                .transition()
                                .duration(800)
                                .attr("cx", d => x(d[props.xkey]))
                                .attr("cy", d => y(d[ykey]))
                        }
                    )
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
        [props.data, props.ydomain, props.ykey, size.width] //will update when these change, size.width from useContainerSize hook
    );

    return (
        <div ref={containerRef} style={{ width: '100%' }}>
            <svg
                id={props.id}
                ref={d3ref}
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