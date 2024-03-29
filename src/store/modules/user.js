import { loginByUsername, logout, getUserInfo } from "@/api/login";
import { UserLogin } from "../../fetch/modules/user";
import {
    getToken,
    setToken,
    removeToken,
    getRole,
    setRole,
    setAdminType,
    removeRole,
    menu,
    setMenu //获取菜单
} from "@/utils/auth";
import { Message } from "element-ui";
const user = {
    state: {
        user: "",
        status: "",
        code: "",
        token: getToken(),
        role_type: getRole(),
        name: "",
        avatar: "",
        introduction: "",
        roles: [],
        setting: {
            articlePlatform: []
        }
    },

    mutations: {
        SET_CODE: (state, code) => {
            state.code = code;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_ROLE: (state, role_type) => {
            state.role_type = role_type;
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction;
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting;
        },
        SET_STATUS: (state, status) => {
            state.status = status;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername({ commit }, userInfo) {
            const username = userInfo.user_account.trim();
            return new Promise((resolve, reject) => {
                UserLogin(userInfo)
                    .then(response => {
                        if (response.data.code === 2000) {
                            localStorage.setItem("token", response.data.data.token);
                            localStorage.setItem(
                                "username",
                                response.data.data.admin_nickname
                            );
                            setToken(response.data.data.token);
                            setRole(response.data.data.type);
                            setAdminType(response.data.data.admin_type);
                            commit("SET_TOKEN", response.data.data.token);
                            setMenu(response.data.data.menu); //存储菜单
                            localStorage.setItem(
                                "loginPermissionData",
                                JSON.stringify(response.data.data)
                            );
                            resolve(response);
                        } else {
                            resolve(response);
                            Message.error(response.data.msg);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
            // return new Promise((resolve, reject) => {
            //   loginByUsername(username, userInfo.password).then(response => {
            //     const data = response.data
            //     commit('SET_TOKEN', data.token)
            //     setToken(response.data.token)
            //     resolve()
            //   }).catch(error => {
            //     reject(error)
            //   })
            // })
        },

        // 获取用户信息
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token)
                    .then(response => {
                        if (!response.data) {
                            // 由于mockjs 不支持自定义状态码只能这样hack
                            reject("error");
                        }
                        const data = response.data;
                        commit("SET_ROLES", data.roles);
                        commit("SET_NAME", data.name);
                        commit("SET_AVATAR", data.avatar);
                        commit("SET_INTRODUCTION", data.introduction);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // 第三方验证登录
        // LoginByThirdparty({ commit, state }, code) {
        //   return new Promise((resolve, reject) => {
        //     commit('SET_CODE', code)
        //     loginByThirdparty(state.status, state.email, state.code).then(response => {
        //       commit('SET_TOKEN', response.data.token)
        //       setToken(response.data.token)
        //       resolve()
        //     }).catch(error => {
        //       reject(error)
        //     })
        //   })
        // },

        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token)
                    .then(() => {
                        commit("SET_TOKEN", "");
                        commit("SET_ROLES", []);
                        removeToken();
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit("SET_TOKEN", "");
                removeToken();
                resolve();
            });
        }

        // 动态修改权限
        // ChangeRoles({ commit }, role) {
        //     return new Promise(resolve => {
        //         commit('SET_TOKEN', role)
        //         setToken(role)
        //         getUserInfo(role).then(response => {
        //             const data = response.data
        //             commit('SET_ROLES', data.roles)
        //             commit('SET_NAME', data.name)
        //             commit('SET_AVATAR', data.avatar)
        //             commit('SET_INTRODUCTION', data.introduction)
        //             resolve()
        //         })
        //     })
        // }
    }
};

export default user;