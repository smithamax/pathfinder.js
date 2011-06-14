function Agent (x,y) {
	this.pos = new Vect(x,y)
	this.dest = this.pos.copy()
	this.maxSpeed = 0.2;
	this.path;
	this.curPathNode = 0
}
Agent.prototype = {
	update: function(delta){
		var speed;
		var dist = this.pos.distTo(this.dest)
		if(dist < this.maxSpeed*delta){
			if (this.curPathNode < path.length-1){
				this.moveTo(this.path[++this.curPathNode])
			}
		} 
		if(this.pos.distTo(this.dest)){
			this.heading = Vect.sub(this.dest, this.pos)
			this.heading.normalise()
			speed = this.heading.mult(this.maxSpeed*delta)
			if(this.pos.distTo(this.dest) < speed.length()){
				speed = Vect.sub(this.dest, this.pos);
			}
			this.pos.add(speed)
		}
	},
	draw: function(ctx){
		var offset = GRID_SIZE/2;
		var radius = GRID_SIZE/2 - 2;
		ctx.save();
		ctx.fillStyle = 'black'
		ctx.beginPath();
		ctx.arc(offset,offset,radius,0,Math.PI*2);
		ctx.fill();
		ctx.restore()
	},
	moveTo: function(node){
		this.dest = new Vect(node.x*GRID_SIZE, node.y*GRID_SIZE)
	},
	followPath: function(path){
		this.path = path;
		this.curPathNode = 0;
		this.moveTo(this.path[this.curPathNode])
	}
}