import Layout from "@/views/layout/Layout";
// import store from '@/store'
const _import = require("@/router/_import_" + process.env.NODE_ENV);
/**
 * 1活动报名一级菜单模板  active父类  activeChildren子类，组装之后将子类添加到父类的children中
 */
const active = {
    path: "/active",
    component: Layout,
    redirect: "/active/activeList",
    name: "active",
    meta: {
        title: "活动报名",
        icon: "huodongbaoming"
    },
    children: []
};
/**
 * 活动报名二级、三级报名模板
 */
const activeChildren = [
    // path: "/service/unitActive",
    // name: "service/unitActive",
    // component: _import("service/unitActive/index"),
    // meta: { title: "活动" },
    // children: [
    // ]
    {
        path: "activeList",
        component: _import("service/unitActive/activeList"),
        name: "activeList",
        meta: { title: "活动列表" }
    },
    {
        path: "activeAdd",
        component: _import("service/unitActive/add"),
        name: "activeAdd",
        meta: { title: "添加" },
        hidden: true
    },
    {
        path: "activeEditor",
        component: _import("service/unitActive/editor"),
        name: "activeEditor",
        meta: { title: "编辑" },
        hidden: true
    },
    {
        path: "activeDetail",
        component: _import("service/unitActive/detail"),
        name: "activeDetail",
        meta: { title: "详情" },
        hidden: true
    },
    {
        path: "lookSign",
        component: _import("service/unitActive/lookSign"),
        name: "lookSign",
        meta: { title: "查看报名" },
        hidden: true
    },
    {
        path: "activePart",
        component: _import("service/unitActive/activePart"),
        name: "activePart",
        meta: { title: "志愿者详情" },
        hidden: true
    },
];


// const activeChildren = {
//     path: "/service/unitActive",
//     name: "service/unitActive",
//     component: _import("service/unitActive/index"),
//     meta: { title: "活动" },
//     children: [{
//             path: "activeList",
//             component: _import("service/unitActive/activeList"),
//             name: "activeList",
//             meta: { title: "活动列表" }
//         },
//         {
//             path: "activeAdd",
//             component: _import("service/unitActive/add"),
//             name: "activeAdd",
//             meta: { title: "添加" },
//             hidden: true
//         },
//         {
//             path: "activeEditor",
//             component: _import("service/unitActive/editor"),
//             name: "activeEditor",
//             meta: { title: "编辑" },
//             hidden: true
//         },
//         {
//             path: "activeDetail",
//             component: _import("service/unitActive/detail"),
//             name: "activeDetail",
//             meta: { title: "详情" },
//             hidden: true
//         },
//         {
//             path: "lookSign",
//             component: _import("service/unitActive/lookSign"),
//             name: "lookSign",
//             meta: { title: "查看报名" },
//             hidden: true
//         },
//         {
//             path: "activePart",
//             component: _import("service/unitActive/activePart"),
//             name: "activePart",
//             meta: { title: "志愿者详情" },
//             hidden: true
//         },
//         // {
//         //   path: "activeDraft",
//         //   component: _import("service/unitActive/activeDraft"),
//         //   name: "activeDraft",
//         //   meta: { title: "草稿箱" }
//         // },
//         // {
//         //   path: "activeVolunteer",
//         //   component: _import("service/unitActive/activeVolunteer"),
//         //   name: "activeVolunteer",
//         //   meta: { title: "志愿者" }
//         // },
//     ]
// };
/**
 * 随手拍一级菜单模板
 */
const photoShow = {
    path: "/revolveOne",
    component: Layout,
    redirect: "/revolveOne/revolving",
    name: "revolveOne",
    meta: {
        title: "随手拍",
        icon: "suisoupai"
    },
    children: []
};
/**
 * 随手拍二级、三级菜单模板
 */
