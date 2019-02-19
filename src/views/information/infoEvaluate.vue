<template>
  <div class="info-container">
    <div>
      <el-card class="box-card">
        <!-- 查询 -->
        <div class="search-box">
          <div class="search">
            <span>输入搜索：</span>
            <el-input style="width:200px" v-model="search.q" placeholder="资讯名称/评论内容/评论者"></el-input>
          </div>

          <!-- <div class="search">
                  <span>资讯 ：</span>
                  <el-input style="width:200px" v-model="search.qa"  placeholder="资讯来源"></el-input> -->
          <!-- <el-select v-model="qa" placeholder="请选择资讯来源">
                        <el-option
                        v-for="item in AuthorOptions"
                        :key="item.qa"
                        :label="item.label"
                        :value="item.qa">
                        </el-option>
                  </el-select> -->
          <!-- </div> -->
          <!-- <div class="search">
                  <span>资讯模块：</span>
                  <el-select v-model="search.category_id" placeholder="请选择资讯模块">
                        <el-option
                        v-for="item in modulesOptions"
                        :key="item.category_id"
                        :label="item.category_name"
                        :value="item.category_id">
                        </el-option>
                  </el-select>
              </div> -->
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
            <div>
              <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->
              <choose-tab @TimeOn="timeOn">
              </choose-tab>
            </div>

          </div>
          <el-table :data="tableData" border style="width: 100%" ref="table" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!-- <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="资讯名称">
                                <span>{{ props.row.news_title }}</span>
                            </el-form-item>
                            <el-form-item label="">
                                <span>{{ props.row.news_intro }}</span>
                            </el-form-item>
                            <el-form-item label="标签">
                                <span >{{props.row.tags}}</span>
                            </el-form-item>
                            <el-form-item>
               
                            </el-form-item>
                        </el-form>
                    </template>
                    </el-table-column>  -->
            <!-- <el-table-column
                    label="评论类型"
                    width="180" >
                    <template slot-scope="scope">
                        <span>{{scope.row.comment_type==1?'资讯':''}}</span>
                    </template>
                </el-table-column > -->
            <el-table-column prop="news_title" label="资讯名称">
            </el-table-column>
            <el-table-column prop="comment_content" label="评论内容">
            </el-table-column>
            <el-table-column prop="user_name" label="评论者">
            </el-table-column>
            <!-- <el-table-column
                prop="user_name"
                label="评论昵称" >
                </el-table-column> -->
            <!-- <el-table-column
                    label="显示状态" >
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status==1? 'success':'danger'">{{scope.row.status==0? '草稿': scope.row.status==1? '正常':'禁用'}}</el-tag>
                    </template>
                </el-table-column> -->
            <!-- <el-table-column
                    label="更新时间" >
                    <template slot-scope="scope">
                        <span>{{scope.row.update_time}}</span>
                    </template>
                </el-table-column> -->
            <el-table-column fixed="right" label="操作" width="100" align="center" v-if="perm.newsCommentState==1">
              <template slot-scope="scope">
                <!-- <div class="el-icon-wrapper">
                  <i :class="scope.row.status==0? '草稿': scope.row.status==1? 'icon-ban':'icon-qiyong'" @click="handlePass(scope.row.comment_id)" :title="scope.row.status==0? '草稿': scope.row.status==1? '禁用':'启用'"></i>
                </div> -->
                <el-button type="text" size="small" @click="handlePass(scope.row.comment_id)"> {{scope.row.status==0? '草稿': scope.row.status==1? '禁用':'显示'}} </el-button>
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
import MoPaging from "../../components/Paginations.vue";
import Tinymce from "../../components/Tinymce/index.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
import SwitchTable from "../../components/Switchtable/index.vue";
// 数据service接口
import { RequestUploads } from "../../fetch/modules/public.js";
import { RequestQiNiutoken } from "../../fetch/tool";
import { RequestNewAuditList, RequestNewAudit, RequestCommentList, RequestCommentState } from "../../fetch/modules/info.js";
// 正则匹配
const rules = {
  news_title: [{ required: true, message: "请输入资讯标题", trigger: "blur" }, { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }]
};
export default {
  components: { MoPaging, Tinymce, ChooseTab, SwitchTable },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      to.meta.perm.forEach((item, index) => {
        if (vm.perm[item.perm_name]) {
          vm.perm[item.perm_name] = item.is_select; // 2-不显示 1-显示
        }
      });
    });
  },
  data() {
    return {
      // 按钮权限  2 不显示 1显示
      perm: {
        newsCommentState: 2
      },
      rules,
      search: {
        // 搜索条件
        q: "", // 搜索资讯标题的关键字
        order_time: 2, // 时间排序
        // status:1, // 上下线，
        status: 1
      },
      modulesOptions: [],
      tableData: [],
      current_page: 1,
      count: 0,
      page_size: 5,
      formLabelWidth: "120px",
      switchData: [{ name: "正常", active: "1" }, { name: "禁用", active: "2" }], // 上线下线,
      active: 1,
      loading: false
    };
  },
  created() {},
  mounted() {
    this.newList();
  },

  methods: {
    // 评论列表
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
      RequestCommentList(args).then(res => {
        if (res) {
          self.tableData = res.list;
          self.count = res.total_num;
          this.loading = false;
        }
      });
    },
    //  评论禁用显示
    handlePass(value) {
      RequestCommentState({ comment_id: value }).then(res => {
        res.code === 2000 ? this.newList({}) : "";
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
    // 正常/禁用切换
    switchFn(active) {
      this.current_page = 1;
      this.active = active;
      this.search.status = active;
      this.newList({ status: JSON.parse(active) });
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
}
</style>

