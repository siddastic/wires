import { GraphBackground } from "./graph_background";
import "../../styles/main.css";

export class WireGraph{
    rootGraph! : HTMLDivElement;
    graphBackground! : GraphBackground;
    constructor(element : HTMLDivElement){
        this.rootGraph = element;
        this.rootGraph.classList.contains("wire-graph") ? void 0 : this.rootGraph.classList.add("wire-graph");
        this.init();
    }

    private init(){
        // create element tree
        this.graphBackground = new GraphBackground(this.rootGraph);
    }
}