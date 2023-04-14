import { UIElement } from "./ui_element";

import {
    fastSwitch,
    provideFASTDesignSystem
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(fastSwitch({}));


export class CheckboxTile extends UIElement{
    constructor(){
        super();
    }
}