import { Vector2 } from "../../main";
import { WireNode } from "../node/wire_node";
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

    public spawnNode(node : typeof WireNode,instancePoint : Vector2){
        // @ts-ignore
        new node(instancePoint,this.graphInstance);
    }
}
