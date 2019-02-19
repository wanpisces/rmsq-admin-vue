<template>
  <div class="info-container">
    <!-- <el-card class="box-card">
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
                        <el-option v-for="item in modulesOptions" :key="item.role" :label="item.role_name" :value="item.role">
                        </el-option>
                    </el-select>
                </div>
                <div class="search">
                    <el-button type="primary" icon="el-icon-search" @click="searchKeyword">搜索</el-button>
                </div>
            </div>
        </el-card> -->
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <div class="table-title">
          <div>
            <el-button v-if="perm.roleDele==1" type="danger" plain @click="tabelDelete()" :disabled="deleteMark">删除</el-button>
          </div>
          <div>
            <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->
            <choose-tab v-if="perm.roleAdd==1" @handleShowDliog="handleShowDliog" add-title="新增角色" @handleAdd="addOperate" @TimeOn="TimeOn">
            </choose-tab>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="selectionChange" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="编号" width="100" type="index">
          </el-table-column>
          <el-table-column label="角色名称" prop="role_name">
          </el-table-column>
          <el-table-column label="角色描述" prop="role_mark">
            <template slot-scope="scope">
              <p class="word_wrap">{{scope.row.role_mark}}</p>
            </template>
          </el-table-column>
          <el-table-column label="用户列表" prop="role_user">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="220" v-if="perm.roleAuth==1||perm.roleUser==1||perm.roleEdit==1||perm.roelCopy==1||perm.roleDele==1">
            <template slot-scope="scope">
              <el-button type="text" v-if="perm.roleAuth==1" size="small" @click="checkLimitsDetail(scope.row)">权限</el-button>
              <el-button type="text" size="small" v-if="perm.roleUser==1" @click="memberMaintain(scope.row)">成员</el-button>
              <el-button type="text" size="small" v-if="perm.roleEdit==1" @click="editOperate(scope.row)">编辑</el-button>
              <el-button type="text" size="small" v-if="perm.roelCopy==1" @click="copyOperate(scope.row)">复制</el-button>
              <el-button type="text" size="small" v-if="perm.roleDele==1" @click="deleteBtn(scope.row)">删除</el-button>

              <!-- <i class="el-icon-view" title="查看" @click="checkDetail(scope.row)"></i> -->
              <!-- <div class="el-icon-wrapper">
      
                <i v-if="perm.roleAuth==1" class="el-icon-goods" title="权限维护" @click="checkLimitsDetail(scope.row)"></i>
                <i v-if="perm.roleUser==1" class="icon-chengyuanweihu" title="成员管理" @click="memberMaintain(scope.row)">111</i>
                <i v-if="perm.roleEdit==1" class="el-icon-edit" title="编辑角色" @click="editOperate(scope.row)"></i>
                <i v-if="perm.roelCopy==1" class="icon-fuzhi" title="复制角色" @click="copyOperate(scope.row)"></i>
                <i v-if="perm.roleDele==1" class="el-icon-delete" title="删除" @click="deleteBtn(scope.row)"></i>
              </div> -->
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
    <el-dialog title="新增角色" :visible.sync="roleVisible" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="role_name">
          <el-input v-model="ruleForm.role_name" auto-complete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" :label-width="formLabelWidth" prop="role_mark">
          <el-input v-model="ruleForm.role_mark" type="textarea" auto-complete="off" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRole('ruleForm')">保存</el-button>
        <!-- <el-button type="danger" @click="roleVisible = false">设为默认分组</el-button> -->
      </span>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="editVisible" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="role_name">
          <el-input v-model="ruleForm.role_name" auto-complete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" :label-width="formLabelWidth" prop="role_mark">
          <el-input v-model="ruleForm.role_mark" type="textarea" auto-complete="off" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="EditRole('ruleForm')">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="复制角色" :visible.sync="copyVisible" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="role_name">
          <el-input v-model="ruleForm.role_name" auto-complete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" :label-width="formLabelWidth" prop="role_mark">
          <el-input v-model="ruleForm.role_mark" type="textarea" auto-complete="off" placeholder="请输入角色描述"></el-input>
        </el-form-item>
        <el-form-item label="选项：" :label-width="formLabelWidth">
          <el-checkbox v-model="copy_menu" @change="copyMenu">复制菜单</el-checkbox>
          <el-checkbox v-model="copy_perm" @change="copyPerm">复制操作</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="copyRole('ruleForm')">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="成员维护" :visible.sync="memberVisible" width="50%">
      <el-container>
        <el-main class="member-main-wrap">
          <div style="height:20px;"></div>
          <el-form label-width="120px">
            <el-form-item label="组内用户">
              <el-checkbox-group v-model="select_list">
                <el-checkbox v-for="(item,index) in memberData.select_list" :key="index" :label="item.uid">{{item.nickname}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="组外用户" label-width="120px">
              <el-checkbox-group v-model="not_select_list">
                <el-checkbox v-for="(item,index) in memberData.not_select_list" :key="index" :label="item.uid">{{item.nickname}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="memberEdit">确定</el-button>
              <el-button @click="memberVisible = false;">取消</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import MoPaging from "../../components/Paginations.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
import {
  RequestRoleList,
  RequestRoleAdd,
  RequestRoleEdit,
  RequestRoleCopy,
  RequestRoleDelete,
  RequestRoleUser,
  RequestRoleUserAdd
} from "../../fetch/modules/account";
import { getRole, removeRole } from "@/utils/auth";
const rules = {
  role_name: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
  ],
  role_mark: [{ required: true, message: "请输入角色描述", trigger: "blur" }]
};
export default {
  components: { MoPaging, ChooseTab },
  beforeRouteEnter(to, from, next) {
    console.log("to", to);
    next(vm => {
      to.meta.perm.forEach((item, index) => {
        vm.perm[item.perm_name] = item.is_select;
      });
      console.log(vm.perm);
    });
  },
  data() {
    return {
      perm: {
        roleAdd: 1,
        roleEdit: 1,
        roleDele: 1,
        roleAuth: 1,
        roleUser: 1,
        roelCopy: 1
      },
      rules,
      roleVisible: false,
      memberVisible: false,
      editVisible: false,
      copyVisible: false,
      copy_perm: false, //是否复制权限
      copy_menu: false,
      ruleForm: {
        role_id: "",
        role_name: "",
        role_mark: ""
      },
      role_id: "",
      not_select_list: [],
      select_list: [],
      value: "",
      tableData: [],
      total_num: 0,
      // 发布编辑
      releaseDialog: false,
      objSearch: {
        q: "",
        order_time: 2,
        current_page: 1,
        page_size: 10
      },
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      memberData: {}
    };
  },
  created() {
    const args = this.objSearch;
    this.getDataList(args);
    // var role_type = getRole("role_type");
  },
  methods: {
    //获取资讯分类列表
    getDataList(args) {
      for (const key in args) {
        // 去除对象内多余的空值key
        if (args[key] === "") {
          delete args[key];
        }
      }
      RequestRoleList(args).then(res => {
        this.tableData = res.list;
        this.total_num = res.total_num;
      });
    },
    memberMaintain(row) {
      this.role_id = row.role_id;
      RequestRoleUser({ role_id: row.role_id }).then(res => {
        this.select_list = [];
        this.not_select_list = [];
        for (let i = 0; i < res.select_list.length; i++) {
          this.select_list.push(res.select_list[i].uid);
        }
        this.memberVisible = true;
        this.memberData = res;
      });
    },
    memberEdit() {
      var args = {
        role_id: this.role_id
      };
      var role_user = {
        add: [],
        cancel: []
      };
      role_user.add = this.not_select_list;
      let sListOld = this.memberData.select_list;
      let sList = this.select_list;
      for (let i = 0; i < sList.length; i++) {
        for (let j = 0; j < sListOld.length; j++) {
          if (sListOld[j].uid == sList[i]) {
            sListOld.splice(j, 1);
          }
        }
      }
      for (let i = 0; i < sListOld.length; i++) {
        role_user.cancel.push(sListOld[i].uid);
      }
      args.role_user = JSON.stringify(role_user);
      RequestRoleUserAdd(args).then(res => {
        if (res.code == 2000) {
          const args = this.objSearch;
          this.getDataList(args);
          this.memberVisible = false;
        }
      });
    },
    //添加操作
    addOperate() {
      this.roleVisible = true;
      this.ruleForm = {
        role_id: "",
        role_name: "",
        role_mark: ""
      };
    },
    //角色添加
    addRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var args = this.ruleForm;
          for (var i in args) {
            if (args[i] === "") {
              delete args[i];
            }
          }
          RequestRoleAdd(args).then(res => {
            // oprateFn(res);
            const args = this.objSearch;
            this.roleVisible = false;
            this.getDataList(args);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加操作
    editOperate(row) {
      this.editVisible = true;
      this.ruleForm = {
        role_id: row.role_id,
        role_name: row.role_name,
        role_mark: row.role_mark
      };
    },
    //角色编辑
    EditRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var args = this.ruleForm;
          for (var i in args) {
            if (args[i] === "") {
              delete args[i];
            }
          }
          RequestRoleEdit(args).then(res => {
            if (res.code == 2000) {
              const args = this.objSearch;
              this.getDataList(args);
              this.editVisible = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    copyOperate(row) {
      this.copyVisible = true;
      this.copy_perm = false;
      this.copy_menu = false;
      this.ruleForm = {
        role_id: row.role_id,
        role_name: row.role_name,
        role_mark: row.role_mark
      };
    },
    copyPerm(e) {
      if (e) {
        this.copy_menu = true;
      }
    },
    //角色复制
    copyRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var args = this.ruleForm;
          args.copy_perm = this.copy_perm ? 1 : 2;
          args.copy_menu = this.copy_menu ? 1 : 2;
          for (var i in args) {
            if (args[i] === "") {
              delete args[i];
            }
          }
          RequestRoleCopy(args).then(res => {
            if (res.code == 2000) {
              const args = this.objSearch;
              this.getDataList(args);
              this.copyVisible = false;
              this.copy_perm = 2;
              this.copy_menu = 2;
            }
          });
        } else {
          return false;
        }
      });
    },
    //是否复制权限
    copyLimits(mark) {
      // console.log(e);
      var copy_perm = 2;
      if (mark) {
        copy_perm = 1;
      } else {
        copy_perm = 2;
      }
      this.copy_perm = copy_perm;
    },
    copyMenu(mark) {
      if (!mark) {
        this.copy_perm = false;
      }
    },
    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      var args = this.objSearch;
      this.getDataList(args);
    },
    // 搜索关键词
    searchKeyword() {
      this.objSearch.current_page = 1;
      var args = this.objSearch;
      this.getDataList(args);
    },
    //排序
    TimeOn(sort) {
      this.objSearch.order_time = sort;
      var args = this.objSearch;
      this.getDataList(args);
    },
    // 添加
    releaseClick() {
      //   this.$router.push({ name: "platAdd", query: {} });
    },
    //编辑信息
    handEditor(row) {
      const role_id = row.role_id;
      this.$router.push({ name: "platEdit", query: { role_id: role_id } });
    },
    // 查看信息
    checkDetail(row) {
      const role_id = row.role_id;
      this.$router.push({ name: "platDetail", query: { role_id: role_id } });
    },
    checkLimitsDetail(row) {
      const role_id = row.role_id;
      this.$router.push({
        name: "roleLimitsDetail",
        query: { role_id: role_id }
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
    deleteBtn(row) {
      var role_id = row.role_id;
      this.deleteFn(role_id);
    },
    //  批量删除
    tabelDelete() {
      const selectionValues = this.selectionValues;
      var role_id = [];
      for (var i = 0; i < selectionValues.length; i++) {
        role_id.push(selectionValues[i].role_id);
      }
      this.deleteFn(role_id);
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(role_id) {
      this.$confirm("您确定要删除角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestRoleDelete({ role_id: role_id }).then(res => {
            var args = this.objSearch;
            this.getDataList(args);
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
  .member-checked-wrap {
    padding: 20px 25px 50px;
  }
  .el-checkbox {
    margin-bottom: 8px;
  }
  .member-btn-foooter {
    position: absolute;
    bottom: 10px;
    right: 25px;
  }
  .title-wrap {
    background: #409eff;
    color: #fff;
    text-align: center;
    height: 35px;
    line-height: 35px;
  }
  .aside-item {
    padding: 15px 5px;
    text-align: center;
    border-bottom: 1px solid #ebeef5;
  }
  .el-aside {
    border: 1px solid #ebeef5;
    border-right: none;
  }

  .el-main {
    padding: 0;
    border: 1px solid #ebeef5;
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

