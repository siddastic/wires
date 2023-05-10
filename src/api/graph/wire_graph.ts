import { GraphBackground } from "./graph_background";
import "../../styles/main.css";
import { GraphContainer } from "./graph_container";
import { UniqueIdGenerator } from "../uid";
import { DefaultGraphTheme } from "./theme";
import { GraphOptions } from "../../interfaces/graph";
import { NodeManager } from "./node_manager";
import { GlobalNodeTree } from "../node/global_node_tree";
import { ExtensionManager } from "../extension/plugin_manager";
import { StatusBar } from "../../extensions/status_bar/status-bar";
import { NodeExplorer } from "../../extensions/node_explorer/node_explorer";

declare global {
    var uniqueIdGenerator: UniqueIdGenerator;
}

globalThis.uniqueIdGenerator = new UniqueIdGenerator();

export class WireGraph {
    nodeManager!: NodeManager;
    rootGraph!: HTMLDivElement;
    graphBackground!: GraphBackground;
    graphContainer!: GraphContainer;
    elementTree!: { nodeContainer: HTMLDivElement; svgContainer: SVGElement };
    extensionManager: ExtensionManager;
    globalNodeTree!: GlobalNodeTree;
    graphOptions: GraphOptions = {
        showGridEnabled: true,
    };
    theme: DefaultGraphTheme;

    constructor(element: HTMLDivElement, options?: GraphOptions) {
        this.rootGraph = element;
        this.rootGraph.classList.contains("wire-graph")
            ? void 0
            : this.rootGraph.classList.add("wire-graph");
        this.init();
        this.createElementTree();

        // define theme
        this.theme = new DefaultGraphTheme();

        // applying graph options in last after defining theme cause theme resets the grid color and if grid was hidden in options it won't be hidden
        // check if graph options are available
        if (options) {
            Object.assign(this.graphOptions, options);
        }

        // apply the provided or else default graph options
        this.applyGraphOptions(this.graphOptions);

        // init node selection manager
        this.nodeManager = new NodeManager(this);

        // init global node tree
        this.globalNodeTree = new GlobalNodeTree(this);

        // init plugin manager
        this.extensionManager = new ExtensionManager(this);

        this.initDefaultExtensions();
    }

    public applyGraphOptions(options: GraphOptions) {
        console.log(options);
        console.log("applying graph options");

        if (options.showGridEnabled === true) {
            console.log("showing grid");
            this.graphBackground.showGrid();
        } else {
            console.log("hiding grid");
            this.graphBackground.hideGrid();
        }

        this.graphOptions = options;
    }

    private init() {
        // init
        this.graphBackground = new GraphBackground(this.rootGraph);
        // append the graph container inside the background element so grid stays behind the container
        this.graphContainer = new GraphContainer(
            this.graphBackground.background
        );
    }

    private createElementTree() {
        // creates elements required for graph functionality
        this.elementTree = {
            nodeContainer: document.createElement("div"),
            svgContainer: document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            ),
        };

        // add classes to elements for styling
        this.elementTree.nodeContainer.classList.add("node-container");
        this.elementTree.svgContainer.classList.add("svg-container");

        // append elements to graph container
        this.graphContainer.graphContainer.appendChild(
            this.elementTree.nodeContainer
        );
        this.graphContainer.graphContainer.appendChild(
            this.elementTree.svgContainer
        );

        // create base defs for svg
        const defs = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "defs"
        );
        this.elementTree.svgContainer.appendChild(defs);
    }

    private initDefaultExtensions() {
        this.extensionManager.useExtension(StatusBar, NodeExplorer);
    }
}
