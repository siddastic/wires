import { WireGraph } from "./api/graph/wire_graph";
import { VariableNode } from "./api/node/wire_node";

declare global {
    var graph: WireGraph;
}

const graph = new WireGraph(document.querySelector(".graph") as HTMLDivElement,{
    showGridEnabled: true,
});
window.graph = graph;

graph.nodeManager.addAvailableNode(VariableNode);


// TODO : add exports in entry file so that they can be imported from other packages