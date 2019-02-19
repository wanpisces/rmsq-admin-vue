<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>用户：</span>
          <el-input style="width:200px" placeholder="用户账号/员工姓名" v-model="objSearch.q"></el-input>
        </div>
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="职位名称" v-model="objSearch.q"></el-input>
        </div>
        <div class="search">
          <span>角色：</span>
          <el-select v-model="select" placeholder="角色筛选" @change="selectId">
            <el-option v-for="item in modulesOptions" :key="item.category_id" :label="item.category_name" :value="item.category_id">
            </el-option>
          </el-select>
        </div>
        <div class="search">
          <el-button type="primary" icon="el-icon-search" @click="searchKeyword">搜索</el-button>
        </div>
      </div>
    </el-card>
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <div class="table-title">
          <div>
            <el-button type="danger" plain @click="tabelDelete()">删除</el-button>
          </div>
          <div>
            <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->
            <choose-tab @handleShowDliog="handleShowDliog" add-title="新增用户" @handleAdd="releaseClick()" @TimeOn="TimeOn">
            </choose-tab>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="selectionChange" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="编号">
                  <span>{{ props.row.attr_id }}</span>
                </el-form-item>
                <el-form-item label="账号">
                  <span>{{ props.row.attr_value }}</span>
                </el-form-item>
                <el-form-item label="员工姓名">
                  <span>{{ props.row.extra }}</span>
                </el-form-item>
                <el-form-item label="职位">
                  <span>{{ props.row.attr_type == 0? '属性':'自定义' }}</span>
                </el-form-item>
                <el-form-item label="联系方式">
                  <span>{{ props.row.create_time }}</span>
                </el-form-item>
                <el-form-item label="联系方式">
                  <span>{{ props.row.create_time }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="编号" width="100" prop="attr_id">
          </el-table-column>
          <el-table-column label="账号" prop="attr_value">
          </el-table-column>
          <el-table-column label="员工姓名" prop="extra">
          </el-table-column>
          <el-table-column label="职位" prop="create_time">
          </el-table-column>
          <el-table-column label="联系方式" prop="extra">
          </el-table-column>
          <el-table-column label="联系方式" prop="create_time">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="checkDetail(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="handEditor(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteClassfiy(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="margin-left: 20px;">
            <mo-paging :page-index="ruleForm.current_page" :total="total_num" :page-size="ruleForm.page_size" @change="pageChange">
            </mo-paging>
          </div>

        </div>
      </div>
    </el-card>
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
    { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
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
        page_size: 10
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
          { required: true, message: "分类名称不能为空", trigger: "blur" }
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
      selectionValues: []
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
      this.getListData(args);
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
      this.$router.push({ name: "platAdd", query: {} });
    },
    //编辑信息
    handEditor(row) {
      const role_id = row.attr_id;
      this.$router.push({ name: "platAdd", query: { role_id: role_id } });
    },
    // 查看信息
    checkDetail(row) {
      const role_id = row.attr_id;
      this.$router.push({ name: "platDetail", query: { role_id: role_id } });
    },
    // 批量选中
    selectionChange(vals) {
      this.selectionValues = vals;
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
      if (selectionValues.length == 0) {
        this.$message({
          showClose: true,
          message: "未选中任何选项！",
          type: "error"
        });
        return;
      }
      var attr_id = "";
      for (var i = 0; i < selectionValues.length; i++) {
        attr_id += selectionValues[i].attr_id + ",";
      }
      this.deleteFn(attr_id);
    },

    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(attr_id) {
      this.$confirm("是否永久删除?", "提示", {
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

