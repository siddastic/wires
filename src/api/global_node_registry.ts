import { WireNode } from "./wire_node";

export class GlobalNodeRegistry {
    private _current: Array<WireNode> = [];
    private _available: Array<typeof WireNode> = [];
    private _selectedWireNode?: WireNode;
    constructor() {
        // clear node selection when clicking on the non-node area
        window.addEventListener("click", (event) => {
            // @ts-ignore
            if (event.target!.closest(".wire-node") == null) {
                const allNodes = document.querySelectorAll(".wire-node");
                allNodes.forEach((node) => {
                    node.classList.remove("wire-node-selected");
                });
                this.setSelectedWireNode(undefined);
            }
        });
    }

    registerInstance(node: WireNode) {
        this._current.push(node);
    }

    unregisterInstance(node: WireNode) {
        this._current = this._current.filter((n) => n.id !== node.id);
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

    get selectedWireNode() {
        return this._selectedWireNode;
    }

    setSelectedWireNode(node: WireNode | undefined) {
        this._selectedWireNode = node;
    }
}
