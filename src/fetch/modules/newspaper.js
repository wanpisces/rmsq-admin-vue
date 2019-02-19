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

export default new class Newsparper {
  //审核列表
  RequesNewspaperAudit(obj) {
    return axios.get(url.newspaperAudit, obj).then(res => {
      return res;
    });
  }
  //社区报上下线列表
  RequesNewspaperList(obj) {
    return axios.get(url.newspaper, obj).then(res => {
      return res;
    });
  }
  //社区报删除
  RequesNewspaperDelete(obj) {
    return axios.delete(url.newspaper, obj).then(res => {
      return res;
    });
  }
  //社区报编辑第一步获取四个模板pageid
  RequesNewspaperEdtor(obj) {
    return axios.put(url.newspaper, obj).then(res => {
      return res;
    });
  }
  //获取所有平台账号
  RequestNewspaperGroup(obj) {
    return axios.get(url.newspaperGroup, obj).then(res => {
      return res;
    });
  }
  //获取所有报刊模板
  RequestNewspaperTemplate(obj) {
    return axios.get(url.newspaperTemplate, obj).then(res => {
      return res;
    });
  }
  //选择模板
  RequestChooseTemplate(obj) {
    return axios.post(url.chooseTemplate, obj).then(res => {
      messageTips(res);
      return res;
    });
  }
  //社区报上下线
  RequestNewspaperOnoff(obj) {
    return axios.put(url.newspaperOnoff, obj).then(res => {
      messageTips(res);
      return res;
    });
  }
  //社区报获取所有驳回
  RequestNewspaperAllRemark(obj) {
    return axios.get(url.newspaperAllRemark, obj).then(res => {
      messageTips(res);
      return res;
    });
  }
  //社区报提交审核
  RequestNewspaperCheck(obj) {
    return axios.put(url.newspaperCheck, obj).then(res => {
      messageTips(res);
      return res;
    });
  }
  //社区报详情(缩略图)
  RequesNewspaperThumb(obj) {
    return axios.get(`${url.newspaper}/${obj.newspaper_id}`, obj);
  }
  //获取社区报具体某个版面信息
  RequesNewspaperPage(obj) {
    return axios.get(url.newspaperPage, obj);
  }
  //新增驳回
  RequestNewspaperRemark(obj) {
    return axios.post(url.newspaperRemark, obj).then(res => {
      messageTips(res);
      return res;
    });
  }
  //编辑驳回
  RequestEditNewspaperRemark(obj) {
    return axios.put(url.newspaperRemark, obj).then(res => {
      messageTips(res);
      return res;
    });
  }
  //删除驳回
  RequestDeleteNewspaperRemark(obj) {
    return axios.delete(url.newspaperRemark, obj).then(res => {
      messageTips(res);
      return res;
    });
  }
  //审核通过
  RequestNewspaperState(obj) {
    return axios.put(url.newspaperState, obj).then(res => {
      messageTips(res);
      return res;
    });
  }
  // 版面内容修改（批量）
  RequestNewspaperPageItemStr(obj) {
    return axios.put(url.newspaperPageItemStr, obj).then(res => {
      messageTips(res);
      return res;
    });
  }
  // 版面基本信息修改
  RequestNewspaperPageModify(obj) {
    return axios.put(url.newspaperPage, obj).then(res => {
      messageTips(res);
      return res;
    });
  }
  // 生成社区报预览图片
  RequesNewspaperPreview(obj) {
    return axios.get(url.newspaperPreview, obj);
  }
  // 获取当前最大报刊数
  RequesNewspaperISSN(obj) {
    return axios.get(url.newspaperISSN, obj);
  }
  //社区报批量驳回
  RequesNewspaperRemarkStr(obj) {
    return axios.post(url.newspaperRemarkStr, obj).then(res => {
      messageTips(res);
      return res;
    });
  }
  //社区报驳回
  RequestPutNewspaperAllRemark(obj) {
    return axios.put(url.newspaperAllRemark, obj).then(res => {
      messageTips(res);
      return res;
    });
  }
}();
