import Cookies from "js-cookie";

const TokenKey = "token";
const RoleType = "role_type";
const Account = "account";
const Password = "password";
const AdminType = "admin_type";
const Menu = "menu";

export function getToken() {
    return Cookies.get(TokenKey);
}

export function setToken(token) {
    return Cookies.set(TokenKey, token, { expires: .5 });
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}
//获取角色
export function getRole() {
    return Cookies.get(RoleType);
}
export function setRole(role_type) {
    return Cookies.set(RoleType, role_type);
}

export function removeRole() {
    return Cookies.remove(RoleType);
}
//获取账号
export function getAccount() {
    return Cookies.get(Account);
}
export function setAccount(account) {
    return Cookies.set(Account, account);
}

export function removeAccount() {
    return Cookies.remove(Account);
}
//获取密码
export function getPassword() {
    return Cookies.get(Password);
}
export function setPassword(password) {
    return Cookies.set(Password, password);
}

export function removePassword() {
    return Cookies.remove(Password);
}
//获取admin_type
export function getAdminType() {
    return Cookies.get(AdminType);
}
export function setAdminType(adminType) {
    return Cookies.set(AdminType, adminType);
}

export function removeAdminType() {
    return Cookies.remove(AdminType);
}

//获取菜单
export function getMenu() {
    return Cookies.get(Menu);
}
export function setMenu(menu) {
    return Cookies.set(Menu, menu);
}
export function removeMenu() {
    return Cookies.remove(Menu);
}

export let menu = [];