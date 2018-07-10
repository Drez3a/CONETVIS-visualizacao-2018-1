function heatmap(node_data){
  var width = 460

  var heatScale = d3.scaleLinear()
                .domain([1, 8, 15])
                .range(['#5C4033','cyan','#688970'])
                .interpolate(d3.interpolateRgb); //interpolateHsl interpolateHcl interpolateRgb

  var svgGroup = d3.select("body")
    .append("svg")            
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + (margin.top + 20) + ")");

  node_data.forEach(function(d){
    freq = {};
    // normalizacao - a principio adotei apenas os repositorios proprios
    d.Repo_Owner = d.Repo_Owner.split(",");
    d.oRepo_Language = d.oRepo_Language.split(",");
    // d.node_data.Repo_Member = d.node_data.Repo_Member.split(",");
    // d.node_data.mRepo_Language = d.node_data.mRepo_Language.split(",");

    d.oRepo_Language.forEach(function(e){
      freq[e] = freq[e] + 1 || 1
    });
    d.oLing_Freq = freq;
  });

  // width_dm = 280;
  // height_dm = 160; 

  // var temp = [ {coord1:1, coord2: "1"}, {coord1:2, coord2: "1"}, {coord1:3, coord2: "1"}, {coord1:4, coord2: "1"},
  //              {coord1:1, coord2: "2"}, {coord1:2, coord2: "2"}, {coord1:3, coord2: "2"}, {coord1:4, coord2: "2"},
  //              {coord1:1, coord2: "3"}, {coord1:2, coord2: "3"}, {coord1:3, coord2: "3"}, {coord1:4, coord2: "3"},
  //              {coord1:1, coord2: "4"}, {coord1:2, coord2: "4"}, {coord1:3, coord2: "4"}, {coord1:4, coord2: "4"},
  //              {coord1:1, coord2: "5"}, {coord1:2, coord2: "5"}, {coord1:3, coord2: "5"}, {coord1:4, coord2: "5"},
  //              {coord1:1, coord2: "6"}, {coord1:2, coord2: "6"}, {coord1:3, coord2: "6"}, {coord1:4, coord2: "6"}
  //            ];

  // valores distintos
  // var x_elem = d3.set(node_data[2].oRepo_Language, function(d){ return d }).values(); 
  // var y_elem = d3.set(node_data[2].oRepo_Language, function(d){ return d }).values(); 

  // var xScale = d3.scaleOrdinal().domain(x_elem).range([0, cell]);  
  // var yScale = d3.scaleOrdinal().domain([y_elem]).range([0, cell]); 

  // cellx = width_dm / x_elem.length;
  // celly = height_dm / y_elem.length;
    
  //   // testes  
  //   console.log("heat",xScale("Java"))
  //   console.log("heat",xScale("None")) 
  //   console.log("heat",xScale("Arduino"))
  //   console.log(xScale(2))
  //   console.log(x_elem)

  //   console.log("heat",yScale("Vue"))
  //  // console.log(yScale(Vue))
  //   console.log(yScale(3))
  
  // var heatMap = svgGroup.append("g")
  //   .attr("class", "heatmap")
  //   .selectAll("heatmap")
  //   .data(temp)
  //   .enter().append("rect")
  //   .attr("x", function(d) { return xScale(d.coord1); }) 
  //   .attr("y", function(d) { return yScale(d.coord2); })     
  //   .attr("width", cellx)
  //   .attr("height", celly)
  //   .style("fill", function(d,i) { return heatScale(i/3); })
  //    .attr("transform", "translate(" + margin.left + "," + 360 + ")");


  // teste com dados padronizados
  width_dm = 280;
  height_dm = 160;

  var temp = [ {coord1:1, coord2: "1"}, {coord1:2, coord2: "1"}, {coord1:3, coord2: "1"}, {coord1:4, coord2: "1"},
               {coord1:1, coord2: "2"}, {coord1:2, coord2: "2"}, {coord1:3, coord2: "2"}, {coord1:4, coord2: "2"},
               {coord1:1, coord2: "3"}, {coord1:2, coord2: "3"}, {coord1:3, coord2: "3"}, {coord1:4, coord2: "3"},
               {coord1:1, coord2: "4"}, {coord1:2, coord2: "4"}, {coord1:3, coord2: "4"}, {coord1:4, coord2: "4"},
               {coord1:1, coord2: "5"}, {coord1:2, coord2: "5"}, {coord1:3, coord2: "5"}, {coord1:4, coord2: "5"},
               {coord1:1, coord2: "6"}, {coord1:2, coord2: "6"}, {coord1:3, coord2: "6"}, {coord1:4, coord2: "6"}
             ];

  x_elem = d3.set(temp.map(function( item ) { return item.coord1; } )).values();  
  y_elem = d3.set(temp.map(function( item ) { return item.coord2; } )).values(); 

  cellx = width_dm / x_elem.length;
  celly = height_dm / y_elem.length;

  var xScale = d3.scaleLinear().domain(x_elem).range([0, cellx]);
  var yScale = d3.scaleLinear().domain(y_elem).range([0, celly]);     
  
  var heatMap = svgGroup.append("g")
    .attr("class", "heatmap")
    .selectAll("heatmap")
    .data(temp)
    .enter().append("rect")
    .attr("width", cellx)
    .attr("height", celly)
    .attr("x", function(d) { return xScale(d.coord1); }) 
    .attr("y", function(d) { return yScale(d.coord2); })  
    .style("fill", function(d,i) { return heatScale(i/3); })
    .attr("transform", "translate(" + margin.left + "," + 360 + ")");

}


