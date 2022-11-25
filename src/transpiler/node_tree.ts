import { NodeField } from "../api/widgets";
import { WireOutData } from "../interfaces/node";

interface NodeMap {
    nodeId: string;
    fields: Array<{
        fieldId: string;
        instance: NodeField;
        paths: Array<SVGPathElement | HTMLElement>;
    }>;
    outPath: SVGPathElement | HTMLElement | undefined;
    outFn: () => WireOutData;
}
export class GlobalNodeTree {
    readonly list: Array<NodeMap> = [];

    addNodeIfNotPresent(map: NodeMap) {
        if (!this.list.find((x) => x.nodeId === map.nodeId)) {
            this.list.push(map);
        }
    }

    getNodeById(nodeId: string) {
        return this.list.find((x) => x.nodeId === nodeId);
    }

    getNodeByFieldId(fieldId: string) {
        return this.list.find((x) =>
            x.fields.find((y) => y.fieldId === fieldId)
        );
    }

    addPathToNode(nodeId: string, path: SVGPathElement | HTMLElement | undefined) {
        const node = this.getNodeById(nodeId);
        if (node) {
            node.outPath = path;
        }
    }

    addPathToField(fieldId : string,path : SVGPathElement | HTMLElement){
        const node = this.getNodeByFieldId(fieldId);
        if(node){
            const field = node.fields.find(x => x.fieldId === fieldId);
            if(field){
                field.paths.push(path);
            }
        }
    }
}
