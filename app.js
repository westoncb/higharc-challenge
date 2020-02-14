const data = {
    "vertices": [[0, 0], [2, 0], [2, 2], [0, 2]],
    "edges": [[0, 1], [1, 2], [0, 2], [0, 3], [2, 3]]
}

window.onload = () => {
    findPolys(data)
}

function findPolys(data) {

    // make graph
    const vertices = data.vertices.map(point => { return { x: point[0], y: point[1], edges: [] }})
    const edges = data.edges.map(edge => {
        return { v1: vertices[edge[0]], v2: vertices[edge[1]], free: true, onPath: false}
    })

    // edges.forEach(edge => {
    //     edge.v1    
    // })

    return findPolysAux(edges[0], null)
}

function findPolysAux(rootEdge, borderPath) {
    let polys = []
    let completedClosedPaths = []

    if (rootEdge === null) {
        rootEdge = findFreeInternalEdge(borderPath)
    }

    do {
        let newClosedPath = findClosedPathWithinBorder(rootEdge, borderPath)

        const interiorPolys = findPolysAux(null, newClosedPath)

        if (interiorPolys.length > 0) {
            polys = polys.concat(interiorPolys)
        } else {
            newClosedPath.forEach(edge => edge.free = false)
            polys.push(newClosedPath.map(edge => edge.v1))
        }

        completedClosedPaths.push(newClosedPath)

        // This will find a free external edge to one of our completed closed paths.
        // It avoids picking up internal edges since they will all have been marked
        // non-free at this point, since the algorithm is depth first.
        rootEdge = findBorderTransitionEdge(completedClosedPaths, edge => edge.free)

    } while (rootEdge)

    return polys
}

function findFreeInternalEdge(borderPath) {
    findBorderTransitionEdge(borderPath, edge => isEdgeInternal(edge, borderPath))
}

function findBorderTransitionEdge(borderPath, func) {
    borderPath.find(path => path.find(pathEdge => pathEdge.v1.edges.find(edge => !edge.onPath && func(edge))))
}

function isEdgeInternal(edge, path) {
    const edgeIndex = path.findIndex(pathEdge => pathEdge === edge)
    const nextEdge = path[(edgeIndex + 1) % path.length]

    edge.v2
}

function findClosedPathWithinBorder(initialEdge, borderPath) {
    const closedPath = []

    // Edge following conditions:
    // no backtracking
    // stop and clip if it's a self-intersect
    // edge must be 'free' (not part of a completed polygon)
    // edge cannot be an external edge of borderPath

    // mark all edges here as onPath
}

// Based on https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
function isClockwise(edgeList) {

    let sum = 0;
    for (let i = 0; i < edgeList.length; i += 1) {
        sum += (edgeList[i].v2.x - polygon[i].v1.x) * (polygon[i].v2.y + polygon[i].v1.y)
    }

    return sum >= 0;
}