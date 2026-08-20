export const MenuType = {
  MENU: 1,
  CATALOG: 2,
  IFRAME: 3,
  OUTSIDE_LINK: 4
} as const;

export type MenuTypeValue = (typeof MenuType)[keyof typeof MenuType];

export function isButtonMenu(row: { isButton?: boolean }): boolean {
  return row.isButton === true;
}

export function isPageMenu(menuType: number): boolean {
  return menuType === MenuType.MENU;
}

export function isIframeMenu(menuType: number): boolean {
  return menuType === MenuType.IFRAME;
}

export function isOutsideLinkMenu(menuType: number): boolean {
  return menuType === MenuType.OUTSIDE_LINK;
}

export function menuTypeToRouterMeta(
  menuType: number,
  frameSrc = ""
): { frameSrc?: string; isLink?: boolean } {
  if (menuType === MenuType.IFRAME) {
    return { frameSrc };
  }
  if (menuType === MenuType.OUTSIDE_LINK) {
    return { frameSrc, isLink: true };
  }
  return {};
}
