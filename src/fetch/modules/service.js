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
// 模块列表
export function RequestServiceList(obj) {
  return axios.get(url.service, obj);
}
// 栏目获取
export function RequestCategory(obj) {
  return axios.get(url.publicCategory + "/" + obj.category_type, obj);
}
// 政务公开
export function RequestGovList(obj) {
  return axios.get(url.govNews, obj);
}
// 政务详情
export function RequestGovDetail(obj) {
  return axios.get(url.govNews + "/" + obj.news_id, obj);
}
// 政务公开新增
export function RequestGovAdd(obj) {
  return axios.post(url.govNews, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 政务公开编辑
export function RequestGovEditor(obj) {
  return axios.put(url.govNews, obj).then(res => {
    messageTips(res);
    return res;
  });
}
export function RequestGovDelete(obj) {
  return axios.delete(url.govNews, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 政务公开上下线
export function RequestGovState(obj) {
  return axios.put(url.serviceNewsState, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 街道信息
export function RequestStreet(obj) {
  return axios.get(url.streetGroup, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 社区添加
export function RequestSubAdd(obj) {
  return axios.post(url.subAdd, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 社区编辑
export function RequestSubEditor(obj) {
  return axios.put(url.subAdd, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 社区编辑
export function RequestSubDelete(obj) {
  return axios.delete(url.subAdd, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 街道编辑
export function RequestGroupEditor(obj) {
  return axios.post(url.group, obj).then(res => {
    messageTips(res);
    return res;
  });
}

// 政务公开分类
export function RequestGovClassList(obj) {
  if (obj.pid != "") {
    return axios.get(url.govAttr + "/" + obj.pid, obj);
  }
}

// 办事指南分类
export function RequestClassfiyList(obj) {
  return axios.get(url.bsznattr, obj);
}
//办事指南列表
export function RequestServiceGuidList(obj) {
  return axios.get(url.event, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//办事指南新增
export function RequestServiceGuidAdd(obj) {
  return axios.post(url.event, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//办事指南编辑
export function RequestServiceGuidEdit(obj) {
  return axios.put(url.event, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//办事指南详情
export function RequestServiceGuidDetail(obj) {
  return axios.get(url.event + "/" + obj.event_id, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//办事指南删除
export function RequestServiceGuidDelete(obj) {
  return axios.delete(url.event, obj).then(res => {
    messageTips(res);
    return res;
  });
}
/**
 *  1.社区活动接口
 */
// 获取 活动列表
export function RequestActiveList(obj) {
  return axios.get(url.activity, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 获取分类
export function RequestActiveAttr(obj) {
  return axios.get(url.activeAttr, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//删除分类

export function RequestDeleteAttr(obj) {
  return axios.delete(url.activityAttr, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//编辑分类
export function RequestEditAttr(obj) {
  return axios.put(url.activityAttr, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//  活动发布
export function RequestActivieState(obj) {
  return axios.post(url.activityState, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//活动预览
export function RequestActiviePreview(obj) {
  return axios.post(url.previewActivity, obj).then(res => {
    messageTips(res);
    return res;
  });
}

//活动投放区域
export function RequestServiceRun(obj) {
  return axios.get(url.serviceRun, obj).then(res => {
    // messageTips(res);
    return res;
  });
}
//服务新增
export function RequestServiceClassAdd(obj) {
  return axios.post(url.serviceAdd, obj).then(res => {
    messageTips(res);
    return res;
  });
}

//服务图标
export function RequestServiceIcon(obj) {
  return axios.get(url.serviceIcon, obj).then(res => {
    // messageTips(res);
    return res;
  });
}
//服务图标条目
export function RequestServiceIconItem(obj) {
  return axios.get(url.serviceIconItem, obj).then(res => {
    // messageTips(res);
    return res;
  });
}
// 添加 活动
export function RequestActiveAdd(obj) {
  return axios.post(url.activity, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 添加 活动
export function RequestActiveEditor(obj) {
  return axios.put(url.activity, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 添加 删除
export function RequestActiveDelete(obj) {
  return axios.delete(url.activity, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 获取 活动详情
export function RequestActiveDetail(obj) {
  return axios.get(url.activity + "/" + obj.activity_id, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 获取 活动报名详情
export function RequestLookSignDetail(obj) {
  return axios.get(url.enlist + "/" + obj.activity_id, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 获取 志愿者列表
export function RequestActiveVolunteerList(obj) {
  return axios.get(url.volunteer, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 获取 志愿者详情
export function RequestActiveVolunteerDetail(obj) {
  return axios.get(url.volunteer + "/" + obj.user_id, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 获取 分类添加
export function RequestActiveVolunteerAttr(obj) {
  return axios.post(url.attrAdd, obj).then(res => {
    messageTips(res);
    return res;
  });
}

/**
 * 1随手拍
 */

// 随手拍列表
export function RequestServiceCaseList(obj) {
  return axios.getTwo(url.case, obj).then(res => {
    return res;
  });
}
// 随手拍详情
export function RequestServiceCaseDetail(obj) {
  return axios.getTwo(url.case + "/" + obj.case_id, obj).then(res => {
    return res;
  });
}
//删除随手拍
export function RequestRevolveDelete(obj) {
  return axios.delete(url.case, obj).then(res => {
    return res;
  });
}

// 随手拍办理
export function RequestServiceCaseHanle(obj) {
  console.log(obj);
  return axios.put(url.caseHandle, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 随手拍结案
export function RequestServiceCase(obj) {
  console.log(obj);
  return axios.put(url.caseSettle, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 节点列表
export function RequestServiceNode(obj) {
  return axios.get(url.node, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 节点添加
export function RequestServiceNodeAdd(obj) {
  return axios.post(url.node, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 节点删除
export function RequestServiceNodeDelete(obj) {
  return axios.delete(url.node, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//随手拍爆料评论
export function RequestServiceBrokeList(obj) {
  return axios.get(url.broke, obj).then(res => {
    messageTips(res);
    return res;
  });
}

//随手拍评论正常禁用
export function RequestServiceCommentState(obj) {
  return axios.put(url.brokeState, obj).then(res => {
    messageTips(res);
    return res;
  });
}

// 主题分类
export function RequestServiceCaseAtrrList(obj) {
  return axios.getTwo(url.sspAttlist, obj).then(res => {
    return res;
  });
}
// 随手拍介绍添加introducation
export function RequestServiceCaseIntroducation(obj) {
  return axios.post(url.introducation, obj);
}
// 随手拍介绍introducation
export function RequestServiceCaseIntroducationList(obj) {
  return axios.getTwo(url.introducation, obj);
}
/**
 * 服务（导航）
 */

// 服务列表
export function RequestServiceManagerList(obj) {
  return axios.getTwo(url.service, obj).then(res => {
    return res;
  });
}

// 服务类目添加
export function RequestServiceCategoryAdd(obj) {
  return axios.post(url.serviceCategory, obj).then(res => {
    return res;
  });
}
// 服务类目编辑
export function RequestServiceCategoryEditor(obj) {
  return axios.put(url.serviceCategory, obj).then(res => {
    return res;
  });
}
// 服务类目删除
export function RequestServiceCategoryDelete(obj) {
  return axios.delete(url.serviceCategory, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 服务类目状态
export function RequestServiceCategoryState(obj) {
  return axios.put(url.serviceCategoryState, obj).then(res => {
    return res;
  });
}

// 二级服务添加
export function RequestServiceAdd(obj) {
  return axios.post(url.service, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 二级服务编辑
export function RequestServiceEditor(obj) {
  return axios.put(url.service, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 二级服务删除
export function RequestServiceDelete(obj) {
  return axios.delete(url.service, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 二级服务详情
export function RequestServiceDetail(obj) {
  return axios.get(url.service + "/" + obj.service_id, obj).then(res => {
    return res;
  });
}
export function RequestServicePublicDetail(obj) {
  return axios.get(url.publicService + "/" + obj.service_id, obj).then(res => {
    return res;
  });
}

// 二级服务状态切换
export function RequestServiceState(obj) {
  return axios.put(url.serviceState, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 二级服务首页显示切换
export function RequestServiceHome(obj) {
  return axios.put(url.serviceHome, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 二级服务推荐
export function RequestServiceRecom(obj) {
  return axios.put(url.serviceRecom, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 二级服务排序
export function RequestServiceSort(obj) {
  return axios.put(url.serviceSort, obj).then(res => {
    messageTips(res);
    return res;
  });
}

// 活动置顶
export function RequestActiveTop(obj) {
  return axios.post(url.activityTop, obj).then(res => {
    messageTips(res);
    return res;
  });
}

/**
 * 投票评选
 */

// 组件列表
export function RequestformBuilderList(obj) {
  return axios.getTwo(url.formBuilder, obj).then(res => {
    return res;
  });
}

// 投票评选列表
export function RequestVoteList(obj) {
  return axios.getTwo(url.vote, obj).then(res => {
    return res;
  });
}

// 投票评选详情
export function RequestVoteDetail(obj) {
  return axios.getTwo(url.vote + "/" + obj.vote_id, obj).then(res => {
    return res;
  });
}

// 创建投票评选
export function RequestVoteAdd(obj) {
  return axios.post(url.vote, obj).then(res => {
    messageTips(res);
    return res;
  });
}

// 编辑投票评选
export function RequestVoteEdit(obj) {
  return axios.put(url.vote, obj).then(res => {
    return res;
  });
}

// 删除投票评选
export function RequestVoteRemove(obj) {
  return axios.delete(url.vote, obj).then(res => {
    return res;
  });
}

// 投票评选状态
export function RequestVoteState(obj) {
  return axios.put(url.voteState, obj).then(res => {
    return res;
  });
}

// 投票评选题目
export function RequestSubjectList(obj) {
  return axios.getTwo(url.subject + "/" + obj.vote_id, obj).then(res => {
    return res;
  });
}
// 删除评选题目
export function RequestSubjectRemove(obj) {
  return axios.delete(url.subject, obj).then(res => {
    return res;
  });
}
// 删除题目选项
export function RequestSubjectItemRemove(obj) {
  return axios.delete(url.subjectItem, obj).then(res => {
    return res;
  });
}

// 某题答题详情
export function RequestSubjectFill(obj) {
  return axios.getTwo(url.subjectFill + "/" + obj.subject_id, obj).then(res => {
    return res;
  });
}

// 导出某题答题
export function RequestSubjectFillExport(obj) {
  return axios.getTwo(url.subjectFillExport, obj).then(res => {
    return res;
  });
}

// 投票评选用户
export function RequestVoteUserList(obj) {
  return axios.getTwo(url.voteUser + "/" + obj.vote_id, obj).then(res => {
    return res;
  });
}
// 某用户答卷详情
export function RequestVoteUserVoteFill(obj) {
  return axios.getTwo(url.voteFill + "/" + obj.vote_id, obj).then(res => {
    return res;
  });
}

// 导出评选详情
export function RequestVoteExportList(obj) {
  return axios.getTwo(url.voteExport, obj).then(res => {
    return res;
  });
}

// 主题列表
export function RequestThemeList(obj) {
  return axios.getTwo(url.themeList, obj).then(res => {
    return res;
  });
}

/**
 * 问卷调查
 */

// 调查问卷用户答题详情
export function RequestQuestionUserFill(obj) {
  return axios.getTwo(url.questionUserFill, obj).then(res => {
    return res;
  });
}
// 调查问卷列表
export function RequestQuestionnaire(obj) {
  return axios.getTwo(url.questionnaire, obj).then(res => {
    return res;
  });
}

// 调查问卷状态
export function RequestQuestionnaireState(obj) {
  return axios.put(url.questionnaireState, obj).then(res => {
    return res;
  });
}

// 调查问卷详情
export function RequestQuestionnaireDetail(obj) {
  return axios.getTwo(url.questionnaire + "/" + obj.questionnaire_id, obj).then(res => {
    return res;
  });
}

// 创建调查问卷
export function RequestQuestionnaireAdd(obj) {
  return axios.post(url.questionnaire, obj).then(res => {
    messageTips(res);
    return res;
  });
}

// 编辑调查问卷
export function RequestQuestionnaireEdit(obj) {
  return axios.put(url.questionnaire, obj).then(res => {
    return res;
  });
}

// 删除调查问卷
export function RequestQuestionnaireRemove(obj) {
  return axios.delete(url.questionnaire, obj).then(res => {
    return res;
  });
}

// 调查问卷题目
export function RequestQuestionSubjectList(obj) {
  return axios.getTwo(url.questionSubject + "/" + obj.questionnaire_id, obj).then(res => {
    return res;
  });
}

// 删除评选题目
export function RequestQuestionSubjectRemove(obj) {
  return axios.delete(url.questionSubject, obj).then(res => {
    return res;
  });
}
// 删除题目选项
export function RequestQuestionSubjectItemRemove(obj) {
  return axios.delete(url.questionSubjectItem, obj).then(res => {
    return res;
  });
}

// 某题答题详情
export function RequestQuestionnaireSubjectFill(obj) {
  return axios.getTwo(url.questionnaireSubjectFill + "/" + obj.subject_id, obj).then(res => {
    return res;
  });
}

// 调查问卷用户
export function RequestQuestionnaireUser(obj) {
  return axios.getTwo(url.questionnaireUser + "/" + obj.questionnaire_id, obj).then(res => {
    return res;
  });
}

//资讯同步

export function RequestSyncNewsServiceToCategory(obj) {
  return axios.post(url.syncNewsServiceToCategory, obj).then(res => {
    messageTips(res);
    return res;
  });
}
//服务下沉

export function RequestServiceSink(obj) {
  return axios.post(url.serviceSink, obj).then(res => {
    messageTips(res);
    return res;
  });
}

/**
 * 投票后台（定制活动）
 */

// 投票项 --检测编码
export function RequestCheckItemNo(obj) {
  return axios.getTwo(url.checkItemNo, obj).then(res => {
    return res;
  });
}
// 投票项列表
export function RequestPollItemList(obj) {
  return axios.getTwo(url.pollItem, obj).then(res => {
    return res;
  });
}
// 投票项详情
export function RequestPollItemDetail(obj) {
  return axios.getTwo(url.pollItem + "/" + obj.item_id, obj).then(res => {
    return res;
  });
}
// 删除投票项
export function RequestPollItemDel(obj) {
  return axios.delete(url.pollItem, obj).then(res => {
    return res;
  });
}
// 添加投票项
export function RequestPollItemAdd(obj) {
  return axios.post(url.pollItem, obj).then(res => {
    messageTips(res);
    return res;
  });
}
// 编辑投票项
export function RequestPollItemEdit(obj) {
  return axios.put(url.pollItem, obj).then(res => {
    return res;
  });
}
// 投票-默认字段
export function RequestPollItemFields(obj) {
  return axios.getTwo(url.pollItemFields, obj).then(res => {
    return res;
  });
}
