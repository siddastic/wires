import { WireGraph } from "../api/graph/wire_graph";
import { UIElement } from "./ui_element";

import "../styles/ui/node_connector.css";
import { NodeField, Vector2, bind } from "../main";
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
    startPosition: Vector2 = {
        x: 0,
        y: 0,
    };

    endPosition: Vector2 = {
        x: 0,
        y: 0,
    };

    pathId = uniqueIdGenerator.create();
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    connectedTo: NodeConnector | null = null;

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

    static getElementOffset(el: Element): Vector2 {
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

    // this method is called when the node is being dragged
    public updatedConnectorPath() {
        let newStartPosition = NodeConnector.getElementOffset(this.element);
        let newEndPosition = this.connectedTo
            ? NodeConnector.getElementOffset(this.connectedTo!.element)
            : this.endPosition;
        let subtractedCurrentPos = Vector.subtract(
            newStartPosition,
            this.graphInstance.graphContainer.transform
        );
        let subtractedEndPos = Vector.subtract(
            newEndPosition,
            this.graphInstance.graphContainer.transform
        );

        this.path.setAttribute(
            "d",
            `M ${subtractedCurrentPos.x} ${subtractedCurrentPos.y}  L ${
                subtractedCurrentPos.x + 50
            } ${subtractedCurrentPos.y} L ${subtractedEndPos.x - 50} ${
                subtractedEndPos.y
            } L ${subtractedEndPos.x} ${subtractedEndPos.y}`
        );

        this.startPosition = newStartPosition;
        this.endPosition = newEndPosition;
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
        const currentPosition = this.startPosition;
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

        let subtractedEndPos = Vector.subtract(
            endPosition,
            this.graphInstance.graphContainer.transform
        );

        this.path.setAttribute(
            "d",
            `M ${subtractedCurrentPos.x} ${subtractedCurrentPos.y}  L ${
                subtractedCurrentPos.x + 50
            } ${subtractedCurrentPos.y} ${startPointCurve} L ${
                subtractedEndPos.x - 50
            } ${subtractedEndPos.y} L ${subtractedEndPos.x} ${
                subtractedEndPos.y
            }`
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

    private createGradientPathForConnections(targetNodeField: NodeField) {
        if (
            this.element.style.borderColor ==
            targetNodeField.connector.element.style.borderColor
        ) {
            // if the connector colors are same, then don't create a gradient path
            return;
        }

        // find if a gradient with the same colors already exists, then use that
        const gradients =
            this.graphInstance.elementTree.svgContainer.querySelectorAll<SVGLinearGradientElement>(
                "linearGradient"
            );
        for (let i = 0; i < gradients.length; i++) {
            const stopElements =
                gradients[i].querySelectorAll<SVGStopElement>("stop");
            if (
                stopElements[0].style.stopColor ==
                    this.element.style.borderColor &&
                stopElements[1].style.stopColor ==
                    targetNodeField.connector.element.style.borderColor
            ) {
                this.path.setAttribute(
                    "style",
                    `stroke:url(#${gradients[i].id});stroke-width:2;fill:none`
                );
                return;
            }
        }

        // if no gradient exists, then create a new one
        const gradient = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "linearGradient"
        );
        gradient.id = uniqueIdGenerator.create();
        const stop1 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "stop"
        );
        stop1.setAttribute("offset", "0%");
        stop1.style.stopColor = this.element.style.borderColor;
        const stop2 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "stop"
        );
        stop2.setAttribute("offset", "100%");
        stop2.style.stopColor =
            targetNodeField.connector.element.style.borderColor;
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        this.graphInstance.elementTree.svgContainer
            .querySelector("defs")!
            .appendChild(gradient);
        this.path.style.stroke = `url(#${gradient.id})`;
    }

    @bind
    onmousedown() {
        this.startPosition = NodeConnector.getElementOffset(this.element);

        window.onmousemove = this.createLineBetweenConnections;
        window.onmouseup = (e: MouseEvent) => {
            window.onmousemove = null;
            window.onmouseup = null;

            let targetElement = e.target as unknown as HTMLElement;
            let targetInConnector = e.target as unknown as HTMLElement;
            if(!targetElement.classList.contains("node-connector") && targetElement.closest(".node-field-container") !== null){
                // if the target has node field as a parent but is not particularily the node connector, then auto assign the node connector
                // this acts as a feature if user left mouse on anywhere else mistakingly wires will auto-connect to that connector inside that node field
                let targetNodeField = targetElement.closest(".node-field-container")!;
                targetInConnector = targetNodeField.querySelector(".node-connector")!;
            }

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

                this.createGradientPathForConnections(targetConnectorInstance);

                let connectedPathIds =
                    targetConnectorInstance.connector.element.hasAttribute(
                        "data-connected-pathIds"
                    )
                        ? JSON.parse(
                              targetConnectorInstance.connector.element.getAttribute(
                                  "data-connected-pathIds"
                              )!
                          )
                        : [];
                connectedPathIds.push(this.pathId);
                targetConnectorInstance.connector.element.setAttribute(
                    "data-connected-pathIds",
                    JSON.stringify(connectedPathIds)
                );
                this.connectedTo = targetConnectorInstance.connector;

                // updating node path again in-case user dropped connector on a node-field instead of another connector directly                
                this.updatedConnectorPath();
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

    static getPathPosition(pathElement: SVGPathElement) {
        // parse the start and end points of the path from the path element's d attribute
        let pathData = pathElement.getAttribute("d")!;
        const pathDataArray = pathData.split(" ").filter((x) => x !== "");
        const startPoint: Vector2 = {
            x: parseFloat(pathDataArray[1]),
            y: parseFloat(pathDataArray[2]),
        };
        const endPoint: Vector2 = {
            x: parseFloat(pathDataArray[pathDataArray.length - 2]),
            y: parseFloat(pathDataArray[pathDataArray.length - 1]),
        };

        return {
            startPoint,
            endPoint,
        };
    }

    @bind
    resetConnector() {
        this.element.classList.remove("connected");
        this.element.style.backgroundColor = "var(--node-background-color)";
        this.path.remove();
    }

    destroy(): void {
        this.path.remove();
        this.connectedTo?.element.classList.remove("connected");
        this.connectedTo ? this.connectedTo.element.style.backgroundColor = "var(--node-background-color)" : null;
        this.connectedTo?.element.getAttribute("data-connected-pathIds") &&
            JSON.parse(
                this.connectedTo?.element.getAttribute(
                    "data-connected-pathIds"
                )!
            ).filter((x: string) => x != this.pathId);
    }
}
