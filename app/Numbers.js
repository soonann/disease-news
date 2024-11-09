// components/BigNumbersDashboard.js
'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BigNumbersDashboard = ({
    newsMonthCount,
    newsWeekCount,
    newsDayCount,
}) => {
    const containerRef = useRef();

    useEffect(() => {
        const data = {
            title: 'Measles related News',
            metrics: [
                { label: 'PAST MONTH', value: newsMonthCount },
                { label: 'PAST WEEK', value: newsWeekCount },
                { label: 'TODAY', value: newsDayCount, }
            ]
        };

        // Clear existing content
        d3.select(containerRef.current).selectAll('*').remove();

        // Create container
        const container = d3.select(containerRef.current)
            .style('background', 'white')
            .style('padding', '20px')
            .style('width', '100%');

        // Add title
        container.append('div')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .style('margin-bottom', '20px')
            .text(data.title);

        // Create sections for each metric
        const sections = container.selectAll('.metric-section')
            .data(data.metrics)
            .join('div')
            .style('margin-bottom', '20px');

        // Add label
        sections.append('div')
            .style('color', '#666')
            .style('font-size', '14px')
            .text(d => d.label);

        // Add value with animation
        sections.append('div')
            .style('font-size', '36px')
            .style('font-weight', 'bold')
            .style('margin', '5px 0')
            .each(function(d) {
                const node = d3.select(this);
                const format = d3.format(',');

                d3.transition()
                    .duration(1000)
                    .tween(null, () => {
                        const interpolator = d3.interpolateNumber(0, d.value);
                        return (t) => node.text(format(Math.round(interpolator(t))));
                    });
            });

        // Add change indicator if present
        sections.filter(d => d.change)
            .append('div')
            .style('color', d => d.changeColor)
            .style('font-size', '20px')
            .text(d => d.change);

    }, []);
    // useEffect(() => {
    //     // Sample data for the metrics
    //     const metrics = [
    //         {
    //             id: 1,
    //             label: 'Total News Count (Month)',
    //             value: newsMonthCount,
    //             format: 'number',
    //         },
    //         {
    //             id: 2,
    //             label: 'Total News Count (Week)',
    //             value: newsWeekCount,
    //             format: 'number',
    //         },
    //         {
    //             id: 3,
    //             label: 'Total News Count (Day)',
    //             value: newsDayCount,
    //             format: 'number',
    //         },
    //     ];
    //     // Clear existing content
    //     d3.select(containerRef.current).selectAll('*').remove();

    //     // Create container
    //     const container = d3.select(containerRef.current)
    //         .style('display', 'grid')
    //         .style('grid-template-columns', 'repeat(auto-fit, minmax(200px, 1fr))');

    //     // Create cards for each metric
    //     const cards = container.selectAll('.metric-card')
    //         .data(metrics)
    //         .join('div')
    //         .attr('class', 'metric-card');

    //     // Add label
    //     cards.append('div')
    //         .text(d => d.label);

    //     // Add value with animation
    //     cards.append('div')
    //         .each(function(d) {
    //             const node = d3.select(this);
    //             const format = d3.format(',');

    //             d3.transition()
    //                 .duration(1000)
    //                 .tween(null, () => {
    //                     const interpolator = d3.interpolateNumber(0, d.value);
    //                     return (t) => node.text(format(Math.round(interpolator(t))));
    //                 });
    //         });
    // }, []);

    return <div ref={containerRef} />;
};

export default BigNumbersDashboard;
