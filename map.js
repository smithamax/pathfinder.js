var GRID_SIZE = 15;

function Node(x,y){
	this.x = x || 0.0;
	this.y = y || 0.0;
	this.walkable = true;

	this.distance = function(node){
		var dx = this.x - node.x;
		var dy = this.y - node.y;
		return Math.sqrt(dx*dx + dy*dy);
	};	//return number

	this.toggle = function() {
		this.walkable = !this.walkable;
	};

	this.draw = function(ctx, color) {
		var bw = this.walkable ? 'white' : 'black';
		ctx.fillStyle = color || bw;
		ctx.fillRect(x*GRID_SIZE,y*GRID_SIZE,GRID_SIZE,GRID_SIZE);
	};
}

function Map(w,h) {
	this.width = w = w || 10;
	this.height = h = h || 10;
	this.grid = [];
	this.canvas = document.createElement('canvas');
	this.canvas.width = w * GRID_SIZE;
	this.canvas.height = h * GRID_SIZE;
	this.ctx = this.canvas.getContext('2d');
	this.dirty = true;

	for (var i = 0; i < w; i++) {
		this.grid[i] = [];
		for (var j = 0; j < h; j++) {
			this.grid[i][j] = new Node(i,j);
		}
	}

	this.nodeAt = function(x,y){
		if (0<=x && x < this.width &&
				0<=y && y < this.height){
			return this.grid[x][y];	
		}else{
			return null;
		}
	};

	this.draw = function(_ctx) {
		if (this.dirty){
			for (var i = 0; i < this.grid.length; i++) {
				for (var j = 0; j < this.grid[i].length; j++) {
					this.grid[i][j].draw(this.ctx);
				}
			}
			this.dirty = false;
		}
		_ctx.drawImage(this.canvas,0,0);
		
	};

	this.randomiz = function() {
		for (var i = 0; i < this.width; i++) {
			for (var j = 0; j < this.height; j++) {

				this.grid[i][j].walkable = !Math.round(Math.random());
			}
		}
	};
	this.applyTemplete = function(temp,scale) {
		for (var i = 0; i < temp.length; i++) {
			for (var j = 0; j < temp[i].length; j++) {
				if (temp[i][j].type == PERIMETER){
					this.applyTempTile(i,j,false,scale)

				}else if(temp[i][j].type == ROOM){
					this.applyTempTile(i,j,true,scale)

				}else if(temp[i][j].type == CORRIDOR){
					this.applyTempTile(i,j,true,scale)

				}else if(temp[i][j].type == ENTRANCE){
					this.applyTempTile(i,j,true,scale)

				}else{
					this.applyTempTile(i,j,true,scale)
				}
				
			};
		};
	};
	this.applyTempTile = function(x,y,walkable,scale) {
		walkable = walkable || false;
		scale = scale || 1;
		var tx, ty;
		for (var i = 0; i < scale; i++) {
			for (var j = 0; j < scale; j++) {
				tx = x*scale+i;
				ty = y*scale+j;
				this.nodeAt(tx,ty).walkable = walkable
			};
		};
	};

}

var diag_adj = function(node){
	var out = [];
	var a = [[-1,-1],[0,-1],[1,-1],
			 [-1, 0],       [1, 0],
			 [-1, 1],[0, 1],[1, 1]];
			 
	for (var i = 0; i < a.length; i++) {
		px = node.x + a[i][0];
		py = node.y + a[i][1];
		adjnode = map.nodeAt(px,py);

		if(adjnode && adjnode.walkable){
			out.push(adjnode);
		}
	}
	return out;
};

var stra_adj = function(node){
	var out = [];
	var a = [        [0,-1],
			 [-1, 0],       [1, 0],
			         [0, 1]];
			 
	for (var i = 0; i < a.length; i++) {
		px = node.x + a[i][0];
		py = node.y + a[i][1];
		adjnode = map.nodeAt(px,py);

		if(adjnode && adjnode.walkable){
			out.push(adjnode);
		}
	}
	return out;
};

