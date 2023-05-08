import { Vector2 } from "../../interfaces/basics";
import { NodeUI } from "../../ui/node_ui";
import { NodeField } from "../../ui/node_field";
import { UIElement } from "../../ui/ui_element";
import { bind } from "../decorators";
import { DraggableUIElement } from "../draggable_ui_element";
import { WireGraph } from "../graph/wire_graph";
import { Vector } from "../vector_operations";

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
        this.nodeUi.title = name;
    }

    // build method is the main method that is called after the node ui is created and node is ready to expect fields to be added to it
    abstract build(): UIElement[] | void;

    @bind
    onDragStart(position: Vector2) {
        void position;
    }

    @bind
    onDrag(dragEvent: MouseEvent) {
        // this.updateConnectedPathsOnDrag();
        this.moveAllSelectedNodes(dragEvent);
    }

    @bind
    onDragEnd(position: Vector2) {
        void position;
    }

    private moveAllSelectedNodes(dragEvent: MouseEvent) {
        let movement: Vector2 = {
            x: dragEvent.movementX,
            y: dragEvent.movementY,
        };
        this.graphInstance.nodeManager.nodeSelectionManager
            .getSelectedNodeInstances()
            .forEach((node) => {
                if (node === this) return;
                node.positionInWorld = Vector.add(
                    node.positionInWorld,
                    movement
                );
                node.nodeUi.nodeElement.style.left =
                    node.positionInWorld.x + "px";
                node.nodeUi.nodeElement.style.top =
                    node.positionInWorld.y + "px";
            });
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
            if (!e.ctrlKey) {
                // deselect all nodes if ctrl key is not pressed while clicking on node
                // this will make sure that only one node is selected at a time
                // unless user wants to select multiple nodes by pressing ctrl key
                this.graphInstance.nodeManager.nodeSelectionManager.deselectAllNodes();
            }
            if (
                (e.target as HTMLElement).classList.contains(
                    "wire-node-header"
                ) ||
                (e.target as HTMLElement).parentElement!.classList.contains(
                    "wire-node-header"
                )
            ) {
                this.graphInstance.nodeManager.nodeSelectionManager.selectNode(
                    this
                );
            }
        });

        // return node ui so that can be used later to append fields to the node
        return node;
    }

    private registerNodeInstance() {
        this.graphInstance.nodeManager.registerNodeInstance(this);

        // add node to the graph
        this.graphInstance.globalNodeTree.registerNode({
            nodeID: this.nodeId,
            nodeFields: [],
        });
    }

    destroy() {
        this.nodeUi.nodeElement.remove();
    }
}

export class VariableNode extends WireNode {
    constructor(positionInWorld: Vector2, graphInstance: WireGraph) {
        super(positionInWorld, graphInstance);
        this.setName("Variable Node");

        setTimeout(() => {
            console.log(this);
        }, 2000);
    }
    build() {
        var nodeField1 = new NodeField(
            {
                label: "x",
                placeholder: "Enter variable name",
                type: "input-in",
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
                valueToSend: () => {
                    return nodeField1.getValueFromFieldInput();
                },
            },
            this.graphInstance
        );

        this.nodeUi.addFooterElement(nodeField2);
        this.nodeUi.addFooterElement(nodeField2);

        return [nodeField1];
    }
}
