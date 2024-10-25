import { ResultData, ReqPage, ResPage, Category, Rankings, App } from "@/api/interface/index";
import http from "@/api";

// 提交反馈
export const addSuggest = (params: any) => {
  return http.post<ResultData>("/web/suggest", params, { loading: false });
};

// 新增登录
export const getLogin = (params: any) => {
  return http.post<ResultData>("/web/addLogin", params, { loading: false });
};

// 获取分类
export const getCategories = (params: any) => {
  return http.get<Category[]>("/web/categories", { params });
};

// 获取排名
export const getTop = () => {
  return http.post<Rankings[]>("/web/top");
};

// 获取应用
export const getApp = (params: ReqPage) => {
  return http.post<ResPage>("/web/apps", params, { loading: false });
};

// 新增安装应用记录
export const installApp = (params: App) => {
  return http.post<ResultData>("/web/addInstall", params, { loading: false });
};

export const installdd = (arch: string, params?: App) => {
  return http.get(`/web/downloadU/${arch}`, params, { loading: false });
};
