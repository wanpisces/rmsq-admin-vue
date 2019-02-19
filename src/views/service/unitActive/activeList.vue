<template>
  <div class="info-container">

    <div v-if="!releaseDialog">
      <el-card class="box-card">
        <!-- 查询 -->
        <div class="search-box">
          <div class="search">
            <span>输入搜索：</span>
            <el-input style="width:200px" v-model="search.q" placeholder="活动标题"></el-input>
          </div>
          <div class="search">
            <span>活动类型：</span>
            <el-select v-model="search.attr_id" placeholder="请选择资讯模块">
              <el-option v-for="item in modulesOptions" :key="item.attr_id" :label="item.attr_value" :value="item.attr_id">
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
              <!-- <el-button type="danger" plain  :disabled="selectionValues.length===0" @click="tabelDelete()">删除</el-button> -->
              <!-- <switch-table @switchFn="switchFn" :switchData="switchData"></switch-table> -->
              <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
            </div>
            <div style="display:flex;align-items:center">
              <div style="padding-right:15px;">
                是否在用户端显示
                <el-switch @change="changeShowInUser" v-model="isShowUser">
                </el-switch>
              </div>
              <!-- <router-link :to="{path:'activeDraft'+urlLastId}">
                <el-button type="success" style="margin-right:5px">
                  草稿箱
                </el-button>
              </router-link> -->
              <choose-tab addTitle='添加' @handleShowDliog="handleShowDliog" @TimeOn="timeOn" @handleAdd='handleAdd'>
              </choose-tab>
            </div>

          </div>
          <el-table :data="tableData" border style="width: 100%" ref="table" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading" @row-click="handleCurrentChange" @selection-change="selectionChange">
            <!-- <el-table-column
                type="selection"
                width="55" >
                </el-table-column> -->
            <el-table-column prop="news_title" label="活动标题" align="center">
              <template slot-scope="scope">
                <span style="color:#409eff">
                  <router-link class="news-link" :to="{path:'activeDetail'+urlLastId,query:{activity_id:scope.row.activity_id,active:1}}">{{scope.row.activity_title}}</router-link>
                </span>

              </template>
            </el-table-column>
            <!-- <el-table-column
                prop="news_source"
                label="资讯来源"
                width="180" >
                </el-table-column> -->

            <el-table-column label="活动类型" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.attr_value}}</span>
              </template>
            </el-table-column>
            <el-table-column label="活动封面" align="center">
              <template slot-scope="scope">
                <img v-if="scope.row.activity_pic" :src="scope.row.activity_pic" class="img-resopnse" alt="">
                <span v-else>无图</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
                label="投放区域" >
                  <template slot-scope="scope">
                       <span >{{scope.row.run_in==2?'轮播':scope.row.run_in==3?'官方快报':'推荐'}}</span>
                  </template>
                </el-table-column> -->
            <el-table-column label="活动时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.activity_starttime}}至{{scope.row.activity_endtime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="截止报名时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.enlist_endtime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="活动地点" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.address}}</span>
              </template>
            </el-table-column>
            <el-table-column label="报名人数" align="center">
              <template slot-scope="scope">
                <span style="color:red">{{scope.row.enlist_general_num}}</span> /
                <span>{{scope.row.enlist_max_general_num}}</span>
              </template>
            </el-table-column>
            <el-table-column label="志愿者人数" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.enlist_max_volunteer_num==0">--</span>
                <span v-else>
                  <span>{{scope.row.enlist_volunteer_num}}</span>/ {{scope.row.enlist_max_volunteer_num}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="活动主办方" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.sponsor_name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center" v-if="search.audit_status!=3">
              <template slot-scope="scope">

                <router-link :to="{path:'lookSign'+urlLastId,query:{activity_id:scope.row.activity_id}}" v-if="active!=4">
                  <el-button type="text" size="small"> 查看报名 </el-button>
                </router-link>

                <router-link v-if="active==1 " :to="{path:'activeEditor'+urlLastId,query:{activity_id:scope.row.activity_id,active:'1',lng:scope.row.lng,lat:scope.row.lat}}">
                  <el-button type="text" size="small"> 编辑 </el-button>
                </router-link>
                <router-link v-if=" active==4" :to="{path:'activeEditor'+urlLastId,query:{activity_id:scope.row.activity_id,active:'1',lng:scope.row.lng,lat:scope.row.lat,status:0,statusTwo:1}}">
                  <el-button type="text" size="small"> 编辑 </el-button>
                </router-link>
                <el-button type="text" size="small" v-if="active==4" @click="submit(scope.row)"> 发布 </el-button>
                <el-button type="text" size="small" v-if="active==1||active==3 || active==4" @click="handDelete(scope.row)"> 删除 </el-button>
                <el-button type="text" size="small" v-if="active!=4" @click="handTop(scope.row)"> {{scope.row.is_top == 1?'取消置顶':'置顶'}} </el-button>

                <!-- <div class="el-icon-wrapper">
                  <router-link :to="{path:'lookSign'+urlLastId,query:{activity_id:scope.row.activity_id}}">
                    <i class="el-icon-view" title="查看报名"></i>
                  </router-link>
                  <router-link v-if="active==1" :to="{path:'activeEditor'+urlLastId,query:{activity_id:scope.row.activity_id,active:'1',lng:scope.row.lng,lat:scope.row.lat}}">
                    <i class="el-icon-edit" title="编辑"></i>
                  </router-link>
                  <i :class="scope.row.is_top == 1?'icon-quxiaozhiding':'icon-zhiding'" :title="scope.row.is_top == 1?'取消置顶':'置顶'" @click="handTop(scope.row)"></i>
                  <i class="el-icon-delete" @click="handDelete(scope.row)" title="删除"></i>
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
              <!-- <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="count"  @current-change="pageChange"
                    :current-page="current_page"
                    :page-size="5">
                </el-pagination> -->
            </div>

          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import MoPaging from "../../../components/Paginations.vue";
import Tinymce from "../../../components/Tinymce/index.vue";
import ChooseTab from "../../../components/ChooseTab/ChooseTab.vue";
// import SwitchTable from "../../components/Switchtable/index.vue"
// 数据service接口
import { RequestUploads } from "../../../fetch/modules/public.js";
import { RequestQiNiutoken } from "../../../fetch/tool";
// '列表，分类，删除'
import { RequestActiveList, RequestActiveAttr, RequestActiveDelete, RequestActiveTop, RequestServiceState, RequestServicePublicDetail, RequestActivieState } from "@/fetch/modules/service.js";
// 正则匹配
const rules = {
  news_title: [{ required: true, message: "请输入资讯标题", trigger: "blur" }, { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }]
};
export default {
  components: { MoPaging, Tinymce, ChooseTab },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log("sssss__", to);
      vm.search.service_id = to.meta.service_id;
      vm.urlLastId = to.meta.id;
      // console.log("vm.current_page", vm.search.current_page);
      vm.current_page = 1;
      // console.log("vm.current_page--end", vm.search.current_page);
      vm.search.activity_state == 4 ? vm.newList({ status: 0 }) : vm.newList();

      vm.moduleList();
      vm.getServiceDetail();
    });
  },
  data() {
    return {
      rules,
      isShowUser: true,
      search: {
        // 搜索条件
        q: "", // 搜索资讯标题的关键字
        order_time: 2, // 时间排序
        // status:1, // 上下线，
        activity_state: 1,
        run_in: "",
        attr_id: "",
        service_id: ""
      },
      urlLastId: "",
      modulesOptions: [{ attr_id: "", attr_value: "全部" }],
      tableData: [],
      current_page: 1,
      count: 0,
      page_size: 5,
      releaseDialog: false,
      tmpExamineData: "",
      formLabelWidth: "120px",
      selectionValues: [],
      switchData: [{ name: "未开始", active: "1" }, { name: "进行中", active: "2" }, { name: "已结束", active: "3" }, { name: "草稿箱", active: "4" }], // 上线下线,
      active: 1,
      loading: false,
      refuseDialogVisible: false,
      refuseContent: "" //拒绝原因,
    };
  },
  created() {
    console.log("_________11111111线上环境");
  },
  watch: {
    // $route(to, from) {
    //   this.moduleList();
    //   this.newList();
    // }
  },

  methods: {
    getServiceDetail() {
      let service_id = this.search.service_id;
      RequestServicePublicDetail({ service_id: service_id }).then(res => {
        res.status == 1 ? (this.isShowUser = true) : (this.isShowUser = false);
      });
    },
    changeShowInUser(val) {
      if (val) {
        this.$confirm("开启后当前模块将在用户端显示?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            RequestServiceState({ service_id: this.search.service_id }).then(res => {
              if (res.code == 2000) {
                this.isShowUser = true;
              }
            });
          })
          .catch(() => {
            this.isShowUser = false;
          });
      } else {
        this.$confirm("关闭后当前模块不在用户端显示?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            RequestServiceState({ service_id: this.search.service_id }).then(res => {
              if (res.code == 2000) {
                this.isShowUser = false;
              }
            });
          })
          .catch(() => {
            this.isShowUser = true;
          });
      }
    },
    //置顶
    handTop(row) {
      RequestActiveTop({ activity_id: row.activity_id }).then(res => {
        if (res.code == 2000) {
          this.newList({});
        }
      });
    },
    // 活动列表
    newList(_obj) {
      this.loading = true;
      let _data = Object.assign(JSON.parse(JSON.stringify(this.search)), _obj);
      for (const key in _data) {
        // 去除对象内多余的空值key
        if (_data[key] === "") {
          delete _data[key];
        }
      }
      let page = { page_size: this.page_size, current_page: this.current_page };
      let args = Object.assign(page, _data) || {};
      let self = this;
      RequestActiveList(args).then(res => {
        if (res) {
          self.tableData = res.list;
          console.log(self.tableData);
          self.count = res.total_num;
          this.loading = false;
        }
      });
    },
    // 活动分类列表
    moduleList() {
      RequestActiveAttr({ service_id: this.search.service_id }).then(res => {
        this.modulesOptions = [{ attr_id: "", attr_value: "全部" }];
        this.modulesOptions = this.modulesOptions.concat(res);
      });
    },

    // 查询
    selectionCotent() {
      this.current_page = 1;
      let args = {
        qt: this.search.qt,
        qa: this.search.qa,
        category_id: this.search.category_id
      };
      this.newList(args);
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
      this.newList({ current_page: current });
    },
    // 批量选中
    selectionChange(selectionValues) {
      this.selectionValues = selectionValues;
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },

    handleShowDliog() {
      this.listShowDialog = true;
    },
    // 上下线切换
    switchFn(active) {
      this.current_page = 1;
      this.active = active;
      this.search.activity_state = active;
      active == 4 ? this.newList({ audit_status: JSON.parse(active), status: 0 }) : this.newList({ audit_status: JSON.parse(active) });
    },
    handleAdd() {
      this.$router.push({ path: "activeAdd" + this.urlLastId });
    },
    //发布
    submit(row) {
      let self = this;
      this.$confirm("确定发布此活动?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestActivieState({
            activity_id: row.activity_id
          }).then(res => {
            if (res.code == 2000) {
              this.$message({
                message: "发布成功",
                type: "success"
              });
              // setTimeout(function() {
              //   self.$router.push({ path: "activeList" + self.urlLastId });
              // }, 2000);
              this.newList({ status: 0 });
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 删除
    handDelete(row) {
      let args = {
        activity_id: row.activity_id
      };
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestActiveDelete(args).then(res => {
            this.active == 4 ? this.newList({ status: 0 }) : this.newList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
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
  .news-content {
    border: 1px #d9d9d9 solid;
    margin: 0 auto;
    // width: 80%;
    padding: 15px;
    border-radius: 5px;
  }
  .examine-btn {
    margin: 30px auto;
    text-align: center;
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

