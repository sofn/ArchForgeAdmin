import { describe, expect, it } from "vitest";
import { latestRequest } from "./latestRequest";

describe("latestRequest", () => {
  it("only the newest of overlapping requests may apply its result", () => {
    const ticket = latestRequest();

    const first = ticket();
    const second = ticket();

    expect(first()).toBe(false);
    expect(second()).toBe(true);
  });

  it("keeps separate pages independent", () => {
    const users = latestRequest();
    const roles = latestRequest();

    const userSearch = users();
    roles();

    expect(userSearch()).toBe(true);
  });
});
