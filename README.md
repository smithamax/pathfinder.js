Pathfinding.js
==============

pathfinding.js implements a simple A* pathfinding algorithm


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