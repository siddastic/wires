import { Widget } from "../api/widgets";

export interface NodeScaffoldData{
    header?: Widget;
    body?: Widget;
    footer?: Widget;
}

export interface NodeHeaderData{
    title: string;
}

export interface NodeBodyData{
    children: Widget[];
}

export interface NodeFooterData{
    child: Widget;
}