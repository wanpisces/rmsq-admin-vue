<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="栏目名称" v-model="objSearch.q"></el-input>
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
            <el-button type="danger" plain @click="tabelDelete" :disabled="deleteMark">删除1</el-button>
            <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
          </div>
          <div>
            <choose-tab @handleShowDliog="handleShowDliog" add-title="新增栏目" @handleAdd="releaseClick" @TimeOn="TimeOn">
            </choose-tab>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="栏目ID">
                  <span>{{ props.row.category_id }}</span>
                </el-form-item>
                <el-form-item label="栏目名称">
                  <span>{{ props.row.category_name }}</span>
                </el-form-item>
                <el-form-item label="栏目描述">
                  <span>{{ props.row.category_desc }}</span>
                </el-form-item>
                <el-form-item label="栏目类型">
                  <span>{{ props.row.category_type == 1?"资讯":"服务" }}</span>
                </el-form-item>
                <el-form-item label="发布时间">
                  <span>{{ props.row.create_time }}</span>
                </el-form-item>
                <el-form-item label="更新时间">
                  <span>{{ props.row.update_time }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="栏目名称" prop="category_name">
          </el-table-column>
          <el-table-column label="栏目描述" prop="category_desc">
          </el-table-column>
          <el-table-column label="发布时间" prop="create_time">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handEditor(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="onOfflineClick(scope.row)">{{active == 1?"停用":"启用"}}</el-button>
              <!-- <div class="el-icon-wrapper">
                <i class="el-icon-edit" @click="handEditor(scope.row)" title="编辑"></i>
                <i :class="active == 1?'icon-ban':'icon-qiyong'" @click="onOfflineClick(scope.row)" :title="active == 1?'禁用':'启用'"></i>
              </div> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="margin-left: 20px;">
            <mo-paging :page-index="objSearch.current_page" :total="count" :page-size="objSearch.page_size" @change="pageChange">
            </mo-paging>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 发布添加 -->
    <el-dialog :title="formTitle" :visible.sync="releaseDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <!-- <el-input v-model="ruleForm.category_id" typecategory_type="hidden"></el-input> -->
        <el-form-item label="栏目标题：" :label-width="formLabelWidth" prop="category_name">
          <el-input v-model="ruleForm.category_name" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="栏目类型：" :label-width="formLabelWidth" prop="category_type">
                <el-select v-model="ruleForm.category_type" placeholder="请选择服务类型">
                <el-option label="资讯" value="1"></el-option>
                </el-select>
             </el-form-item> -->
        <el-form-item label="栏目描述：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="ruleForm.category_desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序值：" :label-width="formLabelWidth">
          <el-input-number v-model="ruleForm.sort" :precision="0" controls-position="right" :min="1" :max="9999"></el-input-number>
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
import { RequestModuleList, DeleteNewsModule, RequestModuleDetail, RequestModuleEdit, RequestModuleAdd, RequestCategoryStatus } from "../../fetch/modules/info";
const rules = {
  category_name: [{ required: true, message: "请输入栏目标题", trigger: "blur" }, { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }],
  category_type: [{ required: true, message: "请选择栏目类型", trigger: "blur" }]
};
export default {
  components: { MoPaging, ChooseTab },
  data() {
    return {
      rules,
      isActive: true,
      btnMark: false, //提交form的时候按钮
      oprateStatus: 1, //1为编辑，2为添加
      primary1: "parimary",
      primary2: "",
      formTitle: "新增栏目",
      search: "",
      options: [
        {
          value: 1,
          label: "资讯"
        }
      ],
      value: "",
      tableData: [],
      objSearch: {
        current_page: 1,
        page_size: 5,
        q: "",
        order_time: 2,
        status: 1
      },
      count: 0,
      // 发布编辑
      releaseDialog: false,
      ruleForm: {
        category_id: 1,
        category_name: "",
        category_desc: "",
        category_type: 1,
        sort: ""
      },
      switchData: [{ name: "已上线", active: "1" }, { name: "已下线", active: "2" }], // 上线下线,
      active: 1,
      formLabelWidth: "120px",
      dynamicTags: [],
      editorData: [],
      // 批量选中
      selectionValues: [],
      deleteMark: true
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
    // 停用启用
    onOfflineClick(data) {
      RequestCategoryStatus({ category_id: data.category_id }).then(res => {
        var args = this.objSearch;
        this.$Message({
          type: "success",
          text: "操作成功"
        });
        this.getListData(args);
      });
    },
    //获取栏目列表
    getListData(args) {
      for (var i in args) {
        if (args[i] === "") {
          delete args[i];
        }
      }
      RequestModuleList(args).then(res => {
        console.log("res", res);
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
    // 上下线切换
    switchFn(active) {
      this.objSearch.current_page = 1;
      this.objSearch.status = active;
      this.active = active;
      this.selectionValues = [];
      var args = this.objSearch;
      this.getListData(args);
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
    // 添加
    releaseClick() {
      var ruleForm = this.ruleForm;
      for (var i in ruleForm) {
        if (i != "category_type") {
          ruleForm[i] = "";
        }
      }
      this.oprateStatus = 2;
      this.ruleForm = ruleForm;
      this.releaseDialog = true;
      this.formTitle = "新增栏目";
    },
    //编辑信息
    handEditor(row) {
      const category_id = row.category_id;
      this.formTitle = "编辑栏目";
      RequestModuleDetail({ category_id: category_id }).then(res => {
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
            RequestModuleEdit(args).then(res => {
              oprateFn(res);
            });
          } else {
            RequestModuleAdd(args).then(res => {
              if (res.code == 2000) {
                this.objSearch.current_page = 1;
              }
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
      // for(var i = 0; i<vals.length; i++) {
      //     this.selectionValues.push(vals[i].category_id);
      // }
      this.selectionValues = vals;
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
      var categoryArr = [];
      for (var i = 0; i < this.selectionValues.length; i++) {
        categoryArr.push(this.selectionValues[i].category_id);
      }

      //   return;
      this.deleteFn(categoryArr.toString());
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
      var status = this.objSearch.status;
      if (status == 1) {
        this.$alert("如需删除请先下线", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
        return false;
      }
      this.$confirm("此操作将删除选中栏目和相关资讯, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          DeleteNewsModule({ category_id: category_id }).then(res => {
            var args = this.objSearch;
            if (res.code == 2000) {
              this.$message.success(res.msg);
              this.getListData(args);
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
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

