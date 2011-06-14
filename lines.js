function blinePoints(a,b) {
	var dx = Math.abs(b.x - a.x);
	var dy = Math.abs(b.y - a.y);
	var sx = a.x < b.x ? 1 : -1;
	var sy = a.y < b.y ? 1 : -1;
	var err = dx-dy;
	var x = a.x;
	var y = a.y;
	var outlist = [];
	while(true){
		outlist.push({x:x,y:y});
		if(x == b.x && y == b.y){
			break;
		}
		if(2*err > -dy){
			err -= dy;
			x += sx;
		}
		if(2*err < dx){
			err += dx;
			y += sy
		}
	}
	return outlist;
}




function collidePoints (a,b){
	var dx = Math.abs(b.x - a.x);
	var dy = Math.abs(b.y - a.y);
	var sx = a.x < b.x ? 1 : -1;
	var sy = a.y < b.y ? 1 : -1;
	var err = dx-dy;
	var x = a.x;
	var y = a.y;
	var outlist = [];
	while(true){
		outlist.push({x:x,y:y});
		if(x == b.x && y == b.y){
			break;
		}
		chgs = 0
		e2 = 2*err;
		if(e2 > -dy){
			err -= dy;
			x += sx;
			chgs++
		}
		if(e2 < dx){
			err += dx;
			y += sy
			chgs++
		}
		if(chgs == 2){
			outlist.push({x:x-sx,y:y});
			outlist.push({x:x,y:y-sy});
		}
	}
	return outlist;
}


