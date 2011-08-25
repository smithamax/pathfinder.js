/**
 * Copyright (c) 2011 Dominic Smith.
 * 
 * Free to use under the MIT License.
 * 
 */

/*jshint browser: true, white: true */

window.PathFinder = (function () {

	var PathFinder = function (options) {
		this.lastclist = [];

		this.edges = options.edges ||
			function (node) {
				return node.ajacent();
			};

		this.cost = options.cost ||
			function (nodea, nodeb) {
				return nodea.distance(nodeb);
			};
		this.heuristic = options.heuristic || this.cost;
	};


	PathFinder.prototype.findpath = function (start, goal) {
		var adj, current, openlist = [];
		var closedlist = this.lastclist = [];
		var self = this;

		var PathNode = function (node, parent) {
			this._g = null;
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
						this._g = this.parent.G() + self.cost(this.node, this.parent.node);
					}
				}
				return this._g;
			},

			H: function (goal) {
				return self.cost(this.node, goal);
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
			openlist.push(node);
		};

		var nNext = function () {
			var best = {
				F : function () {
					return Number.MAX_VALUE;
				}
			};

			for (var i = 0; i < openlist.length; i++) {
				if (openlist[i].F(goal) < best.F(goal)) {
					best = openlist[i];
				}
			}
			return best;
		};

		var nClose = function (node) {
			closedlist.push(node);
			var i = openlist.indexOf(node);
			openlist.splice(i, 1);
		};

		var inList = function (ent, i, ary) {
			return this == ent.node;
		};

		current = new PathNode(start);
		nOpen(current);

		do {
			nClose(current);
			adj = this.edges(current.node);

			for (var n in adj) {
				if (!closedlist.some(inList, adj[n])) {

					var oents = openlist.filter(inList, adj[n]);

					if (oents.length > 0) {

						var old = oents[0];
						var nuw = new PathNode(adj[n], current);

						if (old.G() > nuw.G()) {
							old.reParent(current);
						}

					} else {

						nOpen(new PathNode(adj[n], current));

					}
				}
			}

			if (closedlist.some(inList, goal)) {
				return closedlist.filter(inList, goal)[0].path();
			}

			current = nNext();

		} while (openlist.length > 0);

		return false;
	};

	return PathFinder;
})();

