<template>
  <div class="info-container">
    <div>
      <el-card class="box-card">
        <!-- 查询 -->
        <div class="search-box">
          <div class="search">
            <span>输入搜索：</span>
            <el-input style="width:200px" v-model="search.q" placeholder="投票标题"></el-input>
          </div>
          <div class="search">
            <span>状态：</span>
            <el-select v-model="search.status" placeholder="请选择状态">
              <el-option v-for="item in statusInData" :key="item.val" :label="item.msg" :value="item.val">
              </el-option>
            </el-select>
          </div>
          <div class="search">
            <el-date-picker value-format="yyyy-MM-dd" v-model="search.date" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions1">
            </el-date-picker>
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
              <div style="padding-right:15px;">
                是否在用户端显示
                <el-switch active-value="1" inactive-value="2" @change="changeShowInUser" v-model="isShowUser">
                </el-switch>
              </div>
              <choose-tab @handleAdd="handleAdd(1)" @TimeOn="timeOn" add-title="新建投票">
              </choose-tab>
            </div>
          </div>
          <el-table :data="tableData" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading" ref="table" @row-click="handleCurrentChange" @selection-change="selectionChange">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>

            <el-table-column label="投票标题" align="center">
              <template slot-scope="scope">
                {{scope.row.vote_title}}
              </template>
            </el-table-column>

            <el-table-column prop="create_time" label="创建时间" align="center">
            </el-table-column>

            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                {{scope.row.status == "1" ? "已发布" : "未发布"}}
              </template>
            </el-table-column>

            <el-table-column prop="fill_num" label="参与人数" align="center">
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="150" align="center">
              <template slot-scope="scope">
                <!-- <span v-if="scope.row.status == 2">
                  <router-link :to="{path:'previewVotes'+urlLastId,query:{vote_id:scope.row.vote_id}}">
                    <el-button type="text" size="small"> 预览 </el-button>
                  </router-link>
                  <el-button @click="changeVoteStatus(scope.row.vote_id)" type="text" size="small"> 发布 </el-button>
                </span>
                <span v-else>
                  <router-link :to="{path:'viewVotes'+urlLastId,query:{vote_id:scope.row.vote_id}}">
                    <el-button type="text" size="small"> 查看 </el-button>
                  </router-link>
                  <el-button @click="changeVoteStatus(scope.row.vote_id)" type="text" size="small"> 取消发布 </el-button>
                </span>
                <el-button v-if="scope.row.status == 2" @click="handleAdd(2,scope.row.vote_id)" type="text" size="small"> 编辑 </el-button> -->

                <span v-if="scope.row.status != 2">
                  <router-link :to="{path:'viewVotes'+urlLastId,query:{vote_id:scope.row.vote_id}}">
                    <!-- <i class="el-icon-view" title="查看"></i> -->
                    <el-button type="text" size="small">查看</el-button>
                  </router-link>
                  <el-button type="text" size="small" @click="changeVoteStatus(scope.row.vote_id)">取消发布</el-button>
                  <!-- <i class="icon-quxiaofabu" title="取消发布" @click="changeVoteStatus(scope.row.vote_id)"></i> -->
                </span>
                <span v-if="scope.row.status == 2">
                  <router-link :to="{path:'previewVotes'+urlLastId,query:{vote_id:scope.row.vote_id}}">
                    <!-- <i class="icon-yulan" title="预览"></i> -->
                    <el-button type="text" size="small">预览</el-button>
                  </router-link>
                  <el-button type="text" size="small" @click="changeVoteStatus(scope.row.vote_id)">发布</el-button>
                  <el-button type="text" size="small" @click="handleAdd(2,scope.row.vote_id)">编辑</el-button>
                  <!-- <i class="icon-fabu" title="发布" @click="changeVoteStatus(scope.row.vote_id)"></i>
                    <i class="el-icon-edit" title="编辑" @click="handleAdd(2,scope.row.vote_id)"></i> -->
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div style="margin-left: 20px;">
              <!-- <mo-paging :page-index="search.current_page" :total="count" :page-size="search.page_size" @change="pageChange">
              </mo-paging> -->
              <el-pagination background @current-change="pageChange" :current-page.sync="search.current_page" :page-size="search.page_size" layout="total,prev, pager, next, jumper" :total="count">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
