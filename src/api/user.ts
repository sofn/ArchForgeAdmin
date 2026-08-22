import { http } from "@/utils/http";
import type { ApiResponse, PageData } from "@/utils/http/types.d";

export type UserResult = ApiResponse<{
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 当前登录用户的角色 */
  roles: Array<string>;
  /** 按钮级别权限 */
  permissions: Array<string>;
  /** `token` */
  accessToken: string;
  /** 用于调用刷新`accessToken`的接口时所需的`token` */
  refreshToken: string;
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expires: Date;
}>;

export type RefreshTokenResult = ApiResponse<{
  /** `token` */
  accessToken: string;
  /** 用于调用刷新`accessToken`的接口时所需的`token` */
  refreshToken: string;
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expires: Date;
}>;

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

export type CaptchaResult = ApiResponse<{
  /** 是否开启验证码 */
  isCaptchaOn: boolean;
  /** 验证码唯一标识 */
  captchaCodeKey: string;
  /** 验证码图片 base64 */
  captchaCodeImg: string;
}>;

export type LoginConfigResult = ApiResponse<{
  /** 是否开启验证码 */
  isCaptchaOn: boolean;
}>;

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
