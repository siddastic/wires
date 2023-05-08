import { WireGraph } from "../api/graph/wire_graph";
import { UIElement } from "./ui_element";

import "../styles/ui/node_connector.css";
import { Vector2, bind } from "../main";
import { Vector } from "../api/vector_operations";

export interface NodeConnectorData {
    direction: "input" | "output";
    allowMultidrop?: boolean;
    style: NodeConnectorStyle;
    onBeforeValueSend?: () => any;
    onBeforeValueReceive?: (value: any) => any;
}

export type NodeConnectorStyle = "on-edge" | "on-inside";

export class NodeConnector extends UIElement {
    connectorColors = ["#FF8B8B", "#99EF91", "#FBCBF4", "#83E4E7", "#F6FF9A"];
    connectorPosition: Vector2 = {
        x: 0,
        y: 0,
    };

    endPosition: Vector2 = {
        x: 0,
        y: 0,
    };

    pathId = uniqueIdGenerator.create();
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    constructor(
        public data: NodeConnectorData,
        public graphInstance: WireGraph
    ) {
        super(graphInstance);
        this.element = this.build();

        if (this.data.direction == "output") {
            // only output connectors can be dragged
            this.element.onmousedown = this.onmousedown;
        }

        this.initConnectorElementAttributes();

        if (
            data.onBeforeValueReceive === undefined &&
            data.onBeforeValueSend === undefined
        ) {
            throw new Error(
                "onBeforeValueReceive or onBeforeValueSend must be defined for node connector"
            );
        }
    }

    private getElementOffset(el: HTMLElement | SVGSVGElement): Vector2 {
        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + window.scrollX + rect.width / 2,
            y: rect.top + window.scrollY + rect.height / 2,
        };
    }

    private initConnectorElementAttributes() {
        this.element.setAttribute("connector-direction", this.data.direction);

        // prevent multidrop enabling for output connectors
        if (
            this.data.direction == "output" &&
            this.data.allowMultidrop == true
        ) {
            throw new Error(
                "Multidrop is not supported for output connectors only input connectors can have multidrop enabled"
            );
        }

        this.element.setAttribute(
            "connector-allow-multidrop",
            this.data.allowMultidrop ? "true" : "false"
        );
    }

    private setupLine() {
        const lineElement =
            this.graphInstance.elementTree.svgContainer.querySelector<SVGLineElement>(
                `#${this.pathId}`
            );
        if (lineElement == null) {
            this.path.setAttribute(
                "style",
                `stroke:${this.element.style.borderColor};stroke-width:2;fill:none`
            );
            this.path.id = this.pathId;
            this.graphInstance.elementTree.svgContainer.appendChild(this.path);
        } else {
            this.path = lineElement;
        }
    }

    @bind
    private createLineBetweenConnections(event: MouseEvent) {
        this.setupLine();

        const { x, y } = event;
        this.endPosition.x = x;
        this.endPosition.y = y;

        // this.path.setAttribute("d", `M ${this.currentPosition.x} ${this.currentPosition.y}  L ${this.endPosition.x} ${this.endPosition.y}`);
        // I learnt playing with paths from this video : https://www.youtube.com/watch?v=pKMLPHfLN7k
        // refer to it again if someone is changing the lines below, also shout out to the guy who made the video
        const currentPosition = this.connectorPosition;
        const endPosition = this.endPosition;
        // TODO : make line end points curved
        // let startPointCurve = `Q ${currentPosition.x + 55} ${currentPosition.y} ${currentPosition.x + 55} ${currentPosition.y + (endPosition.y < currentPosition.y ? -5 : 5)}`;
        let startPointCurve = "";
        // if(currentPosition.x < endPosition.x - 50){
        //     // startPointCurve = "";
        // }

        let subtractedCurrentPos = Vector.subtract(
            currentPosition,
            this.graphInstance.graphContainer.transform
        );

        this.path.setAttribute(
            "d",
            `M ${subtractedCurrentPos.x} ${subtractedCurrentPos.y}  L ${
                subtractedCurrentPos.x + 50
            } ${subtractedCurrentPos.y} ${startPointCurve} L ${
                endPosition.x - 50
            } ${endPosition.y} L ${endPosition.x} ${endPosition.y}`
        );

        if (!this.element.classList.contains("connected")) {
            this.element.classList.add("connected");
            this.element.style.backgroundColor = this.element.style.borderColor;
        }
    }

    protected build(): HTMLElement {
        const connector = document.createElement("div");
        connector.classList.add("node-connector");

        if (this.data.style == "on-inside") {
            // remove absolute positioning and set to default
            connector.style.position = "unset";
        }
        if (this.data.direction == "output") {
            connector.classList.add("node-connector-right");
        }
        connector.style.border = `1px solid ${
            this.connectorColors[
                Math.floor(Math.random() * this.connectorColors.length)
            ]
        }`;

        return connector;
    }

    @bind
    onmousedown() {
        this.connectorPosition = this.getElementOffset(this.element);

        window.onmousemove = this.createLineBetweenConnections;
        window.onmouseup = (e: MouseEvent) => {
            window.onmousemove = null;
            window.onmouseup = null;

            let targetInConnector = e.target as unknown as HTMLElement;

            if (
                targetInConnector.classList.contains("node-connector") &&
                targetInConnector.getAttribute("connector-direction") == "input"
            ) {
                // if the target is a connector, then connect the two connectors
                if (targetInConnector.classList.contains("connected")) {
                    // if the target is already connected, then remove the line and reset the connector
                    if (
                        targetInConnector.getAttribute(
                            "connector-allow-multidrop"
                        ) == "false"
                    ) {
                        this.resetConnector();
                        return;
                    }
                }
                targetInConnector.classList.add("connected");
                targetInConnector.style.backgroundColor =
                    targetInConnector.style.borderColor;

                // do the data transfer part here
                // find the node id of the target connector
                let targetNodeId = targetInConnector.closest(".wire-node")!.id;
                // then find the field id of the target connector
                let targetFieldId = targetInConnector.closest(
                    ".node-field-container"
                )!.id;

                // find the target connector instance
                let targetConnectorInstance =
                    this.graphInstance.globalNodeTree.getNodeField(
                        targetNodeId,
                        targetFieldId
                    )!;

                // call the onBeforeValueReceive function of the target connector if it exists and pass the value of the current connector's onBeforeValueSend function
                targetConnectorInstance.connector.data.onBeforeValueReceive !=
                    null &&
                    targetConnectorInstance.connector.data.onBeforeValueReceive(
                        this.data.onBeforeValueSend != null
                            ? this.data.onBeforeValueSend()
                            : null
                    );
            } else {
                // if the target is not a connector, then remove the line and reset the connector
                this.resetConnector();

                // TODO : spawn the explorer here
                // globalThis.searchExplorer.menuSpawnLocation = {
                //     x: e.clientX,
                //     y: e.clientY,
                // };
                // globalThis.searchExplorer.toggleExplorer();
            }
        };
    }

    @bind
    resetConnector() {
        this.element.classList.remove("connected");
        this.element.style.backgroundColor = "unset";
        this.path.remove();
    }
}
