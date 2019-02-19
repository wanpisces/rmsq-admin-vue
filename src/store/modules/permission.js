/**
 * 路由同步路由与异步权限路由
 */
import { asyncRouterMap, constantRouterMap } from "../../router/index";
/**
 * 菜单接口
 */
import publicMenu from "../../fetch/modules/public";
/**
 * 添加动态菜单方法
 */
import { activeMenu } from "../../utils/menuTool";

// import store from "../../store";
/**import menu from './menu';
import { store } from '@/store';

 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.indexOf(role) >= 0);
    } else {
        return true;
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(roles, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles);
            }
            return true;
        }
        return false;
    });
    return accessedRouters;
}
const permission = {
    state: {
        routers: [],
        addRouters: [],
        menState: 0
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            // console.log("staterouters", constantRouterMap);
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        },
        SET_MENUSTATE: (state, menState) => {
            state.menState = menState;
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            const roles = data;
            return new Promise(resolve => {
                publicMenu.RequestServiceMenuList({}).then(res => {
                    let menu = res;
                    let menuList = [];
                    /**
                     * 1.related_tmpl: 1活动报名、2随手拍、3投票评选、4问卷调查
                     * 2.activemenu(item,val):数据处理(item:导航数据，val:related_tmpl)
                     */
                    if (localStorage.isService == 1) {
                        !!menu &&
                            menu.map((item, index) => {
                                if (item.related_tmpl == 1) {
                                    menuList.push(activeMenu(item, item.related_tmpl));
                                }
                                if (item.related_tmpl == 2) {
                                    menuList.push(activeMenu(item, item.related_tmpl));
                                }
                                if (item.related_tmpl == 3) {
                                    menuList.push(activeMenu(item, item.related_tmpl));
                                }
                                if (item.related_tmpl == 4) {
                                    menuList.push(activeMenu(item, item.related_tmpl));
                                }
                            });
                    }
                    let accessedRouters = [];
                    accessedRouters = filterAsyncRouter(
                        asyncRouterMap.concat(menuList),
                        roles
                    );
                    commit("SET_ROUTERS", accessedRouters);
                    resolve(JSON.stringify(menuList));
                });
            });
        },
        GetMenuState({ commit }, data) {
            return new Promise(resolve => {
                commit("SET_MENUSTATE", data);
                resolve();
            });
        }
    }
};

export default permission;