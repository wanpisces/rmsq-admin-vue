<template>
  <div class="info-container">
    <div v-if="!releaseDialog">
      <!-- <el-card class="box-card">
         
          <div class="search-box">
              <div class="search">
                  <span>输入搜索：</span>
                  <el-input style="width:200px" v-model="search.q"  placeholder="请输入标题"></el-input>
              </div>
              <div class="search ">
                  <el-button type="primary" icon="el-icon-search" @click="selectionCotent()">搜索</el-button>
              </div>
          </div>
       </el-card>     -->
      <!-- tabelList -->
      <el-card class="box-card">
        <div class="table-list">
          <div class="table-title">
            <div>
              <!-- <el-button type="danger" plain  :disabled="selectionValues.length===0" @click="tabelDelete()">删除</el-button> -->
              <!-- <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''">{{item.name}}</el-button> -->
              <el-button @click="closeLink" icon="el-icon-d-arrow-left">返回随手拍</el-button>
            </div>
            <div>
              <choose-tab @handleShowDliog="handleShowDliog" @TimeOn="timeOn" add-title="新增" @handleAdd="releaseClick">
              </choose-tab>
            </div>
          </div>
          <el-table :data="tableData" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading" ref="table" @row-click="handleCurrentChange" @selection-change="selectionChange">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column prop="news_title" label="爆料归属单位" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.inst_name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="爆料负责人" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.node_user}}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系方式" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.node_user_tel}}</span>
              </template>
            </el-table-column>
            <el-table-column label="爆料跟踪人" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.case_tracer}}</span>
              </template>
            </el-table-column>
            <el-table-column label="提交时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
            <el-table-column label="爆料办理记录" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.node_log}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleCase">结案</el-button>
                <el-button type="text" @click="handleNode(scope.row.node_id)">
                  <span style="color:red">删除</span>
                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div style="margin-left: 20px;">
              <mo-paging :page-index="current_page" :total="count" :page-size="page_size" @change="pageChange">
              </mo-paging>
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
// 数据service接口
// import { searchGov,searchGovChildren } from "../../fetch/tool";
import { RequestServiceNode, RequestServiceNodeDelete, RequestServiceCase } from "../../fetch/modules/service";
export default {
  components: { MoPaging, ChooseTab },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.search.service_id = to.meta.service_id;
      vm.urlLastId = to.meta.id;
      vm.newList();
    });
  },
  data() {
    return {
      urlLastId: "",
      search: {
        // 搜索条件
        q: "", // 搜索关键字
        order_time: 2 // 时间排序
      },
      labelTitle: "上线时间",
      tableData: [],
      current_page: 1,
      count: 0,
      page_size: 5,
      // 发布编辑
      releaseDialog: false,
      formLabelWidth: "120px",
      editorData: [],
      selectionValues: [],
      switchData: [{ name: "全部", active: "1" }], // 上线下线,
      active: 1,
      loading: false
    };
  },
  mounted() {
    // this.newList();
  },
  watch: {},
  methods: {
    // 结案
    handleCase() {
      let self = this;
      this.$confirm("是否结案当前爆料？", "结案", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          RequestServiceCase({ case_id: JSON.parse(this.$route.query.case_id) }).then(res => {
            this.closeLink();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 节点列表
    newList(_obj) {
      this.loading = true;
      let _data = Object.assign(JSON.parse(JSON.stringify(this.search)), _obj);
      for (const key in _data) {
        // 去除对象内多余的空值key
        if (_data[key] === "") {
          delete _data[key];
        }
      }
      let page = { page_size: this.page_size, current_page: 1 };
      let args = Object.assign(page, _data) || {};
      args["case_id"] = JSON.parse(this.$route.query.case_id);
      let self = this;
      RequestServiceNode(args).then(res => {
        self.tableData = res.list;
        self.count = res.total_num;
        this.loading = false;
      });
    },

    // 查询
    selectionCotent() {
      this.current_page = 1;
      this.newList({});
    },
    // 时间切换
    timeOn(value) {
      this.search.order_time = value;
      let args = { order_time: value };
      this.newList(args);
    },
    // 分页选择
    pageChange(current) {
      this.current_page = current;
      let args = { current_page: current };
      this.newList(args);
    },
    releaseClick() {
      this.$router.push({
        path: "addNode" + this.urlLastId,
        query: { case_id: this.$route.query.case_id }
      });
    },
    // 上下线

    // 批量选中
    selectionChange(selectionValues) {
      this.selectionValues = selectionValues;
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    //  删除
    tabelDelete() {
      // console.log(this.selectionValues);
      let self = this,
        selectionArr = [];
      var status = this.search.status;
      if (status == 1) {
        this.$alert("如需删除，请先取消发布!", "提示", {
          confirmButtonText: "取消",
          type: "error"
        });
        return;
      }
      for (let i in this.selectionValues) {
        selectionArr.push(this.selectionValues[i].news_id);
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestGovDelete({ news_id: selectionArr }).then(res => {
            self.newList({ current_page: this.current_page });
          });
        })
        .catch(() => {
          this.$Message({
            type: "info",
            text: "已取消删除"
          });
        });
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    handleNode(node_id) {
      let self = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestServiceNodeDelete({
            node_id,
            case_id: JSON.parse(this.$route.query.case_id)
          }).then(res => {
            self.newList({ current_page: this.current_page });
          });
        })
        .catch(() => {
          this.$Message({
            type: "info",
            text: "已取消删除"
          });
        });
    },
    closeLink() {
      this.$router.push({
        path: "/revolveOne/revolveList" + this.urlLastId
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/revolveOne/nodeList" + this.urlLastId
      });
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .is-scroll-left a {
    color: #409eff;
  }
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
  margin: 30px 15px;
  font-size: 14px;
  .info-footer {
    margin-left: 120px;
    padding: 50px 0;
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
  .info-title {
    padding: 10px;
    margin-bottom: 30px;
    font-size: 16px;
    color: #1890ff;
    border-bottom: 5px solid rgb(247, 246, 252);
  }
  .avatar-uploader,
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 178px;
    width: 178px;
    overflow: hidden;
  }
  .avatar-uploader,
  .el-upload:hover {
    border-color: #409eff;
  }
  .el-upload,
  .el-upload--text {
    border: 1px dashed #d9d9d9 !important;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .img-resopnse {
    width: 100%;
    height: 100px;
  }
  @media (min-width: 1562px) and (max-width: 1920px) {
    .img-resopnse {
      width: 80%;
    }
  }

  @media (min-width: 1920px) {
    .img-resopnse {
      width: 50%;
      text-align: center;
    }
  }
}
</style>

