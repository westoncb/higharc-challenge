const SNAP_RADIUS = 20

class GraphGenerator {
    constructor() {
        const canvas = document.getElementById("generator-canvas")
        const outputElement = document.getElementsByClassName("generator-output")[0]
        let clickCount = 0
        let mousePos = []
        this.lineStarted = false
        this.vertices = []
        this.edges = []
        this.canvasWidth = canvas.width
        this.canvasHeight = canvas.height
        const ctx = canvas.getContext('2d')

        canvas.onclick = (e) => {

            if (!this.lineStarted) {
                this.startLine(e.offsetX, e.offsetY)
            } else {
                this.finishLine(e.offsetX, e.offsetY)

                // quick hack to continue line from previous end point
                // automatically
                this.startLine(e.offsetX, e.offsetY)
                clickCount++
            }

            clickCount++
            this.lineStarted = clickCount % 2 === 1

            this.draw(ctx, mousePos)
            this.printGraph(outputElement)
        }

        canvas.onmousemove = (e) => {
            mousePos[0] = e.offsetX
            mousePos[1] = e.offsetY

            this.draw(ctx, mousePos)
        }

        document.onkeyup = (e) => {
            if (e.key === 'Escape') {
                this.undo()
                clickCount = 0
                this.lineStarted = false
                this.draw(ctx, mousePos)
            }
        }
    }

    startLine(x, y) {
        const newVert = [x, y]
        const revisedVert = this.snap(newVert)
        this.vertices.push(revisedVert)
        this.edges.push([this.vertices.length-1])
    }

    finishLine(x, y) {
        const newVert = [x, y]
        const revisedVert = this.snap(newVert)
        this.vertices.push(revisedVert)
        this.edges[this.edges.length-1].push(this.vertices.length-1)
    }

    undo() {
        this.vertices.pop()
        if (!this.lineStarted)
            this.vertices.pop()

        this.edges.pop()
    }

    snap(vert) {
        const target = this.vertices.find(curVert => (curVert[0] - vert[0])**2 + (curVert[1] - vert[1])**2 <= SNAP_RADIUS**2)

        return target ? target : vert
    }

    draw(ctx, mousePos) {
        const vert_radius = 4

        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

        this.vertices.forEach(vert => {
            ctx.beginPath()
            ctx.arc(vert[0], vert[1], vert_radius, 0, 2 * Math.PI, false)
            ctx.fillStyle = 'black'
            ctx.fill()
        })

        ctx.strokeStyle = "black"
        this.edges.forEach((edge, i) => {
            const firstVert = this.vertices[edge[0]]
            const secondVert = i === this.edges.length-1 && this.lineStarted ? mousePos : this.vertices[edge[1]]

            ctx.beginPath()
            ctx.moveTo(firstVert[0], firstVert[1])
            ctx.lineTo(secondVert[0], secondVert[1])
            ctx.stroke()
        })

        // show snap radius
        ctx.beginPath();
        ctx.strokeStyle = "#66aa66"
        ctx.arc(mousePos[0], mousePos[1], SNAP_RADIUS, 0, 2 * Math.PI);
        ctx.stroke();
    }

    printGraph(element) {
        const data = {vertices: this.vertices, edges: this.edges}
        element.innerHTML = `<p>${JSON.stringify(data, null, 2)}</p>`
    }
}