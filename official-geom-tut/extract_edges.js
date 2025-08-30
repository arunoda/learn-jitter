
// here directionary is the typename of the argument passed
// we can define multiple functions to access different types of things passed.
function dictionary(ref) {
	const d = new Dict(ref);
	const dict = JSON.parse(d.stringify());
	
	// in geom dictionary, there could be multiple geoms. So, we picked the first one
	const geom = dict.geomlist[0];
	
	// this containts all the edge points
	// These are not vertices, there can be multiple edge points for an vertex
	const edgePoints = [];
	
	// iterate over all the edges
	for (const edge of geom.edges) {
		// here edge only contains a reference to the halfedges (two of them, forward & backward)
		const [forwardEdgeIndex, backwardEdgeIndex] = edge.halfedges;
		// We only need one half-edge as both contains the same vertex
		const halfEdge = geom.halfedges[forwardEdgeIndex];
		
		// get the vertices
		const v1 = geom.vertices[halfEdge.to];
		const v2 = geom.vertices[halfEdge.from];
		
		// add points (We can represent an edge using these adjesant points)
		edgePoints.push(v1.point);
		edgePoints.push(v2.point);
	}
	
	// convert edgePoints into an jitter matrix
	const edgeMat = new JitterMatrix(3, "float32", edgePoints.length);
	edgePoints.forEach((point, id) => {
		edgeMat.setcell(id, "val", point);
	});
	
	// Send it via the outlet
	// Here we just sent the reference to it only
	outlet(0, "jit_matrix", edgeMat.name);
}