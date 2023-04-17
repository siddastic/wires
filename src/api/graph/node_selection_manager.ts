import SelectionArea from "@viselect/vanilla";
import { WireGraph } from "./wire_graph";
import { GraphBackground } from "./graph_background";
import { GraphContainer } from "./graph_container";
import { WireNode } from "../node/wire_node";

export class NodeSelectionManager {
    selectedNodeIds: Set<string> = new Set();
    constructor(public graphInstance: WireGraph) {
        this.setupSelectionLibrary();

        this.setupDeleteKeyListener();
    }

    private setupSelectionLibrary() {
        const selection = new SelectionArea({
            selectables: [".wire-node"],
            boundaries: [this.graphInstance.rootGraph],
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
                if (e.event?.ctrlKey == true) {
                    // cancel the selection if ctrl key is pressed to allow for panning
                    return false;
                }
                if (
                    !(
                        GraphBackground.wasEventStartedOnBackground(
                            e.event as MouseEvent
                        ) ||
                        GraphContainer.wasEventStartedOnContainer(
                            e.event as MouseEvent
                        ) ||
                        GraphContainer.wasEventStartedOnNodeContainer(
                            e.event as MouseEvent
                        )
                    )
                ) {
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
                    this.deselectAllNodes();
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
                        this.selectedNodeIds.add(el.id);
                    }

                    for (const el of removed) {
                        el.classList.remove("wire-node-selected");
                    }
                }
            )
            .on("stop", ({ store: { stored } }) => {
                if (stored.length == 0) {
                    this.deselectAllNodes();
                }
            });
    }

    private setupDeleteKeyListener() {
        document.addEventListener("keydown", (e) => {
            if (e.key == "Delete" && this.selectedNodeIds.size > 0) {
                this.deleteSelectedNodes();
            }
        });
    }

    private clearSelectionIds() {
        this.selectedNodeIds.clear();
    }

    public deselectAllNodes() {
        document
            .querySelectorAll<HTMLDivElement>(".wire-node-selected")
            .forEach((node) => {
                node.classList.remove("wire-node-selected");
            });
        this.clearSelectionIds();
    }

    public selectNode(_node: WireNode) {
        const node = document.getElementById(_node.nodeId);
        if (node) {
            node.classList.add("wire-node-selected");
            this.selectedNodeIds.add(_node.nodeId);
        }
    }

    public getSelectedNodeInstances(): WireNode[] {
        const selectedNodes: WireNode[] = [];
        for (const nodeId of this.selectedNodeIds) {
            const node = this.graphInstance.nodeManager.getInstanceById(nodeId);
            if (node) {
                selectedNodes.push(node);
            }
        }
        return selectedNodes;
    }

    public deleteSelectedNodes() {
        const selectedNodes = this.getSelectedNodeInstances();
        for (const node of selectedNodes) {
            node.destroy();
            this.graphInstance.nodeManager.removeNodeInstance(node);
        }
    }
}
