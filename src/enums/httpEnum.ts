/**
 * @description：请求配置
 */
export enum ResultEnum {
  SUCCESS = 200, // 请求成功
  ERROR = 500, // 服务器错误
  OVERDUE = 401, // 登录已过期，请重新登录
  TIMEOUT = 3000000, // 请求超时
  TYPE = "success" // 默认响应类型
}

/**
 * @description：请求方法
 */
export enum RequestEnum {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE"
}

/**
 * @description：常用的 contentTyp 类型
 */
export enum ContentTypeEnum {
  // json
  JSON = "application/json;charset=UTF-8",
  // text
  TEXT = "text/plain;charset=UTF-8",
  // form-data 一般配合qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data 上传
  FORM_DATA = "multipart/form-data;charset=UTF-8"
}
