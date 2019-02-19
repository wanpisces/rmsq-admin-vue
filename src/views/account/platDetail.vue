<template>
  <div class="info-container">
    <el-card>
      <div class="info-title">用户信息</div>
      <table>
        <tr>
          <td class="bgGrey">账号</td>
          <td>{{tableData.admin_account}}</td>
          <td class="bgGrey">联系方式</td>
          <td>{{tableData.admin_tel}}</td>
        </tr>
        <tr>
          <td class="bgGrey">姓名</td>
          <td>{{tableData.admin_nickname}}</td>
          <td class="bgGrey">角色</td>
          <td>

            <span v-if="tableData.role_type == 1">超级管理员</span>
            <span v-else>{{tableData.role_name||'暂无'}}</span>
            <!-- <span v-if="tableData.role_type == 2">编辑员</span>
            <span v-if="tableData.role_type == 3">审核员</span> -->
          </td>
        </tr>
        <!-- <tr>
                <td class="bgGrey">所有权限</td>
                <td>编辑</td>
            </tr> -->
      </table>
    </el-card>
  </div>
</template>
<script>
//  数据service接口
import { RequestPlatDetail } from "../../fetch/modules/account.js";
export default {
  data() {
    return {
      tableData: {
        admin_account: "",
        admin_nickname: "",
        admin_tel: ""
      }
    };
  },
  created() {
    const query = this.$route.query;
    this.getPlatDetail(query.admin_id);
  },
  methods: {
    getPlatDetail(admin_id) {
      RequestPlatDetail({ admin_id: admin_id }).then(res => {
        this.tableData = res;
      });
    }
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
table {
  width: 100%;
  border-collapse: collapse;
}
table,
th,
td {
  padding: 20px 0 20px 15px;
  border: 1px solid #eee;
}
.bgGrey {
  background: #f6f7f9;
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
