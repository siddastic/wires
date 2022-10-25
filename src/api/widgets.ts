import { NodeFieldData, Vector2 } from "../interfaces/node";
import {
    CustomNodeElementData,
    NodeBodyData,
    NodeButtonData,
    NodeFooterData,
    NodeHeaderData,
    NodeScaffoldData,
} from "../interfaces/widget";
import { bind } from "./decorators";
import { NodeFieldController } from "./node_field_controller";

export abstract class Widget {
    abstract build(): HTMLElement;

    postBuild(): void {}
}

export class NodeScaffold extends Widget {
    constructor(public data: NodeScaffoldData) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node");
        if (this.data.header) {
            div.appendChild(this.data.header.build());
            this.data.header.postBuild();
        }
        if (this.data.body) {
            div.appendChild(this.data.body.build());
            this.data.body.postBuild();
        }
        if (this.data.footer) {
            div.appendChild(this.data.footer.build());
            this.data.footer.postBuild();
        }
        return div;
    }
}

export class NodeHeader extends Widget {
    constructor(public data: NodeHeaderData) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node-header");
        const title = document.createElement("div");
        title.classList.add("title");
        title.innerText = this.data.title;
        div.appendChild(title);
        return div;
    }
}

export class NodeBody extends Widget {
    constructor(public data: NodeBodyData) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node-body");
        this.data.children.forEach((child) => {
            div.appendChild(child.build());
            child.postBuild();
        });
        return div;
    }
}

export class NodeFooter extends Widget {
    constructor(public data: NodeFooterData) {
        super();
    }

    build() {
        const div = document.createElement("div");
        div.classList.add("wire-node-footer");
        div.appendChild(this.data.child.build());
        this.data.child.postBuild();
        return div;
    }
}

export class NodeField extends Widget {
    input = document.createElement("input");
    fieldId = globalThis.uniqueIdGenerator.create();

    constructor(public data: NodeFieldData) {
        super();
        let onConnect = this.data.onConnect;
        this.data.onConnect = (data) => {
            if (data.data !== undefined) {
                this.input.value = String(data.data);
            }
            onConnect?.call(this, data);
        };

        // set fieldType to connect only if not provided
        if (this.data.fieldType === undefined) {
            this.data.fieldType = "connect";
        }
    }

    @bind
    addFieldToGraph() {
        let parent = this.input.parentElement;
        while (parent) {
            if (parent.classList.contains("wire-node")) {
                let parentId = parent.id;
                let index = graphConnectionMap.list.findIndex(
                    (x) => x.nodeId === parentId
                )!;
                var fields = graphConnectionMap.list[index].fields;
                if (fields.findIndex((x) => x.fieldId === this.fieldId) == -1) {
                    graphConnectionMap.list[index].fields.push({
                        fieldId: this.fieldId,
                        instance: this,
                    });
                }
                break;
            }
            parent = parent.parentElement;
        }
        return null;
    }

    build() {
        const textField = document.createElement("div");
        const labelElement = document.createElement("div");
        textField.id = this.fieldId;
        textField.classList.add("text-field");
        labelElement.classList.add("label");
        labelElement.innerText = this.data.label || "...";
        this.input.type = this.data.inputType ?? "text";
        this.input.classList.add("input");
        let connector;
        if (this.data.fieldType === "connect") {
            connector = new NodeInputConnector();
        } else {
            connector = new SizedBox(10, 10);
        }
        textField.appendChild(connector.build());
        connector.postBuild();
        textField.appendChild(labelElement);
        textField.appendChild(this.input);
        this.input.oninput = (ev) => {
            this.data.value = (ev.target as HTMLInputElement).value;
            this.data.onUpdate?.call(this.input.value);
        };
        this.input.placeholder = this.data.placeholder ?? "";
        this.input.value = (this.data.value ?? 0).toString();

        // hide input if fieldType is connect only
        if (this.data.fieldType == "connect") {
            this.input.style.display = "none";
        }
        return textField;
    }

