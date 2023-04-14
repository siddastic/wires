import { NodeUI } from "../../ui/node";
import { NodeField } from "../../ui/node_field";
import { UIElement } from "../../ui/ui_element";
import { bind } from "../decorators";
import { DraggableUIElement } from "../draggable_ui_element";
import { WireGraph } from "../graph/wire_graph";

export abstract class WireNode {
    nodeUi: NodeUI;
    nodeId = globalThis.uniqueIdGenerator.create();

    static doc() {
        throw new Error(
            "Documentation is not implemented for node type: " + this.name
        );
    }

    constructor(
        public positionInWorld: Vector2,
        public graphInstance: WireGraph
    ) {
        this.nodeUi = this.createNodeUI();

        // call the build method
        var fields = this.build();
        if (fields) {
            fields.forEach((field) => {
                this.nodeUi.body.appendChild(field.element);
            });
        }
    }

    // set the name of the node
    setName(name: string) {
        this.nodeUi.header.querySelector<HTMLDivElement>(".title")!.innerText =
            name;
    }

    // build method is the main method that is called after the node ui is created and node is ready to expect fields to be added to it
    abstract build(): UIElement[] | void;

    @bind
    onDragStart(position: Vector2) {
        void position;
    }

    @bind
    onDrag(dragEvent: MouseEvent) {
        void dragEvent;
        // this.updateConnectedPathsOnDrag();
    }

    @bind
    onDragEnd(position: Vector2) {
        void position;
    }

    private createNodeUI(): NodeUI {
        // create node UI
        var node = new NodeUI(this.nodeId, "Node");
        this.graphInstance.elementTree.nodeContainer.appendChild(
            node.nodeElement
        );

        // set node position
        node.nodeElement.style.left = this.positionInWorld.x + "px";
        node.nodeElement.style.top = this.positionInWorld.y + "px";

        // make node draggable
        new DraggableUIElement(
            node.nodeElement,
            (pos, dragEvent) => {
                this.positionInWorld = pos;
                this.onDrag(dragEvent);
            },
            this.onDragStart,
            this.onDragEnd,
            node.header
        );

        // return node ui so that can be used later to append fields to the node
        return node;
    }
}

export class VariableNode extends WireNode {
    constructor(positionInWorld: Vector2, graphInstance: WireGraph) {
        super(positionInWorld, graphInstance);
        this.setName("Variable Node");
    }
    build() {
        console.log("building variable node");
        console.log(this);

        var nodeField1 = new NodeField(
            {
                label: "Variable Name",
                placeholder: "Enter variable name",
            },
            this.graphInstance
        );

        var nodeField2 = new NodeField(
            {
                label: "Variable Value",
                placeholder: "Enter variable value",
            },
            this.graphInstance
        );

        return [nodeField1,nodeField2];

    }
}
