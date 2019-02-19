<template>
  <div class="info-container">

    <div v-if="!releaseDialog">
      <el-card class="box-card">
        <el-button icon="el-icon-download" type="primary" @click="handleExport" v-if="tableData.length!=0">导出</el-button>
        <el-button type="" @click="callback">返回上一级</el-button>
        <div class="table-list">
          <el-table :data="tableData" border style="width: 100%" ref="table" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading">
            <el-table-column label="姓名" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.user_realname}}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系方式" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.user_phone}}</span>
              </template>
            </el-table-column>
            <el-table-column label="身份证信息" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.user_idc}}</span>
              </template>
            </el-table-column>
            <el-table-column label="身份类型" align="center">
              <template slot-scope="scope">
                <span>{{{2:'志愿者',1:'非志愿者'}[scope.row.enlist_type]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="报名时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
            <el-table-column label="报名状态" align="center">
              <template slot-scope="scope">
                <span :style="[scope.row.audit_status==4?'color:red':scope.row.audit_status==3?'color:green':'']">{{{1:'未提审',2:'提审',3:'成功',4:'失败'}[scope.row.audit_status]}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div style="margin-left: 20px;">
              <!-- <mo-paging :page-index="current_page" :total="count" :page-size="page_size" @change="pageChange">
              </mo-paging> -->
              <el-pagination background @current-change="pageChange" :current-page.sync="current_page" :page-size="page_size" layout="total,prev, pager, next, jumper" :total="count">
              </el-pagination>
              <!-- <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="count"  @current-change="pageChange"
                    :current-page="current_page"
                    :page-size="5">
                </el-pagination> -->
            </div>

          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import MoPaging from "../../../components/Paginations.vue";
import Tinymce from "../../../components/Tinymce/index.vue";
import ChooseTab from "../../../components/ChooseTab/ChooseTab.vue";
// import SwitchTable from "../../components/Switchtable/index.vue"
// 数据service接口
import { RequestUploads } from "../../../fetch/modules/public.js";
import { RequestQiNiutoken } from "../../../fetch/tool";
import { getToken } from "../../../utils/auth.js";
// '报名列表，分类，删除'
import { RequestLookSignDetail, RequestActiveAttr, RequestActiveDelete } from "@/fetch/modules/service.js";
let self;
// 正则匹配
const rules = {
  news_title: [{ required: true, message: "请输入资讯标题", trigger: "blur" }, { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }]
};
export default {
  components: { MoPaging, Tinymce, ChooseTab },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.lastUrlId = to.meta.id;
      vm.service_id = to.meta.service_id;
      vm.newList();
    });
  },
  data() {
    self = this;
    return {
      rules,
      tableData: [],
      lastUrlId: "",
      service_id: "",
      current_page: 1,
      count: 0,
      page_size: 5,
      releaseDialog: false,
      loading: false,
      activity_id: this.$route.query.activity_id
    };
  },
  created() {},
  methods: {
    // 活动列表
    newList() {
      this.loading = true;
      let args = {
        activity_id: this.$route.query.activity_id,
        page_size: this.page_size,
        current_page: this.current_page,
        service_id: this.service_id
      };
      RequestLookSignDetail(args).then(res => {
        if (res) {
          self.tableData = res.list;
          self.count = res.total_num;
          this.loading = false;
        }
      });
    },
    // 时间切换
    timeOn(value) {
      this.search.order_time = value;
      let args = { activity_id: this.activity_id };
      this.newList(args);
    },
    // 分页选择
    pageChange(current) {
      this.current_page = current;
      this.newList();
    },
    handleExport() {
      window.location.href = "api/activityAdmin/exportEnlist/" + this.activity_id + "?token=" + getToken() + "&service_id=" + this.service_id + "&activity_id=" + this.activity_id;
    },
    callback() {
      this.$router.push("activeList" + this.lastUrlId);
      this.$store.dispatch("delVisitedViews", {
        path: "/active" + "/lookSign" + this.lastUrlId
      });
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .search-box {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .box-card {
    margin-bottom: 30px;
  }
  .search {
    //   width: 30%;
    display: flex;
    margin-right: 2%;
    align-items: center;
  }
  .table-list {
    margin: 10px 0;
  }
  .icon-font {
    font-size: 16px;
  }
  .table-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
  }
  .label-choose {
    list-style: none;
    cursor: pointer;
  }
  .table-footer {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
  .switch-btn {
    position: relative;
    width: 70px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px #dcdfe6 solid;
    outline: none;
    border-radius: 5px;
    background: #fff;
    top: 2px;
    cursor: pointer;
  }
  .active {
    background: #409eff;
    color: #fff;
  }
  .active:hover {
    opacity: 0.8;
  }
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
  .news-content {
    border: 1px #d9d9d9 solid;
    margin: 0 auto;
    // width: 80%;
    padding: 15px;
    border-radius: 5px;
  }
  .examine-btn {
    margin: 30px auto;
    text-align: center;
  }

  .img-resopnse {
    width: 100%;
    height: 100px;
  }
  @media (min-width: 1562px) and (max-width: 1920px) {
    .img-resopnse {
      width: 80%;
    }
  }

  @media (min-width: 1920px) {
    .img-resopnse {
      width: 50%;
      text-align: center;
    }
  }
}
</style>

