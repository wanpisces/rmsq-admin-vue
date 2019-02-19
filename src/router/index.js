import Vue from "vue";
import Router from "vue-router";
const _import = require("./_import_" + process.env.NODE_ENV);
import {
    getMenu //获取菜单
} from "@/utils/auth";
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);
/* Layout */
import Layout from "../views/layout/Layout";

//  所有权限通用路由表
let routerAdd = [];

/**
 * 主体路由
 */
export const constantRouterMap = [
    { path: "/login", component: _import("login/index"), hidden: true },
    {
        path: "/authredirect",
        component: _import("login/authredirect"),
        hidden: true
    },
    { path: "/404", component: _import("errorPage/404"), hidden: true },
    { path: "/401", component: _import("errorPage/401"), hidden: true },
    { path: "/test", component: _import("test"), hidden: true },
    {
        path: "",
        component: Layout,
        redirect: "dashboard",
        children: [{
            path: "dashboard",
            component: _import("dashboard/index"),
            name: "dashboard",
            meta: { title: "首页", icon: "home", noCache: true }
        }]
    },

    // ...generateRoutesFromMenu(),
    { path: "*", redirect: "/404", hidden: true }
];

const router = new Router({
    // mode: 'history', // require service support 后台支持可以打开
    base: __dirname,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
});
export default router;
/**
 * 异步路由
 * 1 mate中的值
 * icon：渲染的菜单栏的icon，
 * title：菜单栏名与tag名
 * roles： 权限设置 （1:超级管理员，2：编辑员,3:审核员）
 */
