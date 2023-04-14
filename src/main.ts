import { GraphBackground } from "./api/graph/graph_background";
import { GraphContainer } from "./api/graph/graph_container";
import { WireGraph } from "./api/graph/wire_graph";
import { VariableNode } from "./api/node/wire_node";

declare global {
    var graph: WireGraph;
}

const graph = new WireGraph(document.querySelector(".graph") as HTMLDivElement);
window.graph = graph;

// creating a sample node on context menu event
// TODO : remove this
window.addEventListener("contextmenu", (event) => {
    if (
        GraphBackground.wasEventStartedOnBackground(event) ||
        GraphContainer.wasEventStartedOnContainer(event) ||
        GraphContainer.wasEventStartedOnNodeContainer(event)
    ) {
        event.preventDefault();
        const instancePoint: Vector2 = { x: event.x, y: event.y };
        new VariableNode(instancePoint, graph);
    }
});