    postBuild() {
        if (this.data.controller) {
            this.data.controller!(
                new NodeFieldController({
                    element: this.input,
                })
            );
        }
        setTimeout(this.addFieldToGraph, 0);
    }
}

export class NodeButton extends Widget {
    constructor(public data: NodeButtonData) {
        super();
    }

    build() {
        const button = document.createElement("button");
        button.classList.add("wire-button");
        button.innerText = this.data.label;
        if (this.data.onClick !== undefined) {
            button.addEventListener("click", (event) => {
                this.data.onClick?.call(this);
                event.stopPropagation();
            });
        }
        return button;
    }
}

export class CustomNodeElement extends Widget {
    constructor(public data: CustomNodeElementData) {
        super();
    }

    build(): HTMLElement {
        const element = document.createElement(this.data.elementName);
        if (this.data.innerHTML) element.innerHTML = this.data.innerHTML;
        return element;
    }
}

export class HTMLToWidget extends Widget {
    constructor(public element: HTMLElement) {
        super();
    }

    build(): HTMLElement {
        return this.element;
    }
}

const nodeConnectorColors = [
    "#FF8B8B",
    "#99EF91",
    "#FBCBF4",
    "#83E4E7",
    "#F6FF9A",
];

export class NodeInputConnector extends Widget {
    connector = document.createElement("span");
    build(): HTMLElement {
        this.connector.classList.add("node-connector");
        this.connector.style.border = `1px solid ${
            nodeConnectorColors[
                Math.floor(Math.random() * nodeConnectorColors.length)
            ]
        }`;
        this.connector.classList.add("node-in-connector");
        return this.connector;
    }
}

export class NodeOutConnector extends Widget {
    connector = document.createElement("span");
    svg = document.querySelector(".graph-svg-container")!;
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathId = uniqueIdGenerator.create();
    outConnectorId = uniqueIdGenerator.create();
    currentPosition: Vector2 = {
        x: 0,
        y: 0,
    };
    endPosition: Vector2 = {
        x: 0,
        y: 0,
    };

