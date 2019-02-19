import Vue from "vue";
import Layout from "./views/layout/Layout";
const _import = require("./router/_import_" + process.env.NODE_ENV);
import router from "./router";
import axios from "axios";
import { getToken, removeToken, getRole, getMenu, menu } from "@/utils/auth"; // getToken from cooki
import store from "./store";
const whiteList = [
  "/login",
  "/statistics/user-statistics",
  "/account/roleLimitsDetail",
  "/material/addImgArticle",
  "/account/userDetail",
  "/account/userEdit",
  "/account/userAdd",
  "/service/activeDetail",
  "/service/votesDetail",
  "/service/questionnaireDetail",
  "/service/revolveDetail",
  "/service/viewVotesUser",
  "/service/viewQuestioUser",
  "/templateTool/index",
  "/statistics/toolClickStatics",
  "/statistics/pageStatisticsDetail"
]; // 不重定向白名单
import { asyncRouterMap } from "./router/index";
router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === "/login") {
      next("/");
    } else {
      if (store.getters.menState === 0) {
        store.dispatch("GenerateRoutes", [getRole()]).then(res => {
          store.dispatch("GetMenuState", 1);
          router.addRoutes(store.getters.addRouters);
          if (to.redirectedFrom) {
            next(to.redirectedFrom);
          } else {
            next({ ...to, replace: true });
          }
        });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next("/login");
    }
  }
  var loginPermissionData = JSON.parse(
    localStorage.getItem("loginPermissionData")
  );
  if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    if (loginPermissionData) {
      getMenuShow(loginPermissionData.menu);
    }
    function getMenuShow(menuSelf) {
      menuSelf.map((item, index) => {
        if (to.path == item.path) {
          next();
        }
        if (item.childs) {
          getMenuShow(item.childs);
        }
      });
    }
  }
});

router.afterEach(() => {
  // console.log('aaaaaaa')
});

// loginPermissionData.menu.map((item, index) => {
//   if (item.childs.length > 0) {
//     item.childs.map((child, num) => {
//       if (to.path == child.path) {
//         next();
//       }
//     });
//   }
//   if (to.path == item.path) {
//     next();
//   }
// });
