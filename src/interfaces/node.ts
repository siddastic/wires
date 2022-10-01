/**
 * This file contains all node related interfaces
 */

import { NodeFieldController } from "../api/node_field_controller";

export interface NodeFieldData {
    value: string | number;
    controller?: (fieldController: NodeFieldController) => void;
    label?: string;
    onUpdate?: Function;
    placeholder?: string;
    type?: string;
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

export interface NodeData{
    name : string;
    documentation? : string;
}