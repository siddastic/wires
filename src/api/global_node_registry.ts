import { WireNode } from "./wire_node";

export class GlobalNodeRegistry {
    private _current: Array<WireNode> = [];
    private _available: Array<typeof WireNode> = [];
    constructor() {
        // clear node selection when clicking on the non-node area
        // window.addEventListener("click", (event) => {
        //     if (document.querySelector(".selection-area") == null) {
        //         // if the event wasn't triggered by the selection area
        //         // if the closest parent is not a node, clear the selection
        //         if (
        //             (event.target! as HTMLElement).closest(".wire-node") == null
        //         ) {
        //             const allNodes = document.querySelectorAll(".wire-node");
        //             allNodes.forEach((node) => {
        //                 node.classList.remove("wire-node-selected");
        //             });
        //             this._selectedWireNodes = [];
        //         }
        //     }
        // });
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

    get selectedWireNodes() : WireNode[] {
        const selectedNodeElements = document.querySelectorAll(
            ".wire-node-selected"
        );
        const selectedNodes = Array.from(selectedNodeElements).map(
            (element) => {
                const id = element.getAttribute("id");
                return this._current.find((node) => node.id === id);
            }
        );
        // remove all nulls
        return selectedNodes.filter((node) => node != undefined) as WireNode[];
    }

    deselectAllNodes() {
        this.selectedWireNodes.forEach((element) => {
            element.node.element.classList.remove("wire-node-selected");
        });
    }

    removeSelectedNodes() {
        this.selectedWireNodes.forEach((node) => {
            node.destroy();
        });
    }
}
