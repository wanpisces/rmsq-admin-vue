import axios from "axios";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { Message } from "element-ui";
import { getToken, removeToken } from "./../utils/auth.js";
// import store from "@/store";
// import { removeToken } from '@/utils/auth';
// axios.defaults.baseURL = 'http://admin.sqydt.darongshutech.com'
//     // 创建axios实例
// const service = axios.create({
//     baseURL: 'http://admin.sqydt.darongshutech.com', // api的base_url
//     timeout: 15000 // 请求超时时间
// })
axios.interceptors.request.use(
    config => {
        // loading
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
        // console.log('getServiceIconItem', res)
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

function checkStatus(response) {
    // loading
    // 如果http状态码正常，则直接返回数据
    if (
        response &&
        (response.status === 200 ||
            response.status === 304 ||
            response.status === 400)
    ) {
        return response;
        // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    // 异常状态下，把错误信息返回去
    return {
        status: -404,
        msg: "网络异常"
    };
}

function checkCode(res) {
    // console.log(res)
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res.status_code === 500) {
        Message.warning(res.data.msg);
    }
    return res;
}

export default {
    loginPost(url, params) {
        NProgress.start();
        var data = params || {};
        return axios
            .post(url, data)
            .then(function(response) {
                NProgress.done();
                return checkStatus(response);
            })
            .then(res => {
                NProgress.done();
                return checkCode(res);
            })
            .catch(function(err) {
                NProgress.done();
                console.log(err);
            });
    },
    post(url, params) {
        NProgress.start();
        // axios.defaults.headers.common['token'] = localStorage.getItem('token') || ''
        var data = params || {};
        data["token"] = getToken() || "";
        return axios
            .post(url, data)
            .then(res => {
                NProgress.done();
                return res.data;
            })
            .then(res => {
                NProgress.done();
                return checkCode(res);
            })
            .catch(function(err) {
                NProgress.done();
                Message.error("服务器异常");
            });
    },
    put(url, params) {
        NProgress.start();
        // axios.defaults.headers.common['token'] = localStorage.getItem('token') || ''
        var data = params || {};
        data["token"] = getToken() || "";
        return axios
            .put(url, data)
            .then(res => {
                NProgress.done();
                return res.data;
            })
            .then(res => {
                NProgress.done();
                return checkCode(res);
            })
            .catch(function(err) {
                NProgress.done();
                Message.error("服务器异常");
            });
    },
    get(url, params) {
        // console.log(url)
        NProgress.start();
        // getHeader("user-agent")
        // axios.defaults.headers.common['token'] = localStorage.getItem('token') || ''
        var data = params || {};
        data["token"] = getToken() || "";
        return axios
            .get(url, { params: data })
            .then(function(res) {
                NProgress.done();
                if (res.data.code === 2000) {
                    return res.data.data;
                } else if (res.data.code === 4000) {
                    Message.error(res.data.msg);
                } else if (res.data.code === 4010) {
                    Message.warning(res.data.msg);
                }
            })
            .then(res => {
                NProgress.done();
                return checkCode(res);
            })
            .catch(function(err) {
                NProgress.done();
                console.log(err);
            });
    },
    getTwo(url, params) {
        // console.log(url)
        NProgress.start();
        // axios.defaults.headers.common['token'] = localStorage.getItem('token') || ''
        var data = params || {};
        data["token"] = getToken() || "";
        return axios
            .get(url, { params: data })
            .then(function(res) {
                NProgress.done();
                // console.log('aaa_', res.data)
                if (res.data.code === 2000) {} else if (res.data.code === 4000) {
                    Message.error(res.data.msg);
                } else if (res.data.code === 4010) {

                    Message.warning(res.data.msg);
                }
                return res.data;
            })
            .then(res => {
                NProgress.done();
                return checkCode(res);
            })
            .catch(function(err) {
                NProgress.done();
                console.log(err);
            });
    },

    delete(url, params) {
        NProgress.start();
        // axios.defaults.headers.common['token'] = localStorage.getItem('token') || ''
        var data = params || {};
        data["token"] = getToken() || "";
        return axios
            .delete(url, { params: data })
            .then(res => {
                NProgress.done();
                return res.data;
            })
            .then(res => {
                NProgress.done();
                return checkCode(res);
            })
            .catch(function(err) {
                NProgress.done();
                Message.error("服务器异常");
            });
    }
};