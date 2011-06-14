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

var start, goal, path = [];

var can , ctx, map, pather, lasttime;
var drawmode = false;
var doLosslessCull = false;
var doDropNodeCull = false;

function init () {
	can = document.createElement('canvas');
	can.width = window.innerWidth
	can.height = window.innerHeight-16
	document.body.appendChild(can);
	ctx = can.getContext('2d');
	lasttime = Date.now()
	can.addEventListener('click',clicky,false);
	//window.addEventListener('keydown',handleKey,false)

	map = new Map(140,80)

	var gui = new DAT.GUI();

	// Text field
	// gui.add(fizzyText, 'message');

	// // Sliders with min + max
	// gui.add(fizzyText, 'maxSize').min(0.5).max(7);
	// gui.add(fizzyText, 'growthSpeed').min(0.01).max(1).step(0.05);
	// gui.add(fizzyText, 'speed', 0.1, 2, 0.05); // shorthand for min/max/step

	// gui.add(fizzyText, 'noiseStrength', 10, 100, 5);

	// Boolean checkbox
	gui.add(window, 'drawmode');
	gui.add(window, 'doLosslessCull');
	gui.add(window, 'doDropNodeCull');

	gui.add(window, 'doLosslessCullNow')
	gui.add(window, 'doDropNodeCullNow')

	ax = 2
	ay = 2
	dude = new Agent(GRID_SIZE*ax,GRID_SIZE*ay)


	// Fires a function called 'explode'
	// gui.add(fizzyText, 'explode').name('Explode!'); // Specify a custom name.

	// // Alternatively, you can specify custom labels using object syntax
	//gui.add(obj, 'propertyName').options({'Small': 1, 'Medium': 2, 'Large': 3});


	tempmap = Generator.generate(21,21)
	map.applyTemplete(tempmap,1)

	
	//map.randomiz()

	loopsy()
}


var clicky = function(e){
	var cx = Math.floor(e.clientX/GRID_SIZE) //needs to be fixed to offsetX equiv
	var cy = Math.floor(e.clientY/GRID_SIZE)
	if(drawmode){
		map.nodeAt(cx,cy).toggle();
	}else{
		start = goal;
		goal = map.nodeAt(cx,cy)
		if(start){
			console.time('wooo')
			path = pather.findpath(start, goal)
			console.timeEnd('wooo')
			if (doDropNodeCull){
				path = dropNodeCull(path, function(x,y){return map.nodeAt(x,y).walkable})
			}
			if (doLosslessCull){
				path = losslessCull(path)
			}
			dude.followPath(path)
		}
	}
}

function handleKey(e){
	var keynum;
	keynum = e.which;

	if(keyname[keynum] == "SPACE"){
		//drawmode = !drawmode
	}
}


pather = new PathFinder({adj:stra_adj})
pather.drawClist = function(ctx){
	ctx.save();
	ctx.strokeStyle = 'pink';
	ctx.lineWidth = 5.0;
	ctx.lineCap = 'round';
	ctx.beginPath();
	for (var i = 0; i < this.lastclist.length; i++) {
		var a = this.lastclist[i].node;
		var b = this.lastclist[i].parent;
		if(b){
			b = b.node;
			ctx.moveTo((a.x+0.5)*GRID_SIZE,(a.y+0.5)*GRID_SIZE);
			ctx.lineTo((b.x+0.5)*GRID_SIZE,(b.y+0.5)*GRID_SIZE);
		}
	};
	ctx.stroke();
	ctx.restore();
}
function drawPath(ctx,path){
	ctx.save()
	ctx.strokeStyle = 'green';
	ctx.lineWidth = 5.0;
	ctx.lineCap = 'round';
	ctx.beginPath();
	if(path.length)
		ctx.moveTo((path[0].x+0.5)*GRID_SIZE,(path[0].y+0.5)*GRID_SIZE)
	for (var i = 0; i < path.length; i++) {
		ctx.fillStyle = 'lime';
		ctx.fillRect(path[i].x*GRID_SIZE,path[i].y*GRID_SIZE,GRID_SIZE,GRID_SIZE);
		ctx.lineTo((path[i].x+0.5)*GRID_SIZE,(path[i].y+0.5)*GRID_SIZE)
	};
	ctx.stroke()
	ctx.restore()
}

var loopsy = function(){
	time = Date.now();
	delta = time - lasttime;
	lasttime = time;

	map.draw(ctx);
	pather.drawClist(ctx)
	drawPath(ctx,path)
	ctx.save()
	ctx.translate(dude.pos.x, dude.pos.y)
	dude.update(delta)
	dude.draw(ctx)
	ctx.restore()

	requestAnimFrame(loopsy)
}

function doLosslessCullNow () {
	path = losslessCull(path);
}
function doDropNodeCullNow (){
	path = dropNodeCull(path, function(x,y){return map.nodeAt(x,y).walkable})
}
window.onload = init;

var keyname = {
    32: 'SPACE',
    13: 'ENTER',
    9: 'TAB',
    8: 'BACKSPACE',
    16: 'SHIFT',
    17: 'CTRL',
    18: 'ALT',
    20: 'CAPS_LOCK',
    144: 'NUM_LOCK',
    145: 'SCROLL_LOCK',
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
    33: 'PAGE_UP',
    34: 'PAGE_DOWN',
    36: 'HOME',
    35: 'END',
    45: 'INSERT',
    46: 'DELETE',
    27: 'ESCAPE',
    19: 'PAUSE',
    222: "'"
};
