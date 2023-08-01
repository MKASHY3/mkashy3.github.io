//First scene
async function renderFirstScene() {
    const margin = {top: 20, right: 30, bottom: 30, left: 80},
        width = 1300 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;
    const data = await d3.csv("https://mkashy3.github.io/data/owid-covid-latest.csv");
    
    const last_updated_year = 2023;
    const filteredData = data.filter(function (d) {
        return d.last_updated_date.startsWith(last_updated_year) && d.population != "" && d.total_cases_per_million != "" && d.total_vaccinations_per_hundred != "";
    });

    let svg = d3.select("#chart-1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 300])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d => d));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 550000])
        .range([height, 0])
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => d + " cases"));

    // Add a scale for bubble size
    const z = getBubbleSizeScale()

    // Add a scale for bubble color
    const myColor = d3.scaleOrdinal()
        .domain(getContinentKeys())
        .range(d3.schemeSet3.slice(2,11));

    // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3.select("#slide-2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10")
        .style("color", "white")
        .style("width", "150px")
        .style("height", "60px")

    // Add dots
    svg.append('g')
        .selectAll("scatterplot-dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) {
            return x(Number(d.total_vaccinations_per_hundred));
        })
        .attr("cy", function (d) {
            return y(Number(d.total_cases_per_million));
        })
        .attr("id", function (d) {
            return "bubble-" + d.iso_code;
        })
        .attr("r", function (d) {
            return z(Number(d.population));
        })
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(firstSceneTooltipHTML(d));
            tooltip.style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .style("fill", function (d) {
            return myColor(d.continent);
        });
    renderLegend(svg, getContinentKeys(), width, myColor);
    countryCodesToAnnotateSceneOne().forEach(function (countryCode) {
        for (let i = 0; i < filteredData.length; i++) {
            if (filteredData[i].iso_code === countryCode) {
                const countryData = filteredData[i];
                renderFirstSceneAnnotations(countryData, x(Number(countryData.total_vaccinations_per_hundred)), y(Number(countryData.total_cases_per_million)), margin);
            }
        }
    })
}

function countryCodesToAnnotateSceneOne() {
    return ["GRC", "BDI", "PER"]
}

function renderFirstSceneAnnotations(d, x, y, margin) {
    const computedDX = d.location == "Europe" ? -30 : 30;
    const computedDY = d.location == "Europe" ? 30 : -30;
    const annotations = [
        {
            note: {
                label: Math.round(d.total_vaccinations_per_hundred) + " total vaccinations/hundred, " + Math.round(d.total_cases_per_million) + " covid cases/million",
                lineType: "none",
                bgPadding: {"top": 15, "left": 10, "right": 10, "bottom": 10},
                title: d.entity,
                orientation: "leftRight",
                "align": "middle"
            },
            type: d3.annotationCallout,
            subject: {radius: 30},
            x: x,
            y: y,
            dx: computedDX,
            dy: computedDY
        },
    ];
    const makeAnnotations = d3.annotation().annotations(annotations);

    d3.select("svg")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "annotation-group")
        .call(makeAnnotations)
}

function firstSceneTooltipHTML(object) {
    return "<div>" + object.location + "</div><div>" + Math.round(object.total_vaccinations_per_hundred) + " total vaccinations/hundred</div><div>" + Math.round(object.total_cases_per_million) + " covid cases/million</div>";
}


// Second scene
async function renderSecondScene() {
    const margin = {top: 10, right: 20, bottom: 30, left: 80},
        width = 1300 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;
    const data = await d3.csv("https://mkashy3.github.io/data/owid-covid-latest.csv");
    
    const last_updated_year = 2023;
    const filteredData = data.filter(function (d) {
        return d.last_updated_date.startsWith(last_updated_year) && d.population != "" && d.total_cases_per_million != "" && d.total_vaccinations_per_hundred != "";
    });

    let svg = d3.select("#chart-2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 300])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d => d));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 20000])
        .range([height, 0])
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => d + " cases"));

    // Add a scale for bubble size
    const z = getBubbleSizeScale()

    // Add a scale for bubble color
    const myColor = d3.scaleOrdinal()
        .domain(getContinentKeys())
        .range(d3.schemeSet3.slice(2,11));

    // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3.select("#slide-3")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10")
        .style("color", "white")
        .style("width", "150px")
        .style("height", "60px")

    // Add dots
    svg.append('g')
        .selectAll("scatterplot-dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) {
            return x(Number(d.total_vaccinations_per_hundred));
        })
        .attr("cy", function (d) {
            return y(Number(d.total_cases_per_million));
        })
        .attr("id", function (d) {
            return "bubble-" + d.iso_code;
        })
        .attr("r", function (d) {
            return z(Number(d.population));
        })
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(secondSceneTooltipHTML(d));
            tooltip.style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .style("fill", function (d) {
            return myColor(d.continent);
        });
    renderLegend(svg, getContinentKeys(), width, myColor);
    countryCodesToAnnotateSceneTwo().forEach(function (countryCode) {
        for (let i = 0; i < filteredData.length; i++) {
            if (filteredData[i].iso_code === countryCode) {
                const countryData = filteredData[i];
                renderSecondSceneAnnotations(countryData, x(Number(countryData.total_vaccinations_per_hundred)), y(Number(countryData.total_cases_per_million)), margin);
            }
        }
    })
}

