var margin_map = {top: 10, right: 30, bottom: 20, left: 10},
    width_map = 1000 - margin_map.left - margin_map.right,
    height_map = 550 - margin_map.top - margin_map.bottom;

var projection = d3.geoAlbersUsa();
var path = d3.geoPath()
    .projection(projection);

var svg_map = d3.select("#viz2").select("#map")
  .append("g")
  .attr("transform", "translate(" + margin_map.left + "," +  margin_map.top + ")");

var legendData = [{"size":2.5, "value":1}, {"size":2.5+(100/5), "value":100}, {"size":2.5+(200/5), "value":200}, {"size":2.5+(300/5), "value":300}];

var legend = svg_map.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width_map - 50) + "," + (height_map - 20) + ")")
    .selectAll("g")
    .data(legendData)
    .enter().append("g");

legend.append("circle")
    .attr("cy", function(d){return -d.size})
    .attr("r", function(d){return +d.size});

legend.append("text")
    .attr("y", function(d){
      if (d.value != 1) return -2*+d.size-4;
      else return -2*+d.size-15;})
    .attr("dy", "1.3em")
    .text(function(d) {return d.value});

d3.queue()
  .defer(d3.json, 'data/us.json')
  .defer(d3.csv, 'data/skyscrapers-main.csv')
  .await(makeMyMap);

function makeMyMap(error, us, skyscrapers){

  var newData = processData(1912);

  svg_map.append("path")
      .attr("class", "states")
      .datum(topojson.feature(us, us.objects.states))
      .attr("d", path);

    svg_map.selectAll("points")
      .data(d3.keys(newData)).enter()
      .append("circle")
      .attr("class", "circle")
      .attr("id", "points")
      .attr("cx", function (d) { return projection(newData[d].coord)[0]; })
      .attr("cy", function (d) { return projection(newData[d].coord)[1]; })
      .attr("r", function(d){
        if (newData[d].count == 1){
                return "2.5px";
        }else if (newData[d].count == 0){
          return "0px";
        }
        else{
          var n = 2.5 + (+newData[d].count)/5;
          return n.toString();
        }
      })
      .on("mouseover", function(d) {

        if (newData[d].count > 0){

          // position tooltip centered, outside of circle
          var xpos = projection(newData[d].coord)[0] - 50;
          var ypos = projection(newData[d].coord)[1] - ((+newData[d].count)/5) - 37.5;


          var info = "<b>" + d + "</b><br>" + newData[d].count;

          svg_map.append("rect")
            .attr("class", "tooltipM")
            .attr("x", xpos)
            .attr("y", ypos)
            .attr("width", 100)
            .attr("height", 30)
            .style("fill", "white")
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill-opacity", 0.9);

          svg_map.append("foreignObject")
            .attr("class", "tooltipM")
            .attr("width", 100)
            .attr("height", 30)
            .attr("x", xpos)
            .attr("y", ypos+2)
            .style("font", "11px 'Chivo'")
            .style("font-weight", "300")
            .style("color", "black")
            .html("<center>" + info + "</center>");  
        }
  
        })          
        .on("mouseout", function(d) {   
          d3.selectAll(".tooltipM").remove();
        });

    function processData(year){
      var newData = {};
      skyscrapers.forEach(function(d) {
        if (!(d.city in newData)){
          if(+d["completed.year"] <= +year){
            newData[d.city] = {count:1, coord:[+d.longitude, +d.latitude]};
          }
          else{
            newData[d.city] = {count:0, coord:[+d.longitude, +d.latitude]};
          }
        }
        else if(d.city in newData && +d["completed.year"] <= +year){
          newData[d.city].count = newData[d.city].count + 1;
        }
      })
        return newData;
    }

    d3.select("input")
        .on("change", function() {
          var yearInput = +d3.select(this).node().value;
          newData = processData(yearInput);

          svg_map.selectAll("#points")
            .data(d3.keys(newData))
            .transition()
            .duration(500)
            .attr("cx", function (d) { return projection(newData[d].coord)[0]; })
            .attr("cy", function (d) { return projection(newData[d].coord)[1]; })
            .attr("r", function(d){
              if (newData[d].count == 1){
                return "2.5px";
              }else if (newData[d].count == 0){
                return "0px";
              }
              else{
                var n = 2.5 + (+newData[d].count)/5;
                return n.toString();
              }

            });
    });
}
