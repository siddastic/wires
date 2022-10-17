import "./styles/main.css";

import {
    AddNode,
    VariableNode,
    DivideNode,
    MultiplyNode,
    SubtractNode,
} from "./internal/internal_nodes";
import { WireGraph } from "./api/wires";

const availableNodes = [AddNode, SubtractNode, MultiplyNode, DivideNode, VariableNode];


const graph = new WireGraph({
    availableNodes : availableNodes,
    enableDataboard : true,
});