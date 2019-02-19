<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="请输入社区报标题" v-model="search.q"></el-input>
        </div>
        <div class="search" v-if="admin_type==0">
          <span>发布账号：</span>
          <el-select v-model="search.search_group_id" filterable placeholder="请选择账号类型">
            <el-option v-for="item in numberList" :key="item.value" :label="item.group_name" :value="item.group_id">
            </el-option>
          </el-select>
        </div>
        <div class="search">
          <span>时间：</span>
          <el-date-picker unlink-panels v-model="picker_time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
          </el-date-picker>
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
            <!-- <el-button type="danger" plain @click="tabelDelete" :disabled="deleteMark">删除</el-button> -->
            <el-button v-for="(item, index) in switchData" :key="index" :type="search.audit_status == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="handleSelectionChange" style="width: 100%" @sort-change="sortChange">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column label="标题" prop="newspaper_title">
          </el-table-column>
          <el-table-column sortable label="刊号" prop="issn_time">
          </el-table-column>
          <el-table-column sortable label="提审时间" prop="update_time">
          </el-table-column>
          <el-table-column label="所属账号" prop="editor_name">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="search.audit_status==2" @click="auditLink(scope.row)">
                审核
              </el-button>
              <el-button type="text" size="small" v-if="search.audit_status==3" @click='checkDetail(scope.row)'>
                查看
              </el-button>
              <el-button type="text" size="small" v-if="search.audit_status==4" @click="checkRemak(scope.row.newspaper_id)">驳回原因
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="margin-left: 20px;">
            <el-pagination background @current-change="pageChange" :current-page.sync="search.current_page" :page-size="search.page_size" layout="total,prev, pager, next, jumper" :total="count">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog title="驳回原因" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
      <div class="textarea-wrap" style="margin-top:15px;">
        <p class="title">驳回理由（整体）：</p>
        <div class="textarea" style="margin-top: 10px;">{{remark||'暂无'}}</div>
      </div>
      <div class="textarea-wrap" v-if="hasRemark">
        <p style="margin:20px 0 10px;">驳回理由：</p>
        <div class="bohui-item" v-for="(item, key, index) in remarkList" :key="index" v-if="key!='newspaper_remark'&&(item.page.remark||item.item.length>0)">
          <div class="round-title">
            <el-button type="primary" round>{{key}}</el-button>
          </div>
          <el-container v-if="item.page.audit_id">
            <el-aside width="150px">{{item.page.title||'基本信息驳回'}}</el-aside>
            <el-main>
              <div class="textarea">{{item.page.remark}}</div>
            </el-main>
          </el-container>
          <el-container v-for="(child,num) in item.item" :key="num" v-if="item.item.length>0">
            <el-aside width="150px">{{child.title}}</el-aside>
            <el-main>
              <div class="textarea">{{child.remark}}</div>
            </el-main>
          </el-container>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Newsparper from "@/fetch/modules/newspaper";
