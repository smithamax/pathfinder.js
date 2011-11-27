/**
 * Copyright (c) 2011 Dominic Smith.
 * 
 * Free to use under the MIT License.
 * 
 */

/*jshint white: true */
/*global exports: false, Pathfinder: true, setTimeout: false */

var Pathfinder = (function () {

	var finder;

	var Pathfinder = function (options) {
		finder = this;

		this.closedlist = [];
		this.done = false;

		this.edges = options.edges ||
			function (node) {
				return node.adjacent();
			};

		this.cost = options.cost ||
			function (nodea, nodeb) {
				return nodea.distance(nodeb);
			};
		this.heuristic = options.heuristic || this.cost;
		this.nodeHash = options.nodeHash || function (node) {
			return node.x + "x" + node.y;
		};
	};

	var PathNode = function (node, parent) {
		this._g = null;
		this._h = null;
		this.parent = parent;
		this.closed = false;
		this.node = node;
	};

	PathNode.prototype = {
		F: function (goal) {
			return this.G() + this.H(goal);
		},

		G: function () {
			// if no cached value generate new one
			if (!this._g) {
				if (this.parent === undefined) {
					this._g = 0;
				} else {
					this._g = this.parent.G() + finder.cost(this.node, this.parent.node);
				}
			}
			return this._g;
		},

		H: function (goal) {
			if (!this._h) {
				this._h = finder.heuristic(this.node, goal || finder.goal);
			}
			return this._h;
		},

		path: function () {
			if (this.parent === undefined) {
				return [this.node];
			} else {
				var path = this.parent.path();
				path.push(this.node);
				return path;
			}
		},

		reParent: function (parent) {
			this.parent = parent;
			//clear cached value
			this._g = null;
		}
	};

	var nOpen = function (node) {
		finder.pathNodeIndex[JSON.stringify(node.node)] = node;
		for (var i = 0; i < finder.openlist.length; i++) {
			if (finder.openlist[i].F(finder.goal) >= node.F(finder.goal)) {
				return finder.openlist.splice(i, 0, node);
			}
		}
		finder.openlist.push(node);
	};

	var nNext = function () {
		return finder.openlist.shift();
	};

	var nClose = function (node) {
		finder.pathNodeIndex[JSON.stringify(node.node)].closed = true;
	};

	Pathfinder.prototype.start = function (start, goal) {
		finder = this;
		this.pathNodeIndex = {};
		this.openlist = [];
		this.currentNode = new PathNode(start);
		this.done = false;
		this.goal = goal;

		nOpen(this.currentNode);
	};

	Pathfinder.prototype.step = function () {
		finder = this;

		nClose(this.currentNode);

		var adj = this.edges(this.currentNode.node);
		var itnode;

		for (var n in adj) {

			itnode = this.pathNodeIndex[JSON.stringify(adj[n])];

			if (itnode === undefined) {
				nOpen(new PathNode(adj[n], this.currentNode));

			} else if (!itnode.closed) {
				var nuw = new PathNode(adj[n], this.currentNode);

				if (itnode.G() > nuw.G()) {
					itnode.reParent(this.currentNode);
				}
			}
		}
		var goalres = this.pathNodeIndex[JSON.stringify(this.goal)];
		if (goalres !==  undefined && goalres.closed) {
			this.done = true;
			return goalres.path();
		} else {
			this.currentNode = nNext();
		}
		if (this.openlist.length === 0) {
			this.done = true;
		}
	};


	Pathfinder.prototype.findpath = function (start, goal, callback) {
		this.start(start, goal);
		var self = this;
		if (callback) {
			(function loopsy() {
				var c = 0;
				var result;
				while (c++ < 20 && !self.done) {
					result = self.step();
				}
				if (self.done) {
					callback(result ? result.slice(0) : false);
				} else {
					setTimeout(loopsy, 1);
				}
			})();

		} else {
			var result;
			while (!this.done) {
				result = self.step();
			}
			return result ? result.slice(0) : false;
		}

	};

	return Pathfinder;
})();


// Make Node module, if possible.
if (typeof exports == 'object' && exports) {
    exports.Pathfinder = Pathfinder;
}