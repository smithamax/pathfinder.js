window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};

window.requestAnimFrame = (function(){
	return	window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();



canvas = document.createElement('canvas');
canvas.width = window.innerWidth-2
canvas.height = window.innerHeight-2
document.body.appendChild(canvas);
ctx = canvas.getContext('2d');

var start, goal, path = [];
var map = new Map(140,80)
var pather = new PathFinder({adj:diagadj})

canvas.addEventListener("click",function(e){
	cx = Math.floor(e.offsetX/GRID_SIZE)
	cy = Math.floor(e.offsetY/GRID_SIZE)
	start = goal;
	goal = map.nodeAt(cx,cy)
	if(start){
		path = pather.findpath(start, goal)
		console.log(path)
	}
})

map.randomiz()

function loopsy(){
	map.draw(ctx)
	for (var i = 0; i < pather.lastclist.length; i++) {
		pather.lastclist[i].node.draw(ctx,'red')
	};
	for (var i = 0; i < path.length; i++) {
		path[i].draw(ctx,'green')
	};
	requestAnimFrame(loopsy)
}
loopsy()

