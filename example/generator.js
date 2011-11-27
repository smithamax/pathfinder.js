
// square Types
var ROOM = 1;
var CORRIDOR = 2;
var PERIMETER = 3;
var ENTRANCE = 4;

Generator = {
	generate: function(width,height){
		var tempMap;
		var failLimit = 100;
		var genWidth = width;
		var genHeight = height;
		 

		var n_i = Math.floor(width/2);
		var n_j = Math.floor(height/2);

		var randomOdd = function (max) { 
			return Math.floor(Math.random()*Math.ceil(max/2))*2+1;
		};
		var randRange = function(min, max) {
			if(!max){
				max = min
				min = 0
			}
			return Math.floor(Math.random()*(max-min))+min
		};

		var init = function(width,height){
			var tempMap = [];

			for (var i = 0; i < width; i++) {
				tempMap[i] = [];

				for (var j = 0; j < height; j++) {
					tempMap[i][j] = {type: 0, roomId: null, connected: false};
				}
			}

			return tempMap;
		};

		var forBlock = function(x,y,width,height,callback){
			for (var i = 0; i < width; i++) {
				for (var j = 0; j < height; j++) {
					if (i+x < genWidth && j+y < genHeight){
						callback(tempMap[i+x][j+y]);
					}else{
						console.error("outside bounds", i+x,j+y);
					}
				}
			}
		};

		var place_room = function(x, y, width, height, id) {
			var free = true;
			
			forBlock(x,y,width,height,function(node) {
				if(node.roomId !== null){
					free = false;
				}
			});

			if(free){
				//okay so this is the lazy way to do it
				forBlock(x,y,width,height,function(node) {
					node.type = ROOM;
					node.roomId = id;
					node.connected = true;
				});

				var permlist = [];
				var entrylist = [];


				for (var i = 0; i < width; i++) {
					entrylist.push([x+i,y-1])
					entrylist.push([x+i,y+height])
				}
				for (var i = -1; i < width+1; i++) {
					permlist.push([x+i,y-1])
					permlist.push([x+i,y+height])

				}
				for (var i = 0; i < height; i++) {
					permlist.push([x-1,y+i])
					permlist.push([x+width,y+i])
					entrylist.push([x-1,y+i])
					entrylist.push([x+width,y+i])
				}

				for (var i = 0; i < permlist.length; i++) {
					pos = permlist[i]
					node = tempMap[pos[0]][pos[1]]
					node.type = PERIMETER;
					node.roomId = 0;
					node.connected = null;
				}

				var n = entrylist[randRange(entrylist.length)];;
				node = tempMap[n[0]][n[1]]
				node.type = ENTRANCE;
				var n = entrylist[randRange(entrylist.length)];;
				node = tempMap[n[0]][n[1]]
				node.type = ENTRANCE;


				return true;
			}
			return false;
			
		};

		var placeRooms = function(num) {
			var count = 0;
			var fails = 0;
			while(fails < failLimit && count < num){
				w = randomOdd(5)+2;
				h = randomOdd(5)+2;
				x = randomOdd(width-1-w);
				y = randomOdd(height-1-h);
				success = place_room(x,y,w,h,count);
				if(success){
					count++;
				}else{
					fails++;
				}
			}
			console.log('done count:',count, 'fails', fails)
		};

		var connect_corridors = function(x,y) {
			if(x >= 2 && tempMap[x-2][y].type == CORRIDOR){
				tempMap[x-2][y] = {type: CORRIDOR, roomId: null, connected: true};
				tempMap[x-1][y] = {type: CORRIDOR, roomId: null, connected: true};
				tempMap[x][y] = {type: CORRIDOR, roomId: null, connected: true};
				return true;
			}
			if(y >= 2 && tempMap[x][y-2].type == CORRIDOR){
				tempMap[x][y-2] = {type: CORRIDOR, roomId: null, connected: true};
				tempMap[x][y-1] = {type: CORRIDOR, roomId: null, connected: true};
				tempMap[x][y] = {type: CORRIDOR, roomId: null, connected: true};
				return true;
			}
			return false;
		};

		var tunnel = function() {
			var c, r;
			var unconnected = 0;

			for (var i = 0; i < n_i; i++) {
				c = i*2+1;
				for (var j = 0; j < n_j; j++) {
					r = j*2+1;
					if(!tempMap[c][r].type){
						tempMap[c][r].type = CORRIDOR;
						if(!connect_corridors(c,r)){
							unconnected++;
						}
					}
				}
			}

		};

		tempMap = init(genWidth,genHeight);
		placeRooms(20);
		tunnel()
		return tempMap


	}
};