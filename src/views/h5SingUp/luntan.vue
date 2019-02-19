<template>
  <div class="info-container">
    <el-card class="box-card" style="margin-bottom:30px">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>搜索机构名称：</span>
          <el-input style="width:200px" v-model="objSearch.q" placeholder="机构名称"></el-input>
        </div>
        <div class="search">
          <span>论坛名称：</span>
          <el-input style="width:200px" v-model="objSearch.forum_name" placeholder="论坛名称"></el-input>
        </div>

        <div class="search ">
          <el-button type="primary" icon="el-icon-search" @click="searchKeyword()">搜索</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div style="margin:10px 0" align="right">
        <el-button @click="FormExport()" icon="el-icon-download" :disabled="tableData.length==0">导出数据</el-button>
      </div>
      <div class="table-list">
        <el-table :data="tableData" border @selection-change="selectionChange" style="width: 100%">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column label="编号" width="100" type="index">
          </el-table-column>

          <el-table-column label="机构名称" prop="inst_name">
          </el-table-column>
          <el-table-column label="论坛名称" prop="forum_name">
          </el-table-column>
          <el-table-column label="提交用户" prop="user_nickname">
          </el-table-column>
          <el-table-column label="提交时间" prop="create_time">
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
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
    <el-dialog title="查看详情" :visible.sync="dialogVisible " width="500px" :close-on-click-modal="false ">
      <el-scrollbar style="height:70vh;">
        <div class="ltpage-content">
          <header>
            <img width="750" src="https://img.sqydt.darongshutech.com/token_file_201812041739549237.jpg" alt="">
          </header>
          <main>
            <section class="form-item">
              <label>
                <i class="iconfont3 icon-baoming-network" :style="{color: themeColorShow}" :class="' '"></i> 请选择参与的论坛
                <i class="required-icon" :style="{color: themeColorShow}">*</i>
              </label>
              <div class="form-content">
                <div class="my-select"> {{form.forum_name}} &nbsp;
                  <i class="iconfont3 icon-baoming-daosanjiao" :style="{color: themeColorShow,fontSize:'14px'}"></i>
                </div>
              </div>
            </section>
            <section v-for="(item,index) in inputArr" :key="index" class="form-item">
              <label>
                <i class="iconfont3 " :style="{color: themeColorShow}" :class="item.icon"></i> {{ item.filed}}
                <i class="required-icon" :style="{color: themeColorShow}">*</i>
              </label>
              <div class="form-content">
                <input :placeholder="item.placeholder" readonly :value="form[item.form]" type="text">
              </div>
            </section>
            <section class="form-item">
              <label>
                是否参与过此类论坛
                <i class="required-icon" :style="{color: themeColorShow}">*</i>
              </label>
              <div class="form-content">
                <div class="my-radio">
                  <p>
                    <i :class="selectObj[form.had_join]" :style="{color: themeColorShow}"></i>
                    是
                  </p>
                  <p>
                    <i :class="selectTwoObj[form.had_join]" :style="{color: themeColorShow}"></i>
                    否
                  </p>
                </div>
              </div>
            </section>
            <section class="form-item">
              <label>
                如何看待成都市公益慈善的发展？
                <i class="required-icon" :style="{color: themeColorShow}">*</i>
              </label>
              <div class="form-content">
                <textarea v-model="form.inst_txt" readonly :style="{borderColor: themeColorShow}" placeholder="请输入文字描述" rows="6"></textarea>
              </div>
            </section>
            <section class="form-item">
              <label>
                现阶段在公益慈善发展的进程中，存在的疑问和困惑？
                <i class="required-icon" :style="{color: themeColorShow}">*</i>
              </label>
              <div class="form-content">
                <textarea v-model="form.inst_issue" readonly :style="{borderColor: themeColorShow}" placeholder="请输入文字描述" rows="6"></textarea>
              </div>
            </section>
            <section class="form-item">
              <label>
                是否有意向参与到现场互动分享环节
                <i class="required-icon" :style="{color: themeColorShow}">*</i>
              </label>
              <div class="form-content">
                <div class="my-radio">
                  <p>
                    <i :class="selectObj[form.will_share]" :style="{color: themeColorShow}"></i>
                    是
                  </p>
                  <p>
                    <i :class="selectTwoObj[form.will_share]" :style="{color: themeColorShow}"></i>
                    否
                  </p>
                </div>
              </div>
            </section>
            <section class="form-item">
              <label>
                优秀经验分享
                <i class="required-icon" :style="{color: themeColorShow}">*</i>
              </label>
              <div class="form-content">
                <textarea v-model="form.inst_share" readonly :style="{borderColor: themeColorShow}" placeholder="请输入文字描述" rows="6"></textarea>
                <div class="add-photo row">
                  <div class="add-photo-item" v-for="(item,index) in form.inst_share_images" :key="index">
                    <div class="photo-vession" :style="{backgroundImage: 'url(' + item + ')'}">
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section class="form-item">
              <label>
                对组委会的建议
                <i class="required-icon" :style="{color: themeColorShow}">*</i>
              </label>
              <div class="form-content">
                <textarea v-model="form.inst_advice" readonly :style="{borderColor: themeColorShow}" placeholder="期待您的建议，请输入文字描述" rows="6"></textarea>
              </div>
            </section>
          </main>
          <!-- <footer>
            <div :style="{backgroundColor: themeColorShow}" class="my-button">
              <i class="iconfont3 icon-baoming-tijiao"></i>
              提交报名
            </div>
            <div class="flex-between form-content row15">
              <a href="javascript:void(0);">
                <i class="iconfont3 icon-baoming-home" :style="{color: themeColorShow}"></i>
                首页
              </a>
              <a href="javascript:void(0);">
                <i class="iconfont3 icon-baoming-share" :style="{color: themeColorShow}"></i>
                分享
              </a>
            </div>
          </footer> -->
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import FromRequst from "@/fetch/modules/h5SignUp.js";
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue";
export default {
  components: { ChooseTab },
  data() {
    return {
      selectObj: {
        "1": "iconfont3 icon-baoming-xuanzhong",
        "2": "iconfont3 icon-baoming-weixuanzhong"
      },
      selectTwoObj: {
        "1": "iconfont3 icon-baoming-weixuanzhong",
        "2": "iconfont3 icon-baoming-xuanzhong"
      },
      form: {
        forum_name: "成都公益慈善发展主论坛",
        inst_user: "", // 	联系人姓名
        inst_tel: "", // 联系人电话
        inst_name: "", // 机构名称
        inst_user_position: "", // 联系人职位
        had_join: 2, // 是否参与过此类论坛 1是 2否
        inst_txt: "", // 观点
        inst_issue: "", // 疑问
        will_share: 1, // 是否愿意分享
        inst_share: "", // 经验分享
        inst_share_images: [], // 经验分享配图
        inst_advice: "" // 机构建议
      },
      themeColorShow: "#17B1ED",
      inputArr: [
        {
          filed: "姓名",
          form: "inst_user",
          icon: "icon-baoming-name",
          placeholder: "请输入参与论坛的机构联系人姓名",
          required: true
        },
        {
          filed: "联系方式",
          form: "inst_tel",
          icon: "icon-baoming-iphone",
          placeholder: "请输入参与论坛的机构电话",
          required: true
        },
        {
          filed: "工作单位",
          form: "inst_name",
          icon: "icon-baoming-company1",
          placeholder: "请输入参与论坛的机构名称",
          required: true
        },
        {
          filed: "职务",
          form: "inst_user_position",
          icon: "icon-baoming-zhiwei",
          placeholder: "请输入参与论坛的机构联系人职务",
          required: true
        }
      ],
      dialogVisible: false,
      tableData: [],
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      total_num: 0,
      objSearch: {
        q: "",
        current_page: 1,
        page_size: 10,
        forum_name: ""
      },
      formUserDetail: null // 用户详情数据
    };
  },
  created() {
    this.objSearch.form_id = this.$route.query.form_id;

    this.getData();
  },
  computed: {},
  methods: {
    searchKeyword() {
      this.getData();
    },
    getData() {
      var args = this.objSearch;
      FromRequst.RequestForumEnlist(args).then(res => {
        this.total_num = res.total_num;
        this.tableData = res.list;
      });
    },
    // 查看详情
    checkDetail(row) {
      var args = {
        enlist_id: row.enlist_id
      };
      FromRequst.RequestForumEnlistDetail(args).then(res => {
        console.log("详情", res);
        if (res && res.code == 2000) {
          this.dialogVisible = true;
          this.form = res.data;
        } else {
          this.$Message({
            type: "warning",
            text: "获取详情失败!"
          });
        }
      });
    },
    //表单导出数据
    FormExport() {
      window.location.href = "api/admin/cjh/forumEnlistExport" + "?token=" + getToken();
    },

    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      this.getData();
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
    //删除
    deleteClassfiy(row) {
      var form_id = row.form_id;
      this.deleteFn(form_id);
    },
    //  批量删除
    tabelDelete() {
      const selectionValues = this.selectionValues;
      var form_id = "";
      for (var i = 0; i < selectionValues.length; i++) {
        form_id += selectionValues[i].form_id + ",";
      }
      this.deleteFn(form_id);
    },
    //删除请求
    deleteFn(form_id) {
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          FromRequst.RequesFormDelete({ form_id: form_id }).then(res => {
            this.getData();
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

<style rel="stylesheet/scss" lang="scss" scoped>
@import url("./index.scss");

.ltpage-content {
  * {
    margin: 0;
    padding: 0;
  }

  input,
  button,
  select,
  option {
    vertical-align: middle;
    outline: none;
    border: none;
  }

  textarea {
    outline: none;
    border: none;
    resize: none;
  }

  /*解决 a标签点击出现色块*/
  a:active {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -moz-tap-highlight-color: rgba(0, 0, 0, 0);
    -ms-tap-highlight-color: rgba(0, 0, 0, 0);
    -o-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  header img {
    width: 100%;
  }

  section {
    font-size: 14px;
  }
  main,
  footer {
    width: 90%;
    margin: 0 auto;
  }
  footer {
    padding: 15px 3% 40px;
    box-sizing: border-box;
  }

  input {
    width: 100%;
    padding: 3px 0;
    font-size: 14px;
    border-bottom: 1px solid #f2f2f2;
  }

  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: #bababa;
  }
  input::-moz-placeholder,
  textarea::-webkit-input-placeholder {
    /* Mozilla Firefox 19+ */
    color: #bababa;
  }
  input:-moz-placeholder,
  textarea::-webkit-input-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #bababa;
  }
  input:-ms-input-placeholder,
  textarea::-webkit-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #bababa;
  }

  textarea {
    width: 100%;
    padding: 5px;
    font-size: 14px;
    border: 1px solid #f2f2f2;
    box-sizing: border-box;
  }

  .row {
    margin-top: 10px;
  }
  .row15 {
    margin-top: 20px;
  }
  .flex-between {
    display: flex;
    justify-content: space-between;
  }

  .form-item,
  .form-item .form-content {
    padding: 10px 0;
  }

  .form-item label {
    font-size: 15px;
    font-weight: 600;
  }

  .iconfont3 {
    margin-right: 5px;
    font-size: 15px;
    font-weight: 400;
  }
  .form-item .my-select {
    display: inline-block;
    padding: 4px 0 4px 7px;
    font-size: 14px;
    background-color: #f2f2f2;
    color: #2a2a2a;
    cursor: no-drop;
  }
  .my-button {
    width: 100%;
    padding: 7px 0;
    border-radius: 5px;
    margin: 0 auto;
    color: #fff;
    font-size: 14px;
    letter-spacing: 1px;
    text-align: center;
    cursor: no-drop;
  }
  .my-radio {
    width: 70%;
    display: flex;
    justify-content: space-between;
  }
  a {
    font-size: 16px;
    color: #333;
    cursor: no-drop;
  }

  footer .iconfont3 {
    font-size: 16px;
    margin-right: 0;
  }
  .icon-baoming-home,
  .icon-baoming-share {
    margin-right: 5px !important;
  }
  .icon-baoming-tijiao {
    margin-right: 2px !important;
    font-size: 14px !important;
  }

  .add-photo {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
  }
  .add-photo-item {
    width: 25%;
    padding: 5px;
    box-sizing: border-box;
  }
  .photo-vession {
    width: 100%;
    height: 120px;
    background-size: cover;
    background-position: 50% 50%;
    background-color: #f6f8f9;
    background-repeat: no-repeat;
  }
}
</style>
<style>
.d-detail-group .el-radio-group {
  width: 100%;
}
</style>


