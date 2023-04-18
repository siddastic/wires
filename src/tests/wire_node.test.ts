import { describe, it, expect } from "vitest";
import { WireNode } from "../main";

describe("Important Library apis exists", () => {
    it("WireNode exists and its a truthy value",()=>{
        expect(WireNode).toBeTruthy();
    });
});