import MoPaging from "@/components/Paginations.vue"; // 分页
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue"; // 选项

import { RequestServicePublicDetail, RequestVoteList, RequestVoteRemove, RequestServiceState, RequestVoteState } from "@/fetch/modules/service.js";

export default {
  components: { MoPaging, ChooseTab },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log("vm.search.current_page", vm.search.current_page);
      vm.search.current_page = 1;
      console.log("vm.search.current_page--end", vm.search.current_page);
      vm.search.service_id = to.meta.service_id;
      vm.urlLastId = to.meta.id;
      vm.newList();
      vm.getShowStatus();
    });
  },
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      isShowUser: true, // 是否显示在用户端
      urlLastId: "",
      // 搜索条件
      search: {
        q: "", // 标题的关键字
        date: "", // 日期筛选 年月日
        order_time: "2", // 	排序方式 1 升序 2降序（默认）
        status: "", // 状态 1已发布 2未发布
        service_id: "",
        current_page: 1,
        page_size: 5,
        vote_type: "1" // 类型：1投票 2评选 （默认全部）
      },
      // 状态选择
      statusInData: [
        {
          val: "",
          msg: "全部"
        },
        {
          val: "1",
          msg: "已发布"
        },
        {
          val: "2",
          msg: "未发布"
        }
      ],
      tableData: [],

      count: 0,
      timer: null,
      selectionValues: [], // 删除列表
      loading: false
    };
  },
  mounted() {},
  watch: {},
  methods: {
    getShowStatus() {
      let _this = this;
      RequestServicePublicDetail({ service_id: this.search.service_id }).then(res => {
        _this.isShowUser = res.status;
        console.log("_this.isShowUser", _this.isShowUser);
      });
    },
    // 获取列表数据
    newList(params) {
      let _arg = JSON.parse(JSON.stringify(this.search));

      for (let item in _arg) {
        if (_arg[item] == "") {
          delete _arg[item];
        }
      }

      RequestVoteList(_arg).then(res => {
        if (res.code == 2000) {
          this.tableData = res.data.list;
          this.count = res.data.total;
        } else {
        }
        console.log("__RequestVoteList__", res);
      });
    },
    // 切换发布状态
    changeVoteStatus(_vote_id) {
      RequestVoteState({
        vote_id: _vote_id
      }).then(res => {
        if (res.code == 2000) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.newList();
        } else {
          this.$message({
            type: "warning",
            message: res.msg
          });
        }
        console.log("__RequestVoteState__", res);
      });
    },
    // 是否在用户端显示
    changeShowInUser(val) {
      const self = this;
      if (self.timer) clearTimeout(self.timer);
      self.timer = setTimeout(function() {
        console.log("---val", val);
        RequestServiceState({
          service_id: self.search.service_id
        }).then(res => {
          console.log("__RequestServiceState__", res);
          if (res.code == 2000) {
            self.$message({
              type: "info",
              message: val == 1 ? "开启后当前模块将在用户端显示" : "关闭后当前模块不在用户端显示"
            });
          }
        });
        self.timer = null;
      }, 300);
    },
    // 查询
    selectionCotent() {
      this.search.current_page = 1;
      this.newList();
    },
    // 新建投票
    handleAdd(type, _vote_id) {
      if (type == 1) {
        this.$router.push({
          path: "addVote" + this.urlLastId
        });
      } else {
        this.$router.push({
          path: "editVote" + this.urlLastId,
          query: { vote_id: _vote_id }
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
        selectionArr.push(this.selectionValues[i].vote_id);
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestVoteRemove({ vote_id: selectionArr }).then(res => {
            self.newList();
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
</style>

