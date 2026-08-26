import { describe, expect, it } from "vitest";
import { assertOk, EnvelopeError } from "./envelope";

describe("assertOk", () => {
  it("passes through success envelopes", () => {
    const res = { code: 0, message: "操作成功", data: true };
    expect(assertOk(res)).toBe(res);
  });

  it("throws on error envelopes with code≠0", () => {
    expect(() =>
      assertOk({ code: 500101, message: "表格已存在", data: null })
    ).toThrowError(new EnvelopeError("表格已存在", 500101));
  });

  it("throws on ProblemDetail bodies returned with HTTP 200", () => {
    try {
      assertOk({
        type: "about:blank",
        title: "Business Error",
        status: 200,
        detail: "字段类型变更需确认",
        code: 500102
      });
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(EnvelopeError);
      expect((e as EnvelopeError).message).toBe("字段类型变更需确认");
      expect((e as EnvelopeError).code).toBe(500102);
    }
  });

  it("falls back to a generic message when payload has none", () => {
    try {
      assertOk({ title: "Business Error", status: 200, detail: "" });
      expect.unreachable();
    } catch (e) {
      expect((e as EnvelopeError).message).toBe("操作失败");
    }
  });

  it("keeps non-envelope payloads untouched", () => {
    const res = { title: "t", detail: "d" };
    expect(assertOk(res)).toBe(res);
  });
});
