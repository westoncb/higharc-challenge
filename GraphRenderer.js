const vert_radius = 4

class GraphRenderer {
    constructor(graph) {
        const canvas = document.getElementById("graph-canvas")
        this.canvsaWidth = canvas.width
        this.canvasHeight = canvas.height
        const ctx = canvas.getContext("2d")

        this.render(graph, ctx)
    }

    render(graph, ctx) {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

        this.drawGraph(ctx, graph)

        this.drawGraph(ctx, window.currentPath, "red", "red", 3)
    }

    drawGraph(ctx, graph, edgeColor = "black", vertColor = "black", lineWidth = 1) {
        
        ctx.fillStyle = vertColor
        ctx.lineWidth = lineWidth
        graph.vertices.forEach(vert => {
            ctx.beginPath()
            ctx.arc(vert.x, vert.y, vert_radius, 0, 2 * Math.PI, false)
            ctx.fill()
        })

        ctx.strokeStyle = edgeColor
        graph.edges.forEach((edge, i) => {
            const firstVert = edge.v1
            const secondVert = edge.v2

            ctx.beginPath()
            ctx.moveTo(firstVert.x, firstVert.y)
            ctx.lineTo(secondVert.x, secondVert.y)
            ctx.stroke()
        })
    }
}