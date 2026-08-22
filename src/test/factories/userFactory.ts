import type { UserResult } from "@/api/user";

type UserPayload = UserResult["data"];

let sequence = 0;

/**
 * Test factory for the admin login payload (`/auth/login` data).
 * Produces valid-by-default users; tests override only what they assert on.
 */
export function userFactory(overrides: Partial<UserPayload> = {}): UserPayload {
  sequence += 1;
  return {
    avatar: `https://cdn.example.com/avatar-${sequence}.png`,
    username: `admin-${sequence}`,
    nickname: `管理员${sequence}`,
    roles: ["admin"],
    permissions: ["*:*:*"],
    accessToken: `access-token-${sequence}`,
    refreshToken: `refresh-token-${sequence}`,
    expires: new Date(Date.now() + 3600_000),
    ...overrides
  };
}

/** Wraps a payload into the backend success envelope. */
export function envelope<T>(
  data: T,
  overrides: { code?: number; message?: string } = {}
) {
  return { code: 0, message: "操作成功", data, ...overrides };
}
