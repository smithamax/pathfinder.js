//function Node(){
//	this.distance = function(node){};	//return number
//	this.ajacent = function() {}; // return ajacent walkable nodes
//}

function PathFinder(options){
	this.lastclist = [];
	var adjnodesf;

	if(options.adj){
		adjnodesf = function(){return options.adj(this.node);};
	}else{
		adjnodesf = false;
	}

	PathNode = function(node, parent){
		this.parent = parent;
		this.node = node;
		var _g = this.g = null;

		this.F = function(goal){
			return this.g + this.H(goal);
		};
		this.G = function(){
			if(_g) {return _g;}
			if (this.parent === undefined){
				return _g = 0;
			}else{
				return _g = this.parent.G() + this.node.distance(this.parent.node);
			}
		};
		this.H = function(goal){
			return this.node.distance(goal);
		};
		this.path = function(){
			if (this.parent === undefined){
				return [this.node];
			}else{
				var path = this.parent.path();
				path.push(this.node);
				return path;
			}
		};
		this.reParent = function(parent){
			this.parent = parent;
			_g = this.G();
		};
		this.adj = adjnodesf || function(){return this.node.ajacent();};
	};

}
PathFinder.prototype.findpath = function(start, goal){
	var openlist = [];
	var closedlist = this.lastclist = [];

	
	var nOpen = function(node){
		openlist.push(node);
	};
	var nNext = function(){
		var best = {F : function(){return Number.MAX_VALUE;}};
		for (var i = 0; i < openlist.length; i++) {
			if(openlist[i].F(goal) < best.F(goal)){
				best = openlist[i];
			}
		}
		return best;
	};
	var nClose = function(node){
		closedlist.push(node);
		var i = openlist.indexOf(node);
		openlist.splice(i,1);
	};
	var inList = function(ent, i, ary) {
		return this == ent.node;
	};


	var current = new PathNode(start);
	

	nOpen(current);

	do{
		nClose(current);
		var adj = current.adj();
		for(var n in adj){
			if(!closedlist.some(inList,adj[n])){
				var oents = openlist.filter(inList,adj[n]);
				if(oents.length > 0){
					old = oents[0];
					nuw = new PathNode(adj[n], current);
					if(old.G() > nuw.G()){
						old.reParent(current);
					}
				}else{
					nOpen(new PathNode(adj[n], current));
				}
			}
		}

		if(closedlist.some(inList,goal)){
			return closedlist.filter(inList,goal)[0].path();
		}

		current = nNext();
	}while(openlist.length > 0);
	return false;
};