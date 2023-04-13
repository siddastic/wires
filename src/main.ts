import { WireGraph } from "./api/graph/wire_graph";
import { VariableNode, WireNode } from "./api/node/wire_node";

declare global {
    var graph: WireGraph;
    
}

const graph = new WireGraph(document.querySelector(".graph") as HTMLDivElement);
window.graph = graph;

let node = new VariableNode({x: 0, y: 0},graph);