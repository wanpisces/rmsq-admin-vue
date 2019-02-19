<template>
  <div class="info-container">
    <el-card>
      <div class="info-title">{{formTitle}}</div>
      <el-form :model="ruleForm" :rules="ruleGuid" ref="ruleForm" class="form-wrapper">
        <el-form-item label="事项名称：" :label-width="formLabelWidth" prop="event_name">
          <el-input v-model="ruleForm.event_name" auto-complete="off" placeholder="请输入事项的名称"></el-input>
        </el-form-item>
        <el-form-item label="办理部门：" :label-width="formLabelWidth" prop="event_department">
          <el-input v-model="ruleForm.event_department" auto-complete="off" placeholder="请输入办理此业务的部门"></el-input>
        </el-form-item>
        <el-form-item label="办理窗口：" :label-width="formLabelWidth" prop="event_blck">
          <el-input v-model="ruleForm.event_blck" auto-complete="off" placeholder="请输入办理此业务的部门"></el-input>
        </el-form-item>
        <el-form-item label="受理窗口：" :label-width="formLabelWidth" prop="event_service">
          <el-input v-model="ruleForm.event_service" auto-complete="off" placeholder="请输入办理此业务的窗口"></el-input>
        </el-form-item>
        <el-form-item label="办理费用：" :label-width="formLabelWidth" prop="event_free">
          <el-input style="width:650px;margin-right:10px;" v-model="ruleForm.event_free" auto-complete="off" type="number" min="0" placeholder="请输入需要花费的费用，如50，40~60"></el-input>元
        </el-form-item>
        <el-form-item label="承诺时限：" :label-width="formLabelWidth" prop="event_deadline">
          <el-input style="width:625px;margin-right:10px;" v-model="ruleForm.event_deadline" auto-complete="off" type="number" min="0" placeholder="请输入此项业务需要花费的时间，如5个工作日"></el-input>工作日
        </el-form-item>
        <el-form-item label="法定依据：" :label-width="formLabelWidth" prop="event_basis">
          <el-input v-model="ruleForm.event_basis" auto-complete="off" type="textarea" placeholder="请输入此事项的法律依据，如《中国婚姻法》"></el-input>
        </el-form-item>
        <el-form-item label="申请材料：" :label-width="formLabelWidth" prop="event_mark">
          <el-input v-model="ruleForm.event_mark" auto-complete="off" type="textarea" placeholder="请输入办理此项业务需要携带的材料、证件"></el-input>
        </el-form-item>
        <el-form-item label="办理流程：" :label-width="formLabelWidth" prop="event_flow">
          <el-input v-model="ruleForm.event_flow" auto-complete="off" type="textarea" placeholder="请输入此项业务的办理流程"></el-input>
        </el-form-item>
        <el-form-item label="事项分类：" prop="attr_id" :label-width="formLabelWidth">
          <el-cascader :options="options" :show-all-levels="true" @change="selectAttrId" v-model="selectedOptions"></el-cascader>
        </el-form-item>
        <div class="info-footer">
          <el-button type="primary" @click="submitForm('ruleForm')">发布</el-button>
          <el-button @click="resetForm">退 出</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
//  数据service接口
import {
  RequestServiceGuidAdd,
  RequestServiceGuidEdit,
  RequestServiceGuidDetail
} from "../../fetch/modules/service.js";
import { ruleGuid, GetClassfiyList } from "../../fetch/validate.js";
export default {
  data() {
    return {
      options: [],
      ruleGuid,
      formTitle: "新增事项",
      event_id: "",
      selectedOptions: [],
      ruleForm: {
        group_id: 1,
        event_id: "",
        event_name: "",
        event_department: "",
        event_service: "",
        event_free: "",
        event_deadline: "",
        event_basis: "",
        event_mark: "",
        event_flow: "",
        attr_id: "",
        event_blck: ""
      },
      formLabelWidth: "120px",
      btnMark: true
    };
  },
  created() {
    const params = this.$route.query;
    if (params.event_id) {
      this.event_id = params.event_id;
      this.ruleForm.event_id = params.event_id;
      this.handEditor(params.event_id);
    }
    this.getAttr();
  },
  methods: {
    //获取分类
    getAttr() {
      GetClassfiyList().then(res => {
        res.shift();
        this.options = res;
      });
    },
    //选择分类Id
    selectAttrId(e) {
      this.ruleForm.attr_id = e[e.length - 1];
    },
    resetForm() {
      this.$store.dispatch("delVisitedViews", {
        path: "/service/guidAdd"
      });
      this.$router.push({ name: "serviceGuid" });
    },
    // 提交审核
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnMark = true;
          var args = this.ruleForm;
          // args.event_deadline = args.event_deadline + "工作日";
          // args.event_free = args.event_free + "元";
          if (this.event_id) {
            RequestServiceGuidEdit(args).then(res => {
              oprateFn(res);
            });
          } else {
            RequestServiceGuidAdd(args).then(res => {
              oprateFn(res);
            });
          }
          function oprateFn(res) {
            _this.btnMark = false;
            if (res.code == 2000) {
              _this.$Message({
                type: "success",
                text: "操作成功"
              });
              _this.$store.dispatch("delVisitedViews", {
                path: "/service/guidAdd"
              });
              _this.$router.push({ name: "serviceGuid" });
            } else if (res.code == 4000) {
              _this.$Message({
                type: "info",
                text: res.msg
              });
            } else {
              _this.$Message({
                type: "info",
                text: "出错"
              });
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //编辑信息
    handEditor(event_id) {
      this.formTitle = "编辑事项";
      RequestServiceGuidDetail({ event_id: event_id }).then(res => {
        var selectedOptions = [];
        for (var n = 0; n < res.attr.length; n++) {
          selectedOptions.push(res.attr[n].attr_id);
        }
        this.selectedOptions = selectedOptions;
        res.attr_id = res.attr[res.attr.length - 1].attr_id;
        for (var i in res) {
          for (var j in this.ruleForm) {
            if (i == j) {
              this.ruleForm[j] = res[i];
            }
          }
        }
      });
    }
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.form-wrapper {
  width: 800px;
  margin: auto;
}
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .info-footer {
    margin-left: 120px;
    padding: 50px 0;
  }
  .el-tag + .el-tag {
    margin-right: 10px;
  }
  .button-new-tag {
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-right: 10px;
    vertical-align: bottom;
  }
  .info-title {
    padding: 10px;
    margin-bottom: 30px;
    font-size: 16px;
    color: #1890ff;
    border-bottom: 5px solid rgb(247, 246, 252);
  }
  .avatar-uploader,
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 178px;
    width: 178px;
    overflow: hidden;
  }
  .avatar-uploader,
  .el-upload:hover {
    border-color: #409eff;
  }
  .el-upload,
  .el-upload--text {
    border: 1px dashed #d9d9d9 !important;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
