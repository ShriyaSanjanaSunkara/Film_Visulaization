d3.csv("data/a1-film.csv").then(data => {
  const subjectCounts = d3.rollup(data, v => v.length, d => d.Subject);
  const barData = Array.from(subjectCounts, ([subject, count]) => ({ subject, count }))
                       .sort((a, b) => b.count - a.count);

  const margin = { top: 40, right: 30, bottom: 100, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(barData.map(d => d.subject))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(barData, d => d.count)])
    .range([height, 0]);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .style("text-anchor", "end");

  svg.append("g").call(d3.axisLeft(y));

  const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("display", "none");

  svg.selectAll("rect")
    .data(barData)
    .enter()
    .append("rect")
    .attr("x", d => x(d.subject))
    .attr("y", d => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.count))
    .attr("fill", "darkorange")
    .on("mouseover", (event, d) => {
      tooltip.style("display", "block")
             .html(`Genre: ${d.subject}<br>Count: ${d.count}`)
             .style("left", (event.pageX + 5) + "px")
             .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => tooltip.style("display", "none"));
});
