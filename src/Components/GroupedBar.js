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
            var x0, x1, y
            x0 = d3.scaleBand()
                    .domain(props.data.map(d => d.category))
                    .range([0, width])
                    .padding(0.2)

            x1 = d3.scaleBand()
                    .domain(["Men", "Women"])
                    .range([0, x0.bandwidth()])
                    .padding(0.05)

            y = d3.scaleLinear()
                    .domain([0, d3.max(props.data, d => Math.max(d.Men, d.Women))])
                    .nice()
                    .range([height, 0])

            // x and y axes
            const xAxis = d3.axisBottom(x0)
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

            // hide ticks for individual x-axis items
            d3.selectAll("g.x-axis g.tick line").style("display", "none")
            // horizontal y-axis ticks have dash
            svg.selectAll("g.y-axis g.tick line").style("stroke-dasharray", "5 5").style("stroke", "#ccc")

            const categoryGroups = svg.select(".plot")
                .selectAll(".category-group")
                .data(props.data)
                .enter().append("g")
                .attr("class", "category-group")
                .attr("transform", d => `translate(${x0(d.category)},0)`)

            categoryGroups.selectAll(".bar")
                .data(d => [
                    { key: "Men", value: d.Men },
                    { key: "Women", value: d.Women }
                ])
                .enter().append("rect")
                .attr("x", d => x1(d.key))
                .attr("y", d => y(d.value))
                .attr("width", x1.bandwidth())
                .attr("height", d => height - y(d.value))

            categoryGroups.selectAll(".label")
                .data(d => [
                    { key: "Men", value: d.Men },
                    { key: "Women", value: d.Women }
                ])
                .enter().append("text")
                .attr("class", "label")
                .attr("x", d => x1(d.key) + x1.bandwidth() / 2)
                .attr("y", d => y(d.value) - 5)
                .attr("text-anchor", "middle")
                .text(d => d.value);
            
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