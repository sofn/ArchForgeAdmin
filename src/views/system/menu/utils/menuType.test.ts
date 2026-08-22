import { describe, expect, it } from "vitest";
import {
  MenuType,
  isButtonMenu,
  isIframeMenu,
  isOutsideLinkMenu,
  isPageMenu,
  menuTypeToRouterMeta
} from "./menuType";

describe("menuType utils", () => {
  it("keeps the contract values (MENU=1, CATALOG=2, IFRAME=3, OUTSIDE_LINK=4)", () => {
    expect(MenuType).toEqual({
      MENU: 1,
      CATALOG: 2,
      IFRAME: 3,
      OUTSIDE_LINK: 4
    });
  });

  it("isButtonMenu is driven by isButton, not by menuType", () => {
    expect(isButtonMenu({ isButton: true })).toBe(true);
    expect(isButtonMenu({ isButton: false })).toBe(false);
    expect(isButtonMenu({})).toBe(false);
  });

  it("classifies page / iframe / outside-link menu types", () => {
    expect(isPageMenu(MenuType.MENU)).toBe(true);
    expect(isPageMenu(MenuType.CATALOG)).toBe(false);

    expect(isIframeMenu(MenuType.IFRAME)).toBe(true);
    expect(isIframeMenu(MenuType.MENU)).toBe(false);

    expect(isOutsideLinkMenu(MenuType.OUTSIDE_LINK)).toBe(true);
    expect(isOutsideLinkMenu(MenuType.IFRAME)).toBe(false);
  });

  it("menuTypeToRouterMeta maps iframe to frameSrc only", () => {
    expect(menuTypeToRouterMeta(MenuType.IFRAME, "https://a.b")).toEqual({
      frameSrc: "https://a.b"
    });
  });

  it("menuTypeToRouterMeta marks outside links with isLink", () => {
    expect(menuTypeToRouterMeta(MenuType.OUTSIDE_LINK, "https://a.b")).toEqual({
      frameSrc: "https://a.b",
      isLink: true
    });
  });

  it("menuTypeToRouterMeta returns empty meta for regular menus", () => {
    expect(menuTypeToRouterMeta(MenuType.MENU)).toEqual({});
    expect(menuTypeToRouterMeta(MenuType.CATALOG)).toEqual({});
  });
});
