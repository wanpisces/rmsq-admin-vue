<template>
  <div class="info-container">
    <div v-if="!dialogVisible">
      <el-card class="box-card">
        <!-- 查询 -->
        <div class="search-box">
          <div class="search">
            <span>输入搜索：</span>
            <el-input style="width:200px" v-model="search.q" placeholder="编号、名称或录入人员姓名"></el-input>
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
              <el-button type="danger" plain :disabled="selectionValues.length===0" @click="tabelDelete()">删除</el-button>
            </div>
            <div class="table-title-right">
              <!-- <el-button style="margin-right:5px;" @click="preview">预览</el-button> -->
              <choose-tab @handleAdd="handleAdd(1)" @TimeOn="timeOn" add-title="录入数据">
              </choose-tab>
            </div>
          </div>
          <el-table :data="tableData" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading" ref="table" @row-click="handleCurrentChange" @selection-change="selectionChange">
            <el-table-column type="selection" width="50" align="center">
            </el-table-column>

            <el-table-column prop="item_no" width="100" label="序号" align="center">
            </el-table-column>
            <el-table-column prop="item_title" label="名称" align="center">
            </el-table-column>
            <el-table-column prop="item_pic" width="220" label="首页展示图" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.item_pic" class="img-bg-box" :style="{backgroundImage: 'url(' + scope.row.item_pic + ')'}">
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="发布时间" align="center">
            </el-table-column>
            <el-table-column prop="editor_name" label="录入人员" align="center">
              <template slot-scope="scope">
                {{scope.row.editor_name || "-"}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="showDetail(scope.row.item_id)">查看</el-button>
                <el-button type="text" size="small" @click="handleAdd(2,scope.row.item_id)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer ">
            <div style="margin-left: 20px; ">
              <el-pagination background @current-change="pageChange " :current-page.sync="search.current_page " :page-size="search.page_size " layout="total,prev, pager, next, jumper " :total="count ">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <view-federation v-else @cancelPre="cancelPre" :itemId="detailItemId"></view-federation>

  </div>
</template>

<script>
import MoPaging from "@/components/Paginations.vue"; // 分页
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue"; // 选项
import viewFederation from "./viewFederation";
import { RequestPollItemList, RequestPollItemDetail, RequestPollItemDel } from "@/fetch/modules/service.js";

export default {
  components: { MoPaging, ChooseTab, viewFederation },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log("vm.search.current_page", vm.search.current_page);
      vm.search.current_page = 1;
      vm.urlLastId = to.meta.id;
      vm.newList();
    });
  },
  data() {
    return {
      urlLastId: "",
      // 搜索条件
      search: {
        poll_id: "531219648201359360", // 投票ID
        q: "", // 标题的关键字
        order_time: "2", // 	排序方式 1 升序 2降序（默认）
        current_page: 1,
        page_size: 5
      },
      tableData: [],
      count: 0,
      selectionValues: [], // 删除列表
      loading: false,
      dialogVisible: false,
      detailItemId: "",
      url: ""
    };
  },
  mounted() {},
  watch: {},
  methods: {
    showDetail(itemID) {
      this.detailItemId = itemID;
      this.dialogVisible = true;
    },
    cancelPre() {
      this.dialogVisible = false;
    },
    preview() {
      console.log(this.url);
      window.open(this.url, "_blank", "width=450,height=700,left=500,top=300", false);
    },
    // 获取列表数据
    newList(params) {
      let _arg = JSON.parse(JSON.stringify(this.search));
      for (let item in _arg) {
        if (_arg[item] == "") {
          delete _arg[item];
        }
      }
      this.loading = true;
      RequestPollItemList(_arg).then(res => {
        this.loading = false;
        if (res.code == 2000) {
          this.tableData = res.data.list;
          this.count = res.data.total;
          console.log(res);
          this.url = res.data.preview_url;
        }
        console.log("RequestPollItemList", res);
      });
    },
    // 查询
    selectionCotent() {
      this.search.current_page = 1;
      this.newList();
    },
    // 数据录入
    handleAdd(type, itemID) {
      if (type == 1) {
        this.$router.push({
          path: "cjhaddFederation"
        });
      } else {
        this.$router.push({
          path: "cjheditFederation",
          query: { item_id: itemID }
        });
      }
    },
    // 时间排序切换
    timeOn(value) {
      this.search.order_time = value;
      this.newList();
    },
    // 分页选择
    pageChange(current) {
      this.search.current_page = current;
      this.newList();
    },
    // 批量选中
    selectionChange(selectionValues) {
      this.selectionValues = selectionValues;
    },
    // 表格选择
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    //  表格删除
    tabelDelete() {
      let _self = this,
        selectionArr = [];

      for (let i in this.selectionValues) {
        selectionArr.push(this.selectionValues[i].item_id);
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestPollItemDel({ item_id: selectionArr.join(",") }).then(res => {
            _self.newList();
          });
        })
        .catch(() => {
          this.$Message({
            type: "info",
            text: "已取消删除"
          });
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
  .table-title-right {
    display: flex;
    justify-content: space-around;
    align-items: center;
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
.img-bg-box {
  width: 200px;
  height: 125px;
  background-size: cover;
  background-clip: content-box;
  //   background-position: 50% 50%;
  background-color: #f6f8f9;
  overflow: hidden;
}
</style>

