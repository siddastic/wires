import { describe, it, expect } from "vitest";
import { WireGraph } from "../main";

describe("Important Library apis exists", () => {
    it("WireGraph exists and its a truthy value",()=>{
        expect(WireGraph).toBeTruthy();
    });
});

