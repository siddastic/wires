import { Widget } from "../api/widgets";
import { WireOutData } from "./node";

export interface NodeScaffoldData {
    header?: Widget;
    body?: Widget;
    footer?: Widget;
}

export interface NodeHeaderData {
    title: string;
}

export interface NodeBodyData {
    children: Widget[];
}

export interface NodeFooterData {
    child: Widget;
}

export interface CustomNodeElementData {
    elementName: string;
    innerHTML?: string;
}

export interface NodeFieldControllerData {
    element: HTMLInputElement;
}

export interface NodeButtonData {
    label: string;
    onClick?: () => void;
}

export interface NodeInConnectorData {
    onConnect: (data: WireOutData) => void;
}
