<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="反馈内容" v-model="objSearch.q"></el-input>
        </div>
        <div class="search">
          <el-button type="primary" icon="el-icon-search" @click='searchKeyword'>搜索</el-button>
        </div>
      </div>
    </el-card>
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <div class="table-title">
          <div>
            <el-button type="danger" v-if="perm.feedbackDele == 1" plain @click="tabelDelete" :disabled="deleteMark">删除</el-button>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="编号" width="100" type="index">
          </el-table-column>
          <el-table-column label="用户账号" prop="user_nickname">
          </el-table-column>
          <el-table-column label="反馈时间" prop="update_time">
          </el-table-column>
          <el-table-column label="联系方式" prop="user_phone">
          </el-table-column>
          <el-table-column label="反馈内容" prop="feedback_content">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100" v-if="perm.feedbackAdd == 1||perm.feedbackDele == 1">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="perm.feedbackAdd == 1" @click="handEditor(scope.row)">查看</el-button>
              <el-button type="text" size="small" v-if="perm.feedbackDele == 1" @click="batchDelete(scope.row)">删除</el-button>
              <!-- <div class="el-icon-wrapper">
                <i v-if="perm.feedbackAdd == 1" class="el-icon-view" title="查看" @click="handEditor(scope.row)"></i>
                <i v-if="perm.feedbackDele == 1" class="el-icon-delete" title="删除" @click="batchDelete(scope.row)"></i>
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
    <!-- 发布添加 -->
    <el-dialog title="反馈详情" :visible.sync="releaseDialog">
      <div class="feedback-wrapper">
        <table>
          <tr>
            <td>用户账号：</td>
            <td>{{feedbackData.user_nickname}}</td>
          </tr>
          <tr>
            <td>反馈时间：</td>
            <td>{{feedbackData.update_time}}</td>
          </tr>
          <tr>
            <td>反馈内容:</td>
            <td>{{feedbackData.feedback_content}}</td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <!-- 编辑 -->
  </div>
</template>
<script>
import MoPaging from "../../components/Paginations.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
import {
  RequestFeedbackList,
  RequestFeedbackDetail,
  DeleteFeedback
} from "../../fetch/modules/questionFeedback.js";
export default {
  beforeRouteEnter(to, from, next) {
    console.log(to);
    next(vm => {
      to.meta.perm.forEach((item, index) => {
        vm.perm[item.perm_name] && (vm.perm[item.perm_name] = item.is_select); // 2-不显示 1-显示
        console.log("------- vm --", item.perm_name, item.is_select);
      });
    });
  },
  components: { MoPaging, ChooseTab },
  data() {
    return {
      perm: {
        feedbackAdd: 2, // 查看
        feedbackDele: 2 // 删除
      },
      isActive: true,
      search: "",
      value: "",
      tableData: [],
      objSearch: {
        current_page: 1,
        page_size: 10,
        q: "",
        order_time: 2
      },
      count: 0,
      // 发布编辑
      releaseDialog: false,
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      feedbackData: {
        user_nickname: "",
        feedback_content: ""
      } //反馈详情
    };
  },
  created() {
    var args = this.objSearch;
    this.getListData(args);
  },
  methods: {
    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      var args = this.objSearch;
      this.getListData(args);
    },
    //获取模块列表
    getListData(args) {
      RequestFeedbackList(args).then(res => {
        this.tableData = res.list;
        this.objSearch.current_page = Number(res.current_page);
        this.objSearch.page_size = Number(res.page_size);
        this.count = Number(res.total_num);
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
    //编辑信息
    handEditor(row) {
      const feedback_id = row.feedback_id;
      RequestFeedbackDetail({ feedback_id: feedback_id }).then(res => {
        this.feedbackData = res;
        this.releaseDialog = true;
      });
    },
    // 批量选中
    handleSelectionChange(vals) {
      if (vals.length <= 0) {
        this.deleteMark = true;
      } else {
        this.deleteMark = false;
      }
      this.selectionValues = vals;
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 批量删除
    tabelDelete() {
      var feedback_id = "";
      var selectionValues = this.selectionValues;
      for (var i = 0; i < selectionValues.length; i++) {
        feedback_id += selectionValues[i].feedback_id + ",";
      }
      // var feedback_id = this.selectionValues.join(",");
      this.deleteFn(feedback_id);
    },
    //删除
    batchDelete(row) {
      var feedback_id = row.feedback_id;
      this.deleteFn(feedback_id);
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(feedback_id) {
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          DeleteFeedback({ feedback_id: feedback_id }).then(res => {
            var args = this.objSearch;
            this.getListData(args);
            this.$Message({
              type: "success",
              text: "删除成功!"
            });
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.el-dialog__header {
  border-bottom: 1px solid #eee;
}

.el-dialog__body {
  border-top: 1px solid #eee;
}
.feedback-wrapper table {
  width: 100%;
}
.feedback-wrapper table tr td {
  line-height: 40px;
  height: 40px;
  // border-bottom: 1px solid #eee;
}
.feedback-wrapper table tr td:nth-child(1) {
  width: 100px;
  font-size: 14px;
  font-weight: bold;
}
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

