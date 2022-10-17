import { NodeData, NodeElement, Vector2, WireOutData } from "../interfaces/node";
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

    constructor(private instantiatedPoint: Vector2) {}

    prebuild() {
        console.log("Node Pre Build Function called");
    }

    @bind
    onDrag() {
        console.log("Node Dragged");
    }

    abstract build(): Widget;

    createNodeMap(){
        globalThis.graphConnectionMap.addMapIfNotPresent({
            nodeId: this.id,
            // fields will be added by the node field widget when it is created
            fields: [],
            outFn: this.out,
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
            globalNodeRegistry.addSelectedWireNode(this);
        };
        this.node.header = widget.querySelector(".wire-node-header")!;
        widget.id = this.id;
        widget.style.top = `${this.instantiatedPoint.y}px`;
        widget.style.left = `${this.instantiatedPoint.x}px`;
        if(this.out().data !== undefined) {
            this.createOutConnector();
        }
        new DraggableUIElement(
            this.node.element,
            this.onDrag,
            this.node.header
        );
        globalThis.globalNodeRegistry.registerInstance(this);
        this.createNodeMap();
    }

    private createOutConnector(){
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
