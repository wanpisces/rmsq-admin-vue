<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="问题名称" v-model="objSearch.q"></el-input>
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
            <el-button type="danger" v-if="perm.questionDele == 1" plain @click="tabelDelete" :disabled="deleteMark">删除</el-button>
            <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
          </div>
          <div class="table-title-rigth">
            <el-button v-if="perm.questionAdd == 1" class="el-icon-circle-plus-outline title-rigth-add" @click="releaseClick" type="primary"> 新增问题</el-button>
            <choose-tab @handleShowDliog="handleShowDliog" @TimeOn="TimeOn">
            </choose-tab>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="编号" width="100" type="index">
          </el-table-column>
          <el-table-column label="问题名称" prop="question_content">
            <template slot-scope="scope">
              <div v-if="perm.questionDetail == 1" class="question_content" @click="questionDetail(scope.row.question_id)"> {{scope.row.question_content }} </div>
              <div v-else> {{scope.row.question_content }} </div>
            </template>
          </el-table-column>
          <el-table-column :label="labelTitle" prop="update_time">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" v-if="perm.questionCancel == 1||perm.questionOut == 1||perm.questionEdit == 1||perm.questionDele == 1">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.status==1&&perm.questionCancel == 1" @click="handleOnline(scope.row.question_id)">取消发布</el-button>
              <el-button type="text" size="small" v-if="scope.row.status!=1&&perm.questionOut == 1" @click="handleOnline(scope.row.question_id)"> 发布问题 </el-button>
              <el-button v-if="perm.questionEdit == 1" type="text" size="small" @click="handEditor(scope.row)">编辑</el-button>
              <el-button v-if="perm.questionDele == 1" type="text" size="small" @click="batchDelete(scope.row)">删除</el-button>
              <!-- <div class="el-icon-wrapper">
                <span v-if="scope.row.status==1">
                  <i v-if="perm.questionCancel == 1" class="icon-quxiaofabu" @click="handleOnline(scope.row.question_id)" title="取消发布"></i>
                </span>
                <span v-else>
                  <i v-if="perm.questionOut == 1" class="icon-fabu" @click="handleOnline(scope.row.question_id)" title="发布问题"></i>
                </span>

                <i v-if="perm.questionEdit == 1" class="el-icon-edit" @click="handEditor(scope.row)" title="编辑"></i>

                <i v-if="perm.questionDele == 1" class="el-icon-delete" title="删除" @click="batchDelete(scope.row)"></i>
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
    <el-dialog title="问题详情" :visible.sync="detailDialog">
      <div class="detail-wrapper">
        <h1>{{questionData.question_content}}</h1>
        <p>{{questionData.question_reply}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <!-- 发布添加 -->
    <el-dialog :title="formTitle" :visible.sync="releaseDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-input v-model="ruleForm.question_id" type="hidden"></el-input>
        <el-form-item label="问题名称：" :label-width="formLabelWidth" prop="question_content">
          <el-input v-model="ruleForm.question_content" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题答案：" :label-width="formLabelWidth" prop="question_reply">
          <el-input class="textarea-wrapper" type="textarea" v-model="ruleForm.question_reply" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序值：" :label-width="formLabelWidth">
          <el-input-number v-model="ruleForm.sort" controls-position="right" :min="1" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="releaseDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="btnMark">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
  </div>
</template>
<script>
import MoPaging from "../../components/Paginations.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
import {
  RequestQuestionList,
  RequestQuestionOnline,
  DeleteQuestion,
  RequestQuestionDetail,
  RequestQuestionEdit,
  RequestQuestionAdd
} from "../../fetch/modules/questionFeedback.js";
const rules = {
  question_content: [
    { required: true, message: "请输入问题名称", trigger: "blur" }
  ],
  question_reply: [
    { required: true, message: "请输入问题回复", trigger: "blur" }
  ]
};
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
        questionAdd: 2, // 新增
        questionDetail: 2, // 查看
        questionEdit: 2, // 编辑
        questionDele: 2, // 删除
        questionOut: 2, // 发布
        questionCancel: 2 // 取消发布
      },
      rules,
      isActive: true,
      questionData: {}, //问题详情
      detailDialog: false, //问题描述
      labelTitle: "上线时间",
      btnMark: false, //提交form的时候按钮
      oprateStatus: 1, //1为编辑，2为添加
      primary1: "parimary",
      primary2: "",
      formTitle: "问题添加",
      value: "",
      tableData: [],
      objSearch: {
        current_page: 1,
        page_size: 10,
        q: "",
        order_time: 2,
        status: 1
      },
      count: 0,
      // 发布编辑
      releaseDialog: false,
      ruleForm: {
        question_id: "",
        question_reply: "",
        question_content: "",
        sort: ""
      },
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      switchData: [
        { name: "已上线", active: "1" },
        { name: "已下线", active: "2" }
      ], // 上线下线,
      active: 1
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
      RequestQuestionList(args).then(res => {
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
    //问题详情
    questionDetail(question_id) {
      RequestQuestionDetail({ question_id, question_id }).then(res => {
        this.questionData = res;
        this.detailDialog = true;
      });
    },
    // 上下线切换
    switchFn(active) {
      if (active == 1) {
        this.labelTitle = "上线时间";
      } else if (active == 2) {
        this.labelTitle = "下线时间";
      }
      this.selectionValues = [];
      this.objSearch.status = active;
      this.objSearch.current_page = 1;
      this.active = active;
      this.getListData(this.objSearch);
    },
    // 上下线
    handleOnline(question_id) {
      RequestQuestionOnline({ question_id }).then(res => {
        var args = this.objSearch;
        this.getListData(args);
      });
    },
    // 添加
    releaseClick() {
      var ruleForm = this.ruleForm;
      for (var i in ruleForm) {
        ruleForm[i] = "";
      }
      this.oprateStatus = 2;
      this.ruleForm = ruleForm;
      this.releaseDialog = true;
      this.formTitle = "问题添加";
    },
    //编辑信息
    handEditor(row) {
      const question_id = row.question_id;
      this.formTitle = "问题编辑";
      RequestQuestionDetail({ question_id: question_id }).then(res => {
        for (var i in res) {
          for (var j in this.ruleForm) {
            if (i == j) {
              this.ruleForm[j] = res[i];
            }
          }
        }
        (this.oprateStatus = 1), (this.releaseDialog = true);
      });
    },
    //编辑,保存
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnMark = true;
          var args = this.ruleForm;
          if (this.oprateStatus == 1) {
            RequestQuestionEdit(args).then(res => {
              oprateFn(res);
            });
          } else {
            RequestQuestionAdd(args).then(res => {
              oprateFn(res);
            });
          }
          function oprateFn(res) {
            _this.releaseDialog = false;
            _this.btnMark = false;
            if (res.code == 2000) {
              _this.$Message({
                type: "success",
                text: "操作成功"
              });
              _this.getListData(_this.objSearch);
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
      // console.log(this.selectionValues);
      var question_id = "";
      var selectionValues = this.selectionValues;
      for (var i = 0; i < selectionValues.length; i++) {
        question_id += selectionValues[i].question_id + ",";
      }
      this.deleteFn(question_id);
    },
    //删除
    batchDelete(row) {
      var question_id = row.question_id;
      this.deleteFn(question_id);
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(question_id) {
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          DeleteQuestion({ question_id: question_id }).then(res => {
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
// .textarea-wrapper .el-textarea__inner{
//     min-height: 250px!important;
// }
.question_content {
  cursor: pointer;
  color: #409eff;
}
.detail-wrapper h1 {
  font-size: 24px;
  text-align: center;
}
.detail-wrapper p {
  font-size: 16px;
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
  .table-title-rigth {
    display: flex;
    justify-content: space-between;

    .title-rigth-add {
      margin-right: 10px;
    }
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