let RouterMap = [
    { path: "/login", component: _import("login/index"), hidden: true },
    {
        path: "dashboard",
        component: _import("dashboard/index"),
        name: "dashboard",
        meta: { title: "首页", icon: "dashboard", perm: [] }
    },
    {
        path: "",
        component: Layout,
        redirect: "diy",
        meta: { title: "定制活动", icon: "ding", noCache: true },
        hidden: true,
        name: "diy",
        children: [{
                path: "beautifulCourtyard",
                component: _import("diy/beautifulCourtyard/index"),
                name: "beautifulCourtyard",
                hidden: true,
                meta: { title: "微幸福", noCache: true }
            },
            {
                path: "addCourtyard",
                component: _import("diy/beautifulCourtyard/addCourtyard"),
                name: "addCourtyard",
                hidden: true,
                meta: { title: "数据录入", noCache: true }
            },
            {
                path: "editCourtyard",
                component: _import("diy/beautifulCourtyard/addCourtyard"),
                name: "editCourtyard",
                hidden: true,
                meta: { title: "数据编辑", noCache: true }
            },
            {
                path: "womenFederation",
                component: _import("diy/womenFederation/index"),
                name: "womenFederation",
                hidden: true,
                meta: { title: "妇联", noCache: true }
            },
            {
                path: "addFederation",
                component: _import("diy/womenFederation/addFederation"),
                name: "addFederation",
                hidden: true,
                meta: { title: "妇联数据录入", noCache: true }
            },
            {
                path: "editFederation",
                component: _import("diy/womenFederation/addFederation"),
                name: "editFederation",
                hidden: true,
                meta: { title: "妇联数据编辑", noCache: true }
            },
            {
                path: "cjhFederation",
                component: _import("diy/cjhFederation/index"),
                name: "cjhFederation",
                hidden: true,
                meta: { title: "慈交会", noCache: true }
            },
            {
                path: "cjhaddFederation",
                component: _import("diy/cjhFederation/addFederation"),
                name: "cjhaddFederation",
                hidden: true,
                meta: { title: "慈交会数据录入", noCache: true }
            },
            {
                path: "cjheditFederation",
                component: _import("diy/cjhFederation/addFederation"),
                name: "cjheditFederation",
                hidden: true,
                meta: { title: "慈交会数据编辑", noCache: true }
            }
        ]
    },
    {
        path: "/statistics",
        component: Layout,
        name: "statistics",
        redirect: "/statistics/userStatistics",
        hidden: true,
        meta: { title: "统计", icon: "tongji", noCache: true },
        children: [{
                path: "userStatistics",
                component: _import("statistics/userStatistics"),
                name: "userStatistics",
                hidden: true,
                meta: { title: "用户统计", noCache: true }
            },
            {
                path: "newsStatistics",
                hidden: true,
                component: _import("statistics/newsStatistics"),
                name: "newsStatistics",
                meta: { title: "资讯统计", noCache: true }
            },
            {
                path: "activityStatics",
                component: _import("statistics/activityStatics"),
                name: "activityStatics",
                hidden: true,
                meta: { title: "活动统计", noCache: true }
            },
            {
                path: "pageStatistics",
                component: _import("statistics/pageStatistics"),
                name: "pageStatistics",
                hidden: true,
                meta: { title: "页面功能统计", noCache: true }
            },
            {
                path: "toolClickStatics",
                component: _import("statistics/toolClickStatics"),
                name: "toolClickStatics",
                hidden: true,
                meta: { title: "工具点击统计", noCache: true }
            },
            {
                path: "pageStatisticsDetail",
                component: _import("statistics/pageStatisticsDetail"),
                name: "pageStatisticsDetail",
                hidden: true,
                meta: { title: "页面功能统计详情", noCache: true }
            },
            {
                path: "mapStatistics",
                component: _import("statistics/mapStatistics"),
                name: "mapStatistics",
                hidden: true,
                meta: { title: "地区统计", noCache: true }
            }
        ]
    },
    {
        path: "/information",
        component: Layout,
        redirect: "/information/infoList",
        name: "information",
        hidden: true,
        meta: {
            title: "资讯",
            icon: "international",
            perm: []
        },
        children: [{
                path: "infoAdd",
                component: _import("information/infoAdd"),
                hidden: true,
                name: "infoAdd",
                meta: { title: "发布资讯", perm: [] }
            },
            {
                path: "infoList",
                component: _import("information/infoList"),
                name: "infoList",
                hidden: true,
                meta: { title: "资讯列表", perm: [] }
            },
            {
                path: "infoExamine",
                component: _import("information/infoExamine"),
                name: "infoExamine",
                hidden: true,
                meta: { title: "审核列表", perm: [] }
            },
            {
                path: "infoEvaluate",
                component: _import("information/infoEvaluate"),
                name: "infoEvaluate",
                hidden: true,
                meta: { title: "资讯评价", perm: [] }
            },
            {
                path: "infoClassifyList",
                component: _import("information/infoClassifyList"),
                name: "infoClassifyList",
                hidden: true,
                meta: { title: "分类设置", perm: [] }
            },
            {
                path: "module",
                hidden: true,
                component: _import("setting/module"),
                name: "module",
                meta: { title: "按钮设置", perm: [] }
            },
            {
                path: "infoModule",
                hidden: true,
                component: _import("setting/infoModule"),
                name: "infoModule",
                meta: { title: "栏目设置", perm: [] }
            },
            {
                path: "lunbo",
                hidden: true,
                component: _import("setting/lunbo"),
                name: "lunbo",
                meta: { title: "轮播设置", perm: [] }
            },
            {
                path: "infoDetail",
                component: _import("information/infoDetail"),
                name: "infoDetail",
                meta: { title: "资讯详情", perm: [] },
                hidden: true
            },
            {
                path: "inforExamineDetail",
                component: _import("information/inforExamineDetail"),
                name: "inforExamineDetail",
                meta: { title: "审核详情", perm: [] },
                hidden: true
            }
        ]
    },
    {
        path: "/material",
        component: Layout,
        redirect: "/material/imgArticleLib",
        name: "material",
        hidden: true,
        meta: {
            title: "资讯素材库",
            icon: "sucai",
            perm: []
        },
        children: [{
                path: "imgMaterialLib",
                component: _import("information/material/imgMaterialLib"),
                name: "imgMaterialLib",
                hidden: true,
                meta: { title: "图片素材库", perm: [] }
            },
            {
                path: "videoMaterialLib",
                component: _import("information/material/videoMaterialLib"),
                name: "videoMaterialLib",
                hidden: true,
                meta: { title: "视频素材库", perm: [] }
            },
            {
                path: "addImgArticle",
                component: _import("information/material/addImgArticle"),
                name: "addImgArticle",
                meta: { title: "新建资讯", perm: [] },
                hidden: true
            },
            // {
            //     path: "addImgArticleKind",
            //     component: _import("information/material/addImgArticleKind"),
            //     name: "addImgArticleKind",
            //     meta: { title: "资讯编辑测试", perm: [] },
            //     // hidden: true
            // },
            {
                path: "editImgArticle",
                component: _import("information/material/addImgArticle"),
                name: "editImgArticle",
                meta: { title: "编辑资讯", perm: [] },
                hidden: true
            },
            {
                path: "addVideo",
                component: _import("information/material/addVideo"),
                name: "addVideo",
                meta: { title: "新建视频消息", perm: [] },
                hidden: true
            },
            {
                path: "mpList",
                component: _import("mp/components/mpList"),
                name: "mpList",
                meta: { title: "微信公众号授权", perm: [] },
                hidden: true
            },
            {
                path: "weiboList",
                component: _import("mp/components/weiboList"),
                name: "weiboList",
                meta: { title: "微博授权", perm: [] },
                hidden: true
            },
            {
                path: "toutiaoList",
                component: _import("mp/components/toutiaoList"),
                name: "toutiaoList",
                meta: { title: "头条授权", perm: [] },
                hidden: true
            },
            {
                path: "kuaichuanList",
                component: _import("mp/components/kuaichuanList"),
                name: "kuaichuanList",
                meta: { title: "快传授权", perm: [] },
                hidden: true
            },
            {
                path: "baijiaList",
                component: _import("mp/components/baijiaList"),
                name: "baijiaList",
                meta: { title: "百家号授权", perm: [] },
                hidden: true
            }
        ]
    },
    {
        path: "/account",
        component: Layout,
        redirect: "/account/platAccount",
        name: "account",
        hidden: true,
        meta: {
            title: "账号管理",
            icon: "zhanghao",
            perm: []
        },
        children: [{
                path: "platAccount",
                component: _import("account/platAccount"),
                name: "platAccount",
                hidden: true,
                meta: { title: "平台账号", perm: [] }
            },
            {
                path: "userAccount",
                component: _import("account/userAccount"),
                name: "userAccount",
                hidden: true,
                meta: { title: "客户账号", perm: [] }
            },
            {
                path: "platLimits",
                component: _import("account/platLimits"),
                name: "platLimits",
                hidden: true,
                meta: { title: "平台权限设置", perm: [] }
            },
            {
                path: "roleLimits",
                component: _import("account/roleLimits"),
                name: "roleLimits",
                hidden: true,
                meta: { title: "角色权限设置", perm: [] }
            },
            {
                path: "roleLimitsDetail",
                component: _import("account/roleLimitsDetail"),
                name: "roleLimitsDetail",
                meta: { title: "权限维护", perm: [] },
                hidden: true
            },
            {
                path: "platDetail",
                component: _import("account/platDetail"),
                name: "platDetail",
                meta: { title: "用户信息", perm: [] },
                hidden: true
            },
            {
                path: "platAdd",
                component: _import("account/platAdd"),
                name: "platAdd",
                meta: { title: "新增", perm: [] },
                hidden: true
            },
            {
                path: "platEdit",
                component: _import("account/platEdit"),
                name: "platEdit",
                meta: { title: "编辑", perm: [] },
                hidden: true
            },
            {
                path: "userAdd",
                component: _import("account/userAdd"),
                name: "userAdd",
                meta: { title: "客户新增", perm: [] },
                hidden: true
            },
            {
                path: "userEdit",
                component: _import("account/userEdit"),
                name: "userEdit",
                meta: { title: "客户编辑", perm: [] },
                hidden: true
            },
            {
                path: "userDetail",
                component: _import("account/userDetail"),
                name: "userDetail",
                meta: { title: "用户信息", perm: [] },
                hidden: true
            },
            {
                path: "staffAccount",
                component: _import("account/staffAccount"),
                name: "staffAccount",
                meta: { title: "员工账号", perm: [] },
                hidden: true
            }
        ]
    },
    {
        path: "/menuManage",
        component: Layout,
        redirect: "/menuManage/menuList",
        name: "menuManage",
        meta: {
            title: "服务管理",
            icon: "11",
            perm: []
        },
        hidden: true,
        children: [{
            path: "menuManage",
            component: _import("menuManage/menuList"),
            name: "menuManage",
            hidden: true,
            meta: { title: "服务设置", icon: "fuwushezhi", perm: [] }
        }]
    },
    {
        path: "/questionFeedback",
        component: Layout,
        redirect: "/questionFeedback/questionList",
        name: "questionFeedback",
        meta: {
            title: "问题与反馈",
            icon: "wentiyufankui",
            perm: []
        },
        hidden: true,
        children: [{
                path: "questionList",
                component: _import("questionFeedback/questionList"),
                name: "questionList",
                hidden: true,
                meta: { title: "问题列表", perm: [] }
            },
            {
                path: "feedbackList",
                component: _import("questionFeedback/feedbackList"),
                name: "feedbackList",
                hidden: true,
                meta: { title: "反馈列表", perm: [] }
            }
        ]
    },
    {
        path: "/service",
        component: Layout,
        redirect: "/service/serviceList",
        name: "service",
        hidden: true,
        meta: {
            title: "服务",
            icon: "form",
            perm: []
        },
        children: [{
                path: "activeDetail",
                component: _import("service/activeDetail"),
                name: "activeDetail",
                meta: { title: "活动详情", perm: [] },
                hidden: true
            },
            {
                path: "votesDetail",
                component: _import("service/votesDetail"),
                name: "votesDetail",
                meta: { title: "查看投票", perm: [] },
                hidden: true
            },
            {
                path: "viewVotesUser",
                component: _import("service/viewVotesUser"),
                name: "viewVotesUser",
                meta: { title: "查看答题详情", perm: [] },
                hidden: true
            },
            {
                path: "viewQuestioUser",
                component: _import("service/viewQuestioUser"),
                name: "viewQuestioUser",
                meta: { title: "查看答题详情", perm: [] },
                hidden: true
            },
            {
                path: "questionnaireDetail",
                component: _import("service/questionnaireDetail"),
                name: "questionnaireDetail",
                meta: { title: "查看问卷", perm: [] },
                hidden: true
            },
            {
                path: "revolveDetail",
                component: _import("service/revolveDetail"),
                name: "revolveDetail",
                meta: { title: "随手拍", perm: [] },
                hidden: true
            },
            {
                path: "serviceGov",
                component: _import("service/serviceGov"),
                name: "serviceGov",
                meta: { title: "政务公开", perm: [] },
                hidden: true
            },
            {
                path: "guidAdd",
                component: _import("service/guidAdd"),
                name: "guidAdd",
                hidden: true,
                meta: { title: "新增事项", perm: [] }
            },
            {
                path: "guidEdit",
                component: _import("service/guidEdit"),
                name: "guidEdit",
                hidden: true,
                meta: { title: "编辑事项", perm: [] }
            },
            {
                path: "guidDetail",
                component: _import("service/guidDetail"),
                name: "guidDetail",
                hidden: true,
                meta: { title: "事项详情", perm: [] }
            },
            {
                path: "serviceGuid",
                component: _import("service/serviceGuid"),
                name: "serviceGuid",
                hidden: true,
                meta: { title: "办事指南", perm: [] }
            },
            {
                path: "serviceGuidAdd",
                component: _import("service/serviceGuidAdd"),
                name: "serviceGuidAdd",
                hidden: true,
                meta: { title: "政务添加", perm: [] }
            },
            {
                path: "streetInfo",
                component: _import("service/streetInfo"),
                name: "streetInfo",
                hidden: true,
                meta: { title: "街道详情", perm: [] }
            },
            {
                path: "serviceGovEditor",
                component: _import("service/serviceGovEditor"),
                name: "serviceGovEditor",
                hidden: true,
                meta: { title: "政务编辑", perm: [] }
            },
            {
                path: "govDetail",
                component: _import("service/govDetail"),
                name: "govDetail",
                hidden: true,
                meta: { title: "政务详情", perm: [] }
            }
            // { path: 'streetConfig', component: _import('https://www.baidu.com'), name: 'streetConfig', meta: { title: '街道配置' } },
        ]
    },
    {
        path: "",
        component: Layout,
        redirect: "mp",
        hidden: true,
        name: "mp",
        children: [{
            path: "mp",
            component: _import("mp/index"),
            name: "mp",
            hidden: true,
            meta: {
                title: "账号授权",
                icon: "guanliangongzhonghao",
                noCache: true,
                perm: []
            }
        }]
    },
    {
        path: "",
        component: Layout,
        redirect: "groupInfo",
        name: "groupInfo",
        hidden: true,
        children: [{
            path: "groupInfo",
            component: _import("groupInfo/index"),
            name: "groupInfo",
            hidden: true,
            meta: {
                title: "单位信息",
                icon: "danweixinxi",
                noCache: true,
                perm: []
            }
        }]
    },
    {
        path: "/personal",
        component: Layout,
        redirect: "personal/personal",
        name: "personal",
        hidden: true,
        children: [{
            path: "personal",
            component: _import("personal/personal"),
            name: "personal",
            hidden: true,
            meta: { title: "个人中心", icon: "gerenzhongxin", perm: [] }
        }]
    },
    {
        path: "",
        component: Layout,
        redirect: "service",
        hidden: true,
        children: [{
            path: "service",
            component: _import("service/serviceList"),
            name: "serviceList",
            hidden: true,
            meta: { title: "系统设置", icon: "form", noCache: true, perm: [] }
        }]
    },
    {
        path: "",
        component: Layout,
        redirect: "district",
        hidden: true,
        name: "district",
        children: [{
            path: "district",
            component: _import("district/index"),
            name: "district",
            hidden: true,
            meta: { title: "地理位置", icon: "diliweizhi", noCache: true, perm: [] }
        }]
    },
    {
        path: "/PubNumExpansion",
        component: Layout,
        redirect: "PubNumExpansion",
        name: "PubNumExpansion",
        hidden: true,
        children: [{
            path: "index",
            component: _import("PubNumExpansion/index"),
            name: "PubNumExpansion",
            meta: { title: "公众号扩展", icon: "pubNumEx", noCache: true }
        }]
    },
    {
        path: "/releaseNotes",
        component: Layout,
        redirect: "releaseNotes",
        name: "releaseNotes",
        hidden: true,
        children: [{
            path: "index",
            component: _import("releaseNotes/index"),
            name: "releaseNotes",
            meta: { title: "版本说明", icon: "versionMan", noCache: true }
        }]
    },
    {
        path: "/shareSetting",
        component: Layout,
        redirect: "shareSetting",
        name: "shareSetting",
        hidden: true,
        children: [{
            path: "index",
            component: _import("shareSetting/index"),
            name: "shareSetting",
            meta: { title: "分享设置", icon: "share", noCache: true }
        }]
    },
    {
        path: "",
        component: Layout,
        redirect: "templateTool",
        name: "templateTools",
        hidden: true,
        meta: { title: "模板工具", icon: "international", noCache: true },
        children: [{
                path: "templateTool",
                component: _import("templateTool/index"),
                name: "templateTool",
                hidden: true,
                meta: { title: "模板列表" }
            },
            {
                path: "userData",
                component: _import("templateTool/userData"),
                name: "userData",
                hidden: true,
                meta: { title: "用户数据", noCache: true }
            },
            {
                path: "workDaily",
                component: _import("templateTool/component/workDaily"),
                name: "workDaily",
                hidden: true,
                meta: { title: "模板编辑", noCache: true }
            },
            {
                path: "formDetail",
                component: _import("templateTool/component/formDetail"),
                name: "formDetail",
                hidden: true,
                meta: { title: "表单详情", noCache: true }
            }
        ]
    },
    {
        path: "/h5SingUp",
        component: Layout,
        redirect: "/h5SingUp/canzhan",
        name: "h5SingUp",
        meta: {
            title: "慈交会报名",
            icon: "wentiyufankui",
            perm: []
        },
        hidden: true,
        children: [{
                path: "zhanhui",
                component: _import("h5SingUp/zhanhui"),
                name: "zhanhui",
                hidden: true,
                meta: { title: "展会", perm: [] }
            },
            {
                path: "luntan",
                component: _import("h5SingUp/luntan"),
                name: "luntan",
                hidden: true,
                meta: { title: "论坛", perm: [] }
            }
        ]
    },
    {
        path: "/comNewspaper",
        component: Layout,
        redirect: "/comNewspaper/canzhan",
        name: "communityNewspaper",
        meta: {
            title: "社区报",
            icon: "wentiyufankui",
            perm: []
        },
        hidden: true,
        children: [
            // 编辑部分
            {
                path: "comNewspaperList",
                component: _import("communityNewspaper/index"),
                name: "comNewspaperList",
                hidden: true,
                meta: { title: "社区报列表", perm: [] }
            },
            {
                path: "previewLook",
                component: _import("communityNewspaper/previewLook"),
                name: "previewLook",
                hidden: true,
                meta: { title: "社区报预览", perm: [] }
            },
            {
                path: "comNewspaperStep1",
                component: _import("communityNewspaper/edit/step1"),
                name: "comNewspaperStep1",
                hidden: true,
                meta: { title: "社区报编辑", perm: [] }
            },
            {
                path: "comNewspaperStep2",
                component: _import("communityNewspaper/edit/step"),
                name: "comNewspaperStep2",
                hidden: true,
                meta: { title: "社区报编辑", perm: [] }
            },
            {
                path: "stepLast",
                component: _import("communityNewspaper/edit/preview"),
                name: "stepLast",
                hidden: true,
                meta: { title: "完成", perm: [] }
            },
            {
                path: "comNewspaperStep3",
                component: _import(
                    "communityNewspaper/component/plate/fitBoard/testBoard"
                ),
                name: "comNewspaperStep3",
                hidden: true,
                meta: { title: "社区报编辑测试", perm: [] }
            },
            // {
            //     hidden: true,
            //     path: "/communityNewspaper/editor",
            //     name: "communityNewspaper/editor",
            //     meta: { title: "社区报编辑", perm: [] },
            //     component: _import("communityNewspaper/edit/index"),
            //     children: [{
            //         path: "comNewspaperStep1",
            //         component: _import("communityNewspaper/edit/step1"),
            //         name: "comNewspaperStep1",
            //         hidden: true,
            //         meta: { title: "步骤一", perm: [] }
            //     }, ]
            // },

            /**
             * 审核部分
             */
            {
                path: "comNewspaperExamine",
                component: _import("communityNewspaper/examine/index"),
                name: "comNewspaperExamine",
                hidden: true,
                meta: { title: "审核列表", perm: [] }
            },
            {
                path: "comNewspaperLook",
                component: _import("communityNewspaper/examine/examineLook"),
                name: "comNewspaperLook",
                hidden: true,
                meta: { title: "审核", perm: [] }
            }
        ]
    },

    {
        path: "",
        component: Layout,
        redirect: "userManager",
        hidden: true,
        name: "userManager",
        children: [{
            path: "userManager",
            component: _import("userManager/index"),
            name: "userManager",
            meta: { title: "用户管理", icon: "usermanager", noCache: true }
        }]
    },
    { path: "*", redirect: "/404", hidden: true }
];
// var menu = getMenu();
var loginPermissionData = JSON.parse(
    localStorage.getItem("loginPermissionData")
);
// var role_type = JSON.parse(localStorage.getItem("loginPermissionData")).type;
if (loginPermissionData) {
    RouterMap = getMenuShow(RouterMap, loginPermissionData.menu);
    // console.log(loginPermissionData.menu.length);
    var menu = loginPermissionData.menu;
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].name == "menuManage") {
            localStorage.setItem("isService", 1);
            break;
        } else {
            localStorage.setItem("isService", 0);
        }
    }
}

