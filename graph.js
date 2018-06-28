var margin = {top: 30, right: 20, bottom: 20, left: 30}; 
var width = 820;
var height = 520;
var drawWidth = width - margin.left - margin.right; 
var drawHeight = height - margin.top - margin.bottom; 

d3.select("body")
	.append("g")
  .append("h1")
  .text("Github")
  .style("fill", "#039BE5");

d3.select("body").on("contextmenu",d=>{
  d3.event.preventDefault()
    return false; });
  
var svg = d3.select("body")
  .append("svg")            
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .append("g")
  // falta o pan


// d3.csv("data/edges.csv", function(error, edges){	
// 	if(error) { console.log(error); }		
// 	buildGraph(edges);	
// });


d3.csv("data/edges.csv", function(error, edges){
	d3.csv("data/gephi/node_data.csv", function(error, csv){
		if(error) { console.log(error); }

		var data = crossfilter(csv);
		console.log(data.size());
		buildGraph(edges, data);
	});  
});

function buildGraph(edges,data){

//function buildGraph(edges){
	var nodes = {};
	var links = edges;

	var cScale = d3.scaleLinear().domain([1,80]).range([5, 20]); 

	// zoom settings
	var zoomCentered = null;
	var zoomLevel = 2;

	links.forEach(function(link) {	
		link.source = nodes[link.source] ||
			(nodes[link.source] = {user: link.source });			
		link.target = nodes[link.target] ||
			(nodes[link.target] = {user: link.target });
	});

	var link = svg.append("g")
		.attr("class", "link")
		.selectAll(".link")
		.data(links)
		.enter()
		.append("line")
		.style("stroke", "#c5a688")
		.style("stroke-width", "2px")
		.style("stroke-opacity", 0.7);

	var node = svg.append("g") 
		.selectAll(".node")
		.data(d3.values(nodes))
		.enter()
		.append("g")
		.attr("class", "node")

	var circle = node.append("circle")
		.style("fill", "#5ac5d1")
		.style("stroke", "white")	
		//.attr("stroke-width", "1.5px")	
		.attr("r", 
			d=>cScale(3.14*links.filter(e=>{  // boa proporcao entre as areas
			return e.source.user == d.user || e.target.user == d.user}).length
		));  
	
	// eventos 
	node.attr("cursor", "zoom-in")
		.on("click", clicked)  // contem zoom behavior
		.call(d3.drag()
			.on("start", ondragstart)
			.on("drag", ondrag)
			.on("end", ondragend))
		.call(d3.zoom()  // pensando em usar apenas o pan do zoom behavior (e o zoom por nodes)
		  	.scaleExtent([-1, 1])
		  	.on("zoom", function () {  // demo
		  		svg.attr("transform", d3.event.transform) })
		 );

	var labels = node.append("g")
	 	.append("text")
	    .attr("font-family", "Verdana")
	    .attr("font-size", 10)
		.attr("text-anchor", "middle") 
	    .text(function(d) { return d.user; }); 

	var force_dirGraph = d3.forceSimulation()			
		.force("link", d3.forceLink(links)) //.id(function(d) { return d.id; }))
		.force("charge", d3.forceManyBody())			
		.force("center", d3.forceCenter(drawWidth/2, drawHeight/2))
		//.force("radial",d3.forceRadial().radius(1.5))  // oculta caminhos indo para os nos de grau baixo, porem destaca clusters (a confirmar)
		.force("collision", d3.forceCollide().radius(//25));
			d=>(1.5*links.filter(e=>{
			return e.source.user == d.user || e.target.user == d.user}).length)) );
	    
	force_dirGraph.nodes(d3.values(nodes))			
		.on("tick", ticked);	

	function clicked(d) {
		var x;
		var y;
		var level;

		if(!d3.event.ctrlKey){
			if (zoomCentered !== d) {		
				x = d.x; 
				y = d.y; 
				level = zoomLevel;
				zoomCentered = d;		
			} else {
				x = width/2;
				y = height/2;
				level = 1;
				zoomCentered = null;
			}
			svg.transition()
			  .duration(1000)
			  .ease(d3.easeCubicOut)
			  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + level + ")translate(" + -x + "," + -y + ")");
		} else {  // o usuario libera o nó que fixou
		    d.fx = null;
		    d.fy = null;
		}			
	}

	function ondragstart(d) {
		if (!d3.event.active) force_dirGraph.alphaTarget(0.3).restart();
		  d.fx = d.x;
		  d.fy = d.y;
	}

	function ondrag(d) {		
		d.fx = d3.event.x;
		d.fy = d3.event.y;	  
	}

	// o usuario fixa a posicao do nó
	function ondragend(d) {
		if (!d3.event.active) force_dirGraph.alphaTarget(0);
		  d.fx = d.x;
		  d.fy = d.y;
	}	

	function ticked() {	

	link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });
		
	circle.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
			
	labels.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}


// testes... __________________

// var xScale = d3.scaleLinear().domain([]).range([0, drawWidth]);
// var yScale = d3.scaleLinear().domain([]).range([0, drawHeight]);

// function ticked() {	
// 	node.attr("cx", function(d) { return xScale(d.x); })
// 		.attr("cy", function(d) { return yScale(d.y); });
			
// 	link.attr("x1", function(d) { return xScale(d.source.x); })
// 		.attr("y1", function(d) { return yScale(d.source.y); })
// 		.attr("x2", function(d) { return xScale(d.target.x); })
// 		.attr("y2", function(d) { return yScale(d.target.y); });
// 	}
		
} // end