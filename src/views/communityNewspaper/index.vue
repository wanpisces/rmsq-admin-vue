<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="请输入社区报标题" v-model="objSearch.q"></el-input>
        </div>
        <div v-if="admin_type==0" class="search">
          <span>发布账号：</span>
          <el-select v-model="objSearch.search_group_id">
            <el-option v-for="item in numberList" :key="item.value" :label="item.group_name" :value="item.group_id">
            </el-option>
          </el-select>
        </div>
        <div class="search">
          <span>时间：</span>
          <el-date-picker unlink-panels v-model="time" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="search" v-if="active==2">
          <span>审核状态：</span>
          <el-select v-model="objSearch.newspaper_status">
            <el-option :key="0" label="全部" value=""> </el-option>
            <el-option :key="1" label="已驳回" value="1"> </el-option>
            <el-option :key="2" label="已下线" value="2"> </el-option>
            <el-option :key="3" label="审核中" value="3"> </el-option>
          </el-select>
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
            <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
          </div>
          <div>
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="craeteCommunity">新增社区报</el-button>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="handleSelectionChange" @sort-change='sortChange' style="width: 100%">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column align="center" label="标题" prop="newspaper_title">
          </el-table-column>
          <el-table-column align="center" label="刊号" sortable prop="issn_time" width="160">
          </el-table-column>
          <el-table-column align="center" label="浏览人数" sortable prop="visit_num">
          </el-table-column>
          <el-table-column v-if="objSearch.status==1" align="center" label="上线时间" sortable prop="update_time">
          </el-table-column>
          <el-table-column v-else align="center" label="更新时间" sortable prop="update_time">
          </el-table-column>
          <el-table-column align="center" label="点赞数" sortable prop="star_num">
          </el-table-column>
          <el-table-column align="center" label="评论数" sortable prop="comment_num">
          </el-table-column>
          <el-table-column align="center" label="所属账号" prop="editor_name">
          </el-table-column>
          <el-table-column v-if="objSearch.status==2" align="center" label="状态">
            <template slot-scope="scope">
              <!-- <span>{{{1:'待审核',2:'审核中',3:'审核通过',4:'已驳回'}[scope.row.audit_status]}}</span> -->
              <span v-if=" (scope.row.status == 0   &&  scope.row.audit_status == 2) || (scope.row.status == 2   &&  scope.row.audit_status == 2)">
                审核中
              </span>
              <span v-if=" scope.row.status ==2    &&  scope.row.audit_status == 3">
                已下线
              </span>
              <span v-if=" (scope.row.status == 0   &&  scope.row.audit_status == 4) || (scope.row.status ==2  &&  scope.row.audit_status == 4)">
                已驳回
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" width="240" label="操作">
            <template slot-scope="scope">

              <el-button v-if="objSearch.status == 1" type="text" size="small" @click="batchCancel(scope.row)">取消发布</el-button>
              <span v-if="objSearch.status == 2">
                <!-- <el-button v-if="  (scope.row.audit_status == 4 || scope.row.audit_status == 1 ||  scope.row.audit_status == 3)" type="text" size="small" @click="batchEdit(scope.row)">编辑</el-button>
                <el-button v-if=" (scope.row.audit_status == 4 || scope.row.audit_status == 1 ||  scope.row.audit_status == 3)" type="text" size="small" @click="batchSubmit(scope.row)">提交审核</el-button>
                <el-button v-if=" scope.row.audit_status == 4 " type="text" size="small" @click="batchReject(scope.row)">驳回原因</el-button> -->
                <!-- <el-button v-if="scope.row.status == 2  &&  scope.row.audit_status == 3 " type="text" size="small" @click="batchCancel(scope.row)">上线</el-button> -->
                <!-- <el-button v-if="scope.row.status ==0  &&  scope.row.audit_status == 2 " type="text" size="small" @click="batchReject(scope.row)">审核</el-button> -->
                <el-button v-if="(scope.row.status ==2  &&  scope.row.audit_status == 4) ||(scope.row.status ==0  &&  scope.row.audit_status == 4) || (scope.row.status == 2  &&  scope.row.audit_status == 3) " type="text" size="small" @click="batchSubmit(scope.row)">提交审核</el-button>
                <el-button type="text" size="small" @click="batchEdit(scope.row)" v-if="(scope.row.status ==2  &&  scope.row.audit_status == 3) || (scope.row.status ==0  &&  scope.row.audit_status == 4) || (scope.row.status ==2    &&  scope.row.audit_status == 4)">编辑</el-button>
                <el-button v-if="(scope.row.status == 0  &&  scope.row.audit_status == 4) || (scope.row.status == 2  &&  scope.row.audit_status == 4) " type="text" size="small" @click="batchReject(scope.row)">驳回原因</el-button>
              </span>
              <span v-if="objSearch.status == 0">
                <el-button type="text" size="small" @click="batchSubmit(scope.row)">提交审核</el-button>
                <el-button type="text" size="small" @click="batchEdit(scope.row)">编辑</el-button>
              </span>
              <el-button type="text" size="small" @click="handEditor(scope.row)">预览</el-button>

            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="margin-left: 20px;">
            <el-pagination background @current-change="pageChange" :current-page.sync="objSearch.current_page" :page-size="objSearch.page_size" layout="total,prev, pager, next, jumper" :total="count">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 驳回原因 -->
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
          <el-container v-if="item.page.remark">
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
    <!-- 驳回原因 -->
  </div>
