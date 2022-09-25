import { WireNode } from "../api/wire_node";
import { Vector2 } from "./vector_2";

export interface NodeDetails {
    name : string;
    type: NodeType;
    doc? : string;
}

export type NodeType = "tag" | "variable" | "attribute";