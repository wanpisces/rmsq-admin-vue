<template>
  <div class="info-container">
    <!-- <el-card class="box-card">
            <div>平台权限设置</div>
        </el-card> -->
    <!-- tabelList -->
    <div style="min-width:1420px;">
      <el-card class="box-card">
        <div class="table-list">
          <el-table :data="tableData" border @selection-change="selectionChange" style="width: 100%">
            <el-table-column label="编号" width="60" type="index">
            </el-table-column>
            <el-table-column label="模块名称" prop="name">
            </el-table-column>
            <el-table-column label="总数量">
              <template slot-scope="scope">
                <span v-if="scope.row.indexMark||scope.row.key=='TOP_RECOM_NEWS'||scope.row.key=='TOP_SELF_NEWS'||scope.row.key=='SINK_AGENT_BANNER'||scope.row.key=='SINK_AGENT_SERVICE'||scope.row.key=='AGENT_BANNER_NUM'">{{scope.row.total}}</span>
                <el-input-number v-if="!scope.row.indexMark&&scope.row.key!='TOP_RECOM_NEWS'&&scope.row.key!='TOP_SELF_NEWS'&&scope.row.key!='SINK_AGENT_BANNER'&&scope.row.key!='SINK_AGENT_SERVICE'&&scope.row.key!='AGENT_BANNER_NUM'" v-model="scope.row.total" @change="handleChange(1)" :min="0" label="描述文字"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="平台默认" prop="sys">
              <template slot-scope="scope">
                <span v-if="scope.row.indexMark||scope.row.key=='TOP_CUSTOMER_RECOM_NEWS'||scope.row.key=='SINK_AGENT_BANNER'||scope.row.key=='SINK_AGENT_SERVICE'||scope.row.key=='AGENT_BANNER_NUM'">{{scope.row.sys}}</span>
                <el-input-number v-if="!scope.row.indexMark&&scope.row.key!='TOP_CUSTOMER_RECOM_NEWS'&&scope.row.key!='SINK_AGENT_BANNER'&&scope.row.key!='SINK_AGENT_SERVICE'&&scope.row.key!='AGENT_BANNER_NUM'" v-model="scope.row.sys" @change="handleChange(2)" :min="0" label="描述文字"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="省级">
              <template slot-scope="scope">
                <span v-if="scope.row.indexMark||scope.row.key=='TOP_ALL_RECOM_NEWS'||scope.row.key=='OFFICAL_NEWS'">{{scope.row.province}}</span>
                <el-input-number v-if="!scope.row.indexMark&&scope.row.key!='TOP_ALL_RECOM_NEWS'&&scope.row.key!='OFFICAL_NEWS'" v-model="scope.row.province" @change="handleChange(3)" :min="0" label="描述文字"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="市级">
              <template slot-scope="scope">
                <span v-if="scope.row.indexMark||scope.row.key=='TOP_ALL_RECOM_NEWS'||scope.row.key=='OFFICAL_NEWS'">{{scope.row.city}}</span>
                <el-input-number v-if="!scope.row.indexMark&&scope.row.key!='TOP_ALL_RECOM_NEWS'&&scope.row.key!='OFFICAL_NEWS'" v-model="scope.row.city" @change="handleChange(4)" :min="0" label="描述文字"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="区级" prop="">
              <template slot-scope="scope">
                <span v-if="scope.row.indexMark||scope.row.key=='TOP_ALL_RECOM_NEWS'||scope.row.key=='OFFICAL_NEWS'">{{scope.row.area}}</span>
                <el-input-number v-if="!scope.row.indexMark&&scope.row.key!='TOP_ALL_RECOM_NEWS'&&scope.row.key!='OFFICAL_NEWS'" v-model="scope.row.area" @change="handleChange(5)" :min="0" label="描述文字"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="街道">
              <template slot-scope="scope">
                <span v-if="scope.row.indexMark||scope.row.key=='TOP_ALL_RECOM_NEWS'||scope.row.key=='OFFICAL_NEWS'||scope.row.key=='SINK_AGENT_BANNER'||scope.row.key=='SINK_AGENT_SERVICE'||scope.row.key=='AGENT_BANNER_NUM'">{{scope.row.street}}</span>
                <el-input-number v-if="!scope.row.indexMark&&scope.row.key!='TOP_ALL_RECOM_NEWS'&&scope.row.key!='OFFICAL_NEWS'&&scope.row.key!='SINK_AGENT_BANNER'&&scope.row.key!='SINK_AGENT_SERVICE'&&scope.row.key!='AGENT_BANNER_NUM'" v-model="scope.row.street" @change="handleChange(7)" :min="0" label="描述文字"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="社区">
              <template slot-scope="scope">
                <span v-if="scope.row.indexMark||scope.row.key=='SINK_ALL_BANNER'||scope.row.key=='SINK_ALL_SERVICE'||scope.row.key=='TOP_ALL_RECOM_NEWS'||scope.row.key=='OFFICAL_NEWS'||scope.row.key=='SINK_AGENT_SERVICE'||scope.row.key=='SINK_AGENT_BANNER'||scope.row.key=='AGENT_BANNER_NUM'">{{scope.row.community}}</span>
                <el-input-number v-if="!scope.row.indexMark&&scope.row.key!='SINK_ALL_BANNER'&&scope.row.key!='SINK_ALL_SERVICE'&&scope.row.key!='TOP_ALL_RECOM_NEWS'&&scope.row.key!='OFFICAL_NEWS'&&scope.row.key!='SINK_AGENT_BANNER'&&scope.row.key!='SINK_AGENT_SERVICE'&&scope.row.key!='AGENT_BANNER_NUM'" v-model="scope.row.community" @change="handleChange(8)" :min="0" label="描述文字"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column v-if="perm.numChange == 1" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button type="text" v-if="scope.row.indexMark" @click="handEditor(scope.row)">修改</el-button>
                <el-button type="text" v-if="!scope.row.indexMark" @click="handSure(scope.row)">确认</el-button>
                <el-button type="text" v-if="!scope.row.indexMark" @click="cancleBtn(scope.row)">取消</el-button>
                <!-- <div class="el-icon-wrapper">
                <i v-if="scope.row.indexMark" class="el-icon-edit" title="修改" @click="handEditor(scope.row)"></i>
                <i v-if="!scope.row.indexMark" class="el-icon-circle-check-outline" title="确认" @click="handSure(scope.row)"></i>
              </div> -->
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div style="margin-left: 20px;">
              <el-pagination background @current-change="pageChange" :current-page.sync="objSearch.current_page" :page-size="objSearch.page_size" layout="total,prev, pager, next, jumper" :total="total_num">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
