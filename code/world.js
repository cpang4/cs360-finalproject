var margin_world = {top: 100, right: 50, bottom: 50, left: 30},
    width_world = 1100 - margin_world.left - margin_world.right,
    height_world = 550 - margin_world.top - margin_world.bottom;

var xScaleWorld = d3.scaleBand()
              .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
              .range([0, width_world])
              .paddingInner(0.05)
              .paddingOuter(0.25);

var yScaleWorld = d3.scaleLinear()
    .domain([0, 828])
    .range([height_world, 0]);

var xAxisWorld = d3.axisBottom()
    .scale(xScaleWorld);

var yAxisWorld = d3.axisLeft()
    .scale(yScaleWorld);

var svg_world = d3.select("#viz5").select("#worldBar")
    .append("g")
    .attr("transform", "translate(" + margin_world.left + "," + margin_world.top + ")");

    svg_world.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height_world + ")")
      .call(xAxisWorld)
      .selectAll("text")
      .style("font-size", "11px");

  svg_world.append("g")
      .attr("class", "yaxis")
      .call(yAxisWorld)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .style("font-family", "Chivo")
      .attr("font-size", "12px")
      .attr("font-weight", "400")
      .text("Height (m)");


  svg_world.append("text")
        .attr("transform", "translate(" + width_world/2 + "," + -30 + ")")
        .style("text-anchor", "middle")
        .attr("font-family", "Chivo")
        .attr("font-size", "25px")
        .attr("font-weight", 300)
        .text("Tallest Skyscrapers in the World");

    svg_world.append("text")
        .attr("transform", "translate(" + width_world/2 + "," + (height_world+30) + ")")
        .style("text-anchor", "middle")
        .attr("font-family", "Chivo")
        .attr("font-size", "12px")
        .attr("font-weight", "400")
        .text("Rank");

  var filters_world = ["Top 1-10", "Top 11-20"];

    d3.csv("data/world.csv", function(data){

      addFilterWorld();

      svg_world.selectAll("images")
        .data(data.filter(function(d){return +d.rank <= 10}))
        .enter()
        .append("svg:image")
        .attr("class", "images")
        .attr("x", function(d){return xScaleWorld(+d.rank)})
        .attr("y", function(d){return yScaleWorld(d.height)})
        .attr("width", 100)
        .attr("height", function(d){return height_world-yScaleWorld(d.height)})
        .attr("xlink:href", function(d){return "data/images/" + d.link})
        .on("mouseover", function(d){

          var xPosition_world = parseFloat(d3.select(this).attr("x")) + xScaleWorld.bandwidth()/2;

            svg_world.append("text")
            .attr("class", "tooltipWorld")
            .attr("x", xPosition_world)
            .attr("y", yScaleWorld(d.height)-50)
            .attr("text-anchor", "middle")
            .style("font-size", "11px")
            .style("font-weight", "400")
            .style("font-family", "Chivo")
            .style("text-decoration", "underline")
            .text(d.name);

            svg_world.append("text")
              .attr("class", "tooltipWorld")
              .attr("x", xPosition_world)
              .attr("y", yScaleWorld(d.height)-20)
              .attr("text-anchor", "middle")
              .style("font-size", "10px")
              .style("font-weight", "300")
              .style("font-family", "Chivo")
              .text("Height: " + d.height + " m");

            svg_world.append("text")
              .attr("class", "tooltipWorld")
              .attr("x", xPosition_world)
              .attr("y", yScaleWorld(d.height)-35)
              .attr("text-anchor", "middle")
              .style("font-size", "10px")
              .style("font-weight", "300")
              .style("font-family", "Chivo")
              .text(d.city + ", " + d.country);
        })
        .on("mouseout", function(d){
          svg_world.selectAll(".tooltipWorld").remove();
        });

    var top1 = true, top2 = false;

    function addFilterWorld(){

      svg_world.append("rect")
        .attr("id", "top1")
        .attr("x", width_world-150)
        .attr("y", 20)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width",15)
        .attr("height",15)
        .attr("fill", "gray")
        .style("fill-opacity", 0.5)
        .attr("stroke-weight", "0.25px")
        .attr("stroke", "black")
        .on("click", function(d){

          if (top1 != true){
            top1 = !top1;
            top2 = !top2;

            d3.select("#top1").transition()
            .style("fill-opacity", function(d){
              if (top1){
                return 0.5;
              }
              else return 0;
            })

            d3.select("#top2").transition()
            .style("fill-opacity", function(d){
              if (top2){
                return 0.5;
              }
              else return 0;
            })

            xScaleWorld.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            svg_world.selectAll(".xaxis").transition().call(xAxisWorld);

            svg_world.selectAll(".images")
                  .data(data.filter(function(d){ return +d.rank <= 10;}))
                  .transition()
                  .delay(function(d, i) {
                     return i * 200;
                   })
                  .duration(500)
                  .attr("x", function(d){return xScaleWorld(+d.rank)})
                  .attr("y", function(d){return yScaleWorld(d.height)})
                  .attr("width", 100)
                  .attr("height", function(d){return height_world-yScaleWorld(d.height)})
                  .attr("xlink:href", function(d){return "data/images/" + d.link})
          }
        })

        svg_world.append("text")
          .attr("x", width_world-120)
          .attr("y", 33)
          .attr("font-family", "Chivo")
          .text("Top 1-10");

        svg_world.append("text")
          .attr("x", width_world-120)
          .attr("y", 63)
          .attr("font-family", "Chivo")
          .text("Top 11-20");

       svg_world.append("rect")
        .attr("id", "top2")
        .attr("x", width_world-150)
        .attr("y", 50)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width",15)
        .attr("height",15)
        .attr("fill", "gray")
        .style("fill-opacity", 0)
        .attr("stroke-weight", "0.25px")
        .attr("stroke", "black")
        .on("click", function(d){

          if (top2 != true){
            top1 = !top1;
            top2 = !top2;

            d3.select("#top1").transition()
            .style("fill-opacity", function(d){
              if (top1){
                return 0.5;
              }
              else return 0;
            })

            d3.select("#top2").transition()
            .style("fill-opacity", function(d){
              if (top2){
                return 0.5;
              }
              else return 0;
            })


            xScaleWorld.domain([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
            svg_world.selectAll(".xaxis").transition().call(xAxisWorld);

            svg_world.selectAll(".images")
                  .data(data.filter(function(d){ return +d.rank > 10;}))
                  .transition()
                  .delay(function(d, i) {
                     return i * 200;
                   })
                  .duration(500)
                  .attr("x", function(d){return xScaleWorld(+d.rank)})
                  .attr("y", function(d){return yScaleWorld(d.height)})
                  .attr("width", 100)
                  .attr("height", function(d){return height_world-yScaleWorld(d.height)})
                  .attr("xlink:href", function(d){return "data/images/" + d.link})
          }

        })
    }

    })
