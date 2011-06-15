/**
 * Copyright (c) 2011 Dominic Smith.
 * 
 * Free to use under the MIT License.
 * 
 */

function PathFinder(options){
	this.lastclist = [];

	if(options.adj){
		this.adjFunc = options.adj;
	}else{
		this.adjFunc = function(node){return node.ajacent();};
	}

	PathNode = function(node, parent){
		var _g = null;
		this.parent = parent;
		this.node = node;

		this.F = function(goal){
			return this.G() + this.H(goal);
		};

		this.G = function(){
			// if no cached value generate new one
			if(!_g) {
				if (this.parent === undefined){
					_g = 0;
				}else{
					_g = this.parent.G() + this.node.distance(this.parent.node);
				}
			}
			return _g;
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
			//clear cached value
			_g = null;
		};
	};

}
PathFinder.prototype.findpath = function(start, goal){
	var adj, openlist = [];
	var closedlist = this.lastclist = [];
	var current = new PathNode(start);

	
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


	

	nOpen(current);

	do{
		nClose(current);
		adj = this.adjFunc(current.node);

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

		if (closedlist.some(inList, goal)){
			return closedlist.filter(inList,goal)[0].path();
		}

		current = nNext();

	}while(openlist.length > 0);

	return false;
};