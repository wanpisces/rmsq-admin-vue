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
//  地理位置列表
export function RequestMpList(obj) {
    return axios.getTwo(url.district, obj).then(res => {
        return res;
    });
}

// 地理位置添加
export function RequestMpAdd(obj) {
    return axios.post(url.district, obj).then(res => {
        return res;
    });
}
// 地理位置编辑
export function RequestMpEditor(obj) {
    return axios.put(url.district, obj).then(res => {
        return res;
    });
}
// 地理位置删除
export function RequestMpDelete(obj) {
    return axios.delete(url.district, obj).then(res => {
        return res;
    });
}
// 地理位置状态
export function RequestMpState(obj) {
    return axios.put(url.districtState, obj).then(res => {
        return res;
    });
}
// 地理位置导入
export function RequestMpImport(obj) {
    return axios.post(url.districtImport, obj).then(res => {
        return res;
    });
}