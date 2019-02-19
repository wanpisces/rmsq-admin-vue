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

// 获取素材列表
export function RequestMenuList(obj) {
    return axios.get(url.material, obj);
}

// 获取素材详情
export function RequestMenuDetail(obj) {
  return axios.get(url.material + "/" + obj.media_id);
}

// 创建素材
export function RequestAddMenu(obj) {
    return axios.post(url.material, obj).then(res => {
        messageTips(res);
        return res;
    });
}
// 编辑图文素材
export function RequestEditMenu(obj) {
    return axios.put(url.material, obj).then(res => {
        messageTips(res);
        return res;
    });
}
// 删除素材
export function RequestDeleteMenu(obj) {
    return axios.delete(url.material, obj).then(res => {
        // messageTips(res);
        return res
    });
}