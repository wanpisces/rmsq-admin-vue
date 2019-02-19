<template>
  <div class="info-container">
    <div v-if="!releaseDialog">
      <el-card class="box-card">
        <!-- 查询 -->
        <div class="search-box">
          <div class="search">
            <span>输入搜索：</span>
            <el-input style="width:200px" v-model="search.q" placeholder="请输入标题"></el-input>
          </div>
          <div class="search">
            <span>大分类：</span>
            <el-select v-model="search.pid" placeholder="请选择">
              <el-option v-for="item in searchGov" :key="item.attr_id" :label="item.attr_value" :value="item.attr_id">
              </el-option>
            </el-select>
          </div>
          <div class="search" v-if="searchGovChildren.length!=0">
            <span>小分类：</span>
            <el-select v-model="search.attr_id" placeholder="请选择">
              <el-option v-for="item in searchGovChildren" :key="item.attr_id" :label="item.attr_value" :value="item.attr_id">
              </el-option>
            </el-select>
          </div>
          <div class="search ">
            <el-button type="primary" icon="el-icon-search" @click="selectionCotent()">搜索</el-button>
          </div>
        </div>
      </el-card>
      <!-- tabelList -->
      <el-card class="box-card">
        <div class="table-list">

          <div class="table-title">
            <div>
              <el-button v-if="perm.groupDele == 1" type="danger" plain :disabled="selectionValues.length===0" @click="tabelDelete()">删除</el-button>
              <!-- <switch-table @switchFn="switchFn" :switchData="switchData"></switch-table> -->
              <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
            </div>
            <div>
              <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->
              <choose-tab v-if="perm.groupAdd == 1" @handleShowDliog="handleShowDliog" @TimeOn="timeOn" add-title="新增" @handleAdd="releaseClick">
              </choose-tab>
            </div>
          </div>
          <el-table :data="tableData" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading" ref="table" @row-click="handleCurrentChange" @selection-change="selectionChange">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column prop="news_title" label="标题" align="center">
              <template slot-scope="scope">
                <router-link class="news-link" :to="{ name: 'govDetail', query: { news_id: scope.row.news_id }}">{{scope.row.news_title}}</router-link>
              </template>
            </el-table-column>
            <el-table-column label="发布时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发布人" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.editor_name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发布单位" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.group_name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="大类分类" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.pid_value.attr_value}}</span>
              </template>
            </el-table-column>
            <el-table-column label="小类分类" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.attr_value.attr_value}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100" align="center" v-if="perm.groupState ==1||perm.groupEdit ==1">
              <template slot-scope="scope">
                <el-button v-if="scope.row.run_in != 2&&perm.groupState ==1" type="text" size="small" @click="handleOnline(scope.row)">{{scope.row.status==2?'上线':'下线'}}</el-button>
                <router-link v-if="perm.groupEdit ==1&&active == 2" class="news-link" :to="{ name: 'serviceGovEditor', query: { news_id: scope.row.news_id }}">
                  <el-button type="text" size="small">修改</el-button>
                </router-link>

                <!-- <div class="el-icon-wrapper">
                  <i v-if="scope.row.run_in != 2&&perm.groupState ==1" :class="scope.row.status==2?'icon-shangxian':'icon-erji-xiaxianjilu'" @click="handleOnline(scope.row)" :title="scope.row.status==2?'上线':'下线'"></i>
                  <router-link v-if="perm.groupEdit ==1&&active == 2" class="news-link" :to="{ name: 'serviceGovEditor', query: { news_id: scope.row.news_id }}">
                    <i class="el-icon-edit" title="修改"></i>
                  </router-link>
                </div> -->
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div style="margin-left: 20px;">
              <!-- <mo-paging :page-index="current_page" :total="count" :page-size="page_size" @change="pageChange">
              </mo-paging> -->
              <el-pagination background @current-change="pageChange" :current-page.sync="current_page" :page-size="page_size" layout="total,prev, pager, next, jumper" :total="count">
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
// 数据service接口
// import { searchGov,searchGovChildren } from "../../fetch/tool";
import { RequestGovList, RequestGovState, RequestGovClassList, RequestGovDelete } from "../../fetch/modules/service";
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
        groupAdd: 2,
        groupEdit: 2,
        groupDele: 2,
        groupState: 2
      },
      search: {
        // 搜索条件
        q: "", // 搜索关键字
        order_time: 2, // 时间排序
        status: 1, // 上下线,
        attr_id: "",
        pid: ""
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
      switchData: [{ name: "已上线", active: "1" }, { name: "已下线", active: "2" }], // 上线下线,
      active: 1,
      loading: false,
      searchGov: [
        {
          attr_id: "",
          attr_value: "全部"
        }
      ],
      searchGovChildren: []
    };
  },
  mounted() {
    this.newList();
    this.getClass({ pid: "0" });
  },
  watch: {
    "search.pid"() {
      if (this.search.pid != "") {
        this.getClass({ pid: this.search.pid });
      } else {
        this.search.attr_id = "";
        this.searchGovChildren = [];
      }
    }
  },
  methods: {
    // 资讯列表
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
      let self = this;
      RequestGovList(args).then(res => {
        if (res) {
          self.tableData = res.list;
          self.count = res.total_num;
          this.loading = false;
        }
      });
    },
    // 资讯分类
    getClass(obj) {
      RequestGovClassList(obj).then(res => {
        if (res.length != 0) {
          if (res[0].pid != 0) {
            this.searchGovChildren.push({ attr_id: "", attr_value: "全部" });
          }

          res.map((item, index) => {
            if (item.pid == 0) {
              this.searchGov.push(item);
            } else {
              this.searchGovChildren.push(item);
            }
          });
        } else {
          this.search.attr_id = "";
          this.searchGovChildren = [];
        }
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
      this.$router.push({ name: "serviceGuidAdd", params: {} });
    },
    // 上下线
    handleOnline(row) {
      let title = row.status == 2 ? "上线" : "下线";
      this.$confirm(`此操作将${title}, 是否继续`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestGovState({ news_id: row.news_id }).then(res => {
            this.newList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },

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
          confirmButtonText: "确定",
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
          // this.$Message({
          //     type: 'success',
          //     text: '删除成功!'
          // });
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
    // 上下线切换
    switchFn(active) {
      if (active == 1) {
        this.labelTitle = "上线时间";
      } else if (active == 2) {
        this.labelTitle = "下线时间";
      }
      this.current_page = 1;
      this.search.status = active;
      this.active = active;
      this.newList({ status: JSON.parse(active) });
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