    getElementOffset(el: HTMLElement | SVGSVGElement) {
        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + window.scrollX + rect.width / 2,
            y: rect.top + window.scrollY + rect.height / 2,
        };
    }

    setupLine() {
        const lineElement = this.svg.querySelector<SVGLineElement>(
            `#${this.pathId}`
        );
        if (lineElement == null) {
            this.path.setAttribute(
                "style",
                `stroke:${this.connector.style.borderColor};stroke-width:2;fill:none`
            );
            this.path.id = this.pathId;
            this.svg.appendChild(this.path);
        } else {
            this.path = lineElement;
        }
    }

    createGradientPathForOutInConnector(endElement: HTMLElement) {
        // check if both colors are same
        if (this.connector.style.borderColor == endElement.style.borderColor) {
            return;
        }
        // if gradient already exists
        const gradients =
            this.svg.querySelectorAll<SVGLinearGradientElement>(
                "linearGradient"
            );
        for (let i = 0; i < gradients.length; i++) {
            const stopElements =
                gradients[i].querySelectorAll<SVGStopElement>("stop");
            if (
                stopElements[0].style.stopColor ==
                    this.connector.style.borderColor &&
                stopElements[1].style.stopColor == endElement.style.borderColor
            ) {
                this.path.setAttribute(
                    "style",
                    `stroke:url(#${gradients[i].id});stroke-width:2;fill:none`
                );
                return;
            }
        }

        // else create a new gradient
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
        stop1.style.stopColor = this.connector.style.borderColor;
        const stop2 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "stop"
        );
        stop2.setAttribute("offset", "100%");
        stop2.style.stopColor = endElement.style.borderColor;
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        this.svg.querySelector("defs")!.appendChild(gradient);
        this.path.style.stroke = `url(#${gradient.id})`;
    }

    @bind
    createLineBetweenConnections(event: MouseEvent) {
        this.setupLine();

        const { x, y } = event;
        this.endPosition.x = x;
        this.endPosition.y = y;

        // this.path.setAttribute("d", `M ${this.currentPosition.x} ${this.currentPosition.y}  L ${this.endPosition.x} ${this.endPosition.y}`);
        // I learnt playing with paths from this video : https://www.youtube.com/watch?v=pKMLPHfLN7k
        // refer to it again if some is changing the lines below, also shout out to the guy who made the video
        const currentPosition = this.currentPosition;
        const endPosition = this.endPosition;
        // TODO : make line end points curved
        // let startPointCurve = `Q ${currentPosition.x + 55} ${currentPosition.y} ${currentPosition.x + 55} ${currentPosition.y + (endPosition.y < currentPosition.y ? -5 : 5)}`;
        let startPointCurve = "";
        // if(currentPosition.x < endPosition.x - 50){
        //     // startPointCurve = "";
        // }
        this.path.setAttribute(
            "d",
            `M ${currentPosition.x} ${currentPosition.y}  L ${
                currentPosition.x + 50
            } ${currentPosition.y} ${startPointCurve} L ${endPosition.x - 50} ${
                endPosition.y
            } L ${endPosition.x} ${endPosition.y}`
        );

        if (!this.connector.classList.contains("connected")) {
            this.connector.classList.add("connected");
            this.connector.style.backgroundColor =
                this.connector.style.borderColor;
        }
    }

    build(): HTMLElement {
        this.connector.classList.add("node-connector");
        this.connector.classList.add("node-out-connector");
        this.connector.style.border = `1px solid ${
            nodeConnectorColors[
                Math.floor(Math.random() * nodeConnectorColors.length)
            ]
        }`;
        this.connector.id = this.outConnectorId;
        this.connector.onmousedown = () => {
            const { x, y } = this.getElementOffset(this.connector);
            this.currentPosition.x = x;
            this.currentPosition.y = y;

            window.onmousemove = this.createLineBetweenConnections;

            window.onmouseup = (e: MouseEvent) => {
                window.onmousemove = null;
                window.onmouseup = null;

                let targetInConnector = e.target as unknown as HTMLElement;

                if (
                    (
                        e.target as unknown as HTMLElement | undefined
                    )?.classList.contains("node-in-connector") ||
                    false
                ) {
                    if (!targetInConnector.classList.contains("connected")) {
                        // get out function reference of this connector
                        const outConnectorParentNodeId =
                            this.connector.closest(".wire-node")!.id;
                        let index1 = graphConnectionMap.list.findIndex(
                            (item) => item.nodeId === outConnectorParentNodeId
                        );

                        // Connection established with another field, call the onConnect function of the other field
                        let targetParentNodeId =
                            targetInConnector.closest(".wire-node")!.id;
                        let index2 = graphConnectionMap.list.findIndex(
                            (item) => item.nodeId === targetParentNodeId
                        );
                        var fieldIndex = graphConnectionMap.list[
                            index2
                        ].fields.findIndex(
                            (item) =>
                                item.fieldId ===
                                targetInConnector.closest(".text-field")!.id
                        );
                        graphConnectionMap.list[index2].fields[fieldIndex]
                            .instance.data.onConnect!({
                            data: graphConnectionMap.list[index1].outFn().data,
                        });
                        targetInConnector.classList.add("connected");
                        targetInConnector.style.backgroundColor =
                            targetInConnector.style.borderColor;

                        this.createGradientPathForOutInConnector(
                            targetInConnector
                        );
                    }
                } else {
                    this.connector.classList.remove("connected");

                    this.connector.style.backgroundColor = "transparent";
                    this.path.remove();
                    globalThis.searchExplorer.menuSpawnLocation = {
                        x: e.clientX,
                        y: e.clientY,
                    };
                    globalThis.searchExplorer.toggleExplorer();
                }
            };
        };
        return this.connector;
    }
}

export class SizedBox extends Widget {
    constructor(public width?: number, public height?: number) {
        super();
    }
    build(): HTMLElement {
        const element = document.createElement("div");
        element.style.width = (this.width ?? 0) + "px";
        element.style.height = (this.height ?? 0) + "px";
        return element;
    }
}
