import "../../styles/graph_background.css";
import { bind } from "../decorators";
import { GraphContainer } from "./graph_container";

export class GraphBackground {
    background!: HTMLDivElement;
    backgroundPosition: Vector2 = { x: 0, y: 0 };
    backgroundSize: Vector2 = { x: 10, y: 10 };
    canMoveBackground = false;
    constructor(element: HTMLDivElement) {
        this.init(element);
    }

    private init(element: HTMLDivElement) {
        this.background = document.createElement("div");
        this.background.classList.add("graph-background");
        element.appendChild(this.background);

        // set initial background position and other initial properties
        this.updateBackgroundPosition();
        this.setGridSize(this.backgroundSize);

        // add event listeners
        document.addEventListener("pointerdown", this.onPointerDown);
        document.addEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointermove", this.onPointerMove);

        // add wheel scroll event listener to change grid size
        document.addEventListener("wheel", this.onWheel, { passive: false });
    }

    public setGridColor(color: string) {
        // change root grid-color variable
        document.documentElement.style.setProperty("--grid-color", color);
    }

    private updateBackgroundPosition() {
        this.background.style.backgroundPosition = `${this.backgroundPosition.x}px ${this.backgroundPosition.y}px`;
    }

    // set canMoveBackground to true on pointerdown
    @bind
    private onPointerDown(event : PointerEvent) {
        if(GraphContainer.wasEventStartedOnContainer(event) || GraphBackground.wasEventStartedOnBackground(event) || GraphContainer.wasEventStartedOnNodeContainer(event)){
            this.canMoveBackground = true;
        }
    }

    // set canMoveBackground to false on pointerup
    @bind
    private onPointerUp() {
        this.canMoveBackground = false;
    }

    // change background position on pointermove
    @bind
    private onPointerMove(event: PointerEvent) {
        if (this.canMoveBackground) {
            this.backgroundPosition.x += event.movementX;
            this.backgroundPosition.y += event.movementY;
            this.updateBackgroundPosition();
        }
    }

    public setGridSize(size: Vector2) {
        this.backgroundSize = size;
        this.background.style.backgroundSize = `${this.backgroundSize.x}px ${this.backgroundSize.y}px`;
    }

    // change grid size on wheel scroll
    @bind
    private onWheel(event: WheelEvent) {
        event.preventDefault();
        if (event.ctrlKey) {
            // change grid size
            this.backgroundSize.x += event.deltaY * -0.1;
            this.backgroundSize.y += event.deltaY * -0.1;

            // dont let grid size go below 1
            this.backgroundSize.x = Math.max(1, this.backgroundSize.x);
            this.backgroundSize.y = Math.max(1, this.backgroundSize.y);

            // update background size
            this.setGridSize(this.backgroundSize);

            // update background position
            this.backgroundPosition.x += event.deltaY * -0.1;
            this.backgroundPosition.y += event.deltaY * -0.1;
            this.updateBackgroundPosition();
        }
    }

    public resetZoom() {
        this.backgroundSize = { x: 10, y: 10 };
        this.setGridSize(this.backgroundSize);
    }

    public resetPosition() {
        this.backgroundPosition = { x: 0, y: 0 };
        this.updateBackgroundPosition();
    }

    public reset() {
        this.resetZoom();
        this.resetPosition();
    }

    public showGrid() {
        this.setGridColor("#242424");
    }

    public hideGrid() {
        this.setGridColor("transparent");
    }

    static wasEventStartedOnBackground(event: PointerEvent) {
        return (event.target as unknown as HTMLElement).classList.contains("graph-background");
    }
}
