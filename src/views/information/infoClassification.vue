<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="分类名称" v-model="objSearch.q"></el-input>
        </div>
        <div class="search">
          <span>资讯模块：</span>
          <el-select v-model="select" placeholder="请选择资讯模块" @change="selectId">
            <el-option v-for="item in modulesOptions" :key="item.category_id" :label="item.category_name" :value="item.category_id">
            </el-option>
          </el-select>
        </div>
        <div class="search ">
          <el-button type="primary" icon="el-icon-search" @click="searchKeyword">搜索</el-button>
        </div>
      </div>
    </el-card>
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <div class="table-title">
          <div>
            <el-button type="danger" plain @click="tabelDelete" :disabled="deleteMark">删除</el-button>
          </div>
          <div>
            <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->
            <choose-tab @handleShowDliog="handleShowDliog" add-title="添加分类" @handleAdd="releaseClick()" @TimeOn="TimeOn">
            </choose-tab>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="selectionChange" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <!-- <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="分类ID">
                  <span>{{ props.row.attr_id }}</span>
                </el-form-item>
                <el-form-item label="分类名称">
                  <span>{{ props.row.attr_value }}</span>
                </el-form-item>
                <el-form-item label="类型">
                  <span>{{ props.row.extra }}</span>
                </el-form-item>
                <el-form-item label="分类描述">
                  <span>{{ props.row.attr_type == 0? '属性':'自定义' }}</span>
                </el-form-item>
                <el-form-item label="发布时间">
                  <span>{{ props.row.create_time }}</span>
                </el-form-item>
                <el-form-item label="更新时间">
                  <span>{{ props.row.create_time }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column> -->
          <!-- <el-table-column
                label="分类ID"
                width="100"
                prop="attr_id">
                </el-table-column> -->
          <el-table-column label="分类名称" prop="attr_value">
          </el-table-column>
          <el-table-column label="分类描述" prop="extra">
          </el-table-column>
          <el-table-column label="发布时间" prop="create_time">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteClassfiy(scope.row)">删除</el-button>
              <el-button type="text" size="small" @click="handEditor(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="margin-left: 20px;">
            <mo-paging :page-index="objSearch.current_page" :total="total_num" :page-size="objSearch.page_size" @change="pageChange">
            </mo-paging>
          </div>

        </div>
      </div>
    </el-card>
    <!-- 发布添加 -->
    <el-dialog :title="formTitle" :visible.sync="releaseDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="分类标题：" :label-width="formLabelWidth" prop="attr_value">
          <el-input v-model="ruleForm.attr_value" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属分组：" :label-width="formLabelWidth" prop="category_id">
          <el-select v-model="ruleForm.category_id" placeholder="请选择分组">
            <el-option v-for="(item, index) in modulesOptions" :key="item.category_id" :label="item.category_name" :value="item.category_id" v-if="index>0">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类描述：" :label-width="formLabelWidth" prop="extra">
          <el-input v-model="ruleForm.extra" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="releaseDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
  </div>
</template>

<script>
import MoPaging from "../../components/Paginations.vue";
import Tinymce from "../../components/Tinymce/index.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
import {
  RequestClassfiyList,
  RequestModuleList,
  DeleteNewsClassfiy,
  RequestClassfiyEdit,
  RequestClassfiyAdd,
  RequestClassfiyDetail
} from "../../fetch/modules/info";
const rules = {
  name: [
    { required: true, message: "请输入资讯标题", trigger: "blur" },
    { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }
  ]
};
export default {
  components: { MoPaging, ChooseTab },
  data() {
    return {
      rules,
      formTitle: "添加分类",
      select: "全部",
      modulesOptions: [], //选择搜索
      value: "",
      tableData: [],
      total_num: 0,
      // 发布编辑
      releaseDialog: false,
      objSearch: {
        category_id: 0,
        pid: 0,
        q: "",
        order_time: 2,
        current_page: 1,
        page_size: 5
      },
      ruleForm: {
        category_id: "",
        attr_id: "",
        attr_value: "",
        extra: "",
        pid: 0
      },
      rules: {
        attr_value: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        extra: [
          { required: true, message: "额外信息不能为空", trigger: "blur" }
        ],
        category_id: [
          { required: true, message: "请选择分类", trigger: "blur" }
        ]
      },
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true
    };
  },
  created() {
    this.getListData();
    const args = this.objSearch;
    this.getClassfiyList(args);
  },
  methods: {
    //获取栏目id
    getListData() {
      return new Promise((resolve, reject) => {
        RequestModuleList({}).then(res => {
          this.modulesOptions = [
            { category_id: 0, category_name: "全部" }
          ].concat(res.list);
        });
      });
    },
    //获取资讯分类列表
    getClassfiyList(args) {
      RequestClassfiyList(args).then(res => {
        this.tableData = res.list;
        this.total_num = res.total_num;
      });
    },
    //更改Id
    selectId(e) {
      this.objSearch.category_id = e;
      // var args = this.objSearch;
      // this.getClassfiyList(args);
    },
    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      var args = this.objSearch;
      this.getClassfiyList(args);
    },
    // 搜索关键词
    searchKeyword() {
      this.objSearch.current_page = 1;
      var args = this.objSearch;
      this.getClassfiyList(args);
    },
    //排序
    TimeOn(sort) {
      this.objSearch.order_time = sort;
      var args = this.objSearch;
      this.getClassfiyList(args);
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
      this.formTitle = "分类添加";
    },
    //编辑信息
    handEditor(row) {
      const attr_id = row.attr_id;
      this.formTitle = "分类编辑";
      RequestClassfiyDetail({ attr_id: attr_id }).then(res => {
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
            RequestClassfiyEdit(args).then(res => {
              oprateFn(res);
            });
          } else {
            RequestClassfiyAdd(args).then(res => {
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
              _this.getClassfiyList(_this.objSearch);
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
    selectionChange(vals) {
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
    //删除
    deleteClassfiy(row) {
      var attr_id = row.attr_id;
      this.deleteFn(attr_id);
    },
    //  批量删除
    tabelDelete() {
      const selectionValues = this.selectionValues;
      var attr_id = "";
      for (var i = 0; i < selectionValues.length; i++) {
        attr_id += selectionValues[i].attr_id + ",";
      }
      this.deleteFn(attr_id);
    },
    // 获取分类详情
    checkDetail(data) {
      this.dialogClassfiy = true;
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(attr_id) {
      this.$confirm("此操作将删除选中分类和相关资讯, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          DeleteNewsClassfiy({ attr_id: attr_id }).then(res => {
            var args = this.objSearch;
            this.getClassfiyList(args);
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
  hr {
    color: #eee;
    background: #eee;
  }
  .detail-title {
    text-align: center;
    font-size: 26px;
    color: #353535;
  }
  .small-text {
    padding-right: 15px;
    text-align: right;
    font-size: 14px;
    color: #5d5d5d;
  }
  .detail-text {
    margin-top: 30px;
    text-indent: 25px;
    font-size: 16px;
    line-height: 28px;
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

