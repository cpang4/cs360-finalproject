 margin = {top: 50, right: 100, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg_line = d3.select("#viz1").select("#linechart")
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

var colorMap = {"hotel": d3.rgb("#7fc97f"), "residential":d3.rgb("#fdc086"), "office":d3.rgb("#beaed4"), "other":d3.rgb("#f0027f"), "all":d3.rgb("#386cb0")};

var xAxis_line = d3.axisBottom()
    .scale(x);

var yAxis_line = d3.axisLeft()
    .scale(y);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.count); });


// will keep track of which purpose is being shown and full name of purpose
var purpMap = {};

d3.csv("data/skyscrapers-count.csv", type, function(error, data) {
  if (error) throw error;

  var purposes = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {year: d.year, count: d[id]};
      })
    };
  });

  x.domain([d3.min(data, function(d){return d.year; }), d3.max(data, function(d){return d.year;})]);

  y.domain([
    d3.min(purposes, function(c) { return d3.min(c.values, function(d) { return d.count; }); }),
    d3.max(purposes, function(c) { return d3.max(c.values, function(d) { return d.count; }); })
  ]);

  var allPurp = (purposes.map(function(c) { return c.id; }));
  for (index in allPurp){
    purpMap[allPurp[index].substring(0, 3).toUpperCase()] = {"shown": true, "full": allPurp[index]};
  }

  svg_line.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis_line);

  svg_line.append("text")
      .attr("x", width/2)
      .attr("y", height+40)
      .attr("font-family", "Chivo")
      .attr("font-size", "12px")
      .attr("font-weight", "400")
      .text("Year");

  svg_line.append("g")
      .attr("class", "yaxis")
      .call(yAxis_line)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .style("font-family", "Chivo")
      .attr("font-size", "12px")
      .attr("font-weight", "400")
      .text("Number of Skyscrapers");

  svg_line.append("text")
        .attr("transform", "translate(" + width/2 + "," + -20 + ")")
        .style("text-anchor", "middle")
        .attr("font-family", "Chivo")
        .attr("font-weight", "300")
        .attr("font-size", "20px")
        .text("Number of Skyscrapers by Year in the US");

  var purp = svg_line.selectAll(".purp")
    .data(purposes)
    .enter().append("g")
    .attr("class", "purp");

  purp.append("path")
      .attr("class", "line")
      .attr("id", function(d){
          return d.id.substring(0, 3).toUpperCase();
      })
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return colorMap[d.id]; });

  purp.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.count) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .attr("font-weight", "400")
      .attr("font-family", "Chivo")
      .attr("font-size", "12px")
      .text(function(d) { return d.id.substring(0,1).toUpperCase() + d.id.substring(1,d.id.length); })
      .on("mouseover", function(d){
        var thisId = d.id.substring(0, 3).toUpperCase();
        if (purpMap[thisId].shown){
          for (purpose in purpMap){
            if (purpose != thisId){
              if (purpMap[purpose].shown){
                d3.select("path#" + purpose).style("stroke", "lightgray").style("opacity", 0.3);
              }
            }
          } 
        }
      })
      .on("mouseout", function(d){
        for (purpose in purpMap){
          if (purpMap[purpose] && purpMap[purpose].shown){
            d3.select("path#" + purpose).style("stroke", colorMap[purpMap[purpose].full]).style("opacity", 1);
          }
        } 
      })
      .on("click", function(d){
        var id = d.id.substring(0, 3).toUpperCase();
        var newOpacity = 0;
        newOpacity = purpMap[id].shown ? 0: 1;
        purpMap[id].shown = !(purpMap[id].shown);
        d3.select("path#" + id).style("opacity", newOpacity);
      });

    // place year 

    var focusYear = svg_line.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focusYear.append("text")
        .attr("class", "date")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "-.3em")
        .attr("font-family", "Chivo")
        .attr("font-weight", "400")
        .attr("font-size", "12px");
    focusYear.append("text")
        .attr("class", "date")
        .attr("dx", 8)
        .attr("dy", "-.3em")
        .attr("font-family", "Chivo")
        .attr("font-weight", "400")
        .attr("font-size", "12px");


    var focus = svg_line.append("g")
      .attr("class", "focus")
      .style("display", "none");


  //Adds circle to focus point on line
  focus.append("circle")
      .attr("r", 6)
      .attr("stroke-opacity", 0.5);

    // place the value
    focus.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");

  ////2

  var focus2 = svg_line.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus2.append("circle")
      .attr("r", 6)
      .attr("stroke-opacity", 0.5);

    focus2.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus2.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");

    ///3

  var focus3 = svg_line.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus3.append("circle")
      .attr("r", 6)
      .attr("stroke-opacity", 0.5);

    focus3.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus3.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");

    ///4

  var focus4 = svg_line.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus4.append("circle")
      .attr("r", 6)
      .attr("stroke-opacity", 0.5);

    focus4.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus4.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");

    ///5

  var focus5 = svg_line.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus5.append("circle")
      .attr("r", 6)
      .attr("stroke-opacity", 0.5);

    focus5.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");

    focus5.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");


    ///
    var focusLine = svg_line.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focusLine.append("line")
      .attr("id", "vertLine")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("stroke-opacity", 0.25);
  
  //Creates larger area for tooltip   
  var overlay = svg_line.append("rect")
      .attr("class", "overlayLine")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() {

        if (purpMap['ALL'].shown){
          focus.style("display", null);
        }
        if (purpMap['HOT'].shown){
          focus2.style("display", null);
        }
        if (purpMap['OFF'].shown){
          focus3.style("display", null);
        }
        if (purpMap['RES'].shown){
          focus4.style("display", null);
        }
        if (purpMap['OTH'].shown){
          focus5.style("display", null);
        }
        focusYear.style("display", null);
        focusLine.style("display", null); })
      .on("mouseout", function() {
        focus.style("display", "none");
        focus2.style("display", "none");
        focus3.style("display", "none");
        focus4.style("display", "none"); 
        focus5.style("display", "none"); 
        focusYear.style("display", "none");
        focusLine.style("display", "none");  })
      .on("mousemove", mousemove);
  
  //Tooltip mouseovers            
  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.year > d1.year - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.year) + "," + y(d.all) + ")");
    focus2.attr("transform", "translate(" + x(d.year) + "," + y(d.hotel) + ")");
    focus3.attr("transform", "translate(" + x(d.year) + "," + y(d.office) + ")");
    focus4.attr("transform", "translate(" + x(d.year) + "," + y(d.residential) + ")");
    focus5.attr("transform", "translate(" + x(d.year) + "," + y(d.other) + ")");
    focusYear.attr("transform", "translate(" + (x(d.year)-75) + ", 30)");

    d3.select("#vertLine")
      .attr("transform", "translate(" + x(d.year) + ", 0)");

    focusYear.selectAll(".date")
       .text("Year: " + d.year.getFullYear());

    focus.select("text.y3")
        .text(d.all);

    focus.select("text.y4")
        .text(d.all);

    focus2.select("text.y3")
        .text(d.hotel);

    focus2.select("text.y4")
        .text(d.hotel);

    focus3.select("text.y3")
        .text(d.office);

    focus3.select("text.y4")
        .text(d.office);

    focus4.select("text.y3")
        .text(d.residential);

    focus4.select("text.y4")
        .text(d.residential);

    focus5.select("text.y3")
        .text(d.other);

    focus5.select("text.y4")
        .text(d.other);

  }; 

  var bisectDate = d3.bisector(function(d) { return (d.year); }).left;    

});

function type(d, _, columns) {
  d.year = parseTime(d.year);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}