function secondSceneTooltipHTML(object) {
    return "<div>" + object.location + "</div><div>" + Math.round(object.total_vaccinations_per_hundred) + " total vaccinations/hundred</div><div>" + Math.round(object.total_cases_per_million) + " covid cases/million</div>";
}


function renderSecondSceneAnnotations(d, x, y, margin) {
    const computedDX = d.location == "Africa" ? -30 : 30;
    const computedDY = d.location == "Africa" ? 30 : -30;
    const annotations = [
        {
            note: {
                label: Math.round(d.total_vaccinations_per_hundred) + " total vaccinations/hundred, " + Math.round(d.total_cases_per_million) + " covid cases/million",
                lineType: "none",
                bgPadding: {"top": 15, "left": 10, "right": 10, "bottom": 10},
                title: d.entity,
                orientation: "leftRight",
                "align": "middle"
            },
            type: d3.annotationCallout,
            subject: {radius: 30},
            x: x,
            y: y,
            dx: computedDX,
            dy: computedDY
        },
    ];
    const makeAnnotations = d3.annotation().annotations(annotations);

    d3.select("svg")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "annotation-group")
        .call(makeAnnotations)
}

function countryCodesToAnnotateSceneTwo() {
    return ["KGZ", "BGD", "TCD"]
}


//Third Scene
async function renderThirdScene() {
    // The svg
    const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
 
 // Map and projection
 const projection = d3.geoMercator()
    .scale(200)
    .center([0, 0])
    .translate([width / 2, height / 2]);
 
 const tooltip = d3.select("#slide-5")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10")
    .style("color", "white")
    .style("width", "150px")
    .style("height", "50px")
 
 // Data and color scale
 let data = new Map()
 const colorScale = d3.scaleOrdinal()
    .domain(getContinentKeys())
    .range(d3.schemeSet3.slice(2,11));
 
 // Load external data and boot
 Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("https://mkashy3.github.io/data/owid-covid-latest.csv", function (d) {
        if (d.last_updated_date.startsWith(2023)) {
            data.set(d.iso_code,
                {
                    last_updated_date: d.last_updated_date,
                    total_cases_per_million: Number(d.total_cases_per_million),
                    name: d.location,
                    population: d.population,
                    continent: d.continent
                });
        }
    })
 ]).then(function (loadData) {
    let topo = loadData[0]
 
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            if (!data.has(d.id)) {
                return 0;
            } else {
                return colorScale(data.get(d.id).continent);
            }
        })
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(thirdSceneTooltipHTML(data.get(d.id)));
            tooltip.style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
 })
 
    renderLegendSceneThree(d3.select("#chart-4"), getContinentKeys(), width, colorScale);
 }
 
 function thirdSceneTooltipHTML(object) {
     return "<div>" + object.name + "</div><div>" + Math.round(object.total_cases_per_million) + " total cases/million</div>";
 }

