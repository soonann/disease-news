// components/ResponsiveLineChart.js
'use client';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ResponsiveLineChart = ({ data = null }) => {
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Sample data if none provided
    const sampleData = data || [
        { date: '2024-01-01', value: 30 },
        { date: '2024-01-02', value: 45 },
        { date: '2024-01-03', value: 25 },
        { date: '2024-01-04', value: 60 },
        { date: '2024-01-05', value: 40 },
        { date: '2024-01-06', value: 55 },
        { date: '2024-01-07', value: 35 }
    ];

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0) return;

        // Parse dates
        const parsedData = sampleData.map(d => ({
            date: new Date(d.date),
            value: d.value
        }));

        // Clear previous content
        d3.select(containerRef.current).selectAll('*').remove();

        // Set margins
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        // Create SVG
        const svg = d3.select(containerRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(parsedData, d => d.date))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(parsedData, d => d.value)])
            .nice()
            .range([height, 0]);

        // Create line generator
        const line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .ticks(width > 600 ? 10 : 5)
                .tickSizeOuter(0));

        // Add Y axis
        svg.append('g')
            .call(d3.axisLeft(yScale)
                .ticks(height > 300 ? 10 : 5)
                .tickSizeOuter(0));

        // Add the line path
        const path = svg.append('path')
            .datum(parsedData)
            .attr('fill', 'none')
            .attr('stroke', '#3b82f6')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Add dots
        svg.selectAll('circle')
            .data(parsedData)
            .join('circle')
            .attr('cx', d => xScale(d.date))
            .attr('cy', d => yScale(d.value))
            .attr('r', 4)
            .attr('fill', '#3b82f6');

        // Add hover effects
        const tooltip = d3.select(containerRef.current)
            .append('div')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px');

        svg.selectAll('circle')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 6);

                tooltip
                    .style('visibility', 'visible')
                    .html(`Date: ${d.date.toLocaleDateString()}<br/>Value: ${d.value}`)
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 10}px`);
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 4);

                tooltip.style('visibility', 'hidden');
            });

    }, [dimensions, data]);

    return (
        <div>
            <h1 className="font-bold">
                {"News related to Measles in the past month"}
            </h1>
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '300px',
                    position: 'relative'
                }}
            />
        </div>
    );
};

export default ResponsiveLineChart;
