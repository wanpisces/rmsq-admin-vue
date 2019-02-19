<template>
  <div class="info-container">
    <div>
      <el-card class="box-card">
        <!-- 查询 -->
        <div class="search-box">
          <div class="search">
            <span>搜索活动名称：</span>
            <el-input style="width:200px" v-model="search.q" placeholder="活动名称"></el-input>
          </div>
          <div class="search">
            <span>选择一级服务类目：</span>
            <el-select v-model="search.category_id" placeholder="请选择">
              <el-option v-for="item in options" :key="item.category_id" :label="item.category_name" :value="item.category_id">
              </el-option>
            </el-select>
          </div>
          <div class="search" v-if="searchGovChildren.length!=0">
            <span>选择二级服务类目：</span>
            <el-select v-model="search.service_id" placeholder="请选择">
              <el-option v-for="item in searchGovChildren" :key="item.service_id" :label="item.service_title" :value="item.service_id">
              </el-option>
            </el-select>
          </div>
          <div class="search ">
            <el-button type="primary" icon="el-icon-search" @click="searchKeyword()">搜索</el-button>
          </div>
        </div>
      </el-card>
      <!-- tabelList -->
      <el-card class="box-card">
        <div class="table-list">
          <el-table :data="tableData" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading" ref="table">
            <el-table-column type="index">
            </el-table-column>
            <el-table-column label="活动名称" align="center">
              <template slot-scope="scope">
                <router-link style="color:rgb(64, 158, 255);" v-if="scope.row.theme_type==1" :to="{name:'activeDetail',query:{activity_id:scope.row.id}}">{{scope.row.title}}</router-link>
                <router-link style="color:rgb(64, 158, 255);" v-else-if="scope.row.theme_type==2" :to="{name:'revolveDetail',query:{id:scope.row.id,need_audit:scope.row.need_audit,service_id:scope.row.service_id}}">{{scope.row.title}}</router-link>
                <router-link style="color:rgb(64, 158, 255);" v-else-if="scope.row.theme_type==3" :to="{name:'votesDetail',query:{vote_id:scope.row.id}}">{{scope.row.title}}</router-link>
                <router-link style="color:rgb(64, 158, 255);" v-else-if="scope.row.theme_type==4" :to="{name:'questionnaireDetail',query:{questionnaire_id:scope.row.id}}">{{scope.row.title}}</router-link>
                <span v-else>{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="category_name" label="一级类目" align="center">
            </el-table-column>
            <el-table-column prop="service_title" label="二级类目" align="center">
            </el-table-column>
            <el-table-column label="分享封面" align="center">
              <template slot-scope="scope">
                <img v-if="scope.row.share_pic" :src="scope.row.share_pic" width="50px" height="50px" alt="">
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="分享文案" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.share_desc||'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="editBtn(scope.row)" size="small">编辑</el-button>
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
    </div>
    <!-- 模块添加 -->
    <div v-if="dialogVisible">
      <el-dialog title="分享样式设置" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
        <el-form :model="form" ref="form" :rules="rule" label-width="150px" :close-on-click-modal="false">
          <share-template :share_desc="form.share_desc" :share_pic="form.share_pic" :markBtn='true' @cancleForm="cancleForm" :curTitle="curTitle" @submitForm="submitForm" :templateData="templateData"></share-template>
        </el-form>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import MoPaging from "../../components/Paginations.vue";
import Tinymce from "../../components/Tinymce/index.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
import ShareTemplate from "@/components/ShareTemplate/index.vue";
import { RequestUploads } from "@/fetch/modules/public.js";
import {
  RequestShareActivityList,
  RequestshareActivityItem,
  RequestShareActivityEdit,
  RequestShareTheme
} from "@/fetch/modules/share.js";
// import SwitchTable from "../../components/SwitchTable/index.vue"
const rule = {
  share_pic: [{ required: true, message: "请上传分享封面图", trigger: "blur" }]
};
export default {
  components: { MoPaging, Tinymce, ChooseTab, ShareTemplate },
  data() {
    return {
      rule,
      options: [{ category_id: "", category_name: "全部" }],
      searchGovChildren: [],
      curTitle: "",
      radio: "1",
      radio1: "",
      templateData: [],
      form: {
        id: "",
        theme_type: 0,
        share_pic: "",
        share_desc: ""
      },
      loading: false,
      search: {
        // 搜索条件
        q: "", // 搜索条件
        page_size: 5,
        current_page: 1,
        category_id: "",
        service_id: ""
      },
      count: 0,
      tableData: [],
      dialogVisible: false
    };
  },
  created() {
    this.getService();
    this.getData();
  },
  mounted() {},
  watch: {
    "search.category_id"() {
      if (this.search.category_id != "") {
        this.search.service_id = "";
        this.options.map(item => {
          if (item.category_id == this.search.category_id) {
            var arr = [
              {
                service_id: "",
                service_title: "全部"
              }
            ];
            this.searchGovChildren = arr.concat(item.service_list);
          }
        });
      } else {
        this.search.service_id = "";
        this.searchGovChildren = [];
      }
    }
  },
  methods: {
    cancleForm() {
      this.dialogVisible = false;
    },
    //获取搜索类目
    getService() {
      RequestshareActivityItem({}).then(res => {
        this.options = this.options.concat(res);
      });
    },
    editBtn(row) {
      this.form.id = row.id;
      this.form.theme_type = row.theme_type;
      this.form.share_pic = row.share_pic;
      this.form.share_desc = row.share_desc;
      this.curTitle = row.title;
      RequestShareTheme({ theme_type: row.theme_type }).then(res => {
        this.templateData = res;
        this.dialogVisible = true;
      });
    },
    // 搜索关键词
    searchKeyword() {
      this.search.current_page = 1;
      this.getData();
    },
    //获取数据
    getData() {
      var args = this.search;
      RequestShareActivityList(args).then(res => {
        if (res.list) {
          this.tableData = res.list;
          this.count = res.total_num;
          this.loading = false;
        }
      });
    },
    submitForm(obj) {
      var args = {
        id: this.form.id,
        theme_type: this.form.theme_type,
        share_pic: obj.share_pic,
        share_desc: obj.share_desc
      };
      this.$refs["form"].validate(valid => {
        if (valid) {
          RequestShareActivityEdit(args).then(res => {
            if (res.code == 2000) {
              this.getData();
              this.dialogVisible = false;
            }
          });
        }
      });
    },
    // 分页选择
    pageChange(current) {
      this.search.current_page = current;
      this.getData();
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
    height: 70px;
    width: 70px;
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
    font-size: 10px;
    color: #8c939d;
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
  }
  .text-hover:hover {
    color: #1890ff;
    cursor: pointer;
  }
}
</style>

