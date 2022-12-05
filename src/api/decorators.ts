import { NodeData } from "../interfaces/node";
import { WireNode } from "./wire_node";

/**
 * simple `this` binding decorator inside a class
 */
export function bind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}

/**
 * decorator function used to define static doc property on classes extending WireNode, making it easier to document them in search explorer
 */
export function doc(
    name: string,
    desc?: string
): (target: typeof WireNode) => void {
    return function (target: typeof WireNode) {
        target.doc = function (): NodeData {
            return {
                name,
                desc,
            };
        };
    };
}
