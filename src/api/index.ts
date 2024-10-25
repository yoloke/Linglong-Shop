// 引入 axios 库用于发送 HTTP 请求
import axios, {
  AxiosInstance, // 用于定义 Axios 实例的类型
  AxiosError, // 用于处理 Axios 请求错误的类型
  AxiosRequestConfig, // 用于配置 Axios 请求的类型
  InternalAxiosRequestConfig, // 内部使用的 Axios 请求配置类型
  AxiosResponse // 用于定义 Axios 响应的类型
} from "axios";
// 引入全屏加载相关的函数
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/components/Loading/fullScreen";
// 引入登录 URL 常量
// import { LOGIN_URL } from "@/config";
// 引入 Element Plus 的消息提示组件
import { ElMessage } from "element-plus";
// 引入 API 响应数据接口
import { ResultData } from "@/api/interface";
// 引入 HTTP 响应状态码的枚举
import { ResultEnum } from "@/enums/httpEnum";
// 引入用于检查 HTTP 响应状态的辅助函数
import { checkStatus } from "./helper/checkStatus";
// 引入用于取消 Axios 请求的类
import { AxiosCanceler } from "./helper/axiosCancel";
// 引入 Pinia store 钩子用于访问用户相关状态
// import { useUserStore } from "@/stores/modules/user";
// 引入 Vue Router 实例用于路由控制
import router from "@/routers";

// 扩展 Axios 内部请求配置的自定义接口
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  /**
   * 控制是否显示加载指示器。
   * 默认为 false，如果设置为 true，则显示加载中动画。
   */
  loading?: boolean;

  /**
   * 控制是否启用请求取消功能。
   * 默认为 false，如果设置为 true，则允许取消请求。
   */
  cancel?: boolean;
}

const config = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: import.meta.env.VITE_API_URL as string,
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  // withCredentials: true,
  headers: { "Content-Type": "application/json" }
};

const axiosCanceler = new AxiosCanceler();

class RequestHttp {
  // axios 实例
  service: AxiosInstance;
  constructor(config: AxiosRequestConfig) {
    // instantiation
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (res: CustomAxiosRequestConfig) => {
        // const userStore = useUserStore();
        // 重复请求不需要取消，在 api 服务中通过指定的第三个参数: { cancel: false } 来控制
        res.cancel ??= true;
        res.cancel && axiosCanceler.addPending(res);
        // 当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { loading: false } 来控制
        res.loading ??= true;
        res.loading && showFullScreenLoading();
        // if (res.headers && typeof res.headers.set === "function") {
        //   res.headers.set("Authorization", `Bearer ${userStore.token}`);
        // }
        // res.headers.set("Content-Type", "application/json");
        return res;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse & { config: CustomAxiosRequestConfig }) => {
        const { data, config } = response;

        // const userStore = useUserStore();
        axiosCanceler.removePending(config);
        config.loading && tryHideFullScreenLoading();
        // 登录失效
        // if (data.code == ResultEnum.OVERDUE) {
        //   userStore.setToken("");
        //   router.replace(LOGIN_URL);
        //   ElMessage.error(data.msg);
        //   return Promise.reject(data);
        // }
        // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          ElMessage.error(data.msg);
          return Promise.reject(data);
        }
        // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data;
      },
      async (error: AxiosError) => {
        const { response } = error;
        tryHideFullScreenLoading();
        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.indexOf("timeout") !== -1) ElMessage.error("请求超时！请您稍后重试");
        if (error.message.indexOf("Network Error") !== -1) ElMessage.error("网络错误！请您稍后重试");
        // 根据服务器响应的错误状态码，做不同的处理
        if (response) checkStatus(response.status);
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) router.replace("/500");
        return Promise.reject(error);
      }
    );
  }

  // /**
  //  * @description 常用请求方法封装
  //  */
  // get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
  //   return this.service.get(url, config);
  // }

  // post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
  //   return this.service.post(url, data, config);
  // }

  // put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
  //   return this.service.put(url, data, config);
  // }

  // delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
  //   return this.service.delete(url, config);
  // }
  // download(url: string, params?: object, _object = {}): Promise<BlobPart> {
  //   return this.service.post(url, params, { ..._object, responseType: "blob" });
  // }
  /**
   * @description 常用请求方法封装
   * _object 包含其他配置（如 headers、timeout 等）
   * 返回类型是 Promise<ResultData<T>>
   */
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(url: string, params?: object | string, _object = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _object);
  }
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object);
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object });
  }
  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: "blob" });
  }
}

export default new RequestHttp(config);