const photoShowChilren = {
    path: "/revolve/revolving",
    name: "revolve/revolving",
    component: _import("revolving/index"),
    meta: { title: "随手拍" },
    children: [{
            path: "revolveList",
            component: _import("revolving/revolveList"),
            name: "revolveList",
            meta: { title: "随手拍" }
        },
        {
            path: "brokeList",
            component: _import("revolving/brokeList"),
            name: "brokeList",
            meta: { title: "爆料评论" }
        },
        {
            path: "revolveThing",
            component: _import("revolving/revolveThing"),
            name: "revolveThing",
            meta: { title: "办理" },
            hidden: true
        },
        {
            path: "addNode",
            component: _import("revolving/addNode"),
            name: "addNode",
            meta: { title: "节点添加" },
            hidden: true
        },
        {
            path: "nodeList",
            component: _import("revolving/nodeList"),
            name: "nodeList",
            meta: { title: "节点" },
            hidden: true
        },
        {
            path: "revolveDetail",
            component: _import("revolving/revolveDetail"),
            name: "revolveDetail",
            meta: { title: "详情" },
            hidden: true
        }
    ]
};
const photoShowOnAuditChilren = [{
        path: "revolveList",
        component: _import("revolving/revolveList"),
        name: "revolveList",
        meta: { title: "随手拍" }
    },
    {
        path: "brokeList",
        component: _import("revolving/brokeList"),
        name: "brokeList",
        hidden: true,
        meta: { title: "爆料评论" }
    },
    {
        path: "revolveThing",
        component: _import("revolving/revolveThing"),
        name: "revolveThing",
        meta: { title: "办理" },
        hidden: true
    },
    {
        path: "addNode",
        component: _import("revolving/addNode"),
        name: "addNode",
        meta: { title: "节点添加" },
        hidden: true
    },
    {
        path: "nodeList",
        component: _import("revolving/nodeList"),
        name: "nodeList",
        meta: { title: "节点" },
        hidden: true
    },
    {
        path: "revolveDetail",
        component: _import("revolving/revolveDetail"),
        name: "revolveDetail",
        meta: { title: "详情" },
        hidden: true
    }
];
// const photoShowOnAuditChilren = {
//     path: "/revolve/revolving",
//     name: "revolve/revolving",
//     component: _import("revolving/index"),
//     meta: { title: "随手拍" },
//     children: [{
//             path: "revolveList",
//             component: _import("revolving/revolveList"),
//             name: "revolveList",
//             meta: { title: "随手拍" }
//         },
//         {
//             path: "revolveThing",
//             component: _import("revolving/revolveThing"),
//             name: "revolveThing",
//             meta: { title: "办理" },
//             hidden: true
//         },
//         {
//             path: "addNode",
//             component: _import("revolving/addNode"),
//             name: "addNode",
//             meta: { title: "节点添加" },
//             hidden: true
//         },
//         {
//             path: "nodeList",
//             component: _import("revolving/nodeList"),
//             name: "nodeList",
//             meta: { title: "节点" },
//             hidden: true
//         },
//         {
//             path: "revolveDetail",
//             component: _import("revolving/revolveDetail"),
//             name: "revolveDetail",
//             meta: { title: "详情" },
//             hidden: true
//         }
//     ]
// };
/**
 * 投票评选 一级菜单模板
 */
const vote = {
    path: "/votingModule",
    component: Layout,
    redirect: "/voting/index",
    name: "votingModule",
    meta: {
        title: "投票评选",
        icon: "toupiaoxuanju"
    },
    children: []
};
/**
 * 投票二级、三级菜单模板
 */
