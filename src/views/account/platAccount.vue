<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>用户：</span>
          <el-input style="width:200px" placeholder="用户账号/员工姓名" v-model="objSearch.q"></el-input>
        </div>
        <!-- <div class="search">
                    <span>输入搜索：</span>
                    <el-input style="width:200px" placeholder="职位名称" v-model="objSearch.q"></el-input>
                </div> -->
        <!-- <div class="search">
          <span>角色：</span>
          <el-select v-model="select" placeholder="角色筛选" @change="selectId">
            <el-option v-for="item in modulesOptions" :key="item.role" :label="item.role_name" :value="item.role">
            </el-option>
          </el-select>
        </div> -->
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
            <el-button v-if="perm.accountDel==1" type="danger" plain @click="tabelDelete()" :disabled="deleteMark">删除</el-button>
          </div>
          <div>
            <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->
            <choose-tab v-if="perm.accountAdd==1" @handleShowDliog="handleShowDliog" add-title="新增用户" @handleAdd="releaseClick()" @TimeOn="TimeOn">
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
                  <span>{{ props.row.admin_id }}</span>
                </el-form-item>
                <el-form-item label="账号">
                  <span>{{ props.row.admin_account }}</span>
                </el-form-item>
                <el-form-item label="员工姓名">
                  <span>{{ props.row.admin_nickname }}</span>
                </el-form-item>
                <!-- <el-form-item label="职位">
                        <span>{{ props.row.aadmin_position }}</span>
                    </el-form-item> -->
                <el-form-item label="联系方式">
                  <span>{{ props.row.admin_tel }}</span>
                </el-form-item>
                <el-form-item label="发布时间">
                  <span>{{ props.row.create_time }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="编号" width="100" type="index">
          </el-table-column>
          <el-table-column label="账号" prop="admin_account">
          </el-table-column>
          <el-table-column label="员工姓名" prop="admin_nickname">
          </el-table-column>
          <!-- <el-table-column label="职位" prop="admin_position">
          </el-table-column> -->
          <el-table-column label="联系方式" prop="admin_tel">
          </el-table-column>
          <!-- <el-table-column label="角色" prop="role_type">
            <template slot-scope="scope">
              <span v-if="scope.row.role_type == 1">超级管理员</span>
              <span v-if="scope.row.role_type == 2">编辑员</span>
              <span v-if="scope.row.role_type == 3">审核员</span>
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" label="操作" width="150" v-if="perm.accountDetail==1||perm.accountEdit==1||perm.accountDel==1">
            <template slot-scope="scope">
              <el-button v-if="perm.accountDetail==1" type="text" @click="checkDetail(scope.row)">查看</el-button>
              <el-button v-if="perm.accountEdit==1" type="text" @click="handEditor(scope.row)">编辑</el-button>
              <el-button v-if="perm.accountDel==1" type="text" @click="deleteClassfiy(scope.row)">删除</el-button>
              <!-- <div class="el-icon-wrapper">
                <i v-if="perm.accountDetail==1" class="el-icon-view" title="查看" @click="checkDetail(scope.row)"></i>
                <i v-if="perm.accountEdit==1" class="el-icon-edit" title="编辑" @click="handEditor(scope.row)"></i>
                <i v-if="perm.accountDel==1" class="el-icon-delete" title="删除" @click="deleteClassfiy(scope.row)"></i>
              </div> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="margin-left: 20px;">
            <!-- <mo-paging :page-index="objSearch.current_page" :total="total_num" :page-size="objSearch.page_size" @change="pageChange">
            </mo-paging> -->
            <el-pagination background @current-change="pageChange" :current-page.sync="objSearch.current_page" :page-size="objSearch.page_size" layout="total,prev, pager, next, jumper" :total="total_num">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import MoPaging from "../../components/Paginations.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
import { RequestPlatList, DeletePlatList } from "../../fetch/modules/account";
import { getRole, removeRole } from "@/utils/auth";
const rules = {
  name: [{ required: true, message: "请输入资讯标题", trigger: "blur" }, { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }]
};
export default {
  components: { MoPaging, ChooseTab },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      to.meta.perm.forEach((item, index) => {
        vm.perm[item.perm_name] = item.is_select;
      });
    });
  },
  data() {
    return {
      rules,
      perm: {
        accountDetail: 2,
        accountAdd: 2,
        accountEdit: 2,
        accountDel: 2
      },
      formTitle: "添加分类",
      select: "全部",
      modulesOptions: [
        {
          role: 0,
          role_name: "全部"
        },
        {
          role: 1,
          role_name: "超级管理员"
        },
        {
          role: 2,
          role_name: "编辑员"
        },
        {
          role: 3,
          role_name: "审核员"
        }
      ], //选择搜索
      value: "",
      tableData: [],
      total_num: 0,
      // 发布编辑
      releaseDialog: false,
      objSearch: {
        role: 0,
        q: "",
        order_time: 2,
        current_page: 1,
        page_size: 10
      },
      ruleForm: {
        admin_id: "",
        admin_account: "",
        admin_nickname: ""
      },
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true
    };
  },
  created() {
    const args = this.objSearch;
    this.getClassfiyList(args);
    var role_type = getRole("role_type");
  },
  methods: {
    //获取资讯分类列表
    getClassfiyList(args) {
      RequestPlatList(args).then(res => {
        this.tableData = res.list;
        this.total_num = res.total_num;
      });
    },
    //更改Id
    selectId(e) {
      this.objSearch.role = e;
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
      this.$router.push({ name: "platAdd", query: {} });
    },
    //编辑信息
    handEditor(row) {
      const admin_id = row.admin_id;
      this.$router.push({ name: "platEdit", query: { admin_id: admin_id } });
    },
    // 查看信息
    checkDetail(row) {
      const admin_id = row.admin_id;
      this.$router.push({ name: "platDetail", query: { admin_id: admin_id } });
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
      var admin_id = row.admin_id;
      this.deleteFn(admin_id);
    },
    //  批量删除
    tabelDelete() {
      const selectionValues = this.selectionValues;
      var admin_id = "";
      for (var i = 0; i < selectionValues.length; i++) {
        admin_id += selectionValues[i].admin_id + ",";
      }
      this.deleteFn(admin_id);
    },

    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(admin_id) {
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          DeletePlatList({ admin_id: admin_id }).then(res => {
            if (res.code == 2000) {
              var args = this.objSearch;
              this.getClassfiyList(args);
              this.$message.success("删除成功!");
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
  .el-icon-wrapper {
    font-size: 20px;
    color: #409eff;
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

