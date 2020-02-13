const data = {
    "vertices": [[0, 0], [2, 0], [2, 2], [0, 2]],
    "edges": [[0, 1], [1, 2], [0, 2], [0, 3], [2, 3]]
}

window.onload = () => {
    findPolys(data)
}

function findPolys(data) {

    //make graph

    const vertices = data.vertices.map(point => { return { x: point[0], y: point[1], edges: [] }})
    const edges = data.edges.map(edge => {
        return { v1: vertices[edge[0]], v2: vertices[edge[1]], free: true }
    })

    // edges.forEach(edge => {
    //     edge.v1    
    // })

    return findPolysAux(edges[0], null)
}

function findPolysAux(rootEdge, borderPath) {
    let polys = []

    if (rootEdge === null) {
        rootEdge = getFreeInteriorEdge(borderPath)
    }

    do {
        interiorPath = findClosedPathWithinBorder(rootEdge, borderPath)

        const interiorPolys = findPolysAux(null, interiorPath)

        if (interiorPolys.length > 0) {
            polys = polys.concat(interiorPolys)
        } else {
            polys.push(borderPathToPoly(interiorPath))
        }

        rootEdge = getFreeExteriorEdge(interiorPath)


    } while (rootEdge)
}

function findClosedPathWithinBorder(initialEdge, borderPath) {
    const closedPath = []

    // Edge following conditions:
    // no backtracking
    // stop and clip if it's a self-intersect
    // edge must be 'free' (not part of a completed polygon)
    // edge cannot be an external edge of borderPath
}

function getInteriorEdges(borderPath) {

}

function findInteriorPolys(borderPath) {
    // find an interior edge
}

function findExteriorPolys(startNode) {

}

function borderPathToPoly(borderPath) {

}

function isExternalEdge(edge, borderPath) {
    const edgeIndex = borderPath.findIndex(pathEdge => pathEdge === edge)
    const nextEdge = borderPath[(edgeIndex + 1) % borderPath.length]

    edge.v2
}

// Based on https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
function isClockwise(edgeList) {

    let sum = 0;
    for (let i = 0; i < edgeList.length; i += 1) {
        sum += (edgeList[i].v2.x - polygon[i].v1.x) * (polygon[i].v2.y + polygon[i].v1.y)
    }

    return sum >= 0;
}