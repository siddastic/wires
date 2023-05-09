import {WireGraph} from "../graph/wire_graph";
import {Extension, ExtensionState} from "./extension";

export class ExtensionManager{
    readonly activeExtensions : Extension[] = [];
    constructor(public graphInstance : WireGraph){}
    
    public useExtension(ex : typeof Extension){
        // @ts-ignore
        let instance : Extension = new ex(this.graphInstance);
        instance.activate();
        instance.extensionState = ExtensionState.active;
        this.activeExtensions.push(instance);
    }
    
    public findExtensionById(id : string){
        return this.activeExtensions.find((ex) => ex.id == id);
    }
    
    public deactivateAllExtentions(){
        this.activeExtensions.forEach(ex => {
            ex.deactivate();
            ex.extensionState = ExtensionState.deactive;
        });
    }
}