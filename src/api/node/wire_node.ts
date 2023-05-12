import { Vector2 } from "../../interfaces/basics";
import { NodeUI } from "../../ui/node_ui";
import { NodeField } from "../../ui/node_field";
import { UIElement } from "../../ui/ui_element";
import { bind, doc } from "../decorators";
import { DraggableUIElement } from "../draggable_ui_element";
import { WireGraph } from "../graph/wire_graph";
import { Vector } from "../vector_operations";
import { NodeConnector } from "../../main";
import { NodeDocumentation } from "../../interfaces/node";

export abstract class WireNode {
    nodeUi: NodeUI;
    nodeId = globalThis.uniqueIdGenerator.create();
    static doc(): NodeDocumentation {
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
        this.moveNestedPaths();
    }

    @bind
    onDragEnd(position: Vector2) {
        void position;
        // calling it here again as thing function is called even after the node is snapped to the grid so that it updates the paths again
        this.moveNestedPaths();
    }

    protected moveNestedPaths() {
        let nodeFields =
            this.graphInstance.globalNodeTree.getNodeMetadata(this.nodeId)
                ?.nodeFields ?? [];
        nodeFields.forEach((field) => {
            field.connector.updatedConnectorPath();
        });

        this.updateAllConnectedPaths();
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

                node.moveNestedPaths();
            });
    }

    protected updateAllConnectedPaths() {
        // get all the input connectors
        let connectors = this.nodeUi.nodeElement.querySelectorAll(
            ".node-connector[connector-direction='input']"
        );
        connectors.forEach((connector) => {
            // get the connected path ids
            let connectedPathIds = connector.getAttribute(
                "data-connected-pathIds"
            );
            if (!connectedPathIds) return;
            let pathIds = JSON.parse(connectedPathIds) as string[];
            pathIds.forEach((pathId) => {
                // get the path element
                let path = document.querySelector<SVGPathElement>("#" + pathId);
                if (!path) return;

                // get the path start position
                let pathPosition = NodeConnector.getPathPosition(path);
                let { startPoint } = pathPosition;

                // recalculate new end position
                let endPoint: Vector2 =
                    NodeConnector.getElementOffset(connector);

                let subtractedEndPos = Vector.subtract(
                    endPoint,
                    this.graphInstance.graphContainer.transform
                );

                // update the path with new end position
                path.setAttribute(
                    "d",
                    `M ${startPoint.x} ${startPoint.y}  L ${
                        startPoint.x + 50
                    } ${startPoint.y} L ${subtractedEndPos.x - 50} ${
                        subtractedEndPos.y
                    } L ${subtractedEndPos.x} ${subtractedEndPos.y}`
                );
            });
        });
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

    // this function runs when user either presses delete key while this node is selected by default, its also safe to call this function to delete the node
    destroy() {
        // remove all the paths emerging from this node
        this.graphInstance.globalNodeTree
            .getNodeMetadata(this.nodeId)
            ?.nodeFields.forEach((field) => {
                field.connector.destroy();
            });

        // remove all paths connected to this node
        let inputConnectors =
            this.nodeUi.nodeElement.querySelectorAll(".node-connector");

        inputConnectors.forEach((inputConnector) => {
            let connectedPathIds = inputConnector.getAttribute(
                "data-connected-pathIds"
            );

            if (!connectedPathIds) return;
            let pathIds = JSON.parse(connectedPathIds) as string[];
            pathIds.forEach((pathId) => {
                // get the path element
                let path = document.querySelector<SVGPathElement>("#" + pathId);
                if (!path) return;

                // remove the path
                path.remove();
            });
        });

        // remove node from the graph
        this.nodeUi.nodeElement.remove();
    }
}

@doc({
    name: "Variable Node",
    description: "This node is used to create a variable",
    icon: "codicon codicon-symbol-variable",
    iconColor: "mediumseagreen",
})
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
                type: "input-in",
                // connectorStyle: "on-inside",
                allowMultidrop: true,
            },
            this.graphInstance
        );

        var nodeField3 = new NodeField(
            {
                label: "(out)",
                type: "connect-out",
                // connectorStyle: "on-inside",
                valueToSend: () => {
                    return nodeField1.getValueFromFieldInput();
                },
            },
            this.graphInstance
        );

        this.nodeUi.addFooterElement(nodeField3);

        return [nodeField1];
    }
}

