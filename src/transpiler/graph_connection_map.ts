import { NodeField } from "../api/widgets";
import { WireOutData } from "../interfaces/node";

interface NodeMap {
    nodeId: string;
    fields: Array<{
        fieldId: string;
        instance: NodeField;
    }>;
    outFn: () => WireOutData;
};
export class GraphConnectionMap {
    readonly list: Array<NodeMap> = [];

    addMapIfNotPresent(map : NodeMap){
        if(!this.list.find(x => x.nodeId === map.nodeId)){
            this.list.push(map);
        }
    }
}
