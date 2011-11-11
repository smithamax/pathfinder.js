/**
 * Copyright (c) 2011 Dominic Smith.
 * 
 * Free to use under the MIT License.
 * 
 */

/*jshint browser: true, white: true */

window.PathFinder = (function () {
	var finder;

	var PathFinder = function (options) {
		finder = this;

		this.closedlist = [];
		this.done = false;

		this.edges = options.edges ||
			function (node) {
				return node.ajacent();
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
				this._h = finder.heuristic(this.node, goal);
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
		finder.openlist.push(node);
	};

	var nNext = function () {
		var best = {
			F : function () {
				return Number.MAX_VALUE;
			}
		};

		for (var i = 0; i < finder.openlist.length; i++) {
			if (finder.openlist[i].F(finder.goal) <= best.F(finder.goal)) {
				best = finder.openlist[i];
			}
		}
		return best;
	};

	var nClose = function (node) {
		finder.closedlist.push(node);
		var i = finder.openlist.indexOf(node);
		finder.openlist.splice(i, 1);
	};

	var inList = function (ent, i, ary) {
		return this === ent.node;
	};

	PathFinder.prototype.start = function (start, goal) {
		finder = this;
		this.closedlist = [];
		this.openlist = [];
		this.currentNode = new PathNode(start);
		this.done = false;
		this.goal = goal;

		nOpen(this.currentNode);
	};

	PathFinder.prototype.step = function () {
		finder = this;

		nClose(this.currentNode);

		var adj = this.edges(this.currentNode.node);

		for (var n in adj) {
			if (!this.closedlist.some(inList, adj[n])) {

				var oents = this.openlist.filter(inList, adj[n]);

				if (oents.length > 0) {

					var old = oents[0];
					var nuw = new PathNode(adj[n], this.currentNode);

					if (old.G() > nuw.G()) {
						old.reParent(this.currentNode);
					}

				} else {

					nOpen(new PathNode(adj[n], this.currentNode));

				}
			}
		}

		if (this.closedlist.some(inList, this.goal)) {
			this.done = true;
			return this.closedlist.filter(inList, this.goal)[0].path();
		} else {
			this.currentNode = nNext();
		}
		if (this.openlist.length === 0) {
			this.done = true;
		}
	};


	PathFinder.prototype.findpath = function (start, goal, doneCallback) {
		this.start(start, goal);
		var callback = doneCallback || function () {};
		var self = this;
		(function loopsy() {
			var c = 0;
			var result;
			while (c++ < 20 && !self.done) {
				result = self.step();
			}
			if (self.done) {
				callback(result ? result.slice(0) : false);
			} else {
				window.setTimeout(loopsy, 1);
			}
		})();
	};

	return PathFinder;
})();

