function Windmap(container, callback){
  var that = this;
  this.width = $(container).width();
  this.height = this.width * 0.65;

  this.color, this.strengthColor, this.normalizedStrength = d3.scaleLinear();

  this.windData = null;
  //this.windStrength = null;
  this.filteredWindData = null;
  this.ij, this.max, this.scale, this.strengthScale;
  this.offset = 0;

  this.svg = d3.select(container)
    .append('svg')
    .attr("width", this.width*10)
    .attr("height", this.height*10);

  this.ctx = d3.select(container)
    .append('canvas')
    .attr("width", this.width)
    .attr("height", this.height)
    .node()
    .getContext('2d');

  this.ctx.globalAlpha = 0.6;
  this.ctx.fillStyle = "rgba(0, 0, 0, 0.97)"

  this.cols = 200;
  this.rows = 145;

  this.projection = d3.geoMercator()
    .center([6.65, 46.58])
    .scale(this.width * 31.75)
    .translate([this.width/2,this.height/2]);

  this.path = d3.geoPath().projection(this.projection);


  d3.json("./wind_flowfield/mask_EPSG4326_quantized.json", function(error, vd) {
      // Draw mask
      that.svg.append("g")
        .attr("class", "mask")
        .selectAll("path")
        .data(topojson.feature(vd, vd.objects.mask_EPSG4326).features)
        .enter().append("path")
        .attr("d", that.path);

      // Places name and coordinates
      var cities = [
        {name: 'Lausanne', cord: [6.62, 46.51]},
        {name: 'Yverdon', cord: [6.632, 46.775]},
        {name: 'Montreux', cord: [6.914, 46.432]},
        {name: 'Nyon', cord: [6.230, 46.383]},
        {name: 'Orbe', cord: [6.540, 46.727]}
      ]

      // Draw places circles
      var circles = that.svg.selectAll("circles")
        .data(cities)
        .enter()
        .append('circle')
        .attr("cx", 0)
        .attr("cy", 0)
        .attr('r', 2)
        .attr("transform", function(d, i) {return "translate(" + that.projection(d.cord)[0] + "," + that.projection(d.cord)[1] + ")";});
      
      // Draw places text
      var text = that.svg.selectAll("text")
        .data(cities)
        .enter()
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform", function(d, i) {return "translate(" + that.projection(d.cord)[0] + "," + that.projection(d.cord)[1] + ")";})
        .attr('text-anchor', 'middle')
        .attr('dy', -5)
        .text( function (d) { return d.name; });

      // Draw Legend

      /*
      var legend = that.svg.append("g")
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
      */

      /*
      // Title
      var title = that.svg.append("g")
        .attr("class","title")
        .attr("transform","translate(50,30)");

      title.append("text")
        .attr("class", "title-date")
        .attr("x", "100px")
        .attr('dy', -7)
        .text("Lundi 11 décembre 15:30")
        .attr('text-anchor', 'middle');
      */
  });

  d3.csv("./wind_flowfield/wind_direction_concatenated.csv", function(data) {
      that.windData = data;
      that.filteredWindData = that.windData.filter(function(d){ return d.z > 200; })
      dataSorted = data.slice()

      ij = 0
      max = dataSorted.sort(function(a, b) { return b.z - a.z; });
      max = max[0].z
      scale = d3.scaleLinear().domain([0, max]).range(['rgba(255,0,255,1)', 'rgba(50,255,255,1)']);

      for (var i = 0; i < 10000; ++i) {
        boids.push(new Boid(
          Math.random() * that.width,
          Math.random() * that.height,
          that));
      }

      requestAnimationFrame(function(){ that.animate() });
      callback();
  });

  /*d3.csv("./wind_flowfield/wind_strength_EPSG4326_clipped_200x145.csv", function(data) {
      that.windStrength = data;
      dataSorted = data.slice()

      strengthMax = dataSorted.sort(function(a, b) { return b.z - a.z; });
      strengthMax = strengthMax[0].z
      that.strengthColor = d3.scaleLinear().domain([4.29, 14, strengthMax]).range(['#02d8db', '#8c96c6', '#edf8fb']);

      that.normalizedStrength = d3.scaleLinear().domain([4, 16]).range([0.9, 1.02]);
  });*/
}


Windmap.prototype.wrapAround = function(boid) {
  if (boid.position.x < bounds[0]) {
    boid.init();
  }
  if (boid.position.y < bounds[3]) {
    boid.init();
  }
  if (boid.position.x >= bounds[2]) {
    boid.init();
  }
  if (boid.position.y >= bounds[1]) {
    boid.init();
  }
}

Windmap.prototype.updateBoids = function() {
  var that = this;

  boids.forEach(function (boid) {
    // Move the boid
    boid.update();

    // Wrap around the screen
    that.wrapAround(boid);

    // Render
    boid.render();
  });
}

Windmap.prototype.animate = function() {  
  var that = this;
  this.ctx.fillStyle = "rgba(255,255,255,0.025)"
  this.ctx.fillRect(0,0,this.width,this.height)

  this.updateBoids();

  requestAnimationFrame(function(){ that.animate() });
}

Windmap.prototype.getFieldBPos = function(pos){
  var boidCol =  Math.floor((pos.x-bounds[0])/(Math.abs(bounds[0] - bounds[2])/this.cols))
  var boidRow =  Math.floor(Math.abs(pos.y-bounds[1])/(Math.abs(bounds[3] - bounds[1])/this.rows))

  fieldCellIndex = boidCol + this.cols * boidRow;

  if (fieldCellIndex >= 0 && fieldCellIndex < this.cols*this.rows){
    return fieldCellIndex
  }else{
    return 0;
  }
}

Windmap.prototype.getFieldPosValue = function(pos){
  return this.windData[(this.offset*this.cols*this.rows) + this.getFieldBPos(pos)]
}

/*Windmap.prototype.getFieldPosBStrength = function(pos){
  return windStrength[getFieldBPos(pos)]
}*/

/*Windmap.prototype.nextHour = function(){
  offset = ((offset + 1) % 3) 
  $("text.title-date").text("Lundi 12 décembre " + ( 8 + offset ) + ":00")
  console.log( offset + ", " + ( offset*cols*rows ) )
}*/