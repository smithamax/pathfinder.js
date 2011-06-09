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
var map = new Map(140,80)
var pather = new PathFinder({adj:diag_adj})
var can , ctx;
var drawmode = true;

function init () {
	can = document.createElement('canvas');
	can.width = window.innerWidth
	can.height = window.innerHeight-16
	document.body.appendChild(can);
	ctx = can.getContext('2d');

	can.addEventListener('click',clicky,false);
	window.addEventListener('keydown',handleKey)


	tempmap = Generator.generate(21,21)


	for (var i = 0; i < tempmap.length; i++) {
		for (var j = 0; j < tempmap[i].length; j++) {
			if (tempmap[i][j].type == PERIMETER){
				map.nodeAt(i*2,j*2).walkable = false
				map.nodeAt(i*2+1,j*2).walkable = false
				map.nodeAt(i*2,j*2+1).walkable = false
				map.nodeAt(i*2+1,j*2+1).walkable = false

			}else if(tempmap[i][j].type == ROOM){
				map.nodeAt(i*2,j*2).walkable = true
				map.nodeAt(i*2,j*2+1).walkable = true
				map.nodeAt(i*2+1,j*2).walkable = true
				map.nodeAt(i*2+1,j*2+1).walkable = true

			}else if(tempmap[i][j].type == CORRIDOR){
				map.nodeAt(i*2,j*2).walkable = true
				map.nodeAt(i*2,j*2+1).walkable = true
				map.nodeAt(i*2+1,j*2).walkable = true
				map.nodeAt(i*2+1,j*2+1).walkable = true

			}else if(tempmap[i][j].type == ENTRANCE){
				map.nodeAt(i*2,j*2).walkable = true
				map.nodeAt(i*2,j*2+1).walkable = true
				map.nodeAt(i*2+1,j*2).walkable = true
				map.nodeAt(i*2+1,j*2+1).walkable = true

			}else{
				map.nodeAt(i*2,j*2).walkable = true
				map.nodeAt(i*2,j*2+1).walkable = true
				map.nodeAt(i*2+1,j*2).walkable = true
				map.nodeAt(i*2+1,j*2+1).walkable = true
			}
			
		};
	};
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
		if(window.start){
			console.time('wooo')
			path = pather.findpath(start, goal)
			console.timeEnd('wooo')
		}
	}
}

function handleKey(e){
	var keynum;
	keynum = e.which;

	if(keyname[keynum] == "SPACE"){
		drawmode = !drawmode
	}
}

var loopsy = function(){
	map.draw(ctx);
	ctx.strokeStyle = 'pink';
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
