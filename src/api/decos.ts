import { NodeFieldController } from "../interfaces/node_field_controller";
import { WireNode } from "./wire_node";

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

export const serialize = (value? : NodeFieldController) => {
  return (target: any, key: string | symbol) => {
    let val = target[key];

    const getter = function (this: WireNode) {
      return val;
    };

    const setter = function (this: WireNode, v: NodeFieldController) {
      // create an input field when first setting
      var instance = this;
      this.createField(v);
      console.log("setter called");

      val = v;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    },);
  };
}