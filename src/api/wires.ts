import SelectionArea from "@viselect/vanilla";
import { GraphData, Vector2 } from "../interfaces/node";
import { GraphConnectionMap } from "../transpiler/graph_connection_map";
import { DataBoard } from "./data_board";
import { GlobalNodeRegistry } from "./global_node_registry";
import { GraphNodeExplorer } from "./node_explorer";
import { UniqueIdGenerator } from "./unique_id_gen";

declare global {
    var globalNodeRegistry: GlobalNodeRegistry;
    var searchExplorer: GraphNodeExplorer;
    var graphConnectionMap: GraphConnectionMap;
    var uniqueIdGenerator: UniqueIdGenerator;
}

export class WireGraph {
    databoard?: DataBoard;
    currentBodyScale = 1;
    constructor(public graphData: GraphData) {
        globalThis.globalNodeRegistry = new GlobalNodeRegistry();
        graphData.availableNodes.forEach((node) => {
            // @ts-ignore
            globalNodeRegistry.addAvailableNode(node);
        });

        globalThis.uniqueIdGenerator = new UniqueIdGenerator();
        globalThis.searchExplorer = new GraphNodeExplorer();
        globalThis.graphConnectionMap = new GraphConnectionMap();

        this.attachGlobalListeners();
        this.setupSelectionLibrary();
        if (graphData.enableDataboard) {
            this.setupDataboard();
            window.addEventListener("load", () => {
                // TODO : remove this line in production
                // To select the Unititled text
                // @ts-ignore
                globalThis.find("Untitled");
            });
        }
    }

    attachGlobalListeners() {
        // window.addEventListener(
        //     "wheel",
        //     (e) => {
        //         if (e.ctrlKey) {
        //             if (e.deltaY > 0) {
        //                 // zoom out
        //                 this.currentBodyScale -= 0.1;
        //                 document.body.style.transform = `scale(${this.currentBodyScale})`;
        //             } else {
        //                 // zoom in
        //                 this.currentBodyScale += 0.1;
        //                 document.querySelector("body")!.style.transform =
        //                     "scale(" + this.currentBodyScale + ")";
        //             }
        //         }
        //         return e.preventDefault();
        //     },
        //     {
        //         passive: false,
        //     }
        // );

        window.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            const instancePoint: Vector2 = { x: event.x, y: event.y };
            searchExplorer.menuSpawnLocation = instancePoint;
            searchExplorer.toggleExplorer();
        });

        window.addEventListener("keydown", (k) => {
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
        });
    }

    setupSelectionLibrary() {
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
                if (
                    !(event as MouseEvent).ctrlKey &&
                    !(event as MouseEvent).metaKey
                ) {
                    for (const el of store.stored) {
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
            .on("stop", ({ store: { stored } }) => {
                if (stored.length == 0) {
                    globalNodeRegistry.deselectAllNodes();
                }
            });
    }

    setupDataboard() {
        this.databoard = new DataBoard();
        document.body.appendChild(this.databoard.build());
    }
}
