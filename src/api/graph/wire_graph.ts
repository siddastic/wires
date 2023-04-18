import { GraphBackground } from "./graph_background";
import "../../styles/main.css";
import { GraphContainer } from "./graph_container";
import { UniqueIdGenerator } from "../uid";
import { StatusBar, StatusBarAlignment } from "../status-bar";
import { DefaultGraphTheme } from "./theme";
import { GraphOptions } from "../../interfaces/graph";
import { NodeManager } from "./node_manager";

declare global {
    var uniqueIdGenerator: UniqueIdGenerator;
    var statusBar: StatusBar;
}

globalThis.uniqueIdGenerator = new UniqueIdGenerator();

export class WireGraph {
    nodeManager!: NodeManager;
    rootGraph!: HTMLDivElement;
    graphBackground!: GraphBackground;
    graphContainer!: GraphContainer;
    elementTree!: { nodeContainer: HTMLDivElement; svgContainer: SVGElement };
    graphOptions: GraphOptions = {
        showGridEnabled: true,
        statusBarEnabled: true,
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

        // TODO : remove default status bar item
        globalThis.statusBar.addStatusBarItem({
            alignment: StatusBarAlignment.left,
            label: "Node Count : 0",
            iconClass: "codicon codicon-git-branch",
        });

        // TODO : remove default status bar item
        statusBar.addStatusBarItem({
            alignment: StatusBarAlignment.right,
            label: "Graph Flow",
            iconClass: "codicon codicon-git-branch",
            options : [
                "Graph Flow",
                "Node Flow",
                "Node Flow 2",
            ],
            onOptionSelect : (selectedOption) => {
                console.log(selectedOption);
            },
        });

        // init node selection manager
        this.nodeManager = new NodeManager(this);

    }

    public applyGraphOptions(options: GraphOptions) {
        console.log(options);
        console.log("applying graph options");
        if (globalThis.statusBar === undefined) {
            globalThis.statusBar = new StatusBar();
        }

        if (options.statusBarEnabled) {
            globalThis.statusBar.element.style.display = "flex";
        } else {
            globalThis.statusBar.element.style.display = "none";
        }

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
    }
}
