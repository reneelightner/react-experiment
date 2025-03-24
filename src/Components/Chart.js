import React from 'react';
import * as d3 from 'd3';
import { useD3 } from './useD3.js';

export default function Chart(props) {

    const ref = useD3(
        (svg) => {
            d3.selectAll(`svg#${props.id} circle`).remove();

            const height = props.height;
            const width = 893;
            const margin = {top: 1, right: 15, bottom: 20, left: 110};

            const parseTime = d3.timeParse("%Y");
            props.data.map(d => { return {'YEAR' : parseTime(d.YEAR)} });

            const x = d3.scaleTime()
                .rangeRound([margin.right, width-margin.right-margin.left])
                .domain(d3.extent(props.data, function(d) { return parseTime(d.YEAR); }));

            const y = d3.scaleBand()
                .domain(props.awards)
                .rangeRound([0, height-margin.top-margin.bottom])
                .padding(1);

            const xAxis = g => g
                .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
                .call(d3.axisBottom(x));

            const yAxis = g => g
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .call(d3.axisLeft(y));

            svg.select(".x-axis").call(xAxis);
            svg.select(".y-axis").call(yAxis);

            svg
                .select(".plot")
                .append("text")
                .attr("class", `tooltip-artist-${props.id}`)
                .style("pointer-events", "none")
                .style("font-size", "10px")
                .style("font-weight", "bold")
                .style("opacity", 0);

            svg
                .select(".plot")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .selectAll("dot")
                .data(props.data)
                .enter()
                .append("circle")
                .attr("class", (d)=>{ if(d.ARTIST !== ""){return "circle"}else{return "remove-circle"} })
                .attr("cy", d => y(d.AWARD) )
                .attr("cx", d => x(parseTime(d.YEAR)) )
                .attr("i", (d,i) => i )
                .attr("artist", d => d['ART-1'].split(" ").join(""))
                .attr("artist2", d => {if(d['ART-2']) {return d['ART-2'].split(" ").join("")}})
                .attr("artist3", d => {if(d['ART-3']) {return d['ART-3'].split(" ").join("")}})
                .attr("artist4", d => {if(d['ART-4']) {return d['ART-4'].split(" ").join("")}})
                .attr("artist5", d => {if(d['ART-5']) {return d['ART-5'].split(" ").join("")}})
                .attr("artist6", d => {if(d['ART-6']) {return d['ART-6'].split(" ").join("")}})
                .attr("r", 5.5)
                .style("fill", "#666")
                .attr("stroke-width", 2)
                .attr("stroke", "#fff")
                .on("mouseover",function(d) {
                    let index = d3.select(this).attr("i"); 
                    let cynum = d3.select(this).attr("cy");
                    let cxnum = d3.select(this).attr("cx");
                    let side;
                    if (index > props.data.length/2) {side = 'left';} else {side = 'right';}
                    d3.select(this).attr("stroke", "#666");
                    d3.select(this).style("opacity", 1);
                    d3.select(`text.tooltip-artist-${props.id}`)
                        .text(() => {
                            let text = props.data[index]['ARTIST'];
                            if (props.data[index]['WINNER']) {text = text+', '+ props.data[index]['WINNER'];}
                            return text;
                        })
                        .attr("dy", () => {return +cynum-7})
                        .attr("dx", () => {if (side == "left") {return (+cxnum + 5)} else {return (+cxnum - 5)} })
                        .attr("text-anchor", () => { if (side == "left") {return "start"} else {return "end"} })
                        .style("opacity", 1);
                })
                .on("mouseout",function(d,i) {
                    if (props.artist != 'none') {d3.select(this).style("opacity", 0.1);}
                    d3.selectAll("circle.circle.selected-artist").style("opacity", 1);
                    d3.select(this).attr("stroke", "#fff");
                    d3.select(`text.tooltip-artist-${props.id}`).style("opacity", 0);
                });

            d3.selectAll("circle.remove-circle").remove();

            let artistSelected = props.artist.split(" ").join("");
            if (props.artist != 'none') { d3.selectAll("circle.circle").style("opacity", 0.1) }
            d3.selectAll("circle.circle[artist='"+artistSelected+"']").classed('selected-artist', true).style("opacity", 1);
            d3.selectAll("circle.circle[artist2='"+artistSelected+"']").classed('selected-artist', true).style("opacity", 1);
            d3.selectAll("circle.circle[artist3='"+artistSelected+"']").classed('selected-artist', true).style("opacity", 1);
            d3.selectAll("circle.circle[artist4='"+artistSelected+"']").classed('selected-artist', true).style("opacity", 1);
            d3.selectAll("circle.circle[artist5='"+artistSelected+"']").classed('selected-artist', true).style("opacity", 1);
            d3.selectAll("circle.circle[artist6='"+artistSelected+"']").classed('selected-artist', true).style("opacity", 1);
        }, 
        [props.artist]
    );


    return(
        <div class="mt-5">
            <svg
                id={props.id}
                ref={ref}
                style={{
                    height: props.height,
                    width: 893
                }}
            >
                <g className='plot' />
                <g className='x-axis' />
                <g className='y-axis' />
            </svg>
        </div>
    )

}