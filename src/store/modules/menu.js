import Layout from "../../views/layout/Layout";
const _import = require("./../../router/_import_" + process.env.NODE_ENV);
import publicMenu from '../../fetch/modules/public'
let addUrl = [{
    path: "/personal",
    component: Layout,
    redirect: "/personal/personal",
    name: "personal",
    meta: {
        title: "个人中心",
        icon: "user"
    },
    children: [{
        path: "personal",
        component: _import("personal/personal"),
        name: "personal",
        meta: { title: "个人中心", icon: "user" }
    }]
}];

const menu = {
    state: {
        menus: []
    },

    mutations: {
        SET_MENU: (state, menus) => {
            state.menus = menus;
        }
    },

    actions: {
        /**
         * 菜单添加
         * @param {*} menuData
         */
        AddMenu({ commit }, menuData) {
            return new Promise((resolve, reject) => {
                publicMenu.RequestMiniList().then(res => {
                    commit("SET_MENU", addUrl);
                    resolve(addUrl);
                })

            });
        }
    }
};
export default menu;