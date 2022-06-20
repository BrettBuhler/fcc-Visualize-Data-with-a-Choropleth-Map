let mapUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let dataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let mapData;
let tableData;
let w = 1000;
let h = 600;
let svg=d3.select('svg');
let tooltip = d3.select("#tooltip")
svg.attr('width', w).attr('height', h);

let mapFunction = () => {
    svg.selectAll('path')
        .data(mapData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (x) => {
            let id = x.id;
            let county = tableData.find((y) => {
                return y.fips === id;
            })
            let percent = county.bachelorsOrHigher;
            if (percent < 10) {
                return 'red';
            } else if (percent < 20){
                return 'orange';
            } else if ( percent < 30){
                return 'lightgreen';
            } else if ( percent < 40){
                return 'green';
            } else {
                return 'darkgreen';
            }
        })
        .attr('data-fips', (x) => {
            return x.id;
        })
        .attr('data-education', (x) => {
            let id = x.id;
            let county = tableData.find((y) => {
                return y.fips === id;
            })
            let percent = county.bachelorsOrHigher;
            return percent;
        })
        .on('mouseover', x => {
            tooltip.transition()
                .style('visibility', 'visible')

                let id = x.id;
                let county = tableData.find((y) => {
                    return y.fips === id;
                })
            tooltip.attr('data-education', x => {
                return county.bachelorsOrHigher;
            })
            tooltip.text(county.fips + ': ' + county.area_name + ', ' + county.state + " -- Education: " + county.bachelorsOrHigher + "%")
        })
        .on('mouseout', x => {
            tooltip.transition()
                .style('visibility', 'hidden');
        })
}

d3.json(mapUrl).then(
    (response, error) => {
        if(error){
            console.log(log)
        } else {
            mapData = topojson.feature(response, response.objects.counties).features;
            console.log(mapData);

            d3.json(dataUrl).then(
                (response, error) =>{
                    if(error){
                        console.log(log);
                    } else {
                        tableData = response;
                        console.log(tableData);
                        mapFunction();
                    }
                }
            )
        }
    })