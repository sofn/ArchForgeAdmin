import { http } from "@/utils/http";
import type { ApiResponse, PageData } from "@/utils/http/types.d";
import type { OpResult } from "@/types/contract";

export type UserResult = OpResult<"/auth/login", "post">;

export type RefreshTokenResult = OpResult<"/auth/refresh-token", "post">;

export type UserInfo = {
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 联系电话 */
  phone: string;
  /** 简介 */
  description: string;
};

export type UserInfoResult = ApiResponse<UserInfo>;

type ResultTable = ApiResponse<PageData>;

export type CaptchaResult = OpResult<"/auth/captchaImage", "get">;

export type LoginConfigResult = OpResult<"/auth/getConfig", "get">;

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/auth/login", { data });
};

/** 获取验证码 */
export const getCaptcha = () => {
  return http.request<CaptchaResult>("get", "/auth/captchaImage");
};

/** 获取登录配置 */
export const getLoginConfig = () => {
  return http.request<LoginConfigResult>("get", "/auth/getConfig");
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/auth/refresh-token", {
    data
  });
};

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
  return http.request<UserInfoResult>("get", "/mine", { data });
};

/** 账户设置-个人安全日志 */
export const getMineLogs = (data?: object) => {
  return http.request<ResultTable>("get", "/mine-logs", { data });
};
