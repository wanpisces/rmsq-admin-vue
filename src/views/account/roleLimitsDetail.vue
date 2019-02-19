<template>
  <div class="info-container">
    <!-- <el-card class="box-card">
            <div>平台权限设置</div>
        </el-card> -->
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="功能模块" width="200px;">
            <template slot-scope="scope">
              <el-checkbox type="index" @change="handleCheckAllChange(scope.row)" v-model="scope.row.checked" :checked="scope.row.is_select == 1?true:false" :label="scope.row">{{scope.row.menu_name}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="方法">
            <template slot-scope="scope">
              <div v-if="scope.row.perm_list.length==0">
                <div class="row-item" v-for="(item,index) in scope.row.menu_childs" :key="index">
                  <el-checkbox :checked="item.is_select == 1?true:false" v-model="item.checked" :label="item" @change="checkChange(scope.row,item)">{{item.menu_name}}</el-checkbox>
                  <div class="btn-wrapper">
                    <el-checkbox v-for="(item1,index1) in item.perm_list" :key="index1" v-model="item1.checked" :checked="item1.is_select == 1?true:false" :label="item1.is_select" @change="checkChangeBtn(scope.row,item,item1)">{{item1.perm_name}}</el-checkbox>
                  </div>
                </div>
              </div>
              <div v-else>
                <el-checkbox v-for="(item1,index1) in scope.row.perm_list" :key="index1" v-model="item1.checked" :checked="item1.is_select == 1?true:false" :label="item1.is_select" @change="checkChangeBtn(scope.row,false,item1)">{{item1.perm_name}}</el-checkbox>
              </div>
              <!-- <span v-else></span> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="btn-foooter">
          <el-button type="primary" @click="sureForm">确定</el-button>
          <el-button @click="cancelLimits">取消</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import MoPaging from "../../components/Paginations.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
import { RequestRoleMenu, RequestRoleEdit } from "../../fetch/modules/account";
import { getRole, removeRole } from "@/utils/auth";

export default {
  components: { MoPaging, ChooseTab },
  data() {
    return {
      num1: 1,
      value: "",
      tableData: [],
      role_id: "",
      isIndeterminate1: false,
      checkAll: false,
      index: 1,
      ischecked: false
    };
  },
  created() {
    this.role_id = this.$route.query.role_id;
    var role_type = getRole("role_type");
    this.getDataList();
  },
  watch: {
    tableData: {
      handler(val, oldVal) {
        // console.log(val, oldVal);
      }
    }
  },
  methods: {
    //获取资讯分类列表
    getDataList() {
      var role_id = this.role_id;
      RequestRoleMenu({ role_id: role_id }).then(res => {
        this.tableData = res;
      });
    },
    handleCheckAllChange(row) {
      var tableData = this.tableData.map((item, index) => {
        if (row.menu_id == item.menu_id) {
          item.is_select = item.is_select == 1 ? 2 : 1;
          item.checked = item.is_select == 1 ? true : false;
          if (item.is_select == 1) {
            if (item.menu_childs.length == 0) {
              item.perm_list = item.perm_list.map((childitem, childnum) => {
                childitem.is_select = 1;
                childitem.checked = true;
                return childitem;
              });
            }
            item.menu_childs = item.menu_childs.map((child, num) => {
              child.is_select = 1;
              child.checked = true;
              child.perm_list = child.perm_list.map((childitem, childnum) => {
                childitem.is_select = 1;
                childitem.checked = true;
                return childitem;
              });
              return child;
            });
          } else {
            if (item.menu_childs.length == 0) {
              item.perm_list = item.perm_list.map((childitem, childnum) => {
                childitem.is_select = 2;
                childitem.checked = false;
                return childitem;
              });
            }
            item.menu_childs = item.menu_childs.map((child, num) => {
              child.is_select = 2;
              child.checked = false;
              child.perm_list = child.perm_list.map((childitem, childnum) => {
                childitem.is_select = 2;
                childitem.checked = false;
                return childitem;
              });
              return child;
            });
          }
        }
        return item;
      });
      this.tableData = tableData;
    },
    //二级
    checkChange(row, itemRow) {
      var tableData = this.tableData.map((item, index) => {
        var indexAll = 0;
        if (row.menu_id == item.menu_id) {
          if (item.menu_childs.length > 0) {
            item.menu_childs = item.menu_childs.map((child, num) => {
              if (child.menu_id == itemRow.menu_id) {
                child.is_select = child.is_select == 1 ? 2 : 1;
                child.checked = child.checked == 1 ? true : false;
                if (child.is_select == 1) {
                  child.checked = true;
                  child.perm_list = child.perm_list.map(
                    (childitem, childnum) => {
                      childitem.is_select = 1;
                      childitem.checked = true;
                      return childitem;
                    }
                  );
                } else if (child.is_select == 2) {
                  child.perm_list = child.perm_list.map(
                    (childitem, childnum) => {
                      childitem.is_select = 2;
                      childitem.checked = false;
                      return childitem;
                    }
                  );
                }
              }
              if (child.is_select == 1) {
                indexAll++;
              }
              return child;
            });
            if (indexAll == 0) {
              item.is_select = 2;
              item.checked = false;
            } else {
              item.is_select = 1;
              item.checked = true;
            }
          } else {
          }
        }

        return item;
      });
      this.tableData = tableData;
    },
    //三级
    checkChangeBtn(row, itemRow, itemChild) {
      var tableData = this.tableData.map((item, index) => {
        var indexParent = 0;
        if (row.menu_id == item.menu_id) {
          if (item.menu_childs.length > 0) {
            item.menu_childs = item.menu_childs.map((child, num) => {
              if (itemRow.menu_id == child.menu_id) {
                let indexAll = 0;
                child.perm_list = child.perm_list.map((childitem, childnum) => {
                  if (itemChild.perm_id == childitem.perm_id) {
                    childitem.is_select = childitem.is_select == 1 ? 2 : 1;
                    childitem.checked = childitem.is_select == 1 ? true : false;
                  }
                  if (childitem.is_select == 1) {
                    indexAll++;
                    childitem.checked = true;
                  }
                  return childitem;
                });
                if (indexAll != 0) {
                  child.is_select = 1;
                  child.checked = true;
                  indexParent++;
                }
              }
              return child;
            });
            if (indexParent == 0) {
              // item.is_select = 2;
              // item.checked = false;
            } else {
              item.is_select = 1;
              item.checked = true;
            }
          } else {
            if (item.perm_list.length > 0) {
              let indexAll = 0;
              item.perm_list = item.perm_list.map((childitem, childnum) => {
                if (itemChild.perm_id == childitem.perm_id) {
                  childitem.is_select = childitem.is_select == 1 ? 2 : 1;
                  childitem.checked = childitem.is_select == 1 ? true : false;
                }
                if (childitem.is_select == 1) {
                  indexAll++;
                }
                return childitem;
              });
              if (indexAll != 0) {
                item.is_select = 1;
                item.checked = true;
              }
            }
          }
        }
        return item;
      });
      this.tableData = tableData;
    },
    //提交确定
    sureForm() {
      var tableData = this.tableData;
      var role_menu = [];
      console.log(tableData);
      tableData.map((item, index) => {
        if (item.is_select == 1) {
          role_menu.push({
            perm_list: [],
            menu_id: item.menu_id
          });
          if (item.menu_childs.length > 0) {
            item.menu_childs.map((child, index) => {
              if (child.is_select == 1) {
                let arrItem = {
                  perm_list: [],
                  menu_id: child.menu_id
                };
                if (child.perm_list.length > 0) {
                  child.perm_list.map((childitem, childnum) => {
                    if (childitem.is_select == 1) {
                      arrItem.perm_list.push(childitem.perm_id);
                    }
                  });
                }
                role_menu.push(arrItem);
              }
            });
          } else {
            if (item.perm_list.length > 0) {
              let arrItem = {
                perm_list: [],
                menu_id: item.menu_id
              };
              item.perm_list.map((childitem, childnum) => {
                if (childitem.is_select == 1) {
                  arrItem.perm_list.push(childitem.perm_id);
                }
              });
              role_menu.push(arrItem);
            }
          }
        }
      });
      var args = {
        role_id: this.role_id,
        role_menu: JSON.stringify(role_menu)
      };
      RequestRoleEdit(args).then(res => {
        // console.log(res);
        if (res.code == 2000) {
          this.$router.push({ path: "roleLimits" });
          this.$store.dispatch("delVisitedViews", {
            path: "/account/roleLimitsDetail"
          });
        }
      });
    },
    //取消权限
    cancelLimits() {
      this.$router.push({ path: "roleLimits" });
      this.$store.dispatch("delVisitedViews", {
        path: "/account/roleLimitsDetail"
      });
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
  .row-item {
    border-bottom: 1px solid #ebeef5;
  }
  .row-item:nth-last-of-type(1) {
    border-bottom: none;
  }
  .btn-wrapper {
    display: inline-block;
    margin-left: 30px;
    padding: 14px 0;
    // border-left: 1px solid #ebeef5;
  }
  .btn-foooter {
    text-align: center;
    margin-top: 40px;
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

