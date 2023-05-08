import { bind } from "../decorators";
import "../../styles/graph_container.css";
import { GraphBackground } from "./graph_background";
import { Vector2 } from "../../interfaces/basics";

export class GraphContainer {
    graphContainer!: HTMLDivElement;
    transform: Vector2 = { x: 0, y: 0 };
    scale = 1;
    canMoveContainer = false;
    constructor(element: HTMLDivElement) {
        this.init(element);
    }

    private init(element: HTMLDivElement) {
        // create graph container element
        this.graphContainer = document.createElement("div");
        this.graphContainer.classList.contains("graph-container")
            ? void 0
            : this.graphContainer.classList.add("graph-container");
        element.appendChild(this.graphContainer);

        // add event listeners
        document.addEventListener("pointerdown", this.onPointerDown);
        document.addEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointermove", this.onPointerMove);

        // add wheel scroll event listener to change grid size
        document.addEventListener("wheel", this.onWheel, { passive: false });
    }

    // set canMoveContainer to true on pointerdown
    @bind
    private onPointerDown(event: PointerEvent) {
        // only allow graph to move if ctrl key is pressed and event is started on graph
        if (
            event.ctrlKey &&
            (GraphContainer.wasEventStartedOnContainer(event) ||
                GraphBackground.wasEventStartedOnBackground(event) ||
                GraphContainer.wasEventStartedOnNodeContainer(event))
        ) {
            this.canMoveContainer = true;
        }
    }

    // set canMoveContainer to false on pointerup
    @bind
    private onPointerUp() {
        this.canMoveContainer = false;
    }

    // change container position on pointermove
    @bind
    private onPointerMove(event: PointerEvent) {
        if (this.canMoveContainer) {
            this.transform.x += event.movementX;
            this.transform.y += event.movementY;
            this.updateTransform();
        }
    }

    // change container scale on wheel and dont let scale go below 0.1
    @bind
    private onWheel(event: WheelEvent) {
        event.preventDefault();
        // TODO : scaling is turned off until node connectors are compatible with it
        return;
        if (event.ctrlKey) {
            this.scale += event.deltaY * -0.01;
            this.scale = Math.min(Math.max(0.1, this.scale), 4);
            this.updateTransform();
        }
    }

    private updateTransform() {
        this.graphContainer.style.transform = `translate(${this.transform.x}px, ${this.transform.y}px) scale(${this.scale})`;
    }

    static wasEventStartedOnContainer(event: PointerEvent | MouseEvent) {
        return (event.target as unknown as HTMLElement).classList.contains(
            "graph-container"
        );
    }
    static wasEventStartedOnNodeContainer(event: PointerEvent | MouseEvent) {
        return (event.target as unknown as HTMLElement).classList.contains(
            "node-container"
        );
    }

    public setZoom(zoom: number) {
        this.scale = zoom;
        this.updateTransform();
    }
}
