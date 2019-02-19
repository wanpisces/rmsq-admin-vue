import url from "../api";
import axios from "../request.js";
import { Message } from "element-ui";
let messageTips = function(res) {
    if (res.code === 2000) {
        Message.success(res.msg);
    } else if (res.code === 4000) {
        Message.error(res.msg);
    } else if (res.code === 4010) {
        Message.warning(res.msg);
    }
};
// 公众号列表
export function RequestMpList(obj) {
    return axios.getTwo(url.mp, obj).then(res => {
        return res;
    });
}
// 公众号详情
export function RequestMpDetail(obj) {
    return axios.getTwo(url.mp + `/${obj.mp_id}`, obj).then(res => {
        return res;
    });
}

// 公众号添加
export function RequestMpAdd(obj) {
    return axios.post(url.mp, obj).then(res => {
        return res;
    });
}
// 公众号编辑
export function RequestMpEditor(obj) {
    return axios.put(url.mp, obj).then(res => {
        return res;
    });
}
// 公众号删除
export function RequestMpDelete(obj) {
    return axios.delete(url.mp, obj).then(res => {
        return res;
    });
}
// 公众号状态
export function RequestMpState(obj) {
    return axios.put(url.mpState, obj).then(res => {
        return res;
    });
}