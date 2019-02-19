<template>
  <div class="info-container">

    <div v-if="!releaseDialog">
      <el-card class="box-card">
        <div class="table-list">
          <el-table :data="tableData" border style="width: 100%" ref="table" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading">
            <!-- <el-table-column
                type="selection"
                width="55" >
                </el-table-column> -->
            <el-table-column label="序号" align="center" width="100" type="index">
            </el-table-column>
            <el-table-column prop="activity_title" label="活动标题" align="center">
              <template slot-scope="scope">
                <span style="color:#409eff">
                  {{scope.row.activity_title}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="活动时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div style="margin-left: 20px;">
              <mo-paging :page-index="current_page" :total="count" :page-size="page_size" @change="pageChange">
              </mo-paging>
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
// '志愿者详情'
import { RequestActiveVolunteerDetail } from "@/fetch/modules/service.js";
let self;
export default {
  components: { MoPaging, Tinymce, ChooseTab },
  data() {
    self = this;
    return {
      tableData: [],
      current_page: 1,
      count: 0,
      page_size: 5,
      releaseDialog: false,
      loading: false,
      activity_id: this.$route.query.user_id
    };
  },
  created() {
    this.newList();
  },
  methods: {
    // 活动列表
    newList() {
      this.loading = true;
      let args = {
        user_id: this.$route.query.user_id,
        page_size: this.page_size,
        current_page: this.current_page
      };
      RequestActiveVolunteerDetail(args).then(res => {
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
      window.location.href = "api/activityAdmin/exportEnlist/" + this.activity_id + "?token=" + getToken();
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

