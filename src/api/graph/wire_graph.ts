import { GraphBackground } from "./graph_background";
import "../../styles/main.css";
import { GraphContainer } from "./graph_container";

export class WireGraph {
    rootGraph!: HTMLDivElement;
    graphBackground!: GraphBackground;
    graphContainer!: GraphContainer;
    elementTree!: { nodeContainer: HTMLDivElement; svgContainer: SVGElement };
    constructor(element: HTMLDivElement) {
        this.rootGraph = element;
        this.rootGraph.classList.contains("wire-graph")
            ? void 0
            : this.rootGraph.classList.add("wire-graph");
        this.init();
        this.createElementTree();
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
