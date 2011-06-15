/**
 * Copyright (c) 2011 Dominic Smith.
 * 
 * Free to use under the MIT License.
 * 
 */

function losslessCull(nodelist){
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
	mnode = lnode = nodelist.shift()

	outlist.push(snode);
	while(nodelist.length){
		lnode = nodelist.shift();
		testpoints = collidePoints(snode,lnode)
		hit = false;
		for (var i = 0; i < testpoints.length; i++) {
			tx = testpoints[i].x
			ty = testpoints[i].y
			if (!goodNode(tx,ty)){
				hit = true;
				break;
			}	
		};
		if(hit){
			snode = mnode
			outlist.push(snode);
		}
		mnode = lnode;
	}
	outlist.push(lnode)
	return outlist
}
