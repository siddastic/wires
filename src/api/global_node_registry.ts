import { WireNode } from "./wire_node";

export class GlobalNodeRegistry {
    private _current: Array<WireNode> = [];
    private _available: Array<WireNode> = [];
    constructor() {}

    registerInstance(node: WireNode) {
        this._current.push(node);
    }

    get instances() {
        return this._current;
    }

    addAvailableNode(node: WireNode) {
        this._current.push(node);
    }

    get availableNodes() {
        return this._current;
    }
}