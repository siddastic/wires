import {
    NodeData,
    NodeElement,
    Vector2,
    WireOutData,
} from "../interfaces/node";
import { DraggableUIElement } from "./draggable_ui_element";
import { bind } from "./decorators";
import { NodeOutConnector, Widget } from "./widgets";

export abstract class WireNode {
    public id = uniqueIdGenerator.create();

    node: NodeElement = {
        element: document.createElement("div"),
        header: document.createElement("div"),
        headerTitle: document.createElement("div"),
        body: document.createElement("div"),
        fields: [],
    };

    static doc(): NodeData {
        return {
            name: "Unimplemented",
            documentation: "Documentation is not implemented for this node",
        };
    }

    constructor(protected positionInWorld: Vector2) {}

    prebuild() {
        // this function is called before the node is built
    }

    @bind
    onDragStart(position: Vector2) {}

    @bind
    onDrag(dragEvent: MouseEvent) {
        this.updateConnectedPathsOnDrag();
    }

    @bind
    onDragEnd(position: Vector2) {}

    private updateConnectedPathsOnDrag() {
        this.updatePathElement(
            globalNodeTree.getNodeById(this.id)?.outPath as
                | SVGPathElement
                | undefined,
            true
        );

        globalNodeTree.getNodeById(this.id)?.fields.forEach((field) => {
            field.paths.forEach((path) => {
                this.updatePathElement(
                    path as SVGPathElement,
                    false,
                    field.instance.input.parentElement?.querySelector(
                        ".node-in-connector"
                    ) as HTMLElement
                );
            });
        });
    }

    private updatePathElement(
        path: SVGPathElement | undefined,
        isOutConnector = false,
        fieldElement?: HTMLElement
    ) {
        if (!path) return;
        let pathData = path.getAttribute("d")!;
        const pathDataArray = pathData.split(" ").filter((x) => x !== "");
        const startPoint: Vector2 = {
            x: parseFloat(pathDataArray[1]),
            y: parseFloat(pathDataArray[2]),
        };
        const endPoint: Vector2 = {
            x: parseFloat(pathDataArray[pathDataArray.length - 2]),
            y: parseFloat(pathDataArray[pathDataArray.length - 1]),
        };
        if (isOutConnector) {
            // change the position from current node's out connector side
            const rect = this.node.element
                .querySelector(".node-out-connector")!
                .getBoundingClientRect();
            const outConnectorPosition = {
                x: rect.left + window.scrollX + rect.width / 2,
                y: rect.top + window.scrollY + rect.height / 2,
            };

            path.setAttribute(
                "d",
                `M ${outConnectorPosition.x} ${outConnectorPosition.y}  L ${
                    outConnectorPosition.x + 50
                } ${outConnectorPosition.y} L ${endPoint.x - 50} ${
                    endPoint.y
                } L ${endPoint.x} ${endPoint.y}`
            );
        } else {
            // change the position from current node's in connector side
            const rect = fieldElement!.getBoundingClientRect();
            const inConnectorPosition = {
                x: rect.left + window.scrollX + rect.width / 2,
                y: rect.top + window.scrollY + rect.height / 2,
            };

            path.setAttribute(
                "d",
                `M ${startPoint.x} ${startPoint.y}  L ${
                    startPoint.x + 50
                } ${startPoint.y} L ${inConnectorPosition.x - 50} ${
                    inConnectorPosition.y
                } L ${inConnectorPosition.x} ${inConnectorPosition.y}`
            );
        }
    }

    abstract build(): Widget;

    createNodeMap() {
        globalThis.globalNodeTree.addNodeIfNotPresent({
            nodeId: this.id,
            // fields will be added by the node field widget when it is created
            fields: [],
            outFn: this.out,
            outPath: undefined,
        });
    }

    out(): WireOutData {
        return {
            data: undefined,
        };
    }

    destroy() {
        this.node.element.remove();
        globalThis.globalNodeRegistry.unregisterInstance(this);
        // remove connected paths
        globalNodeTree.getNodeById(this.id)?.fields.forEach((field) => {
            field.paths.forEach((path) => {
                path.remove();
            });
        });
        globalNodeTree.getNodeById(this.id)?.outPath?.remove();
    }

    postBuild() {
        // this function is called after the node is built
    }

    rebuild() {
        var newInstance = this.build().build();

        this.node.element.querySelector(".wire-node-header")!.innerHTML =
            newInstance.querySelector(".wire-node-header")!.innerHTML;
        this.node.element
            .querySelector(".wire-node-body")
            ?.replaceWith(newInstance.querySelector(".wire-node-body")!);
        this.node.element
            .querySelector(".wire-node-footer")
            ?.replaceWith(newInstance.querySelector(".wire-node-footer")!);

        this.postBuild();
    }

    setupNode() {
        this.prebuild();
        const instance = this.build();
        const widget = instance.build();
        this.node.element = widget;
        // when node is clicked add the selectedNode class to it and remove it from all other nodes
        this.node.element.onclick = () => {
            const allNodes = document.querySelectorAll(".wire-node");
            allNodes.forEach((node) => {
                node.classList.remove("wire-node-selected");
            });
            this.node.element.classList.add("wire-node-selected");
        };
        this.node.header = widget.querySelector(".wire-node-header")!;
        widget.id = this.id;
        widget.style.top = `${this.positionInWorld.y}px`;
        widget.style.left = `${this.positionInWorld.x}px`;
        if (this.out().data !== undefined) {
            this.createOutConnector();
        }
        new DraggableUIElement(
            this.node.element,
            (pos, dragEvent) => {
                this.positionInWorld = pos;
                this.onDrag(dragEvent);
            },
            this.onDragStart,
            this.onDragEnd,
            this.node.header
        );
        // remove all previous selections when new is created
        globalNodeRegistry.deselectAllNodes();
        globalThis.globalNodeRegistry.registerInstance(this);
        this.postBuild();
        this.createNodeMap();
    }

    private createOutConnector() {
        const outContainer = document.createElement("div");
        const element = new NodeOutConnector();
        const outLabel = document.createElement("div");

        outContainer.style.display = "flex";
        outContainer.style.flexDirection = "row";
        outContainer.style.justifyContent = "end";
        outContainer.style.alignItems = "center";
        outContainer.style.marginBottom = "5px";

        outLabel.innerText = "out";
        outLabel.style.marginRight = "5px";

        outContainer.appendChild(outLabel);
        outContainer.appendChild(element.build());
        this.node.element.appendChild(outContainer);
        element.postBuild();
    }
}
