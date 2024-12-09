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
}

// 应用分类
export interface Category {
  icon?: string;
  categoryId: string | undefined;
  categoryName: string;
  count?: string;
}

export interface Rankings {
  appIcon: string;
  appId: string;
  appName: string;
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