const voteChilren = {
    path: "/voting",
    name: "voting",
    component: _import("voting/index"),
    meta: { title: "投票评选一" },
    children: [{
            path: "vote",
            component: _import("voting/vote/index"),
            name: "vote",
            meta: { title: "投票" }
        },
        {
            path: "addVote",
            component: _import("voting/vote/addVote"),
            name: "addVote",
            hidden: true,
            meta: { title: "新建投票" }
        },
        {
            path: "editVote",
            component: _import("voting/vote/addVote"),
            name: "editVote",
            hidden: true,
            meta: { title: "编辑投票" }
        },
        {
            path: "viewVotes",
            component: _import("voting/vote/viewVotes"),
            name: "viewVotes",
            hidden: true,
            meta: { title: "查看投票" }
        },
        {
            path: "previewVotes",
            component: _import("voting/vote/previewVotes"),
            name: "previewVotes",
            hidden: true,
            meta: { title: "预览投票" }
        },
        {
            path: "viewVotesUser",
            component: _import("voting/vote/viewVotesUser"),
            name: "viewVotesUser",
            hidden: true,
            meta: { title: "用户答题详情" }
        },
        {
            path: "selection",
            component: _import("voting/selection/index"),
            name: "selection",
            meta: { title: "评选" }
        },
        {
            path: "addRepute",
            component: _import("voting/selection/addRepute"),
            name: "addRepute",
            hidden: true,
            meta: { title: "新建评选" }
        },
        {
            path: "editRepute",
            component: _import("voting/selection/addRepute"),
            name: "editRepute",
            hidden: true,
            meta: { title: "编辑评选" }
        },
        {
            path: "viewReputes",
            component: _import("voting/selection/viewReputes"),
            name: "viewReputes",
            hidden: true,
            meta: { title: "查看评选" }
        },
        {
            path: "previewReputes",
            component: _import("voting/selection/previewReputes"),
            name: "previewReputes",
            hidden: true,
            meta: { title: "预览评选" }
        },
        {
            path: "viewReputesUser",
            component: _import("voting/selection/viewReputesUser"),
            name: "viewReputesUser",
            hidden: true,
            meta: { title: "用户答题详情" }
        },
    ]
};
/**
 * 问卷调查 一级菜单模板
 */
const question = {
    path: "/questionModule",
    component: Layout,
    redirect: "/questionnaire/index",
    name: "questionModule",
    meta: {
        title: "问卷调查",
        icon: "email"
    },
    children: []
};
/**
 * 投票二级、三级问卷调查模板
 */
const questionChilren = [{
        path: "question",
        component: _import("questionnaire/question/index"),
        name: "question",
        meta: { title: "问卷列表" }
    },
    {
        path: "addQuestion",
        component: _import("questionnaire/question/addQuestion"),
        name: "addQuestion",
        hidden: true,
        meta: { title: "新建问卷" }
    },
    {
        path: "editQuestion",
        component: _import("questionnaire/question/addQuestion"),
        name: "editQuestion",
        hidden: true,
        meta: { title: "编辑问卷" }
    },
    {
        path: "viewQuestion",
        component: _import("questionnaire/question/viewQuestion"),
        name: "viewQuestion",
        hidden: true,
        meta: { title: "查看问卷" }
    },
    {
        path: "previewQuestion",
        component: _import("questionnaire/question/previewQuestion"),
        name: "previewQuestion",
        hidden: true,
        meta: { title: "预览问卷" }
    },
    {
        path: "viewQuestioUser",
        component: _import("questionnaire/question/viewQuestioUser"),
        name: "viewQuestioUser",
        hidden: true,
        meta: { title: "用户答题详情" }
    }
]

// const questionChilren = {
//     path: "/questionnaire",
//     name: "questionnaire",
//     component: _import("questionnaire/index"),
//     meta: { title: "问卷调查-" },
//     children: [{
//             path: "question",
//             component: _import("questionnaire/question/index"),
//             name: "question",
//             meta: { title: "问卷列表" }
//         },
//         {
//             path: "addQuestion",
//             component: _import("questionnaire/question/addQuestion"),
//             name: "addQuestion",
//             hidden: true,
//             meta: { title: "新建问卷" }
//         },
//         {
//             path: "editQuestion",
//             component: _import("questionnaire/question/addQuestion"),
//             name: "editQuestion",
//             hidden: true,
//             meta: { title: "编辑问卷" }
//         },
//         {
//             path: "viewQuestion",
//             component: _import("questionnaire/question/viewQuestion"),
//             name: "viewQuestion",
//             hidden: true,
//             meta: { title: "查看问卷" }
//         },
//         {
//             path: "previewQuestion",
//             component: _import("questionnaire/question/previewQuestion"),
//             name: "previewQuestion",
//             hidden: true,
//             meta: { title: "预览问卷" }
//         },
//         {
//             path: "viewQuestioUser",
//             component: _import("questionnaire/question/viewQuestioUser"),
//             name: "viewQuestioUser",
//             hidden: true,
//             meta: { title: "用户答题详情" }
//         }
//     ]
// };

