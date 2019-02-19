import axios from "axios";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { getToken, removeToken } from "@/utils/auth.js";
import { Message } from "element-ui";
// axios.defaults.timeout = 15000; //设置默认的请求超时时间
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/**
 * 请求拦截
 */
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
/**
 * 响应的拦截
 */
axios.interceptors.response.use(
  res => {
    if (res.status) {
      switch (res.status) {
        case 500:
          Message("服务器异常");
          break;
        case 403:
          Message("token过期");
          removeToken();
          location.reload();
          break;
        case 404:
          Message("网络请求地址不存在");
          break;
        case 200:
          if (res.data.code == 4010) {
            Message("token过期");
            removeToken();
            location.reload();
          }
          break;
        case 400:
          break;
        case 504:
          Message("请求超时");
          break;
        default:
          // Message('请求超时');
          break;
      }
    }
    return res;
  },
  error => {
    return Promise.resolve(error.response);
  }
);

/**
 * @param {} url 接口地址
 * @param {*} param1 tokenStatus判断是否有token，默认0默认有token,method请求方式，headers请求参数 ,progress 1显示进度条，0隐藏进度条
 */
export function request(
  url,
  {
    tokenStatus = 1,
    data = {},
    method = "get",
    headers = {},
    progress = 1
  } = {}
) {
  progress == 1 ? NProgress.start() : "";
  tokenStatus == 1 ? (data["token"] = getToken() || "") : "";
  return new Promise((resolve, rejects) => {
    axios({
      method: method,
      url: url,
      params: method == "get" || method == "GET" ? data : { token: getToken() },
      data: data,
      headers
    })
      .then(res => {
        NProgress.done();
        if (res.status === 200) {
          // console.log('res', res)
          resolve(res.data);
        }
      })
      .catch(error => {
        return;
        NProgress.done();
        rejects(error);
      });
  });
}
