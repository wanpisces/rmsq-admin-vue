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

// 资讯列表
export function RequestNewsList(obj) {
    return axios.get(url.news, obj);
}
// 资讯添加（版本1.0）
export function RequestNewsAdd(obj) {
    return axios.post(url.news, obj).then(res => {
        messageTips(res);
        return res;
    });
}
// 资讯添加（版本2.0）
export function RequestMpNewsAdd(obj) {
    return axios.post(url.mpnews, obj).then(res => {
        messageTips(res);
        return res;
    });
}


// 资讯编辑
export function RequestNewsEditor(obj) {
    // return axios.put(url.news, obj)
    return axios.put(url.news, obj).then(res => {
        messageTips(res);
    });
}
// 资讯编辑(2.0)
export function RequestMpNewsEditor(obj) {
    // return axios.put(url.news, obj)
    return axios.put(url.mpnews, obj).then(res => {
        messageTips(res);
        return res
    });
}
//修改浏览量
export function RequestNewsViewEdit(obj) {
    return axios.put(url.newsVisitorNum, obj).then(res => {
        messageTips(res);
    });
}
// 资讯详情
export function RequestNewsDetail(obj) {
    return axios.get(url.news + "/" + obj.news_id, obj);
}
// 资讯详情(2.0)
export function RequestMpNewsDetail(obj) {
    return axios.get(url.news + "/" + obj.news_id, obj);
}
// 资讯上下线
export function RequestNewsOnline(obj) {
    return axios.put(url.newsState, obj).then(res => {
        messageTips(res);
    });
}
// 资讯删除
export function RequestNewsDelete(obj) {
    // return axios.delete(url.news, obj)
    return axios.delete(url.news, obj).then(res => {
        messageTips(res);
    });
}
// 资讯置顶
export function RequestNewsTop(obj) {
    return axios.put(url.newsTop, obj).then(res => {
        messageTips(res);
    });
}
// 审核列表
export function RequestNewAuditList(obj) {
    return axios.get(url.newsAudit, obj);
}
// 审核、驳回
export function RequestNewAudit(obj) {
    return axios.put(url.newsAudit, obj).then(res => {
        messageTips(res);
        return res;
    });
}
// 资讯分类列表
export function RequestClassfiyList(obj) {
    return axios.get(url.attr, obj);
}
// 评论列表
// export function RequestCommentList(obj) {
//     return axios.get(url.comment, obj)
// }
export function RequestCommentList(obj) {
    return axios.get(url.comment, obj);
}
export function RequestCommentState(obj) {
    return axios.put(url.commentState, obj).then(res => {
        messageTips(res);
        return res;
    });
}

//资讯模块列表
export function RequestModuleList(obj) {
    return axios.get(url.category, obj);
}
//资讯服务列表
export function RequestModuleServiceList(obj) {
    return axios.get(url.newsCategory, obj);
}
//模块信息获取
export function RequestModuleDetail(obj) {
    return axios.get(url.category + "/" + obj.category_id, obj);
}
//资讯模块删除
export function DeleteNewsModule(obj) {
    return axios.delete(url.category, obj).then(res => {
        messageTips(res);
        return res;
    });
}
//模块编辑
export function RequestModuleEdit(obj) {
    return axios.put(url.category, obj).then(res => {
        messageTips(res);
        return res;
    });
}

//模块（栏目）排序
export function RequestModuleSort(obj) {
    return axios.put(url.categorySort, obj).then(res => {
        messageTips(res);
        return res;
    });
}
//模块添加
export function RequestModuleAdd(obj) {
    return axios.post(url.category, obj).then(res => {
        messageTips(res);
        return res;
    });
}
//资讯分类删除
export function DeleteNewsClassfiy(obj) {
    return axios.delete(url.attr, obj).then(res => {
        messageTips(res);
        return res;
    });
}

//分类编辑
export function RequestClassfiyEdit(obj) {
    return axios.put(url.attr, obj).then(res => {
        messageTips(res);
        return res;
    });
}

//分类添加
export function RequestClassfiyAdd(obj) {
    return axios.post(url.attr, obj).then(res => {
        messageTips(res);
        return res;
    });
}
//资讯提交审核
export function RequestNewsAudit(obj) {
    return axios.put(url.audited, obj).then(res => {
        messageTips(res);
        return res;
    });
}
//分类详情
export function RequestClassfiyDetail(obj) {
    return axios.get(url.attr + "/" + obj.attr_id, obj);
}
// 二维码预览
export function RequestCodeView(obj) {
    return axios.post(url.previewNews, obj).then(res => {
        messageTips(res);
        return res;
    });
}

// 栏目启用停用
export function RequestCategoryStatus(obj) {
    return axios.put(url.categoryStatus, obj).then(res => {
        messageTips(res);
        return res;
    });
}

/**
 * 1.资讯2.0版本
 * 素材库 添加、素材库分类
 */
// 素材库 列表
export function RequestMpMaterialList(obj) {
    return axios.getTwo(url.groupMaterial, obj);
}
// 详情
export function RequestMpMaterialDetail(obj) {
    return axios.get(url.groupMaterial + `/${obj.material_id}`, obj);
}
//素材库添加
export function RequestMpMaterialAdd(obj) {
    return axios.post(url.groupMaterial, obj).then(res => {
        messageTips(res);
        return res;
    });
}
//素材库 编辑
export function RequestMpMaterialEdit(obj) {
    return axios.put(url.groupMaterial, obj).then(res => {
        messageTips(res);
        return res;
    });
}
//素材库 删除
export function RequestMpMaterialDelete(obj) {
    return axios.delete(url.groupMaterial, obj).then(res => {
        messageTips(res);
        return res;
    });
}

// 素材库 分类列表
export function RequestMpMateriaAttrlList(obj) {
    return axios.getTwo(url.groupMaterialAttr, obj);
}
// // 分类详情
// export function RequestMpMaterialAttrDetail(obj) {
//     return axios.get(url.groupMaterialAttr + `/${obj.material_id}`, obj);
// }
//素材库分类添加
export function RequestMpMaterialAttrAdd(obj) {
    return axios.post(url.groupMaterialAttr, obj).then(res => {
        messageTips(res);
        return res;
    });
}
//素材库 分类编辑
export function RequestMpMaterialAttrEdit(obj) {
    return axios.put(url.groupMaterialAttr, obj).then(res => {
        messageTips(res);
        return res;
    });
}
//素材库 分类删除
export function RequestMpMaterialAttrDelete(obj) {
    return axios.delete(url.groupMaterialAttr, obj).then(res => {
        messageTips(res);
        return res;
    });
}