import { sevenDays, thirtyDays, formatDate, getWeekStartDate, getWeekEndDate, getMonthStartDate, getMonthEndDate ,dateFormat} from "@/utils/time";
export default {
  data() {
    return {
      admin_type: "", //是否是平台账户
      numberList: [], //发布账号
      tableData: [],
      search: {
        current_page: 1,
        page_size: 10,
        q: "",
        audit_status: 2,
        starttime: "",
        endtime: "",
        orderIssn: 1,
        orderTime: 1,
        search_group_id: ""
      },
      count: 0,
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      switchData: [{ name: "待审核", active: 2 }, { name: "已通过", active: 3 }, { name: "已驳回", active: 4 }],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        }
      },
      picker_time: [],
      remarkList: [],
      remark: "",
      dialogVisible: false,
      hasRemark: false
    };
  },
  created() {
    let loginPermissionData = JSON.parse(localStorage.getItem("loginPermissionData"));
    this.admin_type = loginPermissionData.admin_type;
    if (this.admin_type == 0) {
      this.getAllNumber();
    }
    this.getListData();
  },
  methods: {
    // 获取所有发布账号
    getAllNumber() {
      Newsparper.RequestNewspaperGroup().then(res => {
        res.group_ids.unshift({
          group_id: "",
          group_name: "全部账号"
        });
        this.numberList = res.group_ids;
      });
    },
    //审核
    auditLink(row) {
      this.getISSN(row);
      this.$router.push({
        name: "comNewspaperLook",
        query: { newspaper_id: row.newspaper_id }
      });
    },
    getISSN(row) {
      let _dataForm = {
        newspaper_title: "",
        issn: "",
        template_ids: "",
        total: "",
        all: ""
      };
      _dataForm.issn = "第" + row.issn + "期";
      _dataForm.total = row.issn_in;
      _dataForm.all = new Date().getFullYear() + "年 " + "第" + row.issn + "期" + " 总第" + row.issn_in + "期";
      localStorage.setItem("newspperTitle", JSON.stringify(_dataForm));
      // Newsparper.RequesNewspaperISSN().then(resOne => {
      //   if (resOne) {
      //     let _dataForm = {
      //       newspaper_title: "",
      //       issn: "",
      //       template_ids: "",
      //       total: "",
      //       all: ""
      //     };
      //     _dataForm.issn = "第" + (resOne.issn + 1) + "期";
      //     _dataForm.total = resOne.total;
      //     _dataForm.all = new Date().getFullYear() + "年 " + "第" + row.issn + "期" + " 总第" + (resOne.total + 1) + "期";
      //     localStorage.setItem("newspperTitle", JSON.stringify(_dataForm));
      //   }
      // });
    },
    //查看预览
    checkDetail(row) {
      this.getISSN(row);
      this.$router.push({
        name: "previewLook",
        query: { newspaper_id: row.newspaper_id, type: 2 }
      });
    },
    // 查看驳回原因
    checkRemak(newspaper_id) {
      Newsparper.RequestNewspaperAllRemark({ newspaper_id: newspaper_id }).then(res => {
        this.remarkList = res.remarks;
        this.remark = this.remarkList.newspaper_remark.remark;
        this.hasRemark = Object.values(this.remarkList).some((item, index) => {
          if (index > 0) {
            return item.item.length > 0 || item.page.audit_id;
          }
        });
        this.dialogVisible = true;
      });
    },
    //分页
    pageChange(currentPage) {
      this.search.current_page = currentPage;
      this.getListData();
    },
    //获取模块列表
    getListData() {
      var args = this.search;
      args["starttime"] = this.picker_time ? this.picker_time[0] : "";
      args["endtime"] = this.picker_time ? this.picker_time[1] : "";
      for (var i in args) {
        if (args[i] === "") {
          delete args[i];
        }
      }
      Newsparper.RequesNewspaperAudit(args).then(res => {
        if (res) {
          res.list.map((item, index) => {
            item["issn_time"] = item.create_time.substring(0,4) + `年 第${item.issn}期 总第${item.issn_in}期`;
          });
          this.tableData = res.list;
          this.search.current_page = Number(res.current_page);
          this.search.page_size = Number(res.page_size);
          this.count = Number(res.total_num);
        }
      });
    },
    //排序
    sortChange(_data) {
      let _order = _data.order == "ascending" ? 2 : 1;
      if (_data.prop == "issn") {
        this.search.orderIssn = _order;
      } else if (_data.prop == "create_time") {
        this.search.orderTime = _order;
      }
      this.getListData();
    },
    // 搜索关键词
    searchKeyword() {
      this.search.current_page = 1;
      this.getListData();
    },
    // 上下线切换
    switchFn(active) {
      this.search.current_page = 1;
      this.search.audit_status = active;
      this.getListData();
    },

    // 批量选中
    handleSelectionChange(vals) {
      for (var i = 0; i < vals.length; i++) {
        this.selectionValues.push(vals[i].mp_id);
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
      var mp_id = "";
      for (var i = 0; i < this.selectionValues.length; i++) {
        mp_id += this.selectionValues[i] + ",";
      }
      this.deleteFn(mp_id);
    },
    //删除
    batchDelete(row) {
      var mp_id = row.mp_id;
      this.deleteFn(mp_id);
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(mp_id) {
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestMpDelete({ mp_id: mp_id }).then(res => {
            this.getListData();
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

<style scoped  rel="stylesheet/scss" lang="scss">
@import url("../component/compoents");
.search {
  padding: 10px 0;
}
.textarea-wrap {
  .title {
    margin: 0 0 10px;
  }
  .textarea {
    padding: 15px;
    border: 1px solid #eee;
  }
}
.round-title {
  margin-bottom: 10px;
  // text-align: center;
}
.bohui-item {
  margin-bottom: 20px;
  .el-container {
    position: relative;
    margin-bottom: 10px;
    // border-bottom: 1px solid #353535;
  }
  .delete-btn {
    position: absolute;
    right: -10px;
    top: -5px;
  }
  .el-aside {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    padding: 15px 10px;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: left;
    line-height: 20px;
  }
}
</style>


