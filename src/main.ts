import { WireGraph } from "./api/graph/wire_graph";

declare global {
    interface Window {
        graph: WireGraph;
    }
}

const graph = new WireGraph(document.querySelector(".graph") as HTMLDivElement);
window.graph = graph;