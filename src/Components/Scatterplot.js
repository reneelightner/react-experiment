import React from 'react';
import * as d3 from 'd3';
import { useD3 } from './useD3.js';


export default function Scatterplot(props) {

    const ref = useD3(
        (svg) => {
            // clear previous circles (necessary if updating scatterplot)
            d3.selectAll(`svg#${props.id} circle`).remove()

            const margin = props.margin
            const height = props.height - margin.top - margin.bottom
            const width = (d3.select(`svg#${props.id}`).node().getBoundingClientRect().width) - margin.right - margin.left

            d3.select(`svg#${props.id} g.plot`)
                .attr("transform", `translate(${margin.left},${margin.top})`)

            // x and y axes
            var x, y
            if (props.xscale === "time") {
                x = d3.scaleTime()
                    .rangeRound([margin.right, width])
                    .domain(props.xdomain)
            }

            if (props.yscale === "band") {
                y = d3.scaleBand()
                    .rangeRound([0, height])
                    .domain(props.ydomain)
                    .padding(1) //need otherwise circles are offset 
            }

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

            // hide vertical line for y axis
            d3.selectAll("g.y-axis path").style("display", "none")
            // horizontal y axis ticks have dash
            svg.selectAll("g.y-axis g.tick line").style("stroke-dasharray", "5 5").style("stroke", "#ccc")
            // hide horizontal line for x axis
            d3.selectAll("g.x-axis path").style("display", "none")
            // vertical x axis ticks have dash
            svg.selectAll("g.x-axis g.tick line").style("stroke-dasharray", "5 5").style("stroke", "#ccc")

            // tooltip
            svg
                .select(".plot")
                .append("text")
                .attr("class", `tooltip-${props.id}`)
                .style("pointer-events", "none")
                .style("font-size", "10px")
                .style("font-weight", "bold")
                .style("opacity", 0);

            // scatterplot
            svg.select(".plot")
                .selectAll("dot")
                .data(props.data)
                .enter()
                .append("circle")
                .attr("class", "circle")
                .attr("cy", d => y(d[props.ykey]) )
                .attr("cx", d => x(d[props.xkey]) )
                .attr("i", (d,i) => i )
                .attr("r", 5.5)
                .style("fill", props.color)
                .attr("stroke-width", 1)
                .attr("stroke", "#fff")
                .on("mouseover",function(d) {
                    // will text hover left or right
                    let index = d3.select(this).attr("i"); 
                    let cynum = d3.select(this).attr("cy");
                    let cxnum = d3.select(this).attr("cx");
                    let side;
                    if (index > props.data.length/2) {side = 'left';} else {side = 'right';}
                    // make all circles opague then make mousedover one non-opague
                    d3.selectAll("circle.circle").style("opacity", 0.1);
                    d3.select(this).attr("stroke", "#666");
                    d3.select(this).style("opacity", 1);
                    // show and fill in tooltip
                    d3.select(`text.tooltip-${props.id}`)
                        .text(() => {
                            return props.data[index][props.ttkey];
                        })
                        .attr("dy", () => {return +cynum-7})
                        .attr("dx", () => {if (side == "left") {return (+cxnum + 5)} else {return (+cxnum - 5)} })
                        .attr("text-anchor", () => { if (side == "left") {return "start"} else {return "end"} })
                        .style("opacity", 1);
                })
                .on("mouseout",function(d,i) {
                    d3.selectAll("circle.circle").style("opacity", 1);
                    d3.select(this).attr("stroke", "#fff");
                    d3.select(`text.tooltip-${props.id}`).style("opacity", 0);
                });

        }, 
        [] //can pass a props here, like props.artist
    );

    return(
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