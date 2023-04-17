import { Vector2 } from "../../interfaces/basics";
import { NodeUI } from "../../ui/node_ui";
import { NodeButton } from "../../ui/node_button";
import { NodeDropdown } from "../../ui/node_dropdown";
import { NodeField } from "../../ui/node_field";
import { NodeSwitch } from "../../ui/node_switch";
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

        this.registerNodeInstance();
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
        console.log(this.graphInstance);
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

        // attach click listener to node which will select the node
        node.nodeElement.addEventListener("click", (e) => {
            this.graphInstance.nodeManager.nodeSelectionManager.deselectAllNodes();
            if((e.target as HTMLElement).classList.contains("wire-node-header") || (e.target as HTMLElement).parentElement!.classList.contains("wire-node-header")){
                this.graphInstance.nodeManager.nodeSelectionManager.selectNode(this);
            }
        });

        // return node ui so that can be used later to append fields to the node
        return node;
    }

    private registerNodeInstance() {
        this.graphInstance.nodeManager.registerNodeInstance(this);
    }

    destroy() {
        this.nodeUi.nodeElement.remove();
    }
}

export class VariableNode extends WireNode {
    constructor(positionInWorld: Vector2, graphInstance: WireGraph) {
        super(positionInWorld, graphInstance);
        this.setName("Variable Node");
    }
    build() {
        var nodeField1 = new NodeField(
            {
                label: "x",
                placeholder: "Enter variable name",
                type: "connect-in",
                // connectorStyle: "on-inside",
            },
            this.graphInstance
        );

        var nodeField2 = new NodeField(
            {
                label: "(out)",
                type: "connect-out",
                // connectorStyle: "on-inside",
                placeholder: "Enter your nationality",
                options: [
                    "Indian",
                    "American",
                    "Chinese",
                    "Japanese",
                    "Russian",
                    "Swiss",
                ],
            },
            this.graphInstance
        );

        let ns = new NodeSwitch(
            {
                label: "Switch",
            },
            this.graphInstance
        );

        var btn = new NodeButton(
            {
                label: "Add",
                onClick: () => {
                    nodeField1.toggleVisibility();
                },
            },
            this.graphInstance
        );

        let dropdown = new NodeDropdown(
            {
                label: "Dropdown",
                options: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6", "Option 7", "Option 8", "Option 9", "Option 10"],
            },
            this.graphInstance
        );

        this.nodeUi.addFooterElement(nodeField2);
        this.nodeUi.addFooterElement(nodeField2);

        return [nodeField1,ns,dropdown,btn];
    }
}
