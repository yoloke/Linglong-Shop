// 响应参数（不包含 data）
export interface Result {
  code: string;
  message: string;
}

// 请求响应参数（包含 data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页---请求参数
export interface ReqPage {
  pageNo: number;
  pageSize: number;
  name?: string;
  categoryId?: string;
  sort?: string;
  lan?: string;
  arch?: string;
  [key: string]: any;
}

// 分页---请求参数(全部可选)
export interface ReqPageParams {
  pageNo?: number;
  pageSize?: number;
  name?: string;
  categoryId?: string;
  sort?: string;
  lan?: string;
  arch?: string;
  [key: string]: any;
}

// 应用记录
export interface App {
  appId: string;
  zhName: string;
  name: string;
  icon?: string;
  description?: string;
  categoryName?: string;
  categoryId?: string;
  version?: string;
  clientIp?: string;
  channel?: string;
  arch?: string;
  kind?: string;
  module?: string;
  repoName?: string;
  runtime?: string;
  size?: string;
  uabUrl?: string;
  user?: string;
  installCount?: number;
  uninstallCount?: number;
  descInfo?: string;
  createTime?: string;
}

export interface AppScreenshot {
  lan?: string;
  screenshotKey: string;
}

export interface AppTag {
  [key: string]: any;
}

export interface AppDetail extends App {
  base?: string;
  devId?: string;
  devName?: string;
  iconNoShow?: string;
  lan?: string;
  appScreenshotList?: AppScreenshot[];
  appTagList?: AppTag[];
}

export type AppDetailMap = Record<string, AppDetail[]>;

export interface AppDetailQuery {
  appId: string;
  arch?: string;
  lang?: string;
}

export interface AppComment {
  id: string;
  appId: string;
  version?: string;
  remark: string;
  visit?: string;
  clientIp?: string;
  agreeNum: number;
  disagreeNum: number;
  createTime?: string;
  updateTime?: string;
  isDelete?: string;
}

export interface AppCommentQuery {
  appId: string;
  pageNo?: number;
  pageSize?: number;
}

// 应用分类
export interface Category {
  icon?: string;
  categoryId: string | undefined;
  categoryName: string;
  categoryAppCount?: string;
}

export interface Rankings {
  appIcon: string;
  appId: string;
  appName: string;
}

// 新闻横幅
export interface News {
  id: string;
  content: string;
  actionType: string;
  actionText: string;
  actionUrl?: string;
}

// 分页---响应参数
export interface ResPage {
  size: number;
  current: number;
  total: number;
  records: App[];
  pages: string;
}

// 答疑问题
export interface Question {
  question: string;
  reply: string;
}

// 推荐应用
export interface Recommend {
  id: string;
  mainId: string;
  appId: string;
  name: string;
  zhName: string;
  version: string;
  xh: string;
  [key: string]: any;
}

export interface RecommendReq {
  arch: string;
  repoName: string;
  [key: string]: any;
}
