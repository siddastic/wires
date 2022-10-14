import { WireNode } from "./wire_node";

export class GlobalNodeRegistry {
    private _current: Array<WireNode> = [];
    private _available: Array<typeof WireNode> = [];
    private _selectedWireNodes: WireNode[] = [];
    constructor() {
        // clear node selection when clicking on the non-node area
        window.addEventListener("click", (event) => {
            // @ts-ignore
            if (event.target!.closest(".wire-node") == null) {
                const allNodes = document.querySelectorAll(".wire-node");
                allNodes.forEach((node) => {
                    node.classList.remove("wire-node-selected");
                });
                this._selectedWireNodes = [];
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

    get selectedWireNodes() {
        return this._selectedWireNodes[0];
    }

    addSelectedWireNode(node: WireNode) {
        this._selectedWireNodes.push(node);
    }

    removeSelectedNodes(){
        this._selectedWireNodes.forEach(node => {
            node.destroy();
        });
        this._selectedWireNodes = [];
    }
}
