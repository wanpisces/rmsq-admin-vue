<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="微博名称" v-model="objSearch.q"></el-input>
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
            <el-button type="danger" plain @click="tabelDelete" :disabled="deleteMark">删除</el-button>
            <!-- <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button> -->
            <span style="color:rgb(249, 167, 167)">温馨提示：不能重复绑定相同账号</span>

          </div>

          <div style="display:flex;align-items: center">

            <div class="table-title-rigth">
              <el-button class="el-icon-circle-plus-outline title-rigth-add" @click="releaseClick" type="primary"> 新增绑定</el-button>
              <!-- <choose-tab @handleShowDliog="handleShowDliog" @TimeOn="TimeOn">
              </choose-tab> -->
            </div>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="序号" width="100" type="index">
          </el-table-column>
          <el-table-column label="微博名称" prop="screen_name">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="batchDelete(scope.row)">删除</el-button>
              <el-button type="text" size="small" @click="handAuthor(scope.row)" :disabled="scope.row.need_auth==2">{{{2:'已授权',1:'授权'}[scope.row.need_auth]}}</el-button>
              <!-- <el-button type="text" size="small" @click="handEditor(scope.row)">编辑</el-button> -->

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
  </div>
</template>
<script>
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue";
import { RequestQuestionList, RequestQuestionOnline, DeleteQuestion, RequestQuestionDetail, RequestQuestionEdit, RequestQuestionAdd } from "@/fetch/modules/questionFeedback.js";
import { RequestMpList, RequestMpDetail, RequestMpAdd, RequestMpEditor, RequestMpDelete, RequestMpState } from "@/fetch/modules/mp";
import { RequestWeiboList, RequestWeiboAuth, RequestWeiboDelete } from "@/fetch/modules/public";
const rules = {
  app_name: [{ required: true, message: "请输入公众号名称", trigger: "blur" }],
  app_id: [{ required: true, message: "请输入开发者app-id", trigger: "blur" }],
  secret: [{ required: true, message: "请输入开发者密码", trigger: "blur" }],
  type: [{ required: true, message: "请选择公众号类型" }],
  mp_id: [{ required: true, message: "请输入公众号ID" }]
};
export default {
  // beforeRouteEnter(to, from, next) {
  //   console.log(to);
  //   next(vm => {
  //     to.meta.perm.forEach((item, index) => {
  //       vm.perm[item.perm_name] && (vm.perm[item.perm_name] = item.is_select); // 2-不显示 1-显示
  //       console.log("------- vm --", item.perm_name, item.is_select);
  //     });
  //   });
  // },
  components: { ChooseTab },
  data() {
    return {
      // perm: {
      //   mpBinding: 1, // 新增绑定
      //   mpEdit: 1, // 编辑
      //   mpDele: 1, // 删除
      //   mpHelp: 1 // 帮助
      // },
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
        type: 0, // 公众号类型 1服务号 2订阅号
        status: 1
      },
      count: 0,
      // 发布编辑
      releaseDialog: false,
      ruleForm: {
        // gid: "", //	是	int	层级 group_id
        // gid: 1,
        // mp_id: "", //	是	int	公众号ID
        app_name: "", //	是	string	公众号名称
        type: 1, //	是	int	公众号类型 1服务号 2订阅号
        app_id: "", //是	string	公众号APPID
        secret: "" //	是	string	公众号SRCRET
      },
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      switchData: [{ name: "启用", active: 1 }, { name: "禁用", active: 2 }],
      active: 1,
      dialogTableVisible: false
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
      if (args.type == 0) {
        delete args.type;
      }
      RequestWeiboList(args).then(res => {
        if (res.code === 2000) {
          this.tableData = res.data.list;
          this.objSearch.current_page = Number(res.data.current_page);
          this.objSearch.page_size = Number(res.data.page_size);
          this.count = Number(res.data.total_num);
        }
      });
    },
    // 微博授权
    handAuthor(row) {
      if (this.$route.query.id == 2) {
        // RequestWeiboAuth({ uid: row.uid }).then(res => {
        //   console.log(res);
        //   if (res.weiboAuthUrl) {
        //     // let authWin = window.open(res.weiboAuthUrl, "_blank", "width=600,height=400,left=500,top=300", false);
        //     // authWin.location = res.weiboAuthUrl;
        //     // window.href = res.weiboAuthUrl;
        //   }
        // });
        RequestWeiboAuth({ uid: row.uid }).then(res => {
          if (res.code == 2000) {
            if (res.data.weiboAuthUrl) {
              // let authWin = window.open(res.weiboAuthUrl, "_blank", "width=600,height=400,left=500,top=300", false);
              // authWin.location = res.weiboAuthUrl;
              window.location.href = res.data.weiboAuthUrl;
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      }
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
    questionDetail(mp_id) {
      RequestQuestionDetail({ mp_id, mp_id }).then(res => {
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
      this.current_page = 1;
      this.objSearch.status = active;
      this.active = active;
      this.getListData({ status: JSON.parse(active) });
    },
    // 上下线
    handleOnline(mp_id) {
      RequestQuestionOnline({ mp_id }).then(res => {
        this.getListData({});
      });
    },
    // 添加
    releaseClick() {
      let _this = this;
      // this.ruleForm = {
      //   // gid: 1,
      //   // mp_id: "", //	是	int	公众号ID
      //   app_name: "", //	是	string	公众号名称
      //   type: 1, //	是	int	公众号类型 1服务号 2订阅号
      //   app_id: "", //是	string	公众号APPID
      //   secret: "" //	是	string	公众号SRCRET
      // };
      // this.oprateStatus = 2;
      // this.releaseDialog = true;
      // this.formTitle = "新增绑定";
      // if (this.$route.query.id == 2) {
      RequestWeiboAuth({}).then(res => {
        console.log(res);
        if (res.code == 2000) {
          if (res.data.weiboAuthUrl) {
            // let authWin = window.open(res.weiboAuthUrl, "_blank", "width=600,height=400,left=500,top=300", false);
            // authWin.location = res.weiboAuthUrl;
            window.location.href = res.data.weiboAuthUrl;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
      // }
    },
    //编辑信息
    handEditor(row) {
      const mp_id = row.mp_id;
      this.formTitle = "编辑绑定";
      RequestMpDetail({ mp_id: mp_id }).then(res => {
        if (res.code == 2000) {
          res.data.type = Number(res.data.type);
          this.ruleForm = Object.assign(this.ruleForm, res.data);
          this.oprateStatus = 1;
          this.releaseDialog = true;
        }
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
            RequestMpEditor(args).then(res => {
              oprateFn(res);
            });
          } else {
            RequestMpAdd(args).then(res => {
              oprateFn(res);
            });
          }
          function oprateFn(res) {
            _this.resetForm("ruleForm");
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
                text: res.msg
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
      for (var i = 0; i < vals.length; i++) {
        this.selectionValues.push(vals[i].weibo_id);
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
      if (this.selectionValues.length == 0) {
        this.$message({
          showClose: true,
          message: "未选中任何选项！",
          type: "error"
        });
        return;
      }
      // var mp_id = "";
      // for (var i = 0; i < this.selectionValues.length; i++) {
      //   mp_id += this.selectionValues[i] + ",";
      // }
      this.deleteFn(this.selectionValues);
    },
    //删除
    batchDelete(row) {
      let _arr = [];
      _arr.push(row.weibo_id);
      this.deleteFn(_arr);
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(arr) {
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestWeiboDelete({ weibo_id: arr }).then(res => {
            var args = this.objSearch;

            if (res.code == 2000) {
              this.getListData(args);
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.releaseDialog = false;
    },
    handleClose() {
      this.resetForm("ruleForm");
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
.el-icon-wrapper {
  font-size: 20px;
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
.table-title-rigth {
  display: flex;
  justify-content: space-between;

  .title-rigth-add {
    margin-right: 10px;
  }
}
</style>

