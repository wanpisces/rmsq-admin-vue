<template>
  <div class="info-container">
    <el-card>
      <div class="info-title">基本信息</div>
      <table>
        <tr>
          <td class="bgGrey">账号</td>
          <td>{{tableData.admin_account}}</td>
          <td class="bgGrey">联系方式</td>
          <td>{{tableData.admin_tel}}</td>
        </tr>
        <tr>
          <td class="bgGrey">单位名称</td>
          <td>{{tableData.group_name}}</td>
          <td class="bgGrey">单位地址</td>
          <td>{{tableData.group_location}}</td>
        </tr>
        <tr>
          <td class="bgGrey">行政级别</td>
          <td>{{{'1':'社区','2':'街道','3':'区','4':'市','5':'省'}[tableData.group_type]}}</td>
          <td class="bgGrey">行政Id</td>
          <td>
            <span>{{tableData.group_id}}</span>
          </td>
        </tr>
        <tr>
          <td class="bgGrey">接入链接</td>
          <td>
            <span>{{tableData.wechat_connect_wxapp_link}}</span>
          </td>
        </tr>
        <tr>
          <td class="bgGrey">所有服务</td>
          <td>
            <span v-for="(item,index) in serviceArr" :key="index" style="margin-right:15px;">{{item}}</span>
          </td>
        </tr>
      </table>
    </el-card>
  </div>
</template>
<script>
//  数据service接口
// import {RequestNewsAdd, RequestModuleList, RequestClassfiyList } from  "../../fetch/modules/info.js";
// import { RequestUploads } from  "../../fetch/modules/public.js";
// import { RequestQiNiutoken } from '../../fetch/tool'
import {
  RequestCustomerDetail,
  RequestPublicService
} from "@/fetch/modules/account";
export default {
  data() {
    return {
      tableData: [],
      serviceArr: []
    };
  },
  created() {
    const query = this.$route.query;
    this.getList({ admin_id: query.admin_id });
  },
  methods: {
    getList(obj) {
      RequestCustomerDetail(obj).then(res => {
        if (res) {
          this.tableData = res;
        }
        var service = res.service;
        RequestPublicService().then(obj => {
          var serviceArr = [];
          for (var i = 0; i < service.length; i++) {
            for (var j = 0; j < obj.length; j++) {
              var serviceChild = obj[j].list;
              for (var n = 0; n < serviceChild.length; n++) {
                if (service[i] == serviceChild[n].service_id) {
                  serviceArr.push(serviceChild[n].service_title);
                }
              }
            }
          }
          this.serviceArr = serviceArr;
        });
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
