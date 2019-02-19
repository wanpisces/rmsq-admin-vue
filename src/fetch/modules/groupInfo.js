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
//  单位信息详情
export function RequestGroupInfoList(obj) {
    return axios.getTwo(url.groupInfo, obj).then(res => {
        return res;
    });
}

// 单位信息添加
export function RequestGroupInfoAdd(obj) {
    return axios.post(url.groupInfo, obj).then(res => {
        return res;
    });
}
// 单位信息编辑
export function RequestGroupInfoEditor(obj) {
    return axios.put(url.groupInfo, obj).then(res => {
        return res;
    });
}