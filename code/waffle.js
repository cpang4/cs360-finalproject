var margin_waffle = {top: 80, right: 50, bottom: 70, left: 20},
    width_waffle = 1000 - margin_waffle.left - margin_waffle.right,
    height_waffle = 250 - margin_waffle.top - margin_waffle.bottom;

var svg_waffle = d3.select("#viz3").select("#waffle")
    .append("g")
    .attr("transform", "translate(" + margin_waffle.left + "," + margin_waffle.top + ")");

var filters = ["All", "San Francisco", "New York City", "Chicago", "Las Vegas", "Miami", "Houston"];

var mainPurposes = ["hotel", "office", "residential", "other"];

var otherPurposes = ["abandoned", "airtraffic", "belltower", "bridge", "casino", "commercial", "education", "exhibition", "government", "industrial", "library", "observation", "religious", "telecommunications", "museum", "retail", "hospital"];

var colorMap = {"hotel": d3.rgb("#7fc97f"), "residential":d3.rgb("#fdc086"), "office":d3.rgb("#beaed4"), "other":d3.rgb("#f0027f")};

d3.csv("data/skyscrapers-main.csv", function(error, data)
{
  addFilter();
  var totalsMap = getTotals("All");
  for (var index = 0; index < mainPurposes.length; index++){
      makeGrid(totalsMap, mainPurposes[index], index);
  }

  svg_waffle.append("text")
    .attr("x",0)
    .attr("y",-50)
    .attr("font-family", "Chivo")
    .attr("font-size", "15px")
    .attr("font-weight", "700")
    .text("total skyscrapers:");


  svg_waffle.append("text")
    .attr("id", "overallTotal")
    .attr("x", 140)
    .attr("y", -49)
    .attr("font-family", "Chivo")
    .attr("font-size", "15px")
    .text(totalsMap["total"]);

  
  function getTotals(city){


    var totalsMap = {"abandoned":0, "airtraffic":0, "belltower":0, "bridge":0, "casino":0, "commercial":0, "education":0, "exhibition":0, "government":0, "hospital":0, "hotel":0, "industrial":0, "library":0, "observation":0, "office":0, "religious":0, "residential":0, "retail":0, "telecommunications":0, "total":0, "other":0, "museum":0};

    data.forEach(function(d){
    
      if (d.city === city || city == "All"){
        if (d.main === "government"){
          totalsMap["other"] = totalsMap["other"] + 1
          totalsMap["government"] = totalsMap["government"] + 1;
        }
        if (d.main === "hospital"){
          totalsMap["other"] = totalsMap["other"] + 1;
          totalsMap["hospital"] = totalsMap["hospital"] + 1;
        }
        if (d.main === "hotel"){
          totalsMap["hotel"] = totalsMap["hotel"] + 1;
        }
        if (d.main === "residential"){
          totalsMap["residential"] = totalsMap["residential"] + 1;
        }
        if (d.main === "retail"){
          totalsMap["retail"] = totalsMap["retail"] + 1;
          totalsMap["other"] = totalsMap["other"] + 1;
        }
        if (d.main === "office"){
          totalsMap["office"] = totalsMap["office"] + 1;
        }
        if (d.main === "religious"){
          totalsMap["religious"] = totalsMap["religious"] + 1;
          totalsMap["other"] = totalsMap["other"] + 1;
        }
        if (d.main === "abandoned"){
          totalsMap["abandoned"] = totalsMap["abandoned"] + 1;
          totalsMap["other"] = totalsMap["other"]+ 1;
        }
        if (d.main === "air traffic control tower"){
          totalsMap["airtraffic"] = totalsMap["airtraffic"] + 1;
          totalsMap["other"] = totalsMap["other"] + 1;
        }
        if (d.main === "belltower"){
          totalsMap["belltower"] = totalsMap["belltower"] + 1;
          totalsMap["other"] = totalsMap["other"] + 1;
        }
        if (d.main === "casino"){
          totalsMap["casino"] = totalsMap["casino"] + 1;
          totalsMap["other"] = totalsMap["other"] + 1;
        }
        if (d.main === "commercial"){
          totalsMap["commercial"] = totalsMap["commercial"] + 1;
          totalsMap["other"] = totalsMap["other"] + 1;
        }
        if (d.main === "education"){
          totalsMap["education"] = totalsMap["education"] + 1;
          totalsMap["other"] = totalsMap["other"] + 1;
        }
        if (d.main === "industrial"){
          totalsMap["industrial"] = totalsMap["industrial"] + 1;
          totalsMap["other"] = totalsMap["other"] + 1;
        }
        if (d.main === "library"){
          totalsMap["library"] = totalsMap["library"] + 1;
          totalsMap["other"] = totalsMap["other"] + 1;
        }
        if (d.main === "observation"){
          totalsMap["other"] = totalsMap["other"] + 1
          totalsMap["observation"] = totalsMap["observation"] + 1;
        }
        if (d.main === "telecommunications"){
          totalsMap["telecommunications"] = totalsMap["telecommunications"] + 1;
          totalsMap["other"] = totalsMap["other"] + 1;
        }
        if (d.main === "museum"){
          totalsMap["museum"] = totalsMap["museum"] + 1;
          totalsMap["other"] = totalsMap["other"] + 1;
        }
        if (d.main === "bridge"){
          totalsMap["bridge"] = totalsMap["bridge"] + 1;
          totalsMap["other"] = totalsMap["other"] + 1;
        }
        totalsMap["total"] = totalsMap["total"] + 1;
      }
  }) // end for each
  return totalsMap;

} // end getTotals

  function makeGrid(totalsMap, purpose, index){

    var numPerRow = 10
    var size = 10
    var scale = d3.scaleLinear()
      .domain([0, numPerRow -1])
      .range([0, size * numPerRow])

    var boxes = 0;
    var percentage = Math.floor((totalsMap[purpose]/totalsMap["total"])*100);

    svg_waffle.selectAll(purpose)
      .data(d3.range(100))
      .enter()
      .append("rect")
      .attr("id", "grid")
      .attr("transform", "translate(" + (150*(index%6)) + "," + 0 + ")")
      .attr("x", function(d, i){
        var n = (99-i) % numPerRow
        return scale(n);
      })
      .attr("y", function(d, i){
        var n = Math.floor((99-i) / 10)
        return scale(n);
      }) 
      .attr("width", size)
      .attr("height", size)
      .attr("fill", function(d){
        if (boxes < percentage){
          boxes = boxes + 1;
          return colorMap[purpose];
        }
        else{
          return "gainsboro";
        }
      })
      .attr("stroke-width", 0)
      .attr("stroke", "black");

    svg_waffle.append("text")
      .attr("class", "catTitle")
      .attr("x", 150*(index%6))
      .attr("y", -20)
      .attr("font-family", "Chivo")
      .attr("font-size", "12px")
      .attr("fill", "black")
      .attr("font-weight", "700")
      .text(purpose);

    svg_waffle.append("text")
      .attr("class", "catTitle")
      .attr("x", 150*(index%6))
      .attr("y", -8)
      .attr("font-family", "Chivo")
      .attr("font-size", "10px")
      .attr("fill", "black")
      .text(percentage + "% (" + totalsMap[purpose]+ "/" + totalsMap["total"]+")");


    // have a clear rectangle so the hover over information does not flicker
    svg_waffle.append("rect")
    .attr("transform", "translate(" + (150*(index%6)) + "," + 0 + ")")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 110)
    .attr("height", 110)
    .attr("fill", "white")
    .attr("fill-opacity", 0.01)
    .on("mouseover", function(d){

      if (purpose === "other" && totalsMap["other"] != 0){
      var hoverInfo = "";

        if (purpose === "other"){
          hoverInfo = "<b>other</b>";
          for (var otherPurp = 0; otherPurp < otherPurposes.length; otherPurp++){
            if (totalsMap[otherPurposes[otherPurp]] != 0){
              hoverInfo = hoverInfo + "<br>" + totalsMap[otherPurposes[otherPurp]] + " are <i>" + otherPurposes[otherPurp] + "</i>";
            }
          }
        }


        svg_waffle.append("foreignObject")
          .attr("id", "tooltipw")
          .attr("width", 150)
          .attr("height", 150)
          .attr("x", 600+margin_waffle.left)
          .attr("y", -20)
          .style("font", "11px 'Chivo'")
          .style("font-weight", "300")
          .style("color", "black")
          .html("<center>" + hoverInfo + "</center>");
      }

        })
      .on("mouseout", function(d){
        d3.selectAll("#tooltipw").remove();

      });

  }

  function addFilter(){

    d3.select('#filter').append('ul')
            .selectAll('li')
            .data(filters)
            .enter().append('li')
            .style("opacity", function(d){
              if (d === "All") return 1;
                else return 0.4;
            })
            .on('click', function (d){
              var totalsMap = getTotals(d);


              d3.selectAll("#grid").remove();
              d3.selectAll(".catTitle").remove();
              for (var index = 0; index < mainPurposes.length; index++){
                makeGrid(totalsMap, mainPurposes[index], index);
              }
              var selectedCity = d;
              var filterSelect = d3.selectAll("#filter");
              filterSelect.selectAll("li").transition().style("opacity", function(d){
                if (d === selectedCity) return 1;
                else return 0.4;
              })

              d3.selectAll("#overallTotal").transition().text(totalsMap["total"]);
            })
            .text(function (d) { return d; });
  }
  

});
