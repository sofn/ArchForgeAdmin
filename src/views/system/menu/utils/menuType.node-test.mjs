import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./menuType.ts", import.meta.url), "utf8");
assert.match(source, /MENU:\s*1/);
assert.match(source, /CATALOG:\s*2/);
assert.match(source, /IFRAME:\s*3/);
assert.match(source, /OUTSIDE_LINK:\s*4/);
assert.match(source, /isButton === true/);
assert.doesNotMatch(source, /value:\s*0/);
console.log("menuType contract ok");

