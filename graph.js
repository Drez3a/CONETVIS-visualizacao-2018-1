var margin = {top: 30, right: 20, bottom: 20, left: 30}; 
var width = 1000;
var height = 650;
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
  .call(d3.zoom()  // usa apenas o pan do zoom behavior
  	.scaleExtent([1, 1])
  	.on("zoom", function () {  // demo
  		svg.attr("transform", d3.event.transform)
    })
  );


d3.csv("data/edges.csv", function(edges){
  buildGraph(edges);
});


function buildGraph(edges){
	var nodes = {};
	var links = edges;

	var cScale = d3.scaleLinear()    	
	  .domain([0,100])
	  .range([10, 200]); 

	// zoom settings
	var zoomCentered = null;
	var zoomLevel = 3;

	links.forEach(function(link) {
		link.source = nodes[link.source] ||
			(nodes[link.source] = {user: link.source});			
		link.target = nodes[link.target] ||
			(nodes[link.target] = {user: link.target});
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

	var node = svg.selectAll(".node")
		.data(d3.values(nodes))
		.enter()
		.append("g")
		.attr("class", "node")
		.append("circle")	
		.style("fill", "#5ac5d1")
		.style("stroke", "white")	
		//.attr("stroke-width", "1.5px")	
		.style("r", d=>cScale(0.2*links.filter(e=>{
			return e.source.user == d.user || e.target.user == d.user}).length
		));  
		
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

	// eventos 
	node.attr("cursor", "zoom-in")
		.on("click", clicked)  // contem zoom behavior
		.call(d3.drag()
			.on("start", ondragstart)
			.on("drag", ondrag)
			.on("end", ondragend));

	var force_dirGraph = d3.forceSimulation()			
		.force("link", d3.forceLink(links))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(width/2, height/2))
		.force("collision",d3.forceCollide().radius(30));;
	    
	force_dirGraph.nodes(d3.values(nodes))			
		.on("tick", ticked);
	    
	force_dirGraph.force("link").links(links);    

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
	node.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
			
	link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });
	}
		
} 