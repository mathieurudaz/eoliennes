function Boid(x, y, map) {
  this.map = map;
  this.fieldPos = null;
  this.radius = 1.5;
  this.angle = Math.random() * Math.PI * 2;
  this.init();
}

Boid.prototype.init = function () {
  this.age = 0;
  this.color = "#ffffff"//"rgba(255,255,255,0)"//"rgba(160,160,255,0.95)"//"#333333";
  this.lifespan = Math.random()*50;
  this.position = new Victor(
    this.map.bounds[0][0] + Math.random()*(this.map.bounds[1][0]-this.map.bounds[0][0]), 
    this.map.bounds[0][1] + Math.random()*(this.map.bounds[1][1]-this.map.bounds[0][1]))
  this.velocity = new Victor(0.0025, 0);
  this.orient(this.map.getFieldPosValue(this.position).z, 0.3)
};

Boid.prototype.update = function () {
  // Apply rotation to velocity
  if(this.map.getFieldBPos(this.position) !== false && this.fieldPos != this.map.getFieldBPos(this.position)){
    this.orient(
      this.map.getFieldPosValue(this.position).z,
      0.3)
    this.fieldPos = this.map.getFieldBPos(this.position);
  }

  // Apply velocity to position
  this.position.add(this.velocity);

  // Increase age
  this.age += 1;

  // Respawn anew after a while
  if(this.age > this.lifespan){
    this.init();
  }
};

Boid.prototype.orient = function (angle, velocity) {
  //console.log("")
  var angle = parseInt( angle )
  var angleDem =  angle > 180 ? 180+(180 - angle) : angle
  var angleDem =  angle > 180 ? 180+(180 - angle + 90) : 90 - angle
  //console.log("angle: " + angle + " - cell: " + this.map.getFieldBPos(this.position))

  this.velocity.rotateDeg((angleDem - this.velocity.horizontalAngleDeg()));
};

Boid.prototype.render = function () {
  this.map.ctx.fillStyle = this.color;
  projected_position = this.map.projection([this.position.x, this.position.y])
  this.map.ctx.fillRect(projected_position[0], projected_position[1], this.radius, this.radius);
};