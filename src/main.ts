import { GlobalNodeRegistry } from "./api/global_node_registry";
import { GraphNodeExplorer } from "./api/node_explorer";
import { Vector2 } from "./interfaces/node";
import "./styles/main.css";
import SelectionArea from "@viselect/vanilla";

import {
    AddNode,
    DataNode,
    DivideNode,
    MultiplyNode,
    SubtractNode,
} from "./internal/internal_nodes";
import { DataBoard } from "./api/data_board";

declare global {
    var globalNodeRegistry: GlobalNodeRegistry;
    var searchExplorer: GraphNodeExplorer;
}

const availableNodes = [AddNode, SubtractNode, MultiplyNode, DivideNode, DataNode];

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
    searchExplorer.menuSpawnLocation = instancePoint;
    searchExplorer.toggleExplorer();
});

window.onkeydown = (k) => {
    if (k.which == 32 && k.ctrlKey) {
        searchExplorer.menuSpawnLocation = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        };
        searchExplorer.toggleExplorer();
    }
    // Deleting elements and instances on delete key hit
    if (k.key == "Delete" && globalNodeRegistry.selectedWireNodes) {
        globalNodeRegistry.removeSelectedNodes();
    }
};
searchExplorer.toggleExplorer();

const selection = new SelectionArea({
    selectables: [".wire-node"],
    boundaries: ["body"],
    behaviour: {
        // Specifies what should be done if already selected elements get selected again.
        //   invert: Invert selection for elements which were already selected
        //   keep: Keep selected elements (use clearSelection() to remove those)
        //   drop: Remove stored elements after they have been touched
        // overlap: "invert",

        // On which point an element should be selected.
        // Available modes are cover (cover the entire element), center (touch the center) or
        // the default mode is touch (just touching it).
        // intersect: "touch",

        // px, how many pixels the point should move before starting the selection (combined distance).
        // Or specifiy the threshold for each axis by passing an object like {x: <number>, y: <number>}.
        startThreshold: 10,

        // Scroll configuration.
        scrolling: {
            // On scrollable areas the number on px per frame is devided by this amount.
            // Default is 10 to provide a enjoyable scroll experience.
            speedDivider: 10,

            // Browsers handle mouse-wheel events differently, this number will be used as
            // numerator to calculate the mount of px while scrolling manually: manualScrollSpeed / scrollSpeedDivider.
            manualSpeed: 750,

            // This property defines the virtual inset margins from the borders of the container
            // component that, when crossed by the mouse/touch, trigger the scrolling. Useful for
            // fullscreen containers.
            startScrollMargins: { x: 0, y: 0 },
        },
    },
})
    .on("beforestart", (e) => {
        if ((e.event?.target as Element).tagName != "BODY") {
            // Cancel selection if not initiated directly on body
            return false;
        }
        return;
    })
    .on("start", ({ store, event }) => {
        if (!(event as MouseEvent).ctrlKey && !(event as MouseEvent).metaKey) {
            for (const el of store.stored) {
                console.log("Deselecting", el);
                el.classList.remove("wire-node-selected");
            }

            selection.clearSelection();
            globalNodeRegistry.deselectAllNodes();
        }
    })
    .on(
        "move",
        ({
            store: {
                changed: { added, removed },
            },
        }) => {
            for (const el of added) {
                el.classList.add("wire-node-selected");
            }

            for (const el of removed) {
                el.classList.remove("wire-node-selected");
            }
        }
    )
    .on("stop", ({ store: { stored } }) => console.log(stored));

console.log(selection);


const databoard = new DataBoard();
document.body.appendChild(databoard.build());