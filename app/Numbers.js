'use client';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function BigNumbersDashboard(props) {
    const containerRef = useRef();
    const [data, setData] = useState({
        metrics: [
            { label: 'PAST MONTH', value: props.bigNumber3 },
            { label: 'PAST WEEK', value: props.bigNumber2 },
            { label: 'TODAY', value: props.bigNumber1 }
        ]
    });

    useEffect(() => {
        // Clear existing content
        d3.select(containerRef.current).selectAll('*').remove();

        // Create container
        const container = d3.select(containerRef.current)
            .style('display', 'flex')
            .style('flex-direction', 'column') // Display items in a row
            .style('gap', '10px')
            .style('justify-content', 'space-between')
            .style('background', 'white')
            .style('padding', '20px')
            .style('width', '100%')
            .style('max-width', '300px')
            .style('height', '100%')
            .style('max-height', '600px');

        // Create sections for each metric and make them look like cards
        const sections = container.selectAll('.metric-section')
            .data(data.metrics)
            .join('div')
            .style('flex', '1')
            .style('display', 'flex')
            .style('flex-direction', 'column')
            .style('align-items', 'center')
            .style('justify-content', 'center')
            .style('background', '#f8f9fa')
            .style('border', '1px solid #ddd')
            .style('border-radius', '8px')
            .style('padding', '20px')
            .style('box-shadow', '0 1px 1px rgba(0, 0, 0, 0.1)')
            .style('height', '100%');

        // Add label
        sections.append('div')
            .style('color', '#666')
            .style('font-size', '14px')
            .text(d => d.label);

        // Add value without animation
        sections.append('div')
            .style('font-size', '36px')
            .style('font-weight', 'bold')
            .style('margin', '5px 0')
            .text(d => d3.format(',')(d.value)); // Format number with commas

    }, []);

    return props.bigNumber1 && props.bigNumber2 && props.bigNumber3 ?
        <div ref={containerRef} style={{ height: '100vh', width: '100%' }} />
        : <div> Loading</div>
};

export default BigNumbersDashboard;

