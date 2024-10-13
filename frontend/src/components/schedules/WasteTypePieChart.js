import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const WasteTypePieChart = ({ data }) => {
    const chartRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 450, height: 450 });

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            setDimensions({
                width: isMobile ? 250 : 450,
                height: isMobile ? 250 : 450
            });
        };

        handleResize(); // Set initial size
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const { width, height } = dimensions;
        const margin = 40;
        const radius = Math.min(width, height) / 2 - margin;

        // Clear previous SVG content
        d3.select(chartRef.current).selectAll("*").remove();

        const svg = d3.select(chartRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Set the dark green color scale
        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.type))
            .range([
                "#004d00", // Dark green
                "#006600", // Green
                "#008000", // Medium green
                "#339933", // Lighter green
                "#66b266", // Light green
            ]);

        // Compute the position of each group on the pie chart
        const pie = d3.pie().value(d => d.value);
        const data_ready = pie(data);

        // Build the pie chart
        svg
            .selectAll('pieces')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(radius))
            .attr('fill', d => color(d.data.type))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.9);

        // Add labels
        svg
            .selectAll('labels')
            .data(data_ready)
            .enter()
            .append('text')
            .text(d => `${d.data.type}`)
            .attr("transform", d => `translate(${d3.arc().innerRadius(0).outerRadius(radius).centroid(d)})`)
            .style("text-anchor", "middle")
            .style("font-size", width < 300 ? 10 : 15)
            .style("fill", "white");

    }, [data, dimensions]);

    return (
        <svg ref={chartRef} width={dimensions.width} height={dimensions.height}></svg>
    );
};

export default WasteTypePieChart;