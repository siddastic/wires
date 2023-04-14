import { WireGraph } from "../api/graph/wire_graph";

export abstract class UIElement {
    element!: HTMLElement;
    id = globalThis.uniqueIdGenerator.create();
    constructor(public graphInstance: WireGraph) {
    }

    protected abstract build(): HTMLElement;
}
