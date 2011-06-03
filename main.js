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
var pather = new PathFinder({adj:diag_adj})

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
	map.draw(ctx);
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 5.0;
	ctx.lineCap = 'round'
	ctx.beginPath();
	for (var i = 0; i < pather.lastclist.length; i++) {
		var a = pather.lastclist[i].node
		var b = pather.lastclist[i].parent
		if(b){
			b = b.node;
			ctx.moveTo((a.x+0.5)*GRID_SIZE,(a.y+0.5)*GRID_SIZE);
			ctx.lineTo((b.x+0.5)*GRID_SIZE,(b.y+0.5)*GRID_SIZE);
		}
	};
	ctx.stroke()
	ctx.strokeStyle = 'green';
	ctx.beginPath();
	if(path.length)
		ctx.moveTo((path[0].x+0.5)*GRID_SIZE,(path[0].y+0.5)*GRID_SIZE)
	for (var i = 0; i < path.length; i++) {
		ctx.lineTo((path[i].x+0.5)*GRID_SIZE,(path[i].y+0.5)*GRID_SIZE)
	};
	ctx.stroke()
	requestAnimFrame(loopsy)
}
loopsy()
