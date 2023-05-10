import { WireGraph } from "../graph/wire_graph";
import { GraphExtension, ExtensionState } from "./graphExtension";

export class ExtensionManager {
    readonly activeExtensions: GraphExtension[] = [];
    constructor(public graphInstance: WireGraph) {}

    public useExtension(...ex: (typeof GraphExtension)[]) {
        ex.forEach((e) => {
            // @ts-ignore
            let instance: GraphExtension = new e(this.graphInstance);
            instance.activate();
            instance.extensionState = ExtensionState.active;
            this.activeExtensions.push(instance);
        });
    }

    public findExtensionById(id: string) {
        return this.activeExtensions.find((ex) => ex.id == id);
    }

    public deactivateAllExtensions() {
        this.activeExtensions.forEach((ex) => {
            ex.deactivate();
            ex.extensionState = ExtensionState.inactive;
        });
    }
}
