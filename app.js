
// const data = {
//     "vertices": [[0, 0], [2, 0], [2, 2], [0, 2]],
//     "edges": [[0, 1], [1, 2], [0, 2], [0, 3], [2, 3]]
// }

const data = { "vertices": [[261, 84], [111, 243], [359, 320], [373, 183], [713, 180], [613, 394], [177, 414], [77, 308], [405, 428], [675, 447], [439, 464], [149, 468]], "edges": [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 2], [2, 6], [6, 7], [7, 1], [6, 8], [8, 2], [8, 5], [5, 9], [9, 10], [10, 8], [9, 4], [0, 4], [6, 11], [11, 10]] }

window.onload = () => {
    new GraphGenerator()
    
    const graph = makeGraph(data)

    console.log("graph", graph)

    findPolys(graph)

    new GraphRenderer(graph)
}

function makeGraph(data) {
    const vertices = data.vertices.map(point => { return { x: point[0], y: point[1], edges: [], paths: []} })
    const edges = data.edges.map(edge => {
        return { v1: vertices[edge[0]], v2: vertices[edge[1]], free: true, onPath: false }
    })

    edges.forEach(edge => {
        edge.v1.edges.push(edge)
        edge.v2.edges.push(edge)
    })

    return {edges, vertices}
}

function findPolys(graph) {

    return findPolysAux(graph.edges[0], null)
}

function findPolysAux(rootEdge, borderPath) {
    let polys = []
    let completedPaths = []

    if (rootEdge === null) {
        rootEdge = findFreeInternalEdge(borderPath)
    }

    do {
        let newClosedPath = findClosedPathWithinBorder(rootEdge, borderPath)

        window.currentPath = newClosedPath

        break;

        const interiorPolys = findPolysAux(null, newClosedPath)

        if (interiorPolys.length > 0) {
            polys = polys.concat(interiorPolys)
        } else {
            newClosedPath.forEach(edge => edge.free = false)
            polys.push(newClosedPath.map(edge => edge.v1))
        }

        completedPaths.push(newClosedPath)

        // Finds a free external edge to one of our completed closed paths.
        // It avoids picking up internal edges since they will all have been marked
        // non-free at this point, since the algorithm is depth first.
        let pathIndex = 0
        do {
            rootEdge = findTransitionEdge(completedPaths[pathIndex++], edge => edge.free)
        } while (!rootEdge && pathIndex < completedPaths.length)
        

    } while (rootEdge)

    return polys
}

function findFreeInternalEdge(borderPath) {
    findTransitionEdge(borderPath, edge => isEdgeInternal(edge, borderPath))
}

function findTransitionEdge(borderPath, func) {
    traverseTransitionEdges(borderPath, transitionEdge => !func(transitionEdge))
}

/**
 * Iterates through the 'transition edges' of a path, calling the given function
 * with each transition edge as a param. Traversal will finish when the provided function
 * returns false, or there are no transition edges remaining.
 * 
 * The 'transition edges' of a path are the edges which are not themselves on the path, but
 * connect to vertices which are. If the path is closed, they are the edges leading either
 * to the interior or exterior of the path from the path itself.
 */
function traverseTransitionEdges(path, func) {
    let pathEdgeIndex = 0
    let transitionEdgeIndex = 0
    let pathEdge
    let transitionEdge
    let keepGoing = true

    do {
        if (pathEdgeIndex === path.length) {
            return
        } else {
            pathEdge = path[pathEdgeIndex]

            if (transitionEdgeIndex < pathEdge.v1.edges.length) {

                transitionEdge = pathEdge.v1.edges[transitionEdgeIndex]

                if (!transitionEdge.onPath) {
                    keepGoing = func(transitionEdge)
                }

                transitionEdgeIndex++
            } else {

                pathEdgeIndex++
                transitionEdgeIndex = 0
            }
        }
    } while (keepGoing)

    return transitionEdge
}

function isEdgeInternal(edge, path) {
    const edgeIndex = path.findIndex(pathEdge => pathEdge === edge)
    const nextEdge = path[(edgeIndex + 1) % path.length]

    // edge.v2
}

class Path {
    constructor() {
        this.vertices = []
        this.edges = []
    }

    addVert(vert) {
        vert.paths.push(this)
        this.vertices.push(vert)
    }

    addEdge(edge) {
        this.edges.push(edge)
        edge.onPath = true
    }

    hasVert(vert) {
        return this.vertices.includes(vert)
    }
}

function findClosedPathWithinBorder(initialEdge, borderPath = []) {
    const path = new Path()

    let currentEdge = initialEdge
    let currentVert = initialEdge.v2
    let lastEdge = null
    let lastVert = initialEdge.v1

    do {
        path.addVert(currentEdge.v1)
        path.addVert(currentEdge.v2)
        path.addEdge(currentEdge)

        currentEdge = nextEdge(currentEdge.v2, currentEdge)
    } while (!path.hasVert(currentEdge.v2))

    // Edge following conditions:
    // no backtracking
    // stop and clip if it's a self-intersect
    // edge must be 'free' (not part of a completed polygon)
    // edge cannot be an external edge of borderPath

    // mark all edges here as onPath

    return path
}

function nextEdge(vert, currentEdge) {
    let edge
    let count = 0

    do {
        edge = randEdge(vert)
        count++
    } while (edge === currentEdge && count < 1600)

    return edge
}

function randEdge(vert) {
    const index = rand(0, vert.edges.length - 1)
    console.log(index, vert.edges.length)
    return vert.edges[index]
}

function rand(min, max) {
    return Math.round(Math.random() * (max-min) + min)
}

// Based on https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
function isClockwise(edgeList) {

    let sum = 0;
    for (let i = 0; i < edgeList.length; i += 1) {
        sum += (edgeList[i].v2.x - polygon[i].v1.x) * (polygon[i].v2.y + polygon[i].v1.y)
    }

    return sum >= 0;
}

// p1, p2, p3 are the points making up two line segments with a shared vertex.
// p2 is the shared vertex.
function crossProduct(p1, p2, p3) {
    return (p2.x - p1.x)*(p3.y - p1.y) - (p2.y - p1.y)*(p3.x - p1.x)
}