const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
const req = new XMLHttpRequest()

let data
let values

let heightScale
let xScale 
let xAxisScale
let yAxisScale

let width = 800
let height = 600
let padding = 80

let svg = d3.select("svg")


let drawCanvas= () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {
heightScale = d3.scaleLinear()
    .domain([0,d3.max(values, (item) => {
        return item[1]
    })])
    .range([0, height - (2*padding)])

    xScale = d3.scaleLinear()
        .domain([0, values.length-1])
        .range([padding, width - padding])


    let datesArr = values.map((item) => {
        return new Date(item[0])
    })


    xAxisScale = d3.scaleTime()
    .domain([d3.min(datesArr), d3.max(datesArr)])
    .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(values, (item) => {
        return item[1]
    })])
    .range([height - padding, padding])


}

let drawBars = () => {

    let tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', '0')
    .style('height', 'auto')
    .style('width', 'auto')
    tooltip.text("placeholder")


    let name = d3.select('body')
    .append('div')
    .attr('id', 'name')
    .style('height', 'auto')
    .style('width', 'auto')

    name.text(nameData)

    let dates = d3.select('body')
    .append('div')
    .attr('id', 'dates')
    .style('height', 'auto')
    .style('width', 'auto')

    dates.text(start + " - " + end)



    let display_url = d3.select('body')
    .append('div')
    .attr('id', 'description')
    .style('height', 'auto')
    .style('width', 'auto')

    display_url.text(display_urlData)


    let description = d3.select('body')
    .append('div')
    .attr('id', 'description')
    .style('height', 'auto')
    .style('width', 'auto')

    description.text(desc) 






    svg.selectAll('rect')
    .data(values)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', (width - (2*padding)) / values.length)
    .attr('data-date', (item) => {
        return item[0]
    })
    .attr('data-gdp', (item) => {
        return item[1]
    })
    .attr('height', (item) => {
        return heightScale(item[1])
    })
    .attr('x', (item, index) => {
        return xScale(index)
    })
    .attr('y', (item) =>{
        return (height - padding) - heightScale(item[1])

    })
    .on('mouseover', (e, item) => {
        tooltip.transition()
        .style('opacity', '1')

        tooltip.text(item[0] + " - " + "$" + item[1] + "(bil)") 


        document.querySelector('#tooltip').setAttribute('data-date', item[0])
    })
    .on('mouseout', (item) => {
        tooltip.transition()
        .style('opacity', '0')
    })


    svg.selectAll('text')
    .attr('class', 'text')

}

let generateAxes = () => {

    let xAxis = d3. axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')' )

        svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')

    

}
//three args - method, url, async bool
req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    nameData = data.name
    display_urlData = data.display_url
    values = data.data
    desc = data.description
    source = data.source_name
    start = data.from_date
    end = data.to_date
    console.log(desc)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}

req.send()

