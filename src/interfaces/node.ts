/**
 * This file contains all node related interfaces
 */

import { NodeFieldController } from "../api/node_field_controller";

type NodeFieldType = "connect" | "input";

export interface GraphData{
    availableNodes: any[];
    enableDataboard: boolean;
}

export interface NodeFieldData {
    value?: string | number;
    controller?: (fieldController: NodeFieldController) => void;
    label?: string;
    onUpdate?: Function;
    placeholder?: string;
    inputType?: string;
    fieldType?: NodeFieldType;
    onConnect?: (data: WireOutData) => void;
}

export interface NodeElement {
    element: HTMLElement;
    header: HTMLDivElement;
    headerTitle: HTMLDivElement;
    body: HTMLDivElement;
    fields: Array<HTMLDivElement>;
}

export interface Vector2 {
    x: number;
    y: number;
}

export interface NodeData {
    name: string;
    documentation?: string;
}

export interface WireOutData{
    data: string | number | undefined;
}