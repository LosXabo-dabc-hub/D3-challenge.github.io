var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our scatter, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var scatterGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("Xdata.csv").then(function(Xdata) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    Xdata.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(Xdata, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(Xdata, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the scatter
    // ==============================
    scatterGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    scatterGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = scatterGroup.selectAll("circle")
    .data(Xdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))

    .attr("r", "15")
    .attr("fill", "#B5D3E7")
    .attr("opacity", ".5");


    var textGroup = scatterGroup.selectAll("#text")
    .data(Xdata)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("class", "textStyle")
    .text(d => d.abbr);

    // var textGroup = scatterGroup.selectAll(".text1")
    // .data(Xdata)
    // .enter()
    // .append("text")
    // .attr("x", d => xLinearScale(d.poverty))
    // .attr("y", d => yLinearScale(d.healthcare))
    // .attr("class", "text1")
    // .label(d => d.abbr);

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
     // .offset([80, -60])
      .html(function(d) {
        return (`${d.id}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
      });

    // Step 7: Create tooltip in the scatter
    // ==============================
    scatterGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    scatterGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    scatterGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Povery (%)");
  }).catch(function(error) {
    console.log(error);
  });
