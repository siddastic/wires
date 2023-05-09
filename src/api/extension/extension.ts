import {WireGraph} from "../graph/wire_graph";

export enum ExtensionState{
    active,
    deactive,
    neutral
};

export abstract class Extension {
    extensionState : ExtensionState = ExtensionState.neutral;
    abstract id: string;

    constructor(public graphInstance: WireGraph) {
    }

    public abstract activate(): void;

    public abstract deactivate(): void;
}