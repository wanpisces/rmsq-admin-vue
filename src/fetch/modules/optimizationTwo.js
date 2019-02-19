import url from '../api';
import axios from '../request.js';
import { Message } from 'element-ui';
let messageTips = function(res) {
    if (res.code === 2000) {
        Message.success(res.msg);
    } else if (res.code === 4000) {
        Message.error(res.msg);
    } else if (res.code === 4010) {
        Message.warning(res.msg);
    }
};

// 版本管理列表
export function RequestVersionList(obj) {
    return axios.get(url.version, obj);
}

// 界面状态
export function RequestGroupLock(obj) {
    return axios.get(url.groupLock, obj);
}
// 界面锁定
export function RequestGroupLockState(obj) {
    return axios.put(url.groupLockState, obj).then(res => {
        messageTips(res);
        return res;
    });
}

// 分享样式模板
export function RequestShareThemeList(obj) {
    return axios.get(url.shareTheme, obj);
}