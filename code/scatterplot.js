var divisionList = [
        { name: "New England", states: ["Connecticut", "Maine", "Massachusetts", "New Hampshire", "Rhode Island", "Vermont" ]},
        { name: "Mid-Atlantic", states: ["New Jersey", "New York", "Pennsylvania" ]},
        { name: "East North Central", states: ["Illinois", "Indiana", "Michigan", "Ohio", "Wisconsin" ]},
        { name: "West North Central", states: ["Iowa", "Kansas", "Minnesota", "Missouri", "Nebraska", "North Dakota" ,"South Dakota" ]},
        { name: "South Atlantic", states: ["Delaware", "Florida", "Georgia", "Maryland", "North Carolina", "South Carolina", "Virginia", "District of Columbia", "West Virginia" ]},
        { name: "East South Central", states: ["Alabama", "Kentucky", "Mississippi", "Tennessee" ]},
        { name: "West South Central", states: ["Arkansas", "Louisiana", "Oklahoma", "Texas" ]},
        { name: "Mountain", states: ["Arizona", "Colorado", "Idaho", "Montana", "Nevada", "New Mexico", "Utah", "Wyoming" ]},
        { name: "Pacific", states: ["Alaska", "California", "Hawaii", "Oregon", "Washington" ]}
    ];

    var regionList = [
        { name: "Northeast", divisions: ["New England", "Mid-Atlantic"] },
        { name: "Midwest", divisions: ["East North Central", "West North Central"] },
        { name: "South", divisions: ["South Atlantic", "East South Central", "West South Central"] },
        { name: "West", divisions: ["Mountain", "Pacific"] }
    ];

    var allDivisions = divisionList.map(function (d) { return d.name; });
    var allRegions = regionList.map(function (d) { return d.name; });

    var allPurposes = ["air traffic control tower", "belltower", "bridge", "casino", "commercial", "education", "exhibition", "government", "hospital", "hotel", "industrial", "library", "museum", "observation", "office", "other", "religious", "residential", "retail", "serviced apartments", "telecommunications"];

    var allDropdownOptions = ["All States", "Northeast", "Midwest", "South", "West", "Atlanta", "Boston", "Chicago", "Dallas", "Detroit", "Houston", "Jersey City", "Las Vegas", "Los Angeles", "Miami", "New York City", "Philadelphia", "Pittsburgh", "San Francisco", "Seattle"];
    var currentDropedownSelected = "All States";

    var startingYear = 1910;
    var startingHeight = 120;

    var margin_scatter = { top: 20, right: 250, bottom: 80, left: 30},
        width_scatter = 1100 - margin_scatter.left - margin_scatter.right,
        height_scatter = 550 - margin_scatter.top - margin_scatter.bottom;

    var dotRadius = 4; // Dot radius
    var dotRadiusHover = 7; // Dot radius when mouse hover over
    var dotStrokeWidth = 0.5; // Dot border width
    var dotFillOpacity = 0.6; // Dot fill opacity
    var dotStroke = "#999"; // Dot border color
    var dotHoverColor = "orange"; // Dot color when mouse hover over
    var allStatesColor = "#9ecae1"; // Dot color when "All States" selected
    var divisionColors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
    
    var heightFormater = d3.format(".5n");

    var color = d3.scaleOrdinal()
        .domain(allDivisions)
        .range(divisionColors);

    var xScatter = d3.scaleLinear()
        .range([0, width_scatter]);

    var yScatter = d3.scaleLinear()
        .range([height_scatter, 0]);

    var xAxis_scatter = d3.axisBottom()
        .scale(xScatter)
        .tickFormat(function(d) {
            return d3.format("d")(d); // Format year number
        });

    var yAxis_scatter = d3.axisLeft()
        .scale(yScatter);

    // Dropdown
    var dropdown = d3.select("#dropScatter")
        .append("div")
        .append("select")
        .on("change", function() {
            // Get the selected option value
            currentDropedownSelected = d3.event.target.value;
            filterDots();
            renderLegend();
        });

    dropdown.selectAll("options")
        .data(allDropdownOptions)
        .enter().append("option")
        .attr("value", function(d) { return d; })
        .text(function(d) { return d; });

    // svg_scatter's
    var svg_scatter = d3.select("#viz6").select("#scatter")
        .attr("width", width_scatter + margin_scatter.left + margin_scatter.right)
        .attr("height", height_scatter + margin_scatter.top + margin_scatter.bottom)
        .append("g")
        .attr("transform", "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");

    var legend_scatter = svg_scatter.append("g")
        .attr("class", "legend");

    // renderLegend();

    d3.csv("data/skyscrapers-main.csv", function (error, data) {    
        if (error) throw error;

        data.forEach(function (d) {
            d.buildingHeight = +d.height;
            d.year = +d['completed.year'];
            d.division = getDivisionFromState(d.state);
            d.region = getRegionFromDivision(d.division);
            d.purposes = d.main;
        });

        xScatter.domain([
            startingYear,
            d3.max(data, function (d) {
                return d.year;
            })
        ]);
        yScatter.domain([
            startingHeight,
            d3.max(data, function (d) {
                return d.buildingHeight;
            })
        ]);

        //  
        svg_scatter.append("text")
            .attr("class", "label")
            .attr("x", width_scatter/2)
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("font-family", "Chivo")
            .attr("font-weight", "300")
            .attr("font-size", "20px")
            .text("Skyscraper Construction Density");

        svg_scatter.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(0," + height_scatter + ")")
            .call(xAxis_scatter)
            .append("text")
            .attr("class", "label")
            .attr("x", width_scatter/2)
            .attr("y", 40)
            .style("text-anchor", "end")
            .attr("font-weight", "400")
            .attr("font-size", "12px")
            .text("Year");



        svg_scatter.append("g")
            .attr("class", "yaxis")
            .call(yAxis_scatter)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .style("font-family", "Chivo")
            .attr("font-size", "12px")
            .attr("font-weight", "400")
            .text("Height (m)");


        svg_scatter.selectAll(".dot")
            .data(data.filter(function(d) {
                return d.year >= startingYear;
            }))
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", dotRadius)
            .attr("cx", function (d) {
                return xScatter(d.year);
            })
            .attr("cy", function (d) {
                return yScatter(d.buildingHeight);
            })
            .style("fill", allStatesColor)
            .style("fill-opacity", dotFillOpacity)
            .style("stroke", dotStroke)
            .style("stroke-width", dotStrokeWidth)
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip);

    });

    function showTooltip(d) {    
        // Increase the size and change the color of the dot
        d3.select(this).raise()
            .attr("r", dotRadiusHover)
            .style("fill", dotHoverColor);

        var purposeScatter = 'purposes: ' + '<i>' + d.purposes + '</i>';

        var count = 0;

        for (i in allPurposes){
            if(d[allPurposes[i]] === "TRUE" && allPurposes[i] != d.purposes){
                purposeScatter = purposeScatter + ", " + allPurposes[i];
                count = count + 1;
            }
        }

        // Generate the contents of the tooltip
        var html = '<b>' + d.name + '</b><br>' +
            d.city + ', ' + d.state + '<br>' + 
            'height: ' + heightFormater(d.height) + ' m<br>' + 
            'completed: ' + d["completed.year"] + '<br>' +
            purposeScatter;

        var xPosition = parseFloat(d3.select(this).attr("cx")) + 10;
        var yPosition = parseFloat(d3.select(this).attr("cy")) + 10;

        svg_scatter.append("rect")
            .attr("class", "tooltipScatter")
            .attr("x", xPosition)
            .attr("y", yPosition)
            .attr("width", function(d){ if (count > 0) return 150 + count*25; else return 150;})
            .attr("height", 80)
            .style("fill", "white")
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill-opacity", 0.9);
            
        svg_scatter.append("foreignObject")
          .attr("class", "tooltipScatter")
          .attr("width", 200)
          .attr("height", 80)
          .attr("x", xPosition+5)
          .attr("y", yPosition+3)
          .style("font", "10px 'Chivo'")
          .style("font-weight", "300")
          .style("color", "black")
          .html(html);
            
    }

    function hideTooltip() {
        // Reset the size and color of the dot
        d3.select(this)
            .attr("r", dotRadius)
            .style("fill", allStatesColor);
        // Hide the tooltip
        svg_scatter.selectAll(".tooltipScatter").remove();

    }

    function filterDots() {
        if (currentDropedownSelected === "All States") { // Show all states
            svg_scatter.selectAll(".dot")
                .style("fill", allStatesColor)
                .style("display", "inline");
        } else if (allRegions.indexOf(currentDropedownSelected) !== -1) { // Show selected region
            svg_scatter.selectAll(".dot")
                .style("fill", allStatesColor)
                .style("display", function(d) {
                    if (d.region === currentDropedownSelected) {
                        return "inline";
                    } else {
                        return "none";
                    }
                });
        } else { // Show selected city
            svg_scatter.selectAll(".dot")
                .style("fill", allStatesColor)
                .style("display", function (d) {
                    if (d.city === currentDropedownSelected) {
                        return "inline";
                    } else {
                        return "none";
                    }
                });
        }
    }

    function renderLegend() {
        var legendData = [];
        if (currentDropedownSelected === "All States") { // Show all states
            // No legend for "All States"
            legend_scatter.selectAll("*").remove();
            return;
        } else if (allRegions.indexOf(currentDropedownSelected) !== -1) { // Show selected region
            var divisions = regionList.find(function(region) {
                return region.name === currentDropedownSelected
            }).divisions;

            divisions.forEach(function(divisionName) {
                var states = divisionList.find(function(division) {
                    return division.name === divisionName;
                }).states;

                states.forEach(function(state) {
                    legendData.push({
                        label: state,
                        color: color(divisionName)
                    });
                });
            })
        } else { // Show selected city
            // No legend for selected city
            legend_scatter.selectAll("*").remove();
            return;
        }

        // Delete old legend
        legend_scatter.selectAll("*").remove();
        // Add new legend
        var legendItem = legend_scatter.selectAll(".legend-item")
            .data(legendData)
            .enter().append("g")
            .attr("class", "legend-item")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });
        
        legendItem.append("text")
            .attr("x", width + 20)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-weight", "300")
            .style("font-family", "Chivo")
            .text(function (d) { return d.label; });
    }

    function getDivisionFromState(state) {
        for (var i = 0; i < divisionList.length; i++) {
            if (divisionList[i].states.indexOf(state) !== -1) {
                return divisionList[i].name;
            }
        }
    }

    function getRegionFromDivision(division) {
        for (var i = 0; i < regionList.length; i++) {
            if (regionList[i].divisions.indexOf(division) !== -1) {
                return regionList[i].name;
            }
        }
    }

   