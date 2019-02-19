import url from '../api'
import axios from '../request.js'
// 登录
export function UserLogin(obj) {
    return axios.loginPost(url.login, obj)
}
// 用户管理
export function RequestUserList(obj) {
    return axios.get(url.getUsers, obj);
}