import url from '../api'
import axios from '../request.js'
import { Message } from 'element-ui'
let messageTips = function(res) {
        if (res.code === 2000) {
            Message.success(res.msg);
        } else if (res.code === 4000) {
            Message.error(res.msg);
        } else if (res.code === 4010) {
            Message.warning(res.msg);
        }
    }
    // 模块列表
export function RequestModulesList(obj) {
    return axios.get(url.nav, obj)
}

// 轮播列表
export function RequestBnnerList(obj) {
    return axios.get(url.banner, obj);
}
// 轮播添加
export function RequestBnnerAdd(obj) {
    return axios.post(url.banner, obj);
}

// 轮播编辑
export function RequestBnnerEdit(obj) {
    return axios.put(url.banner, obj);
}

// 轮播详情
export function RequestLunboDetail(obj) {
    return axios.get(url.banner + '/' + obj.banner_id, obj);
}

// 轮播上下线
export function RequestBnnerOnline(obj) {
    return axios.put(url.bannerState, obj);
}
// 轮播下沉
export function RequestBnnerSink(obj) {
    return axios.post(url.bannerSink, obj);
}
//轮播删除

export function RequestDeleteBanner(obj) {
    return axios.delete(url.banner, obj);
}

// 模块添加
export function RequestModulesAdd(obj) {
    return axios.post(url.nav, obj).then(res => {
        messageTips(res)
        return res;
    })
}
// 模块删除
export function RequestModulesDelete(obj) {
    return axios.delete(url.nav, obj).then(res => {
        messageTips(res)
        return res;
    })
}
// 模块删除
export function RequestModulesEditor(obj) {
    return axios.put(url.nav, obj).then(res => {
        messageTips(res)
        return res;
    })
}
// 模块上下线
export function RequestModulesState(obj) {
    return axios.put(url.navState, obj).then(res => {
        messageTips(res)
        return res;
    })
}