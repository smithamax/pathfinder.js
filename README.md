Pathfinding.js
==============

pathfinding.js implements a simple A* pathfinding algorithm.

This code needs a clean up badly, however the pathfinder.js file itself is fairly well structured.

API
---

###Pathfinder([options]);

    var finder = new Pathfinder();

#### options

* edges: a function that when passed a graph node returns its edges;
* cost: a function when passed two nodes returns the cost of moving from the first to the second. 
  This will be used to get the H value if no heuristic function is given.
* heuristic: like cost but used for none ajacent nodes.

    var finder = new Pathfinder({
        edges: function (node) {
            return node.neighbours();
        },
        cost: function (nodea, nodeb) {
            return nodea.distance(nodeb);
        }
    });
    
if no edges function is provided Pathfinder will try calling node.ajacent();
if no cost function is provided Pathfinder will try calling node.distance();

###Pathfinder#findpath(startnode, goalnode);

    var path = finder.findPath(currentNode, goal);


Example
-------

to use the example open index.html (preferably in chrome, though FF4 has been tested)

you may need to refresh to get an acceptable generated map.

in th top right corner there is an options panel.
options are as follows

* editmode - when checked clicking the canvas will add and remove walls
* showPaths - when checked nodes will be drawn in lime green the path in dark green, and the searched area in light red.
* doLosslessCull - when checked the nodes not resulting in a direction change will be removed from the path.
* doDropNodeCull - when checked path smoothing will be applied
* toggleNeighbourMode - switches between using diagonal movement and only 4 way movement.
* doLosslessCullNow - applies the lossless cull to the current path
* doDropNodeCullNow - applies smoothing to the current path.

note: the last two functions will bug out the agents movement if it is not at the end of the path.