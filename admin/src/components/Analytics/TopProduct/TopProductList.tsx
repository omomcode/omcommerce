import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  Box,
} from "@strapi/design-system";

interface TopProductsListProps {
  topProducts: [string, number][];
}

const TopProductsList: React.FC<TopProductsListProps> = ({ topProducts }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (chartRef.current && topProducts) {
      drawChart();
    }
  }, [topProducts]);

  const drawChart = () => {
    const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"];
    const svg = d3.select(chartRef.current);
    const margin = { top: 40, right: 40, bottom: 30, left: 40 }; // Increased top and right margins
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.1)
      .domain(topProducts.map((d) => d[0].toString()));

    const y = d3
      .scaleLinear()
      .rangeRound([height, 0])
      .domain([0, d3.max(topProducts, (d) => d[1] || 0) as number]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle");

    g.append("g").call(d3.axisLeft(y).ticks(5));

    g.selectAll(".bar")
      .data(topProducts)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d: [string, number]) => x(d[0].toString()) || 0)
      .attr("y", (d: [string, number]) => y(d[1] || 0))
      .attr("width", x.bandwidth())
      .attr("height", (d: [string, number]) => height - y(d[1] || 0))
      .attr("fill", (_, i) => colors[i % colors.length]);

    const legend = g
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 100},20)`); // Adjust legend's transform

    legend
      .selectAll("rect")
      .data(colors)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", (d) => d);

    legend
      .selectAll("text")
      .data(topProducts.map((d) => d[0].toString()))
      .enter()
      .append("text")
      .attr("x", 20)
      .attr("y", (d, i) => i * 20 + 12)
      .text((d) => d)
      .style("fill", "white");

    g.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "white")
      .text("Top product");
  };

  return (
    <Box style={{ color: "white" }}>
      <svg ref={chartRef} width={600} height={400}></svg>
    </Box>
  );
};

export default TopProductsList;