@doc({
    name: "Add Node",
    description: "This node is used to add two numbers",
    icon: "codicon codicon-symbol-method",
    iconColor: "purple",
})
export class AddNode extends WireNode {
    build(): void | UIElement[] {
        this.setName("Add Node");
        var nodeField1 = new NodeField(
            {
                label: "x",
                type: "input-in",
            },
            this.graphInstance
        );
        var nodeField2 = new NodeField(
            {
                label: "y",
                type: "input-in",
            },
            this.graphInstance
        );

        var outfield = new NodeField(
            {
                label: "(out)",
                type: "connect-out",
                valueToSend: () => {
                    return (
                        Number(nodeField1.getValueFromFieldInput()) +
                        Number(nodeField2.getValueFromFieldInput())
                    );
                },
            },
            this.graphInstance
        );

        this.nodeUi.addFooterElement(outfield);
        return [nodeField1, nodeField2];
    }
}

@doc({
    name: "Subtract Node",
    description: "This node is used to subtract two numbers",
    icon: "codicon codicon-symbol-method",
    iconColor: "purple",
})
export class SubtractNode extends WireNode {
    build(): void | UIElement[] {
        this.setName("Subtract Node");
        var nodeField1 = new NodeField(
            {
                label: "x",
                type: "input-in",
            },
            this.graphInstance
        );
        var nodeField2 = new NodeField(
            {
                label: "y",
                type: "input-in",
            },
            this.graphInstance
        );

        var outfield = new NodeField(
            {
                label: "(out)",
                type: "connect-out",
                valueToSend: () => {
                    return (
                        Number(nodeField1.getValueFromFieldInput()) -
                        Number(nodeField2.getValueFromFieldInput())
                    );
                },
            },
            this.graphInstance
        );

        this.nodeUi.addFooterElement(outfield);
        return [nodeField1, nodeField2];
    }
}

@doc({
    name: "Multiply Node",
    description: "This node is used to subtract two numbers",
    icon: "codicon codicon-symbol-method",
    iconColor: "purple",
})
export class MultiplyNode extends WireNode {
    build(): void | UIElement[] {
        this.setName("Multiply Node");
        var nodeField1 = new NodeField(
            {
                label: "x",
                type: "input-in",
            },
            this.graphInstance
        );
        var nodeField2 = new NodeField(
            {
                label: "y",
                type: "input-in",
            },
            this.graphInstance
        );

        var outfield = new NodeField(
            {
                label: "(out)",
                type: "connect-out",
                valueToSend: () => {
                    return (
                        Number(nodeField1.getValueFromFieldInput()) *
                        Number(nodeField2.getValueFromFieldInput())
                    );
                },
            },
            this.graphInstance
        );

        this.nodeUi.addFooterElement(outfield);
        return [nodeField1, nodeField2];
    }
}

@doc({
    name: "Power Node",
    description: "This node is used to subtract two numbers",
    icon: "codicon codicon-symbol-method",
    iconColor: "purple",
})
export class PowerNode extends WireNode {
    build(): void | UIElement[] {
        this.setName("Power Node");
        var nodeField1 = new NodeField(
            {
                label: "x",
                type: "input-in",
            },
            this.graphInstance
        );
        var nodeField2 = new NodeField(
            {
                label: "y",
                type: "input-in",
            },
            this.graphInstance
        );

        var outfield = new NodeField(
            {
                label: "(out)",
                type: "connect-out",
                valueToSend: () => {
                    return (
                        Number(nodeField1.getValueFromFieldInput()) **
                        Number(nodeField2.getValueFromFieldInput())
                    );
                },
            },
            this.graphInstance
        );

        this.nodeUi.addFooterElement(outfield);
        return [nodeField1, nodeField2];
    }
}
