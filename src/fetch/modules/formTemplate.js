import url from "../api";
import { request } from "../requestTwo.js";
import { Message } from "element-ui";
let messageTips = function(res) {
  if (res.code === 4000) {
    Message.error(res.msg);
  }
};
export default new class FromRequst {
  // 模板列表
  RequesTemplateList(obj) {
    return request(url.formTemplate, { data: obj }).then(res => {
      return res.data;
    });
  }
  // 模板详情列表
  RequesTemplateDetail(obj) {
    return request(`${url.formTemplate}/${obj.template_id}`, {
      data: obj
    }).then(res => {
      return res;
    });
  }
  //   表单状态切换
  RequesFormState(obj) {
    return request(url.formState, { data: obj, method: "PUT" }).then(res => {
      messageTips(res);
      return res.data;
    });
  }
  //表单列表
  RequesFormList(obj) {
    return request(url.form, { data: obj, method: "GET" }).then(res => {
      return res.data;
    });
  }
  //表单用户列表
  RequesFormUserList(obj) {
    return request(url.formUser, { data: obj, method: "GET" }).then(res => {
      return res.data;
    });
  }
  //表单用户答卷详情
  RequesFormUserDetail(obj) {
    return request(url.formUser + "/" + obj.form_id, {
      data: obj,
      method: "GET"
    }).then(res => {
      return res.data;
    });
  }
  //表单数据导出
  RequesFormFillExport(obj) {
    return request(url.formFillExport, { data: obj, method: "GET" }).then(
      res => {
        return res.data;
      }
    );
  }
  //表单删除
  RequesFormDelete(obj) {
    return request(url.form, { data: obj, method: "DELETE" }).then(res => {
      messageTips(res);
      return res.data;
    });
  }
  // 创建表单
  RequesFromCreate(obj) {
    return request(url.form, { data: obj, method: "POST" }).then(res => {
      return res.data;
    });
  }
  // 编辑表单
  RequesFromEditor(obj) {
    return request(url.form, { data: obj, method: "PUT" }).then(res => {
      return res;
    });
  }
  // 表单详情
  RequesFromDetail(obj) {
    return request(`${url.form}/${obj.form_id}`, { data: obj }).then(res => {
      return res.data;
    });
  }
  //标准模板创建表单
  RequestFormApply(obj) {
    return request(url.formApply, { data: obj, method: "GET" }).then(res => {
      return res.data;
    });
  }
  //查看二维码
  RequestFormMiniPermanentQr(obj) {
    return request(url.formMiniPermanentQr, { data: obj, method: "GET" }).then(
      res => {
        return res.data;
      }
    );
  }
}();
