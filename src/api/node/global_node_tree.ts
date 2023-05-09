import { NodeField, WireGraph } from "../../main";

export interface NodeMetadata {
    nodeID: string;
    nodeFields: NodeField[];
}

export class GlobalNodeTree {
    readonly nodeTree: NodeMetadata[] = [];

    constructor(public graphInstance : WireGraph) {}

    registerNode(nodeMetadata: NodeMetadata) {
        // check if the node is already registered
        if (this.nodeTree.find((node) => node.nodeID == nodeMetadata.nodeID)) {
            // Node is already registered
            return;
        }

        this.nodeTree.push(nodeMetadata);
    }

    getNodeInstance(nodeID: string) {
        return this.graphInstance.nodeManager.getInstanceById(nodeID);
    }

    addNodeFieldToTree(nodeID: string, nodeField: NodeField) {
        let node = this.nodeTree.find((node) => node.nodeID == nodeID);
        if (!node) {
            return;
        }

        node.nodeFields.push(nodeField);

        console.log(this.nodeTree);
    }

    getNodeField(nodeID: string, nodeFieldID: string) {
        let node = this.nodeTree.find((node) => node.nodeID == nodeID);
        if (!node) {
            return;
        }

        return node.nodeFields.find((nodeField) => nodeField.id == nodeFieldID);
    }

    getNodeMetadata(nodeId : string) : NodeMetadata | undefined {
        return this.nodeTree.find((node) => node.nodeID == nodeId);
    }
}
