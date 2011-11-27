function Vect(x,y){
  this.x = x || 0.0;
  this.y = y || 0.0;

  this.distTo = function(v){
    var dx = Math.abs(v.x - this.x);
    var dy = Math.abs(v.y - this.y);

    return Math.sqrt((dx*dx)+(dy*dy));
  };
  this.length = function(){
    return Math.sqrt((this.x*this.x)+(this.y*this.y));
  };
  this.lengthSq = function(){
    return (this.x*this.x)+(this.y*this.y);
  };
  this.normalise = function() {
    var l = this.length();
    if (l === 0){
      this.x = 0;
      this.y = 0;
    }else{
      this.x = this.x/l;
      this.y = this.y/l;
    }
    return this;
  };
  this.getNormalised = function() {
    var c = this.copy();
    return c.normalise();
  };
  this.sub = function(v){
    this.x -= v.x;
    this.y -= v.y;
    return this;
  };
  this.add = function(v){
    this.x += v.x;
    this.y += v.y;
    return this;
  };
  this.mult = function(n){
    this.x *= n;
    this.y *= n;
    return this;
  };
  this.copy = function() {
    return new Vect(this.x, this.y);
  };
  this.angle = function() {
    return Math.atan2(this.x,this.y);
  };
  this.angleTo = function(v) {
    return Math.atan2(v.x-this.x,v.y-this.y);
  };
}
Vect.sub = function(v1,v2){
  return new Vect(v1.x-v2.x,v1.y-v2.y);
};
Vect.add = function(v1,v2){
  return new Vect(v1.x+v2.x,v1.y+v2.y);
};