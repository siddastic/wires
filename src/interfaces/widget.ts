import { Widget } from "../api/widgets";

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
    element: HTMLInputElement | HTMLTextAreaElement;
}

export interface NodeButtonData {
    label: string;
    onClick?: () => void;
}

export interface CheckboxData{
    label?: string;
    checked?: boolean;
    onChange?: (value: boolean) => void;
}

export interface DropdownMenuData<T>{
    label?: string;
    onChange?: (value: T | null) => void;
    value?: T;
    options: {
        label?: string;
        value: T;
    }[];
}