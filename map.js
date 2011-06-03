GRID_SIZE = 10

function Node(x,y){
	this.x = x || 0.0;
	this.y = y || 0.0;
	this.walkable = true;
	this.distance = function(node){
		var dx = this.x - node.x;
		var dy = this.y - node.y;
		return Math.sqrt(dx*dx + dy*dy);
	};	//return number
	this.walkable = function() {
		return this.walkable;
	};
	this.toggle = function() {
		this.walkable = !this.walkable
	};
	this.draw = function(ctx, color) {
		bw = this.walkable ? 'white' : 'black';
		ctx.fillStyle = color || bw;
		ctx.fillRect(x*GRID_SIZE,y*GRID_SIZE,GRID_SIZE,GRID_SIZE)
	};
}

function Map(w,h) {
	this.width = w = w || 10;
	this.height = h = h || 10;
	this.grid = [];
	for (var i = 0; i < w; i++) {
		this.grid[i] = []
		for (var j = 0; j < h; j++) {
			this.grid[i][j] = new Node(i,j)
		};
	};
	this.nodeAt = function(x,y){
		if (0<=x && x < this.width &&
				0<=y && y < this.height){
			return this.grid[x][y];	
		}else{
			return null;
		}
	}
	this.draw = function(ctx) {
		for (var i = 0; i < this.grid.length; i++) {
			for (var j = 0; j < this.grid[i].length; j++) {
				this.grid[i][j].draw(ctx);
			};
		};
	};
	this.randomiz = function() {
		for (var i = 0; i < this.width; i++) {
			for (var j = 0; j < this.height; j++) {

				this.grid[i][j].walkable = Math.round(Math.random()) == true
			};
		};
	};
}

diagadj = function(node){
	var out = [];
	var a = [[-1,-1],[0,-1],[1,-1],
			 [-1, 0],       [1, 0],
			 [-1, 1],[0, 1],[1, 1]]
	for(var p in a){
		px = node.x + a[p][0]
		py = node.y + a[p][1]
		adjnode = map.nodeAt(px,py)
		if(adjnode && adjnode.walkable){
			out.push(adjnode);
		}
	}
	return out;
};