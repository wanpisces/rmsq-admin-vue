import url from "../api";
import axios from "../request.js";
import { RequestAccountDetail } from "./account";
import { Message } from "element-ui";
import { request } from "../requestTwo.js";

let messageTips = function(res) {
    if (res.code === 2000) {
        Message.success(res.msg);
    } else if (res.code === 4000) {
        Message.error(res.msg);
    } else if (res.code === 4010) {
        Message.warning(res.msg);
    }
};

// 登录
export function getToken(obj) {
    return axios.get(url.getToken, obj);
}
// 直传服务器
export function RequestUploads(obj) {
    return axios.post(url.uploads, obj);
}
// 省市联动
export function RequestArea(obj) {
    return axios.get(url.area, obj);
}

// 小程序列表
export function RequestMiniList(obj) {
    return axios.get(url.miniUrl, obj);
}
// 单位
export function RequestCompany(obj) {
    return axios.get(url.searchGroup, obj);
}
export default new class publicMenu {
    RequestServiceMenuList(obj) {
        return axios.get(url.serviceMenu, obj);
    }
}();
// 单位
export function RequestService(obj) {
    return axios.get(url.publicService, obj);
}
// 资讯关联活动列表
export function RequestMpActive(obj) {
    return axios.get(url.mpactivity, obj);
}
// 四大工具关联活动列表
export function RequestMapActive(obj) {
    return axios.post(url.mapActivity, obj).then(res => {
        messageTips(res);
        return res;
    });
}

//活动简介
export function RequestActivityInformation(obj) {
    return axios.get(url.introducation, obj);
}

//  读取草稿
export function RequestDraftList(obj) {
    return request(url.draft, { data: obj }).then(res => {
        return res;
    });
}

// 保存草稿
export function RequestDraftfoAdd(obj) {
    return request(url.draft, { data: obj, method: "POST" }).then(res => {
        return res.data;
    });
}
// 删除草稿
export function RequestDraftDelete(obj) {
    return request(url.draft, { data: obj, method: "DELETE" }).then(res => {
        return res.data;
    });
}

// 微博列表
export function RequestWeiboList(obj) {
    return request(url.weibo, { data: obj, progress: 0 }).then(res => {
        return res;
    });
}
//微博认证
export function RequestWeiboAuth(obj) {
    return request(url.weiboAuth, { data: obj }).then(res => {
        return res;
    });
}
//微博删除
export function RequestWeiboDelete(obj) {
    return request(url.weibo, { data: obj, method: "DELETE" }).then(res => {
        return res;
    });
}
//微博认证是否认证成功状态
export function RequestWeiboAuthStatus(obj) {
    return request(url.weiboAuthStatus, { data: obj, progress: 0 }).then(res => {
        return res.data;
    });
}

// 头条列表
export function RequestToutiaoList(obj) {
    return request(url.toutiao, { data: obj }).then(res => {
        return res;
    });
}
// 头条添加
export function RequestToutiaoAdd(obj) {
    return request(url.toutiao, { data: obj, method: "POST" }).then(res => {
        return res;
    });
}
// 头条编辑
export function RequestToutiaoEditor(obj) {
    return request(url.toutiao, { data: obj, method: "PUT" }).then(res => {
        return res;
    });
}
// 头条删除
export function RequestToutiaoDelete(obj) {
    return request(url.toutiao, { data: obj, method: "DELETE" }).then(res => {
        return res;
    });
}
// 头条详情
export function RequestToutiaoDetail(obj) {
    return request(url.toutiao + `/${obj.toutiao_id}`, { data: obj }).then(res => {
        return res;
    });
}
//  头条验证码
export function RequestToutiaoCaptcha(obj) {
    return request(url.toutiaoCaptcha, { data: obj }).then(res => {
        return res;
    });
}

// 头条编辑
export function RequestToutiaoAuth(obj) {
    return request(url.toutiaoAuth, { data: obj, method: "POST" }).then(res => {
        return res;
    });
}


// 头条手机验证码
export function RequestToutiaoIphoneCode(obj) {
    return request(url.toutiaoMobileCode, { data: obj, method: "POST" }).then(res => {
        return res;
    });
}

// 头条号安全验证
export function RequestToutiaoSec(obj) {
    return request(url.toutiaoSec, { data: obj, method: "POST" }).then(res => {
        return res;
    });
}


// 头条手机号登陆
export function RequestToutiaoByMobile(obj) {
    return request(url.toutiaoLoginByMobile, { data: obj, method: "POST" }).then(res => {
        return res;
    });
}
/**
 * 快传相关接口
 * @param {} obj 
 */

// 快传列表
export function RequestKuaichuanList(obj) {
    return request(url.kuaichuan, { data: obj }).then(res => {
        return res;
    });
};

// 快传删除
export function RequestKuaichuanDelete(obj) {
    return request(url.kuaichuan, { data: obj, method: "DELETE" }).then(res => {
        return res;
    });
}

// 快传添加
export function RequestKuaichuanAdd(obj) {
    return request(url.kuaichuan, { data: obj, method: "POST" }).then(res => {
        return res;
    });
}

// 快传编辑
export function RequestKuaichuanEditor(obj) {
    return request(url.kuaichuan, { data: obj, method: "PUT" }).then(res => {
        return res;
    });
}

// 快传详情
export function RequestKuaichuanDetail(obj) {
    return request(url.kuaichuan + `/${obj.kuaichuan_id}`, { data: obj }).then(res => {
        return res;
    });
}

//  快传验证码
export function RequestKuaichuanCaptcha(obj) {
    return request(url.kuaichuan_captcha, { data: obj }).then(res => {
        return res;
    });
}

// 快传登录登陆
export function RequestKuaichuanLogin(obj) {
    return request(url.kuaichuan_login, { data: obj }).then(res => {
        return res;
    });
}



/**
 * 百家号相关接口
 * @param {} obj 
 */

// 百家列表
export function RequestBaijiaList(obj) {
    return request(url.baijia, { data: obj }).then(res => {
        return res;
    });
};

// 百家删除
export function RequestBaijiaDelete(obj) {
    return request(url.baijiaDelete, { data: obj, method: "DELETE" }).then(res => {
        return res;
    });
}

// 百家添加 授权
export function RequestBaijiaAdd(obj) {
    return request(url.baijiaLogin, { data: obj, method: "POST" }).then(res => {
        return res;
    });
}

//  百家验证码
export function RequestBaijiaCaptcha(obj) {
    return request(url.baijiaCaptcha, { data: obj }).then(res => {
        return res;
    });
}