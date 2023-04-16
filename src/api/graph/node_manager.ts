import { Vector2 } from "../../interfaces/basics";
import { WireNode } from "../node/wire_node";
import { GraphBackground } from "./graph_background";
import { GraphContainer } from "./graph_container";
import { NodeSelectionManager } from "./node_selection_manager";
import { WireGraph } from "./wire_graph";

export class NodeManager {
    nodeSelectionManager!: NodeSelectionManager;
    readonly availableNodes: Set<typeof WireNode> = new Set();
    readonly createdNodeInstances: Set<WireNode> = new Set();

    constructor(public graphInstance: WireGraph) {
        this.nodeSelectionManager = new NodeSelectionManager(
            this.graphInstance
        );

        this.attachContextMenuEventListener();
    }

    public addAvailableNode(node: typeof WireNode) {
        this.availableNodes.add(node);
    }

    public registerNodeInstance(node: WireNode) {
        this.createdNodeInstances.add(node);
    }

    public removeNodeInstance(node: WireNode) {
        this.createdNodeInstances.delete(node);
    }

    public getInstanceWhere(
        predicate: (node: WireNode) => boolean
    ): WireNode | undefined {
        return Array.from(this.createdNodeInstances).find(predicate);
    }

    public getInstanceById(id: string): WireNode | undefined {
        return this.getInstanceWhere((node) => node.nodeId === id);
    }

    private attachContextMenuEventListener() {
        window.addEventListener("contextmenu", (event) => {
            if (
                GraphBackground.wasEventStartedOnBackground(event) ||
                GraphContainer.wasEventStartedOnContainer(event) ||
                GraphContainer.wasEventStartedOnNodeContainer(event)
            ) {
                this.nodeSelectionManager.deselectAllNodes();
                event.preventDefault();
                const instancePoint: Vector2 = { x: event.x, y: event.y };

                // TODO : remove this
                // creating a new node instance from the first available node
                var v = this.availableNodes.values().next().value;
                var node = new v(instancePoint, this.graphInstance);
            }
        });
    }
}