import MoPaging from "../../components/Paginations.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
import {
  RequestPlatLimitsList,
  RequestPlatLimitsEdit
} from "../../fetch/modules/account";
import { getRole, removeRole } from "@/utils/auth";
const rules = {
  name: [
    { required: true, message: "请输入资讯标题", trigger: "blur" },
    { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }
  ]
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
      perm: {
        numChange: 2
      },
      rules,
      formTitle: "添加分类",
      select: "全部",
      num1: 1,
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
        page_size: 20
      },
      ruleForm: {
        key: "",
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
    this.getDataList(args);
    var role_type = getRole("role_type");
  },
  methods: {
    //获取资讯分类列表
    getDataList(args) {
      RequestPlatLimitsList(args).then(res => {
        this.tableData = res.list.map((item, index) => {
          item.indexMark = true;
          return item;
        });
        this.total_num = res.total_num;
      });
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
      this.$router.push({ name: "platAdd", query: {} });
    },
    //编辑信息
    handEditor(row) {
      const key = row.key;
      this.tableData = this.tableData.map((item, index) => {
        if (row.key == item.key) {
          item.indexMark = false;
        }
        return item;
      });
    },
    cancleBtn(row) {
      this.tableData = this.tableData.map((item, index) => {
        if (row.key == item.key) {
          item.indexMark = true;
        }
        return item;
      });
    },
    //  确认修改
    handSure(row) {
      var dataRow = row;
      this.tableData = this.tableData.map((item, index) => {
        item.total = Math.floor(item.total);
        item.sys = Math.floor(item.sys);
        item.province = Math.floor(item.province);
        item.city = Math.floor(item.city);
        item.area = Math.floor(item.area);
        item.street = Math.floor(item.street);
        item.community = Math.floor(item.community);
        return item;
      });
      if (
        dataRow.total <
        dataRow.sys +
          dataRow.province +
          dataRow.city +
          dataRow.area +
          dataRow.street +
          dataRow.community
      ) {
        this.$Message({
          type: "error",
          text: "超过总数量!"
        });
      } else {
        RequestPlatLimitsEdit(dataRow).then(res => {
          if (res.code == 2000) {
            var args = this.objSearch;
            this.getDataList(args);
          }
        });
      }
    },
    // 查看信息
    checkDetail(row) {
      const key = row.key;
      this.$router.push({ name: "platDetail", query: { key: key } });
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
      var key = row.key;
      this.deleteFn(key);
    },
    //  批量删除
    tabelDelete() {
      const selectionValues = this.selectionValues;
      var key = "";
      for (var i = 0; i < selectionValues.length; i++) {
        key += selectionValues[i].key + ",";
      }
      this.deleteFn(key);
    },

    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(key) {
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          DeletePlatList({ key: key }).then(res => {
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
  overflow-x: scroll;
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

