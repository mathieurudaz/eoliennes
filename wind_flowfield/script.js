function Windmap(container){

}


var width = $("#graphique").width();
var height = width * 1;

var color, strengthColor, normalizedStrength = d3.scaleLinear();

var windData = null;
var windStrength = null;
var filteredWindData = null;
var ij, max, scale, strengthScale;
var offset = 0;

var svg = d3.select('#graphic')
  .append('svg')
  .attr("width", width*10)
  .attr("height", height*10);

var ctx = d3.select('#graphic')
  .append('canvas')
  .attr("width", width)
  .attr("height", height)
  .node()
  .getContext('2d');

ctx.globalAlpha = 0.6;
ctx.fillStyle = "rgba(0, 0, 0, 0.97)"

var cols = 200;
var rows = 145;

var projection = d3.geoMercator()
  .center([6.63, 46.5652])
  .scale(25800)
  .translate([width/2,height/2]);


var path = d3.geoPath().projection(projection);

d3.json("./wind_flowfield/mask_EPSG4326_quantized.json", function(error, vd) {

    // Mask
    svg.append("g")
      .attr("class", "mask")
      .selectAll("path")
      .data(topojson.feature(vd, vd.objects.mask_EPSG4326).features)
      .enter().append("path")
      .attr("d", path);

    // Localities
    var cities = [
      {name: 'Lausanne', cord: [6.62, 46.51]},
      {name: 'Yverdon', cord: [6.632, 46.775]},
      {name: 'Montreux', cord: [6.914, 46.432]},
      {name: 'Nyon', cord: [6.230, 46.383]},
      {name: 'Orbe', cord: [6.540, 46.727]}
    ]

    var circles = svg.selectAll("circles")
      .data(cities)
      .enter()
      .append('circle')
      .attr("cx", 0)
      .attr("cy", 0)
      .attr('r', 2)
      .attr("transform", function(d, i) {return "translate(" + projection(d.cord)[0] + "," + projection(d.cord)[1] + ")";});

    var text = svg.selectAll("text")
      .data(cities)
      .enter()
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("transform", function(d, i) {return "translate(" + projection(d.cord)[0] + "," + projection(d.cord)[1] + ")";})
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .text( function (d) { return d.name; });

    // Legend
    var legend = svg.append("g")
      .attr("class","legend")
      .attr("transform","translate(30,60)");

    legend.append("text")
      .attr("x", "100px")
      .attr('dy', -7)
      .text("Force du vent")
      .attr("class", "legend-title")
      .attr('text-anchor', 'middle');

    for(var i=0; i<5; i++){
      legend.append("rect")
        .attr("x", i*41)
        .attr("y", 0)
        .attr("width", 40)
        .attr("height", 7)
        //.attr("fill", strengthColor(i*20/100));

      legend.append("text")
        .text(i*5 + (i >= 4 && " km/h"))
        .attr('dy', 19)
        .attr("x", i*41)
        .attr("y", 0)
    }

    // Title
    var title = svg.append("g")
      .attr("class","title")
      .attr("transform","translate(50,30)");

    title.append("text")
      .attr("class", "title-date")
      .attr("x", "100px")
      .attr('dy', -7)
      .text("Lundi 11 décembre 15:30")
      .attr('text-anchor', 'middle');
});


function getFieldBPos(pos){

  var boidCol =  Math.floor((pos.x-bounds[0])/(Math.abs(bounds[0] - bounds[2])/cols))
  var boidRow =  Math.floor(Math.abs(pos.y-bounds[1])/(Math.abs(bounds[3] - bounds[1])/rows))

  fieldCellIndex = boidCol + cols * boidRow;

  if (fieldCellIndex >= 0 && fieldCellIndex < cols*rows){
    return fieldCellIndex
  }else{
    return 0;
  }
}

function getFieldPosValue(pos){
  return windData[(offset*cols*rows) + getFieldBPos(pos)]
}

function getFieldPosBStrength(pos){
  return windStrength[getFieldBPos(pos)]
}

function nextHour(){
  offset = ((offset + 1) % 3) 
  $("text.title-date").text("Lundi 12 décembre " + ( 8 + offset ) + ":00")
  console.log( offset + ", " + ( offset*cols*rows ) )
}

$("body").on("click", function(e){

  nextHour()

})