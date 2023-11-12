import * as d3 from 'd3';

interface SaleData {
  id: number;
  order_id: string;
  amount: number;
  currency: string;
  items: {
    SKU: string;
    name: string;
    quantity: string;
    description: string;
    unit_amount: {
      value: string;
      currency_code: string;
    };
  }[];
  // Add other fields as needed
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Sample data
const data: SaleData[] = [
  // ... Your data goes here ...
];

// Function to create a daily sales chart
export const createDailySalesChart = (data: SaleData[], container: HTMLDivElement | null) => {
  // Parse dates and group data by day
  const dateFormat = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
  data.forEach((d) => {
    // @ts-ignore
    d.createdAt = dateFormat(d.createdAt);
  });
  // @ts-ignore
  const dataByDay = d3.group(data, (d) => d3.utcDay(d.createdAt));

  // Calculate daily sales totals
  const dailySales = Array.from(dataByDay, ([date, salesData]) => ({
    date,
    totalSales: d3.sum(salesData, (d) => d.amount),
  }));

  // Set up SVG dimensions
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };

  // Create an SVG element
  const svg = d3.select(container).append('svg')
    .attr('width', width)
    .attr('height', height);

  // Create scales for x and y axes
  const xScale = d3.scaleUtc()
    .domain(d3.extent(dailySales, (d) => d.date) as [Date, Date])
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dailySales, (d) => d.totalSales) as number])
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
// Create a line generator
  const line = d3.line< { date: Date, totalSales: number }>()
    .x((d) => xScale(d.date) as number)
    .y((d) => yScale(d.totalSales) as number);

  // Draw the line chart
  svg.append('path')
    .datum(dailySales)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue') // Change the color here
    .attr('stroke-width', 1.5)
    .attr('d', line);

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', margin.top)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('fill', 'white')
    .text('Daily Sales Chart');

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height)
    .attr('text-anchor', 'middle')
    .style('fill', 'white')
    .text('Date');

// Y-axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .style('fill', 'white')
    .text('Total Sales');

  svg.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${height - margin.bottom})`)

  svg.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(${margin.left},0)`)

};
