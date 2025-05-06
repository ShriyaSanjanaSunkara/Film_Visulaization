d3.csv("data/a1-film.csv").then(data => {
  data.forEach(d => {
    d.Year = +d.Year;
    d.Popularity = +d.Popularity;
  });

  const yearMap = d3.rollup(data, v => d3.mean(v, d => d.Popularity), d => d.Year);
  const lineData = Array.from(yearMap, ([year, popularity]) => ({ year, popularity }))
                        .sort((a, b) => a.year - b.year);

  const margin = { top: 40, right: 30, bottom: 40, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain(d3.extent(lineData, d => d.year))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(lineData, d => d.popularity)])
    .range([height, 0]);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  svg.append("g").call(d3.axisLeft(y));

  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.popularity));

  svg.append("path")
    .datum(lineData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("display", "none");

  svg.selectAll("circle")
    .data(lineData)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.year))
    .attr("cy", d => y(d.popularity))
    .attr("r", 4)
    .attr("fill", "steelblue")
    .on("mouseover", (event, d) => {
      tooltip.style("display", "block")
             .html(`Year: ${d.year}<br>Popularity: ${d.popularity.toFixed(2)}`)
             .style("left", (event.pageX + 5) + "px")
             .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => tooltip.style("display", "none"));
});
