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
                this.input.value = data.data;
            }
            onConnect?.call(this, data);
        };
    }

    @bind
    addFieldToGraph() {
        console.log("adding field to graph");
        let parent = this.input.parentElement;
        while (parent) {
            console.log(parent);
            if (parent.classList.contains("wire-node")) {
                let parentId = parent.id;
                console.log("found parent with id", parentId);
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
        const connector = new NodeInputConnector();
        textField.appendChild(connector.build());
        connector.postBuild();
        textField.appendChild(labelElement);
        textField.appendChild(this.input);
        this.input.oninput = (ev) => {
            this.data.value = (ev.target as HTMLInputElement).value;
            this.data.onUpdate?.call(this.input.value);
        };
        this.input.placeholder = this.data.placeholder ?? "";
        this.input.value = this.data.value.toString();
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

export class NodeInputConnector extends Widget {
    connector = document.createElement("span");
    build(): HTMLElement {
        this.connector.classList.add("node-connector");
        this.connector.classList.add("node-in-connector");
        return this.connector;
    }
}

export class NodeOutConnector extends Widget {
    connector = document.createElement("span");
    svg = document.querySelector(".graph-svg-container")!;
    line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineId = uniqueIdGenerator.create();
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
            `#${this.lineId}`
        );
        if (lineElement == null) {
            this.line.setAttribute("style", "stroke:#2eaa56;stroke-width:2");
            this.line.id = this.lineId;
            this.svg.appendChild(this.line);
        } else {
            this.line = lineElement;
        }
    }

    @bind
    createLineBetweenConnections(event: MouseEvent) {
        this.setupLine();

        const { x, y } = event;
        this.endPosition.x = x;
        this.endPosition.y = y;

        this.line.setAttribute("x1", this.currentPosition.x.toString());
        this.line.setAttribute("x2", this.endPosition.x.toString());
        this.line.setAttribute("y1", this.currentPosition.y.toString());
        this.line.setAttribute("y2", this.endPosition.y.toString());

        if (!this.connector.classList.contains("connected")) {
            this.connector.classList.add("connected");
        }
    }

    build(): HTMLElement {
        this.connector.classList.add("node-connector");
        this.connector.classList.add("node-out-connector");
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
                        console.log(
                            graphConnectionMap.list[index2].fields[fieldIndex]
                                .instance.data.onConnect
                        );
                        graphConnectionMap.list[index2].fields[fieldIndex]
                            .instance.data.onConnect!({
                            data: graphConnectionMap.list[index1].outFn().data,
                        });
                        targetInConnector.classList.add("connected");
                    }
                } else {
                    this.connector.classList.remove("connected");
                    this.line.remove();
                }
            };
        };
        return this.connector;
    }
}
