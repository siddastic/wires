import {WireGraph} from "../graph/wire_graph";

export enum ExtensionState{
    active,
    inactive,
    neutral
};

export abstract class GraphExtension {
    extensionState : ExtensionState = ExtensionState.neutral;
    abstract id: string;

    constructor(public graphInstance: WireGraph) {
    }

    public abstract activate(): void;

    public abstract deactivate(): void;
}