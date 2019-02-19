<template>
  <div class="info-container">
    <el-card>
      <el-form class="form-wrapper">
        <el-form-item label="事项名称：" :label-width="formLabelWidth">
          <span>{{tableData.event_name}}</span>
        </el-form-item>
        <el-form-item label="发布时间：" :label-width="formLabelWidth">
          <span>{{tableData.create_time}}</span>
        </el-form-item>
        <el-form-item label="发布人姓名：" :label-width="formLabelWidth">
          <span>{{tableData.event_name}}</span>
        </el-form-item>
        <el-form-item label="发布单位：" :label-width="formLabelWidth">
          <span>{{tableData.event_name}}</span>
        </el-form-item>
        <el-form-item label="事项分类：" :label-width="formLabelWidth">
          <span v-for="(item, index) in tableData.attr" :key="index">{{item.attr_value}}-</span>
        </el-form-item>
        <el-form-item label="办理部门：" :label-width="formLabelWidth">
          <span>{{tableData.event_department}}</span>
        </el-form-item>
        <el-form-item label="受理窗口：" :label-width="formLabelWidth">
          <span>{{tableData.event_service}}</span>
        </el-form-item>
        <el-form-item label="办理费用：" :label-width="formLabelWidth">
          <span>{{tableData.event_free}}元</span>
        </el-form-item>
        <el-form-item label="承诺时限：" :label-width="formLabelWidth">
          <span>{{tableData.event_deadline}}个工作日</span>
        </el-form-item>
        <el-form-item label="法定依据：" :label-width="formLabelWidth">
          <span>{{tableData.event_basis}}</span>
        </el-form-item>
        <el-form-item label="申请材料：" :label-width="formLabelWidth">
          <span>{{tableData.event_mark}}</span>
        </el-form-item>
        <el-form-item label="办理流程：" :label-width="formLabelWidth">
          <span>{{tableData.event_flow}}</span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
//  数据service接口
import { RequestServiceGuidDetail } from "../../fetch/modules/service.js";
export default {
  data() {
    return {
      tableData: {},
      formLabelWidth: "120px"
    };
  },
  created() {
    const params = this.$route.query;
    RequestServiceGuidDetail({ event_id: params.event_id }).then(res => {
      this.tableData = res;
    });
  },
  methods: {}
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