</template>
<script>
import newspaper from "@/fetch/modules/newspaper";
import { dateFormat } from "@/utils/time";
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      admin_type: "", //是否是平台账户
      objSearch: {
        current_page: 1,
        page_size: 12,
        q: "",
        search_group_id: "",
        status: 1,
        orderIssn: "1",
        orderVisit: "1",
        orderTime: "1",
        orderStar: "1",
        orderComment: "1",
        newspaper_status: ""
      },
      time: "",
      numberList: [], //发布账号
      count: 0,
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      switchData: [{ name: "上线中", active: 1 }, { name: "已下线", active: 2 }, { name: "草稿箱", active: 0 }],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        }
      },
      active: 1,
      // 驳回原因
      remark: {},
      reamrksKeys: [],
      hasRemark: false,
      remarkList: []
    };
  },
  created() {
    let loginPermissionData = JSON.parse(localStorage.getItem("loginPermissionData"));
    this.admin_type = loginPermissionData.admin_type;
  },
  mounted() {
    if (this.admin_type == 0) {
      this.getAllNumber();
    }
    this.getListData();
  },
  methods: {
    //分页
    pageChange(currentPage) {
      console.log(currentPage);
      this.objSearch.current_page = currentPage;
      this.getListData();
    },
    //获取模块列表
    getListData() {
      let args = JSON.parse(JSON.stringify(this.objSearch));
      args["starttime"] = this.time ? this.time[0] : "";
      args["endtime"] = this.time ? this.time[1] : "";
      newspaper.RequesNewspaperList(args).then(res => {
        if (res) {
          res.list.map((item, index) => {
            item["issn_time"] = item.create_time.substring(0,4) + `年 第${item.issn}期 总第${item.issn_in}期`;
          });
          this.tableData = res.list;
          this.count = res.total_num;
        }
      });
    },
    // 获取所有发布账号
    getAllNumber() {
      newspaper.RequestNewspaperGroup().then(res => {
        res.group_ids.unshift({
          group_id: "",
          group_name: "全部账号"
        });
        this.numberList = res.group_ids;
      });
    },
    // 新增社区报
    craeteCommunity() {
      this.$router.push({
        name: "comNewspaperStep1"
      });
    },
    //排序
    sortChange(_data) {
      console.log(_data);
      let _order = _data.order == "ascending" ? 2 : 1;
      if (_data.prop == "issn") {
        this.objSearch.orderIssn = _order;
      } else if (_data.prop == "visit_num") {
        this.objSearch.orderVisit = _order;
      } else if (_data.prop == "create_time") {
        this.objSearch.orderTime = _order;
      } else if (_data.prop == "star_num") {
        this.objSearch.orderStar = _order;
      } else {
        this.objSearch.orderComment = _order;
      }
      this.getListData();
    },
    // 上下线切换
    switchFn(active) {
      this.objSearch.current_page = 1;
      this.objSearch.status = active;
      this.objSearch.newspaper_status = "";
      this.active = active;
      this.getListData();
    },
    // 预览
    handEditor(row) {
      this.getISSN(row);
      this.$router.push({
        name: "previewLook",
        query: {
          newspaper_id: row.newspaper_id,
          type: 1
        }
      });
    },
    // 取消发布
    batchCancel(row) {
      newspaper.RequestNewspaperOnoff({ newspaper_id: row.newspaper_id }).then(res => {
        this.getListData();
      });
    },
    // 编辑
    batchEdit(row) {
      newspaper.RequesNewspaperEdtor({ newspaper_id: row.newspaper_id, type: 1 }).then(res => {
        console.log(res);
        if (res.code === 2000) {
          localStorage.setItem("pageId", JSON.stringify(res.data.page_id));
          // localStorage.setItem(
          //   "newspperTitle",
          //   JSON.stringify({
          //     newspaper_title: row.newspaper_title,
          //     issn: row.issn
          //   })
          // );
          this.getISSN(row);
          this.$router.push({
            path: "/comNewspaper/stepLast",
            query: { newspaper_id: row.newspaper_id }
          });
        } else {
          this.$message.error(res.msg);
        }
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
      // newspaper.RequesNewspaperISSN().then(resOne => {
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
      //     _dataForm.all = new Date().getFullYear() + "年 " + "第" + row.issn + "期" + " 总第" + (resOne.total+1) + "期";
      //     localStorage.setItem("newspperTitle", JSON.stringify(_dataForm));
      //   }
      // });
    },
    // 提交审核
    batchSubmit(row) {
      newspaper.RequestNewspaperCheck({ newspaper_id: row.newspaper_id }).then(res => {
        this.getListData();
      });
    },
    // 驳回原因
    batchReject(row) {
      this.dialogVisible = true;
      newspaper.RequestNewspaperAllRemark({ newspaper_id: row.newspaper_id }).then(res => {
        this.remarkList = res.remarks;
        this.remark = this.remarkList.newspaper_remark.remark;
        this.hasRemark = Object.values(this.remarkList).some((item, index) => {
          if (index > 0) {
            return item.item.length > 0 || item.page.remark;
          }
        });
        this.dialogVisible = true;
      });
    },

    // 搜索关键词
    searchKeyword() {
      this.objSearch.current_page = 1;
      this.getListData();
    },
    // 批量选中
    handleSelectionChange(vals) {
      this.selectionValues = [];
      for (var i = 0; i < vals.length; i++) {
        this.selectionValues.push(vals[i].newspaper_id);
      }
      if (vals.length <= 0) {
        this.deleteMark = true;
      } else {
        if (this.active == 1) {
          this.deleteMark = true;
        } else {
          this.deleteMark = false;
        }
      }
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 批量删除
    tabelDelete() {
      this.deleteFn(this.selectionValues.toString());
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
    deleteFn(newspaper_id) {
      let _this = this;
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          newspaper.RequesNewspaperDelete({ newspaper_id: newspaper_id }).then(res => {
            var args = _this.objSearch;
            _this.getListData(args);
            _this.$Message({
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

<style scoped rel="stylesheet/scss" lang="scss">
@import url("./component/compoents");

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
.bohui-item {
  margin-bottom: 20px;
  .round-title {
    margin-bottom: 10px;
    // text-align: center;
  }
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
.tip-container-title {
  margin-top: 20px;
  h2 {
    font-size: 16px;
    padding-bottom: 5px;
    margin: 0;
    border-bottom: 1px solid #f2f2f2;
  }
}
.tip-container {
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #f2f2f2;
  padding: 20px 0;
  h4 {
    width: 30%;
    margin: 0;
  }
  p {
    width: 70%;
    text-align: left;
    margin-left: 0;
  }
}
</style>


