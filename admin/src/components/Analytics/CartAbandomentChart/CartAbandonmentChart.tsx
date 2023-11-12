import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  Layout,
  ContentLayout,
  Box,
  Typography,
} from "@strapi/design-system";

interface CartAbandonmentChartProps {
  orders: any[]; // Pass the orders data
}

const CartAbandonmentChart: React.FC<CartAbandonmentChartProps> = ({ orders }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      createChart();
    }
  }, [orders]);

  const createChart = () => {
    // Clear any existing content inside the SVG container
    d3.select(chartRef.current).selectAll('*').remove();

    // Parse dates and group data by day
    const dateFormat = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
    const formattedOrders = orders.map(order => ({ ...order, createdAt: dateFormat(order.createdAt) }));
    const dataByDay = d3.group(formattedOrders, order => d3.utcDay(order.createdAt));

    // Calculate daily abandoned cart totals
    const dailyAbandonedCarts = Array.from(dataByDay, ([date, cartData]) => ({
      date,
      totalAbandonedCarts: cartData.filter(order => order.status === 'CREATED').length,
    }));

    // Set up SVG dimensions
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    // Create an SVG element
    const svg = d3.select(chartRef.current).append('svg')
      .attr('width', width)
      .attr('height', height);

    // Create scales for x and y axes
    const xScale = d3.scaleUtc()
      .domain(d3.extent(dailyAbandonedCarts, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dailyAbandonedCarts, d => d.totalAbandonedCarts) as number])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create x and y axes
    const xAxis = (g: d3.Selection<SVGGElement, unknown, HTMLElement, any>) => g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom<Date>(xScale).ticks(d3.utcDay)); // Make sure Date matches your xScale type

    const yAxis = (g: d3.Selection<SVGGElement, unknown, HTMLElement, any>) => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft<number>(yScale)); // Make sure number matches your yScale type

    // Add the x and y axes to the SVG
    // @ts-ignore
    svg.append('g').call(xAxis);
    // @ts-ignore
    svg.append('g').call(yAxis);

    // Create a line generator
    const line = d3.line<{ date: Date, totalAbandonedCarts: number }>()
      .x(d => xScale(d.date) as number)
      .y(d => yScale(d.totalAbandonedCarts) as number);

    // Draw the line chart
    svg.append('path')
      .datum(dailyAbandonedCarts)
      .attr('fill', 'none')
      .attr('stroke', 'red') // Change the color here
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // Chart title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('fill', 'white')
      .text('Daily Cart Abandonment Chart');

    // X-axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .text('Date');

    // Y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -16)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .text('Total Abandoned Carts');

    // Add gridlines (optional)
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height - margin.bottom})`);

    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`);
  };

  return (
    <Box style={{ color: "white" }}>
      <svg ref={chartRef}></svg>
    </Box>
  );
};

export default CartAbandonmentChart;
