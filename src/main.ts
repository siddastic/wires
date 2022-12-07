import "./styles/main.css";

import {
    AddNode,
    DivideNode,
    MultiplyNode,
    SubtractNode,
    VariableNode,
} from "./internal/internal_nodes";
import { WireGraph } from "./api/wires";

export const availableNodes = [
    AddNode,
    SubtractNode,
    MultiplyNode,
    DivideNode,
    VariableNode,
];

new WireGraph({
    availableNodes,
    enableDataboard: true,
    enableStatusBar: true,
    graphHostElement: document.querySelector(".graph")!,
});

export { WireGraph };
