import "./styles/main.css";

import {
    AddNode,
    VariableNode,
    DivideNode,
    MultiplyNode,
    SubtractNode,
} from "./internal/internal_nodes";
import { WireGraph } from "./api/wires";

export const availableNodes = [AddNode, SubtractNode, MultiplyNode, DivideNode, VariableNode];


export {WireGraph};