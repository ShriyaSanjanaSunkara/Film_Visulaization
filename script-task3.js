d3.csv("data/a1-film.csv").then(data => {
  data.forEach(d => {
    d.Length = +d.Length;
    d.Popularity = +d.Popularity;
  });

  const margin = { top: 40, right: 30, bottom: 50, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#scatter-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Length)])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Popularity)])
    .range([height, 0]);

  const color = d3.scaleOrdinal()
    .domain(["Yes", "No"])
    .range(["green", "red"]);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g").call(d3.axisLeft(y));

  const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("display", "none");

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.Length))
    .attr("cy", d => y(d.Popularity))
    .attr("r", 5)
    .attr("fill", d => color(d.Awards))
    .attr("opacity", 0.7)
    .on("mouseover", (event, d) => {
      tooltip.style("display", "block")
             .html(`Length: ${d.Length}<br>Popularity: ${d.Popularity}<br>Awards: ${d.Awards}`)
             .style("left", (event.pageX + 5) + "px")
             .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => tooltip.style("display", "none"));
});

