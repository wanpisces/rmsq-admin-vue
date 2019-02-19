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

//个人账号信息

export function RequestAccountDetail(obj) {
  return axios.get(url.account, obj);
}
//修改密码

export function EditAccountPsw(obj) {
  return axios.post(url.accountPwd, obj).then(res => {
    messageTips(res);
    return res;
  });
}

// 平台账号列表
export function RequestPlatList(obj) {
  return axios.get(url.sys, obj);
}
// 平台账号详情
export function RequestPlatDetail(obj) {
  return axios.get(url.sys + "/" + obj.admin_id, obj);
}
//平台账号添加
export function RequestPlatAccountAdd(obj) {
  return axios.post(url.sys, obj);
}
//平台账号编辑
export function RequestPlatAccountEdit(obj) {
  return axios.put(url.sys, obj);
}
//平台账号删除
export function DeletePlatList(obj) {
  return axios.delete(url.sys, { id: obj.admin_id });
}
// 客户列表
export function RequestCustomerList(obj) {
  return axios.get(url.customer, obj);
}
// 客户账号添加
export function RequestCustomerAdd(obj) {
  return axios.post(url.customer, obj).then(res => {
    messageTips(res);
    console.log(res);
    return res;
  });
}
// 客户账号编辑
export function RequestCustomerEditor(obj) {
  return axios.put(url.customer, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 客户账号删除
export function RequestCustomerDelete(obj) {
  return axios.delete(url.customer, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 客户详情列表
export function RequestCustomerDetail(obj) {
  return axios.get(url.customer + "/" + obj.admin_id, obj);
}
// 办事指南分类
export function RequestPublicService(obj) {
  return axios.get(url.publicService, obj);
}

// 角色列表
export function RequestRoleList(obj) {
  return axios.get(url.role, obj);
}
// 角色添加
export function RequestRoleAdd(obj) {
  return axios.post(url.role, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 角色编辑
export function RequestRoleEdit(obj) {
  return axios.put(url.role, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 角色复制
export function RequestRoleCopy(obj) {
  return axios.post(url.roleCopy, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//角色删除
export function RequestRoleDelete(obj) {
  return axios.delete(url.role, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//用户列表
export function RequestRoleUser(obj) {
  return axios.get(url.roleUser, obj);
}
//角色添加用户
export function RequestRoleUserAdd(obj) {
  return axios.post(url.roleUser, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//菜单列表
export function RequestRoleMenu(obj) {
  return axios.get(url.menu, obj);
}

//角色菜单添加
export function RequestRoleMenuAdd(obj) {
  return axios.post(url.roleMenu, obj).then(res => {
    messageTips(res);
    return res;
  });
}

// 内容配置列表
export function RequestPlatLimitsList(obj) {
  return axios.get(url.contentConfig, obj);
}

// 内容配置修改
export function RequestPlatLimitsEdit(obj) {
  return axios.put(url.contentConfig, obj).then(res => {
    messageTips(res);
    return res;
  });
}