function getMenuShow(menuSelf, menuLimits) {
    // var role_type =
    menuLimits.map((item, index) => {
        menuSelf.map((child, num) => {
            // console.log(item.childs)
            if (item.name == "diy") {
                if (item.childs.length != 0) {
                    if (item.name == child.name) {
                        if (menuSelf[num].meta) {
                            menuSelf[num].meta.perm = item.perm;
                        }
                        menuSelf[num].hidden = false;
                        if (item.childs && child.children) {
                            if (item.childs.length > 0 && child.children.length > 0) {
                                child.children = getMenuShow(child.children, item.childs);
                            } else {
                                if (menuSelf[num].children[0].meta) {
                                    menuSelf[num].children[0].meta.perm = item.perm;
                                }
                            }
                        }
                    }
                }
            } else {
                if (item.name == child.name) {
                    if (menuSelf[num].meta) {
                        menuSelf[num].meta.perm = item.perm;
                    }
                    menuSelf[num].hidden = false;
                    if (item.childs && child.children) {
                        if (item.childs.length > 0 && child.children.length > 0) {
                            child.children = getMenuShow(child.children, item.childs);
                        } else {
                            if (menuSelf[num].children[0].meta) {
                                menuSelf[num].children[0].meta.perm = item.perm;
                            }
                        }
                    }
                }
            }
        });
    });
    return menuSelf;
}

export const asyncRouterMap = RouterMap;

// loginPermissionData.menu.map((item, index) => {
//   RouterMap.map((child, num) => {
//     if (item.name == child.name) {
//       RouterMap[num].hidden = false;
//       if (item.childs.length > 0 && child.children.length > 0) {
//         item.childs.map((item1, index1) => {
//           child.children.map((child1, num1) => {
//             if (item1.name == child1.name) {
//               RouterMap[num].children[num1].hidden = false;
//             }
//             if (loginPermissionData.type != 0) {
//               if (
//                 child1.name == "userAccount" ||
//                 child1.name == "platLimits" ||
//                 child1.name == "district"
//               ) {
//                 RouterMap[num].children[num1].hidden = true;
//               }
//             }
//           });
//         });
//       }
//     }
//   });
// });