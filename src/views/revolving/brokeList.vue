<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="评论内容/评论者" v-model="objSearch.q"></el-input>
        </div>
        <div class="search">
          <el-button type="primary" icon="el-icon-search" @click='searchKeyword'>搜索</el-button>
        </div>
      </div>
    </el-card>
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <el-button @click="closeLink" icon="el-icon-d-arrow-left">返回随手拍</el-button>
        <div class="table-title">
          <div>
            <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
          </div>
          <div>
            <!-- <el-button type="primary" plain @click="shareSet" style="margin-right:10px;">分享设置</el-button> -->
            <choose-tab style="display: inline-block;" @handleShowDliog="handleShowDliog" @TimeOn="TimeOn">
            </choose-tab>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column label="爆料内容" width="330" prop="case_content">
            <template slot-scope="scope">
              <div class="case-title" :title="scope.row.case_content">{{scope.row.case_content}}</div>
            </template>
          </el-table-column>
          <el-table-column label="评论内容" prop="comment_content">
          </el-table-column>
          <el-table-column label="评论者" prop="user_name">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status == 2" type="text" size="small" @click="onOfflineClick(scope.row)">显示</el-button>
              <el-button v-if="scope.row.status == 1" type="text" size="small" @click="onOfflineClick(scope.row)">禁用</el-button>
              <!-- <div class="el-icon-wrapper">
                <i class="icon-qiyong" v-if="scope.row.status == 2" type="text" size="small" @click="onOfflineClick(scope.row)" title="启用"></i>
                <i class="icon-ban" v-if="scope.row.status == 1" type="text" size="small" @click="onOfflineClick(scope.row)" title="禁用"></i>
              </div> -->

            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="margin-left: 20px;">
            <!-- <mo-paging :page-index="objSearch.current_page" :total="count" :page-size="objSearch.page_size" @change="pageChange">
            </mo-paging> -->
            <el-pagination background @current-change="pageChange" :current-page.sync="objSearch.current_page" :page-size="objSearch.page_size" layout="total,prev, pager, next, jumper" :total="count">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog title="分享样式设置" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
      <el-form label-width="150px" :close-on-click-modal="false">
        <share-template :share_desc="form.share_desc" :share_pic="form.share_pic" :markBtn='true' :curTitle="curTitle" @submitForm="submitFormShare" :templateData="templateData" :theme_type="form.theme_type" @cancleForm="cancleForm"></share-template>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import MoPaging from "../../components/Paginations.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
import ShareTemplate from "@/components/ShareTemplate/index.vue";
import { RequestServiceBrokeList, RequestServiceCommentState, RequestServiceCaseIntroducationList } from "../../fetch/modules/service";
import { RequestShareActivityEdit, RequestShareTheme, RequestSspShare } from "@/fetch/modules/share.js";
export default {
  components: { MoPaging, ChooseTab, ShareTemplate },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.objSearch.service_id = to.meta.service_id;
      vm.urlLastId = to.meta.id;
      vm.getListData(vm.objSearch);
    });
  },
  data() {
    return {
      curTitle: "",
      dialogVisible: false,
      isActive: true,
      search: "",
      active: 1,
      switchData: [{ name: "正常", active: "1" }, { name: "禁用", active: "2" }],
      value: "",
      tableData: [],
      objSearch: {
        current_page: 1,
        page_size: 5,
        q: "",
        status: 1,
        order_time: 2,
        service_id: "",
        case_id: JSON.parse(this.$route.query.case_id)
      },
      count: 0,
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      form: {
        id: "",
        theme_type: 2,
        share_pic: "",
        share_desc: ""
      },
      templateData: [],
      urlLastId: ""
    };
  },
  created() {
    this.getShareTheme();
  },
  methods: {
    getShareTheme() {
      RequestShareTheme({ theme_type: 2 }).then(res => {
        this.templateData = res;
        this.form.share_pic = res[0].share_pic;
      });
    },
    cancleForm() {
      this.dialogVisible = false;
    },
    shareSet() {
      this.form.share_desc = "";
      this.form.share_pic = "";
      if (this.templateData.length > 0 && this.form.share_pic) {
        this.dialogVisible = true;
      } else {
        RequestShareTheme({ theme_type: 2 }).then(obj => {
          this.templateData = obj;
          RequestServiceCaseIntroducationList({
            service_id: this.objSearch.service_id
          }).then(res => {
            this.form.share_desc = res.data.share_desc;
            this.form.share_pic = res.data.share_pic || obj[0].share_pic;
            this.dialogVisible = true;
          });
        });
      }
    },
    submitFormShare(obj) {
      var args = {
        service_id: this.objSearch.service_id,
        theme_type: this.form.theme_type,
        share_pic: obj.share_pic,
        share_desc: obj.share_desc
      };
      RequestSspShare(args).then(res => {
        if (res.code == 2000) {
          this.dialogVisible = false;
        }
      });
    },
    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      var args = this.objSearch;
      this.getListData(args);
    },
    getListData() {
      var args = this.objSearch;
      RequestServiceBrokeList(args).then(res => {
        if (res.list.length == 0 && this.objSearch.current_page > 1) {
          this.objSearch.current_page = +this.objSearch.current_page - 1;
          this.getListData();
        } else {
          this.tableData = res.list;
          // this.objSearch.current_page = Number(res.current_page);
          // this.objSearch.page_size = Number(res.page_size);
          this.count = Number(res.total_num);
        }
      });
    },
    // 正常禁用切换
    switchFn(active) {
      this.current_page = 1;
      this.objSearch.status = active;
      this.active = active;
      var args = this.objSearch;
      this.getListData(args);
    },
    // 正常禁用操作
    onOfflineClick(data) {
      RequestServiceCommentState({ comment_id: data.comment_id }).then(res => {
        var args = this.objSearch;
        this.$Message({
          type: "success",
          text: "操作成功"
        });
        this.getListData(args);
      });
    },
    // 搜索关键词
    searchKeyword() {
      this.objSearch.current_page = 1;
      var args = this.objSearch;
      this.getListData(args);
    },
    //排序
    TimeOn(sort) {
      this.objSearch.order_time = sort;
      var args = this.objSearch;
      this.getListData(args);
    },
    // 批量选中
    handleSelectionChange(vals) {
      for (var i = 0; i < vals.length; i++) {
        this.selectionValues.push(vals[i].category_id);
      }
      if (vals.length <= 0) {
        this.deleteMark = true;
      } else {
        this.deleteMark = false;
      }
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 批量删除
    tabelDelete() {
      var category_id = "";
      for (var i = 0; i < selectionValues.length; i++) {
        category_id += selectionValues[i] + ",";
      }
      this.deleteFn(category_id);
    },
    //删除
    batchDelete(row) {
      var category_id = row.category_id;
      this.deleteFn(category_id);
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(category_id) {
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          DeleteNewsModule({ category_id: category_id }).then(res => {
            var args = this.objSearch;
            this.getListData(args);
            this.$Message({
              type: "success",
              text: "删除成功!"
            });
          });
        })
        .catch(() => {});
    },
    closeLink() {
      this.$router.push({
        path: "/revolveOne/revolveList" + this.urlLastId
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/revolveOne/brokeList" + this.urlLastId
      });
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.case-title {
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.info-container {
  margin: 30px 15px;
  font-size: 14px;
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}
</style>