//Fourth scene
async function renderFourthScene() {
    const margin = {top: 10, right: 20, bottom: 30, left: 50},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
    const data = await d3.csv("https://mkashy3.github.io/data/us_state_vaccinations.csv");
    // append the svg object to the body of the page
    const svg = d3.select("#chart-3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    const filteredData = data.filter(function (d) {
        return d.total_vaccinations_per_hundred != "" && d.people_vaccinated_per_hundred != "";
    });

    const entities = getStateKeysForFourthScene();
    d3.select("#select-location")
        .selectAll('country-options')
        .data(entities)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
        }) // text showed in the menu
        .attr("value", function (d) {
            return d;
        }) // corresponding value returned by the button


    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
        .domain(entities)
        .range(d3.schemeSet3.slice(2,11));

    // Add X axis to measure time
    const x = d3.scaleLinear()
        .domain([0, 180])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));
    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0.2, 500])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d3.format("d")));

    // Initialize line with group a
    const firstCountryData = filteredData.filter(function (d) {
        return d.location === entities[0]
    });
    const line = svg
        .append('g')
        .append("path")
        .attr("id", "line-" + entities[0])
        .datum(firstCountryData)
        .attr("d", d3.line()
            .x(function (d) {
                return x(Number(d.people_vaccinated_per_hundred))
            })
            .y(function (d) {
                return y(Number(d.total_vaccinations_per_hundred))
            })
        )
        .attr("stroke", function (d) {
            return myColor(d.location)
        })
        .style("stroke-width", 4)
        .style("fill", "none")
    const mostRecentFirstCountryData = firstCountryData[firstCountryData.length - 1]
    renderFourthSceneAnnotations(mostRecentFirstCountryData, x(Number(mostRecentFirstCountryData.people_vaccinated_per_hundred)) - 10, y(Number(mostRecentFirstCountryData.total_vaccinations_per_hundred)) - 10, margin);

    function update(selectedGroup) {
        // Create new data with the selection?
        const countryData = filteredData.filter(function (d) {
            return d.location === selectedGroup;
        });

        // Give these new data to update line
        line
            .datum(countryData)
            .transition()
            .duration(1000)
            .attr("id", "line-" + selectedGroup)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(Number(d.people_vaccinated_per_hundred))
                })
                .y(function (d) {
                    return y(Number(d.total_vaccinations_per_hundred))
                })
            )
            .attr("stroke", function (d) {
                return myColor(selectedGroup)
            })

        // update the annotation
        const finalCountryData = countryData[countryData.length - 1];
        renderFourthSceneAnnotations(finalCountryData, x(Number(finalCountryData.people_vaccinated_per_hundred)) - 10, y(finalCountryData.total_vaccinations_per_hundred) - 10, margin)
    }

    // When the button is changed, run the updateChart function
    d3.select("#select-location").on("change", function (d) {
        // recover the option that has been chosen
        const selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

}


function renderFourthSceneAnnotations(d, x, y, margin) {
    d3.select(".annotation-group").remove();
    const annotations = [
        {
            note: {
                label: "The total number of vaccinations per hundred:  " + Math.round(d.total_vaccinations_per_hundred),
                lineType: "none",
                bgPadding: {"top": 15, "left": 10, "right": 10, "bottom": 10},
                title: d.entity,
                orientation: "topBottom",
                align: "top"
            },
            type: d3.annotationCalloutCircle,
            subject: {radius: 30},
            x: x,
            y: y,
            dx: -100,
            dy: -10
        },
    ];
    const makeAnnotations = d3.annotation().annotations(annotations);
    const chart = d3.select("svg")
    chart.transition()
        .duration(1000);
    chart.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "annotation-group")
        .call(makeAnnotations)
}



//Common funcs
function renderLegend(svg, continentKeys, width, myColor) {
    // Add one dot in the legend for each name.
    svg.selectAll("legend-dots")
        .data(continentKeys)
        .enter()
        .append("circle")
        .attr("cx", width - 100)
        .attr("cy", function (d, i) {
            return 50 + i * 25
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 2)
        .style("fill", function (d) {
            return myColor(d)
        })

    svg.selectAll("legend-labels")
        .data(continentKeys)
        .enter()
        .append("text")
        .attr("x", width + 8 - 100)
        .attr("y", function (d, i) {
            return 50 + i * 25
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d) {
            return myColor(d)
        })
        .text(function (d) {
            return d
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
}

function renderLegendSceneThree(svg, continentKeys, width, myColor) {
    // Add one dot in the legend for each name.
    svg.selectAll("legend-dots")
        .data(continentKeys)
        .enter()
        .append("circle")
        .attr("cx", width - 100)
        .attr("cy", function (d, i) {
            return 50 + i * 25
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 2)
        .style("fill", function (d) {
            return myColor(d)
        })

    svg.selectAll("legend-labels")
        .data(continentKeys)
        .enter()
        .append("text")
        .attr("x", width + 8 - 100)
        .attr("y", function (d, i) {
            return 50 + i * 25
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d) {
            return myColor(d)
        })
        .text(function (d) {
            return d
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
}


function getContinentKeys() {
    return ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"];
}

function getBubbleSizeScale() {
    // Add a scale for bubble size
    const z = d3.scaleLog()
        .domain([200000, 1310000000])
        .range([1, 30]);
    return z;
}

function getStateKeysForFourthScene() {
    return ["Alabama", "Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas", 
    "Bureau of Prisons", "California", "Colorado", "Connecticut", "Delaware", 
    "Dept of Defense", "District of Columbia", "Federated States of Micronesia", 
    "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indian Health Svc", 
    "Indiana", "Iowa", "Kansas", "Kentucky", "Long Term Care", "Louisiana", "Maine", 
    "Marshall Islands", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
    "New York State", "North Carolina", "North Dakota", "Northern Mariana Islands", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Republic of Palau", "Rhode Island", 
    "South Carolina", "South Dakota", "Tennessee", "Texas", "United States", "Utah", "Vermont", 
    "Veterans Health", "Virgin Islands", "Virginia", "Washington", "West Virginia", "Wisconsin", 
    "Wyoming"];
}
