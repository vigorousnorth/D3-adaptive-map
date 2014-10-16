//								Andr		Aroo		Cumb		Frank		Hancock	Kenne		Knox		Linc		Oxford	Penob		Pisca		Sagada	Somerse	Waldo		Washing	York
var data  =			  [99.6,	87.2,		97.8,		70.7,		80.7,		99.1,		98.0,		99.4,		94.5,		88.7,		46.1,		91.9,		79.8,		86.7,		88.5,		98.8	];

function pair(array) {
	return array.slice(1).map(function(b, i) {
		return [array[i], b];
	});
}

//Define svg width and height in terms of dimensions of the containing element
var width = parseInt(document.getElementById("boundingbox").offsetWidth) * .75,
		height = width*1.3;
		
var fill = d3.scale.linear()
	 .domain([0, 100])
	 .range(["white", "darkblue"]);

var x1 = d3.scale.linear()
		.domain([0, 100])
		// legend width is expressed in terms of the bounding box width
		.range([0,width/2]);

var legendAxis = d3.svg.axis()
		.ticks(5)
		.scale(x1)
		.orient("bottom")
		.tickSize(22)
		.tickFormat(d3.format(".0f%"));

// Scale is expressed in terms of svg width variable
var scale = width * 12;
var projection = d3.geo.conicConformal()
		.parallels([38 + 02 / 60, 39 + 12 / 60])
		.rotate([70, 0])
		.scale(scale)
		.translate([0, 0]);

var path = d3.geo.path()
		.projection(projection);

var svg = d3.select("#boundingbox").append("svg")
		.attr("width", width)
		.attr("height",	 height)   


d3.json("mainecounties_topo.json", function(error, topo) {

var state = topojson.feature(topo, topo.objects.states),
		statebounds = path.bounds(state);
		
var counties = topojson.feature(topo, topo.objects.counties);

projection
      .translate([width  * .55 - (statebounds[0][0] + statebounds[1][0]) * .55, height / 2 - (statebounds[0][1] + statebounds[1][1]) / 2]);
      
var g =
  svg.append("g")
    .attr("class", "counties")
    .selectAll("path");
    
var counties = 
	g.data(topojson.feature(topo, topo.objects.counties).features)
	.enter().append("path")
		.attr("d", path)
		.attr("class","county");	

counties		
	.style("fill", function(d,i) { return fill(data[i]); })
	.attr("county", function(d) {
			return d.properties.name;
	})
	.attr("centroid-x", function(d) {
			var centroid = path.centroid(d);
			return centroid[0];
	} )
	.attr("centroid-y", function(d) {
			var centroid = path.centroid(d);
			return centroid[1];
	} );


svg.append("path")
		.datum(topojson.mesh(topo, topo.objects.counties, function(a, b) { return a !== b; }))
		.attr("class", "county-outline")
		.attr("d", path);

d3.select('#boundingbox').append("div")
	.attr("class","tooltip");  	

d3.select('.caption').text("Percentage of addresses with Tier 1 access");  


//  Build the legend


var legend = svg.append('g')
	.attr("transform", "translate(" + width * .4 + "," + (height * .9) + ")")
	.attr('class','key');
	
legend.selectAll("rect")
		.data(pair(x1.ticks(20)))
	.enter().append("rect")
		.attr("height", 20)
		.attr("x", function(d) { return x1(d[0]); })
		.attr("width", function(d) { return x1(d[1]) - x1(d[0]); })
		.style("fill", function(d) { return fill(d[0]); });

legend.call(legendAxis).append("text")
		.attr("class", "caption")
		.attr("y", -10)
		.text("Percentage");    
		

});  // end of d3.json function