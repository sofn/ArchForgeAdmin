import { beforeEach, describe, expect, it, vi } from "vitest";

const { cookieSet, storageSet } = vi.hoisted(() => ({
  cookieSet: vi.fn(),
  storageSet: vi.fn()
}));

vi.mock("js-cookie", () => ({
  default: { set: cookieSet, get: vi.fn(), remove: vi.fn() }
}));
vi.mock("@/store/modules/user", () => ({
  useUserStoreHook: () => ({
    isRemembered: false,
    loginDay: 7,
    SET_AVATAR: vi.fn(),
    SET_USERNAME: vi.fn(),
    SET_NICKNAME: vi.fn(),
    SET_ROLES: vi.fn(),
    SET_PERMS: vi.fn()
  })
}));
vi.mock("@pureadmin/utils", () => ({
  storageLocal: () => ({
    getItem: vi.fn(),
    setItem: storageSet,
    removeItem: vi.fn()
  }),
  isString: (v: unknown) => typeof v === "string",
  isIncludeAllChildren: vi.fn()
}));

import { setToken, TokenKey, multipleTabsKey } from "./auth";

describe("setToken cookies", () => {
  beforeEach(() => {
    cookieSet.mockClear();
  });

  const login = {
    accessToken: "at",
    refreshToken: "rt",
    expires: new Date(Date.now() + 3_600_000).toISOString(),
    username: "admin",
    roles: ["admin"]
  };

  it("pins SameSite=Strict on the token cookie and the multi-tab marker", () => {
    setToken(login);

    const attrsOf = (name: string) =>
      cookieSet.mock.calls.find(call => call[0] === name)?.[2];
    expect(attrsOf(TokenKey)).toMatchObject({ sameSite: "strict" });
    expect(attrsOf(multipleTabsKey)).toMatchObject({ sameSite: "strict" });
  });

  it("marks the cookie Secure only over HTTPS so plain-HTTP dev keeps working", () => {
    setToken(login);

    const attrs = cookieSet.mock.calls.find(call => call[0] === TokenKey)?.[2];
    expect(attrs.secure).toBe(window.location.protocol === "https:");
  });

  it("keeps the session cookie expiry derived from the token", () => {
    setToken(login);

    const attrs = cookieSet.mock.calls.find(call => call[0] === TokenKey)?.[2];
    expect(attrs.expires).toBeGreaterThan(0);
    expect(attrs.expires).toBeLessThan(1);
  });
});
