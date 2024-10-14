import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import Breadcrumb from "../../components/utility/Breadcrumbs";
import SchedulePredictionChart from "../../components/charts/SchedulePredictorChart";
import {MdSensors} from "react-icons/md";
import {AiFillSchedule, AiOutlineSchedule} from "react-icons/ai";
import SchedulesByHourChart from "../../components/charts/SchedulesByHourChart";
import CollectionTruckRadialChart from "../../components/charts/CollectionTruckRadialChart";
import {PiTruckFill} from "react-icons/pi";

const breadcrumbItems = [
    { name: 'Reports', href: '/reports/home' },
];

export default function Reports() {
    const [collectionData, setCollectionData] = useState([]);
    const [binData, setBinData] = useState([]);
    const [filter, setFilter] = useState('week'); // Default filter is week

    useEffect(() => {
        // Fetch schedule data based on filter
        fetch(`http://localhost:5555/newSchedule/charts?filterBy=${filter}`)
            .then(response => response.json())
            .then(collectionData => setCollectionData(collectionData))
            .catch(error => console.error('Error fetching data:', error));
    }, [filter]);

    useEffect(() => {
        // Fetch bin data based on filter
        fetch(`http://localhost:5555/device/charts?filterBy=${filter}`)
            .then(response => response.json())
            .then(binData => setBinData(binData))
            .catch(error => console.error('Error fetching data:', error));
    }, [filter]);

    useEffect(() => {
        if (collectionData.length > 0) {
            // Clear the SVG before drawing a new chart
            d3.select('#chart1').selectAll('*').remove();

            // Set up dimensions for both charts
            const containerWidth1 = document.getElementById('chart1').clientWidth;
            const margin = { top: 20, right: 30, bottom: 50, left: 50 };
            const width1 = containerWidth1 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            // Calculate an appropriate width for each bar
            const barWidth = Math.max(20, width1 / collectionData.length); // Ensures minimum bar width
            const totalWidth = Math.max(width1, collectionData.length * barWidth);

            // Append SVG for both charts
            const svg1 = d3.select('#chart1')
                .append('svg')
                .attr('width', totalWidth + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Set up scales
            const x = d3.scaleBand()
                .domain(collectionData.map(d => d._id)) // Use location as the domain
                .range([0, totalWidth])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, d3.max(collectionData, d => d.count)])
                .nice()
                .range([height, 0]);

            // Draw gridlines (before bars so bars are drawn on top)
            const makeGridlines = svg => {
                svg.append('g')
                    .attr('class', 'grid')
                    .call(d3.axisLeft(y).tickSize(-totalWidth).tickFormat(''))
                    .selectAll('line')
                    .style('stroke-dasharray', '3, 3')  // Dashed gridlines
                    .style('stroke', 'silver') // Light color for the grid
                    .style('stroke-width', '1px');

                // Remove the solid axis line to make all lines dashed
                svg.selectAll('.domain').remove();
            };

            // Apply to both SVGs
            makeGridlines(svg1);

            // Add bars to both charts
            [svg1].forEach((svg, index) => {
                svg.selectAll('.bar')
                    .data(collectionData)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('x', d => x(d._id))
                    .attr('y', d => y(d.count))
                    .attr('width', x.bandwidth())
                    .attr('height', d => height - y(d.count))
                    .attr('fill', '#69b3a2')
                    .on('mouseover', function (event, d) {
                        d3.select(this).attr('fill', '#4caf50'); // Highlight bar on hover

                        // Show tooltip
                        tooltip.style('opacity', 1)
                            .html(`Location: ${d._id}<br>Count: ${d.count}`)
                            .style('left', `${event.pageX + 10}px`)
                            .style('top', `${event.pageY - 30}px`);
                    })
                    .on('mouseout', function () {
                        d3.select(this).attr('fill', '#69b3a2'); // Reset bar color

                        // Hide tooltip
                        tooltip.style('opacity', 0);
                    });
            });

            const addXaxis = svg => {
                svg.append('g')
                    .attr('class', 'x-axis')
                    .attr('transform', `translate(0,${height})`)
                    .call(d3.axisBottom(x).tickSizeOuter(0))
                    .selectAll('text') // Rotate text to avoid overlap
                    .attr('transform', 'rotate(-45)')
                    .style('text-anchor', 'end')
                    .style('font-weight', 'bold')
                    .style('font-size', 12);

                svg.append('text')
                    .attr('text-anchor', 'end')
                    .attr('x', totalWidth / 2)
                    .attr('y', height + margin.bottom + 5) // Adjust the position
                    .style('font-weight', 'bold')
                    .text('');
            };

            //add x-axis to both graphs
            addXaxis(svg1);

            const addYaxis = svg => {
                svg.append('g')
                    .attr('class', 'y-axis')
                    .call(d3.axisLeft(y))
                    .style('font-weight', 'semibold');

                svg.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', -margin.left + 15 ) // Adjust the position
                    .attr('x', -height / 2)
                    .style('font-weight', 'bold')
                    .text('Schedules');
            };

            //add y-axis to both graphs
            addYaxis(svg1);

            // Tooltip setup
            const tooltip = d3.select('#chart1') // Tooltip for both charts
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0)
                .style('position', 'absolute')
                .style('background-color', 'lime')
                .style('border', '1px solid #ccc')
                .style('padding', '8px')
                .style('border-radius', '8px')
                .style('pointer-events', 'none');
        }
    }, [collectionData]);

    useEffect(() => {
        if (binData.length > 0) {
            // Clear the SVG before drawing a new chart
            d3.select('#chart2').selectAll('*').remove(); // For the second chart

            // Set up dimensions for both charts
            const containerWidth2 = document.getElementById('chart2').clientWidth;
            const margin = { top: 20, right: 30, bottom: 50, left: 50 };
            const width2 = containerWidth2 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            // Calculate an appropriate width for each bar
            const barWidth = Math.max(20, width2 / binData.length); // Ensures minimum bar width
            const totalWidth = Math.max(width2, binData.length * barWidth);

            // Append SVG for both charts
            const svg2 = d3.select('#chart2')
                .append('svg')
                .attr('width', totalWidth + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Set up scales
            const x = d3.scaleBand()
                .domain(binData.map(d => d._id)) // Use location as the domain
                .range([0, totalWidth])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, d3.max(binData, d => d.count)])
                .nice()
                .range([height, 0]);

            // Draw gridlines (before bars so bars are drawn on top)
            const makeGridlines = svg => {
                svg.append('g')
                    .attr('class', 'grid')
                    .call(d3.axisLeft(y).tickSize(-totalWidth).tickFormat(''))
                    .selectAll('line')
                    .style('stroke-dasharray', '3, 3')  // Dashed gridlines
                    .style('stroke', 'silver') // Light color for the grid
                    .style('stroke-width', '1px');

                // Remove the solid axis line to make all lines dashed
                svg.selectAll('.domain').remove();
            };

            // Apply to both SVGs
            makeGridlines(svg2);

            // Add bars to both charts
            [svg2].forEach((svg, index) => {
                svg.selectAll('.bar')
                    .data(binData)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('x', d => x(d._id))
                    .attr('y', d => y(d.count))
                    .attr('width', x.bandwidth())
                    .attr('height', d => height - y(d.count))
                    .attr('fill', '#69b3a2')
                    .on('mouseover', function (event, d) {
                        d3.select(this).attr('fill', '#4caf50'); // Highlight bar on hover

                        // Show tooltip
                        tooltip.style('opacity', 1)
                            .html(`Location: ${d._id}<br>Count: ${d.count}`)
                            .style('left', `${event.pageX + 10}px`)
                            .style('top', `${event.pageY - 30}px`);
                    })
                    .on('mouseout', function () {
                        d3.select(this).attr('fill', '#69b3a2'); // Reset bar color

                        // Hide tooltip
                        tooltip.style('opacity', 0);
                    });
            });

            const addXaxis = svg => {
                svg.append('g')
                    .attr('class', 'x-axis')
                    .attr('transform', `translate(0,${height})`)
                    .call(d3.axisBottom(x).tickSizeOuter(0))
                    .selectAll('text') // Rotate text to avoid overlap
                    .attr('transform', 'rotate(-45)')
                    .style('text-anchor', 'end')
                    .style('font-weight', 'bold')
                    .style('font-size', 12);
            };

            //add x-axis to both graphs
            addXaxis(svg2);

            const addYaxis = svg => {
                svg.append('g')
                    .attr('class', 'y-axis')
                    .call(d3.axisLeft(y))
                    .style('font-weight', 'semibold');

                svg.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', -margin.left + 15 ) // Adjust the position
                    .attr('x', -height / 2)
                    .style('font-weight', 'bold')
                    .text('Tracking Devices');
            };

            //add y-axis to both graphs
            addYaxis(svg2);

            // Tooltip setup
            const tooltip = d3.select('#chart2') // Tooltip for both charts
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0)
                .style('position', 'absolute')
                .style('background-color', 'lime')
                .style('border', '1px solid #ccc')
                .style('padding', '8px')
                .style('border-radius', '8px')
                .style('pointer-events', 'none');
        }
    }, [binData]);


    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <div className="sticky top-0 z-10">
                <Navbar />
            </div>

            {/* Sidebar and Main Content */}
            <div className="flex flex-1">
                {/* Sidebar hidden on smaller screens */}
                <div className="hidden sm:block w-1/6 sticky top-0 self-start">
                    <SideBar />
                </div>

                <div className="flex-1 w-full sm:w-5/6 p-4 flex flex-col">
                    {/*<ReportsNavigation/>*/}
                    <div className="flex flex-row items-center space-x-2 mb-4">
                        <BackButton/>
                        <Breadcrumb items={breadcrumbItems}/>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex-1">
                        <div className="mb-0.5">
                            <h4 className="font-bold text-left text-xl ">Graph Visualization</h4>
                        </div>
                        <div className="flex-row">
                            <div
                                className="flex space-x-2 mb-4 lg:mb-6 px-4 md:px-8 lg:px-16 justify-center"> {/* Responsive padding */}
                                <button
                                    className={`px-4 py-2 rounded-lg ${filter === 'week' ? 'bg-gradient-to-tr from-sky-700 via-blue-500 to-sky-300 text-white font-bold' : 'bg-blue-200 text-black font-semibold'}`}
                                    onClick={() => setFilter('week')}
                                >
                                    Week
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-lg ${filter === 'month' ? 'bg-gradient-to-tr from-sky-700 via-blue-500 to-sky-300 text-white font-bold' : 'bg-blue-200 text-black font-semibold'}`}
                                    onClick={() => setFilter('month')}
                                >
                                    Month
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-lg ${filter === 'year' ? 'bg-gradient-to-tr from-sky-700 via-blue-500 to-sky-300 text-white font-bold' : 'bg-blue-200 text-black font-semibold'}`}
                                    onClick={() => setFilter('year')}
                                >
                                    Year
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Charts Container */}
                    <div
                        className="flex flex-col sm:flex-row w-full items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        {/* Chart 1 */}
                        <div className="w-full sm:w-1/2  border p-4 shadow-lg rounded-xl">
                            <div className="flex justify-center justify-items-center">
                                <h4 className="text-md font-bold mr-2 lg:mr-2 sm:mr-1.5">Tracking Devices Installed by
                                    Location</h4>
                                <MdSensors size={30} className="blink-icon"/>
                            </div>
                            <div id="chart2"></div>
                        </div>

                        {/* Chart 2 */}
                        <div className="w-full sm:w-1/2 border p-4 shadow-lg rounded-xl">
                            <div className="flex justify-center ">
                                <h4 className="text-md font-bold mr-2 lg:mr-2 sm:mr-1.5 md:mr-2">Number of Schedules by
                                    Location</h4>
                                <AiOutlineSchedule size={30}/>
                            </div>
                            <div id="chart1"></div>
                        </div>
                    </div>
                    <div
                        className="flex flex-col sm:flex-row w-full items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="w-full">
                            <CollectionTruckRadialChart/>
                        </div>
                        <div className="w-full">
                            <SchedulesByHourChart/>
                        </div>
                    </div>
                    <div>
                        <SchedulePredictionChart/>
                    </div>
                </div>
            </div>
        </div>
    );
}
