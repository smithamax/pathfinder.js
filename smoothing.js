function losslessCull(nodelist){
	console.log('cull');
	var outlist = [];
	var node, lastnode, dx, dy, ldx, ldy;

	node = nodelist.shift()
	dx = null;
	dy = null;


	while(nodelist.length){
		lastnode = node;
		ldx = dx;
		ldy = dy;
		node = nodelist.shift();
		dx = lastnode.x - node.x;
		dy = lastnode.y - node.y;
		if(dx != ldx || dy != ldy){
			outlist.push(lastnode);
		}
	}
	outlist.push(node)
	return outlist
}

function dropNodeCull (nodelist, goodNode) {
	//nodelist = losslessCull(nodelist)
	var outlist = [];
	var snode, mnode, lnode, testpoints, hit;

	snode = nodelist.shift()
	mnode = nodelist.shift()

	while(nodelist.length){
		console.log('dropNodeCullWhile')
		outlist.push(snode);
		lnode = nodelist.shift();
		testpoints = collidePoints(snode,lnode)
		hit = false;
		for (var i = 0; i < testpoints.length; i++) {
			console.log('dropNodeCullfor')
			tx = testpoints[i].x
			ty = testpoints[i].y
			if (!goodNode(tx,ty)){
				hit = true;
				break;
			}	
		};
		if(hit){
			snode = mnode
		}
		mnode = lnode;
	}
	outlist.push(snode);
	outlist.push(lnode)
	return outlist
}