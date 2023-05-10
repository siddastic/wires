import { GraphExtension } from "../../api/extension/graphExtension";
import { WireGraph } from "../../api/graph/wire_graph";
import { Vector } from "../../api/vector_operations";
import { Vector2 } from "../../interfaces/basics";
import { bind } from "../../main";
import { UIElement } from "../../ui/ui_element";
import "./graph_minimap.css";

export class GraphMinimap extends GraphExtension {
    id: string = "wire-graph-minimap";
    ui: MinimapUI = new MinimapUI(this.graphInstance);
    reqAnimFrameId: number = 0;

    public activate(): void {
        this.graphInstance.rootGraph.appendChild(this.ui.element);

        this.reqAnimFrameId = requestAnimationFrame(() => {
            this.startDrawLoop();
        });
    }

    @bind
    startDrawLoop(): void {
        this.ui.draw();
        this.reqAnimFrameId = requestAnimationFrame(this.startDrawLoop);
    }

    public deactivate(): void {
        cancelAnimationFrame(this.reqAnimFrameId);
        this.ui.destroy();
    }
}

class MinimapUI extends UIElement {
    ctx!: CanvasRenderingContext2D;
    element: HTMLCanvasElement;
    constructor(public graphInstance: WireGraph) {
        super(graphInstance);
        this.element = this.build();
    }

    calculateMinimapSize(): [number, number] {
        // get size of graph
        let width = window.getComputedStyle(this.graphInstance.rootGraph).width;
        let height = window.getComputedStyle(
            this.graphInstance.rootGraph
        ).height;
        // convert to number
        width = width.slice(0, width.length - 2);
        height = height.slice(0, height.length - 2);

        return [Number(width) / 5, Number(height) / 5];
    }

    build(): HTMLCanvasElement {
        let minimap = document.createElement("canvas");
        minimap.classList.add("graph-minimap");

        let [width, height] = this.calculateMinimapSize();
        minimap.width = width;
        minimap.height = height;

        this.ctx = minimap.getContext("2d") as CanvasRenderingContext2D;
        return minimap;
    }

    updateCanvasTransform(): void {
        const view = [1, 0, 0, 1, 0, 0];
        const graphTransform = this.graphInstance.graphContainer.transform;

        view[4] = graphTransform.x / 5;
        view[5] = graphTransform.y / 5;

        // @ts-ignore
        this.ctx.setTransform(...view);
    }

    draw(): void {
        // clear canvas first
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);

        // set transform to ensure canvas moves with graph
        this.updateCanvasTransform();

        // draw nodes
        this.graphInstance.nodeManager.createdNodeInstances.forEach((node) => {
            let nodeElementStyles = window.getComputedStyle(
                node.nodeUi.nodeElement
            );

            let nodeElementWidth = nodeElementStyles.width;
            let nodeElementHeight = nodeElementStyles.height;

            nodeElementWidth = nodeElementWidth.slice(
                0,
                nodeElementWidth.length - 2
            );
            nodeElementHeight = nodeElementHeight.slice(
                0,
                nodeElementHeight.length - 2
            );

            this.drawNode(
                Vector.divideByScalar(node.positionInWorld, 5),
                node.nodeUi.title,
                Number(nodeElementHeight) / 5,
                Number(nodeElementWidth) / 5
            );
        });
    }

    drawNode(
        coordinates: Vector2,
        nodeTitle: string,
        height: number,
        width: number
    ): void {
        // draw a simple filled box with border radius
        // get node color
        let nodeColor = window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("--node-background-color");

        let textColor = window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("--text-color");

        this.ctx.fillStyle = nodeColor;
        this.ctx.beginPath();
        this.ctx.roundRect(coordinates.x, coordinates.y, width, height, 5);
        this.ctx.stroke();
        this.ctx.fill();

        // draw node title
        this.ctx.fillStyle = textColor;
        this.ctx.font = `4px JetBrains Mono`;
        this.ctx.fillText(nodeTitle, coordinates.x + 4, coordinates.y + 6);
    }

    destroy(): void {
        this.element.remove();
    }
}
