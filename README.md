Pathfinder.js
==============

pathfinder.js implements a simple A* pathfinding algorithm.

This code needs a clean up badly, however the pathfinder.js file itself is fairly well structured.

API
---

###Pathfinder([options]);

    var finder = new Pathfinder();

#### options

* __edges:__ a function that when passed a graph node returns its edges;
* __cost:__ a function when passed two nodes returns the cost of moving from the first to the second. 
  This will be used to get the H value if no heuristic function is given.
* __heuristic:__ like cost but used for none adjacent nodes.
* __nodeHash:__ a function that creates a unique identifier string for a node.


```
var finder = new Pathfinder({
    edges: function (node) {
        return node.neighbors();
    },
    cost: function (nodea, nodeb) {
        return nodea.distance(nodeb);
    },
    nodeHash: function (node) {
        return node.x + '$' + node.y;
    }
});
```
    
if no edges function is provided Pathfinder will try calling node.adjacent();
if no cost function is provided Pathfinder will try calling node.distance();
if no nodeHash function is provided Pathfinder will try using node.x and node.y to create an index;

###Pathfinder#findpath(startnode, goalnode, [callback]);

    var path = finder.findPath(currentNode, goal);

or the async version.

    finder.findPath(currentNode, goal, function (path){
        doSomthing(path);
    });


Example
-------

to use the example open [example/index.html](example/index.html) (preferably in chrome, though FF4 has been tested)

you may need to refresh to get an acceptable generated map.

in th top right corner there is an options panel.
options are as follows

* editmode - when checked clicking the canvas will add and remove walls
* showPaths - when checked nodes will be drawn in lime green the path in dark green, and the searched area in light red.
* doLosslessCull - when checked the nodes not resulting in a direction change will be removed from the path.
* doDropNodeCull - when checked path smoothing will be applied
* Pather - switches between using diagonal movement and only 4 way movement.
* doLosslessCullNow - applies the lossless cull to the current path
* doDropNodeCullNow - applies smoothing to the current path.

note: the last two functions will bug out the agents movement if it is not at the end of the path.
