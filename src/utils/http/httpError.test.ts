import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi
} from "vitest";
import { HttpResponse, http as mswHttp } from "msw";
import { setupServer } from "msw/node";
import type { ApiResponse } from "@/utils/http/types.d";

vi.mock("@/plugins/i18n", () => ({
  $t: (key: string) => key,
  transformI18n: (key: unknown) => key,
  i18n: { global: { locale: "zh" } }
}));
vi.mock("@/utils/message", () => ({ message: vi.fn() }));
vi.mock("@/store/modules/user", () => ({
  useUserStoreHook: () => ({
    handRefreshToken: vi.fn(),
    logOut: vi.fn()
  })
}));

import { http as PureHttp } from "@/utils/http";

const server = setupServer(
  mswHttp.post("*/admin/user/create", () =>
    HttpResponse.json({ code: 0, message: "操作成功", data: true })
  ),
  mswHttp.get("*/admin/server", () =>
    HttpResponse.json(
      {
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "令牌无效",
        code: 10140
      },
      { status: 401 }
    )
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("httpClient error mapping", () => {
  /** Node-side axios cannot resolve relative URLs; tests point baseURL at the MSW server. */
  const withTestBase = { baseURL: "http://archforge.test" };

  it("returns the raw `{code,message,data}` envelope on success", async () => {
    const result = await PureHttp.request<ApiResponse<boolean>>(
      "post",
      "/admin/user/create",
      { data: {} },
      withTestBase
    );

    expect(result.code).toBe(0);
    expect(result.data).toBe(true);
  });

  it("maps RFC 9457 ProblemDetail responses to a rejected PureHttpError", async () => {
    expect.assertions(4);

    try {
      await PureHttp.request("get", "/admin/server", {}, withTestBase);
    } catch (error) {
      const err = error as Record<string, any>;
      expect(err.isCancelRequest).toBe(false);
      expect(err.response?.status).toBe(401);
      expect(err.response?.data?.detail).toBe("令牌无效");
      expect(err.response?.data?.code).toBe(10140);
    }
  });
});