/**
 * 深度拷贝
 * @param {*} currobj
 */
function deepClone(currobj) {
    if (typeof currobj !== "object") {
        return currobj;
    }
    if (currobj instanceof Array) {
        var newobj = [];
    } else {
        var newobj = {};
    }
    for (var key in currobj) {
        if (typeof currobj[key] !== "object") {
            // 不是引用类型，则复制值
            newobj[key] = currobj[key];
        } else {
            // 引用类型，则递归遍历复制对象
            newobj[key] = deepClone(currobj[key]);
        }
    }
    return newobj;
}
/**
 * 菜单导航数据处理
 * @param {*} actives  父类
 * @param {*} item    menus数据
 * @param {*} val     判断类型
 */
function menuArr(actives = [], item, val) {
    // console.log(actives)
    let list = item.service_list;
    actives.component = Layout;
    for (var i = 0; i < list.length; i++) {
        let activeChildrens = deepClone(
            val == 1 ?
            activeChildren :
            val == 3 ?
            voteChilren :
            val == 4 ?
            questionChilren :
            val == 2 ?
            photoShowOnAuditChilren : []
        );
        if (val != 1 && val != 4 && val != 2) {
            // if (list[i].need_audit) {
            //     list[i].need_audit == 1 ?
            //         (activeChildrens.meta.title = list[i].service_title + "（审）") :
            //         (activeChildrens.meta.title = list[i].service_title);
            // } else {
            //     activeChildrens.meta.title = list[i].service_title;
            // }
            activeChildrens.meta.title = list[i].service_title;
            activeChildrens.meta.service_id = list[i].service_id;
            activeChildrens.path = activeChildrens.path + i;
            activeChildrens.name = activeChildrens.path + i;
            if (typeof activeChildrens.children === "object") {
                activeChildrens.children = Object.values(activeChildrens.children);
            }
            activeChildrens.children.map((value, j) => {
                list[i].need_audit ? (value.meta.need_audit = list[i].need_audit) : "";
                value.name = value.name + i;
                value.path = value.path + i;
                value.meta.id = i;
                value.meta.service_id = list[i].service_id;
            });
            actives.children.push(activeChildrens);
        } else {
            activeChildrens.map((value, j) => {
                value.name = value.name + i;
                value.path = value.path + i;
                value.meta.id = i;
                if (j == 0) {
                    list[i].need_audit && list[i].need_audit == 1 ? value.meta.title = list[i].service_title + "（审）" : value.meta.title = list[i].service_title;
                    // list[i].need_audit ? value.meta.need_audit = list[i].need_audit : "";
                }
                list[i].need_audit ? value.meta.need_audit = list[i].need_audit : "";
                value.meta.service_id = list[i].service_id;
            });
            actives.children = [...(actives.children), ...activeChildrens];
        }

    }
    // console.log('actives', actives)
    return actives;
}
/**
 * 导出 菜单数据
 * @param {*} item
 * @param {*} val
 */
export function activeMenu(item, val) {
    // console.log('val', val)
    if (val == 1) {
        // let actives = active;
        return menuArr(active, item, val) || [];
    }
    if (val == 2) {
        console.log(val)
        return menuArr(photoShow, item, val) || [];
    }
    if (val == 3) {
        return menuArr(vote, item, val);
    }
    if (val == 4) {
        return menuArr(question, item, val);
    }
}