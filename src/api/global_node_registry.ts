import { WireNode } from "./wire_node";

export class GlobalNodeRegistry {
    private _nodes: Array<WireNode> = [];
    constructor() {}

    registerNode(node: WireNode) {
        this._nodes.push(node);
    }

    get nodes() {
        return this._nodes;
    }
}