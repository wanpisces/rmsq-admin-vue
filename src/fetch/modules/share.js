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
// 分享活动列表
export function RequestShareActivityList(obj) {
  return axios.get(url.shareActivity, obj);
}
export function RequestshareActivityItem(obj) {
  return axios.get(url.shareActivityItem, obj);
}

export function RequestShareActivityEdit(obj) {
  return axios.put(url.shareActivity, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//分享样式列表
export function RequestShareTheme(obj) {
  return axios.get(url.shareTheme, obj).then(res => {
    messageTips(res);
    return res;
  });
}

//随手拍分享

export function RequestSspShare(obj) {
  return axios.post(url.sspShare, obj).then(res => {
    messageTips(res);
    return res;
  });
}
