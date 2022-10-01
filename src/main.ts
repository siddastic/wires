import { GlobalNodeRegistry } from "./api/global_node_registry";
import { GraphNodeExplorer } from "./api/node_explorer";
import { Vector2 } from "./interfaces/node";
import "./styles/main.css";
import {
    AddNode,
    DivideNode,
    MultiplyNode,
    SubtractNode,
} from "./internal/internal_nodes";

declare global {
    var globalNodeRegistry: GlobalNodeRegistry;
    var searchExplorer: GraphNodeExplorer;
}

const availableNodes = [AddNode, SubtractNode, MultiplyNode, DivideNode];

globalThis.globalNodeRegistry = new GlobalNodeRegistry();
availableNodes.forEach((node) => {
    // @ts-ignore
    globalNodeRegistry.addAvailableNode(node);
});

globalThis.searchExplorer = new GraphNodeExplorer();

// disables page zooming without control key
let wheelLocked = true;

window.addEventListener("keydown", (e) => {
    if (e.key === "Control") {
        wheelLocked = false;
    }
});

// release the lock when the user releases the control button
window.addEventListener("keyup", (e) => {
    if (e.key === "Control") {
        wheelLocked = true;
    }
});

window.addEventListener(
    "wheel",
    (e) => {
        if (wheelLocked) {
            e.preventDefault();
        }
    },
    {
        passive: false,
    }
);

window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const instancePoint: Vector2 = { x: event.x, y: event.y };
    const tag = new availableNodes[0](instancePoint);
    tag.setupNode();
    document.body.appendChild(tag.node.element);
});

window.onkeydown = (k) => {
    if (k.which == 32 && k.ctrlKey) {
        searchExplorer.toggleExplorer();
        document
            .querySelector(".explorer-container")
            ?.querySelector("input")
            ?.focus();
    }
    // Deleting elements and instances on delete key hit
    if (k.key == "Delete" && globalNodeRegistry.selectedWireNode != undefined) {
        globalNodeRegistry.selectedWireNode.destroy();
        globalNodeRegistry.setSelectedWireNode(undefined);
    }
};
