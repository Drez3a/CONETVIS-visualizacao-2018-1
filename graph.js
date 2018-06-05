d3.select('body')
  .append("g")
  .append("h1")
  .text("GITHUB");

var width = 800;
	height = 500;

var svg = d3.select('body')
			.append('g')
			.append('svg')
			.attr('width', width)
			.attr('height', height); 

var nodes = {};

var links = [
	{source: 'ana', target: 'joana'},
	{source: 'ana', target: 'jose'},
	{source: 'joana', target: 'jose'},
];

links.forEach(function(link) {
	link.source = nodes[link.source] ||
		(nodes[link.source] = {name: link.source});
	link.target = nodes[link.target] ||
		(nodes[link.target] = {name: link.target});
});

var link = svg
			.append('g')
			.attr('class', 'link')
			.selectAll('.link')
			.data(links)
			.enter()
			.append('line')
			.attr('stroke', 'black');

var node = svg
			.selectAll('.node')
			.data(d3.values(nodes))
			.enter()
			.append('g')
			.attr('class', 'node')
			.append('circle')			
			.attr('r', width*0.01)
			.call(d3.drag()
				.on("start", dragstarted)
        		.on("drag", dragged)
        		.on("end", dragended));

var force_dirGraph = d3.forceSimulation()			
			.force('link', d3.forceLink(links))
			.force("charge", d3.forceManyBody())
			.force('center', d3.forceCenter(width / 2, height / 2));
			
force_dirGraph.nodes(d3.values(nodes))			
							.on('tick', tick);
			
force_dirGraph.force("link")
      				.links(links);    

function tick() {	

	node.attr('cx', function(d) { return d.x; })
		.attr('cy', function(d) { return d.y; });
	
	link.attr('x1', function(d) { return d.source.x; })
			.attr('y1', function(d) { return d.source.y; })
			.attr('x2', function(d) { return d.target.x; })
			.attr('y2', function(d) { return d.target.y; });

}

function dragstarted(d) {
  if (!d3.event.active) force_dirGraph.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) force_dirGraph.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}