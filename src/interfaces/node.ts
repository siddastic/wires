/**
 * This file contains all node related interfaces
 */

export interface NodeFieldController {
    value: string;
    label?: string;
    onUpdate?: Function;
    placeholder?: string;
    type?: string;
    element? : HTMLInputElement,
};

export interface NodeElement {
    element: HTMLElement,
    header: HTMLDivElement,
    headerTitle: HTMLDivElement,
    body: HTMLDivElement,
    fields : Array<HTMLDivElement>,
}

export interface Vector2 {
    x: number;
    y: number;
}