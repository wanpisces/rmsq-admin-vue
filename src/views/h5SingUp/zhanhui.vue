<template>
  <div class="info-container">
    <el-card class="box-card" style="margin-bottom:30px">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>搜索机构名称：</span>
          <el-input style="width:200px" v-model="objSearch.q" placeholder="机构名称"></el-input>
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
            <img width="750" src="https://img.sqydt.darongshutech.com/token_file_201812041740488197.jpg" alt="">
          </header>
          <main>
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
                机构简介
                <i class="required-icon" :style="{color: themeColorShow}">*</i>
              </label>
              <div class="form-content">
                <textarea v-model="form.inst_desc" readonly :style="{borderColor: themeColorShow}" placeholder="请输入文字描述" rows="6"></textarea>
                <div class="add-photo row">
                  <div class="add-photo-item" v-for="(item,index) in form.inst_desc_images" :key="index">
                    <div class="photo-vession" :style="{backgroundImage: 'url(' + item + ')'}">
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section class="form-item">
              <label>
                机构品牌项目经验
                <i class="required-icon" :style="{color: themeColorShow}">*</i>
              </label>
              <div class="form-content">
                <textarea v-model="form.inst_exp" readonly :style="{borderColor: themeColorShow}" placeholder="请输入文字描述" rows="6"></textarea>
                <div class="add-photo row">
                  <div class="add-photo-item" v-for="(item,index) in form.inst_exp_images" :key="index">
                    <div class="photo-vession" :style="{backgroundImage: 'url(' + item + ')'}">
                    </div>
                  </div>
                </div>
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
      form: {},
      themeColorShow: "#17B1ED",
      inputArr: [
        {
          filed: "机构名称",
          form: "inst_name",
          icon: "icon-baoming-company1",
          placeholder: "请输入参与展会的机构名称",
          required: true
        },
        {
          filed: "联系人",
          form: "inst_user",
          icon: "icon-baoming-name",
          placeholder: "请输入参与论坛的机构联系人姓名",
          required: true
        },
        {
          filed: "联系人电话",
          form: "inst_tel",
          icon: "icon-baoming-iphone",
          placeholder: "请输入参与论坛的机构电话",
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
        page_size: 10
      }
    };
  },
  created() {
    this.objSearch.form_id = this.$route.query.form_id;

    this.getData();
  },
  computed: {},
  methods: {
    getData() {
      var args = this.objSearch;
      FromRequst.RequestExhibitionEnlist(args).then(res => {
        this.total_num = res.total_num;
        this.tableData = res.list;
      });
    },
    // 查看详情
    checkDetail(row) {
      var args = {
        enlist_id: row.enlist_id
      };
      FromRequst.RequestExhibitionEnlistDetail(args).then(res => {
        if (res.code == 2000) {
          this.form = res.data;
          this.dialogVisible = true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    searchKeyword() {
      this.getData();
    },
    //表单导出数据
    FormExport() {
      window.location.href = "api/admin/cjh/exhibitionEnlistExport" + "?token=" + getToken();
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
.detail-img > div {
  margin: 10px 0;
}
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


