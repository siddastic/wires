import { WireNode } from "./wire_node";

export class GlobalNodeRegistry {
    private _current: Array<WireNode> = [];
    private _available: Array<typeof WireNode> = [];
    constructor() {}

    registerInstance(node: WireNode) {
        this._current.push(node);
    }

    get instances() {
        return this._current;
    }

    addAvailableNode(nodes: typeof WireNode) {
        this._available.push(nodes);
    }

    get availableNodes() {
        return this._available;
    }
}