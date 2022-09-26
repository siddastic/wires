import { NodeBody, NodeField, NodeHeader, NodeScaffold } from "../api/widgets";
import { WireNode } from "../api/wire_node";
import { Vector2 } from "../interfaces/node";

export class HTML extends WireNode {
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
    }

    build() {
        return new NodeScaffold({
            header: new NodeHeader({
                title: "HTML",
            }),
            body : new NodeBody({
                children: [
                    new NodeField({
                        value: "en",
                        label : "lang",
                    }),
                ],
            }),
        });
    }
}
export class Head extends WireNode {
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
    }

    build() {
        return new NodeScaffold({
            header: new NodeHeader({
                title: "Head",
            }),
        });
    }
}
