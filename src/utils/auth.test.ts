import { beforeEach, describe, expect, it, vi } from "vitest";

const { cookieSet, storageSet, user } = vi.hoisted(() => ({
  cookieSet: vi.fn(),
  storageSet: vi.fn(),
  user: { permissions: [] as string[] }
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
    SET_PERMS: vi.fn(),
    get permissions() {
      return user.permissions;
    }
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

import { setToken, TokenKey, multipleTabsKey, hasAnyPerm } from "./auth";

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

describe("hasAnyPerm (direct-URL guard for static pages)", () => {
  it("lets a page without requirements through", () => {
    user.permissions = [];
    expect(hasAnyPerm(undefined)).toBe(true);
  });

  it("needs only one of the listed permissions", () => {
    user.permissions = ["meta-table:edit"];
    expect(hasAnyPerm(["meta-table:add", "meta-table:edit"])).toBe(true);
  });

  it("refuses a user holding none of them", () => {
    user.permissions = ["system:user:list"];
    expect(hasAnyPerm(["meta-table:add", "meta-table:edit"])).toBe(false);
  });

  it("honours the super-admin wildcard", () => {
    user.permissions = ["*"];
    expect(hasAnyPerm(["meta-table:add"])).toBe(true);
  });
});
