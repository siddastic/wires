import { GraphBackground } from "./graph_background";
import "../../styles/main.css";
import { GraphContainer } from "./graph_container";

export class WireGraph{
    rootGraph! : HTMLDivElement;
    graphBackground! : GraphBackground;
    graphContainer! : GraphContainer;
    constructor(element : HTMLDivElement){
        this.rootGraph = element;
        this.rootGraph.classList.contains("wire-graph") ? void 0 : this.rootGraph.classList.add("wire-graph");
        this.init();
    }

    private init(){
        // create element tree
        this.graphBackground = new GraphBackground(this.rootGraph);
        // append the graph container inside the background element so grid stays behind the container
        this.graphContainer = new GraphContainer(this.graphBackground.background);
    }
}