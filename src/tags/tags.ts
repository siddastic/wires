import { NodeHeader, NodeScaffold } from "../api/widgets";
import { WireNode } from "../api/wire_node";
import { Vector2 } from "../interfaces/vector_2";

export {}

// import { WireNode } from "../api/wire_node";
// import { NodeFieldController } from "../interfaces/node_field_controller";
// import { Vector2 } from "../interfaces/vector_2";

// export class HTML extends WireNode {
//     langController: NodeFieldController = {
//         label: "lang",
//         value: "spanish",
//         placeholder: "en",
//     };
//     classController: NodeFieldController = {
//         label: "class",
//         value: "",
//     };

//     constructor(instantiatedPoint: Vector2) {
//         super(instantiatedPoint);
//         this.setupNode();


//         this.createField(this.langController);
//         this.createField(this.classController);
//     }

//     outNode() { }
// }

// export class Head extends WireNode {
//     titleController: NodeFieldController = {
//         label: "title",
//         value: "My Page",
//     };
//     constructor(instantiatedPoint: Vector2) {
//         super(instantiatedPoint);
//         this.setupNode();
//         this.createField(this.titleController);
//     }
//     outNode() { }
// }

export class HTML extends WireNode{

    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
        this.setupNode();
    }

    build(){
        return new NodeScaffold(
            new NodeHeader("HTML"),
        );
    }
    outNode(): string | void {
        throw new Error("Method not implemented.");
    }
}