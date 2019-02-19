<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="活动名称" v-model="objSearch.q"></el-input>
        </div>
        <!-- <div class="search">
          <span>角色：</span>
          <el-select v-model="select" placeholder="角色筛选" @change="selectId">
            <el-option v-for="item in modulesOptions" :key="item.role" :label="item.role_name" :value="item.role">
            </el-option>
          </el-select>
        </div> -->
        <div class="search">
          <el-button type="primary" icon="el-icon-search" @click="searchKeyword">搜索</el-button>
        </div>
      </div>
    </el-card>
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <div class="table-title clearfix">
          <div style="float:left;">
            <el-button type="danger" plain @click="tabelDelete()" :disabled="deleteMark">删除</el-button>
            <el-button v-for="(item, index) in switchData" :key="index" :type="objSearch.status == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
          </div>
          <div style="float:right;">
            <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->
            <choose-tab add-title="选择模板" @handleAdd="dialogVisible=true" @TimeOn="TimeOn">
            </choose-tab>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="selectionChange" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="编号" width="100" type="index">
          </el-table-column>
          <el-table-column label="活动名称" prop="form_name">
          </el-table-column>
          <el-table-column label="状态" prop="form_name">
            <template slot-scope="scope">
              <span>{{scope.row.status == 1?"已发布":"未发布"}}</span>
            </template>
          </el-table-column>
          <el-table-column label="反馈数" prop="fill_num">
          </el-table-column>
          <el-table-column label="更新时间" prop="update_time">
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status == 1" type="text" @click="checkDetail(scope.row)">查看</el-button>
              <el-button v-if="scope.row.status == 1" type="text" @click="handleOnline(scope.row)">取消发布</el-button>
              <el-button v-if="scope.row.status == 2" type="text" @click="handleOnline(scope.row)">发布</el-button>
              <el-button v-if="scope.row.status == 2" type="text" @click="handEditor(scope.row)">编辑</el-button>
              <el-button type="text" @click="checkData(scope.row)">查看数据</el-button>
              <el-button v-if="scope.row.status == 2" type="text" @click="deleteClassfiy(scope.row)">删除</el-button>
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
    <el-dialog title="扫描二维码 " :visible.sync="codeVisible " width="30%" :close-on-click-modal="false ">
      <div class="code-wrap">
        <img :src="curCodeUrl " alt=" ">
      </div>
    </el-dialog>
    <el-dialog title="选择模板" :visible.sync="dialogVisible" width="90%" :close-on-click-modal="false">
      <div class="panel-group">
        <div v-for="(item,index) in dataArr" :key="index" :class='curTemplateId ==item.template_id?"card-panel active":"card-panel"  ' @click="changeTemplate(item.template_id)">
          <img class="template-pic" :src="item.template_pic">
          <h2>{{item.template_name}}</h2>
        </div>
        <div class="btn-wrap">
          <el-button type="primary" size="middle" @click="switchTemplate">使用此模板</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FromRequst from "@/fetch/modules/formTemplate.js";
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue";
export default {
  components: { ChooseTab },
  data() {
    return {
      codeVisible: false,
      curCodeUrl: "",
      dialogVisible: false,
      curTemplateId: "",
      dataArr: [],
      tableData: [],
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      total_num: 0,
      switchData: [{ name: "已发布", active: "1" }, { name: "未发布", active: "2" }], // 上线下线,
      objSearch: {
        status: 1,
        q: "",
        order_time: 2,
        current_page: 1,
        page_size: 10
      }
    };
  },
  created() {
    this.objSearch.status = this.$route.query.active || 1;
    this.getTemplate();
    this.getData();
  },
  computed: {},
  methods: {
    getData() {
      var args = this.objSearch;
      FromRequst.RequesFormList(args).then(res => {
        if (res.list.length == 0 && this.objSearch.current_page > 1) {
          this.objSearch.current_page = +this.objSearch.current_page - 1;
          this.getData();
        } else {
          this.total_num = res.total_num;
          this.tableData = res.list;
        }
      });
    },
    checkData(row) {
      this.$router.push({ name: "userData", query: { form_id: row.form_id } });
    },
    //编辑信息
    handEditor(row) {
      const form_id = row.form_id;
      this.$router.push({ name: "workDaily", query: { form_id: form_id } });
    },
    getTemplate() {
      FromRequst.RequesTemplateList({}).then(res => {
        this.curTemplateId = res[0].template_id;
        this.dataArr = res;
      });
    },
    changeTemplate(template_id) {
      this.curTemplateId = template_id;
    },
    switchTemplate() {
      FromRequst.RequestFormApply({ template_id: this.curTemplateId }).then(res => {
        this.$router.push({
          name: "workDaily",
          query: { form_id: res.form_id }
        });
      });
    },
    // 上下线
    handleOnline(row) {
      FromRequst.RequesFormState({ form_id: row.form_id }).then(res => {
        this.getData();
      });
    },
    switchFn(active) {
      this.current_page = 1;
      this.objSearch.status = active;
      this.getData();
    },
    // 查看详情
    checkDetail(row) {
      const form_id = row.form_id;
      // this.codeVisible = true;
      // this.$router.push({ name: "formDetail", query: { form_id: form_id } });
      FromRequst.RequestFormMiniPermanentQr({ form_id: form_id }).then(res => {
        // console.log(res);
        this.curCodeUrl = res.base_url + res.key;
        this.codeVisible = true;
      });
    },
    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      this.getData();
    },
    // 搜索关键词
    searchKeyword() {
      this.objSearch.current_page = 1;
      this.getData();
    },
    //排序
    TimeOn(sort) {
      this.objSearch.order_time = sort;
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
.table-footer {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.code-wrap {
  width: 100%;
  text-align: center;
  img {
    width: 200px;
    height: auto;
  }
}
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
}
.btn-wrap {
  text-align: center;
  margin-top: 30px;
}
.table-title {
  margin: 20px 0;
}
.panel-group {
  margin: 40px auto auto;
  text-align: center;
  font-size: 0;
}
.card-panel {
  display: inline-block;
  margin: 0 8px 20px;
  width: 300px;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border: 2px solid #efebeb;
  border-radius: 10px;
  .template-pic {
    width: 100%;
    height: 185px;
  }
  h2 {
    text-align: center;
    font-size: 20px;
    font-weight: normal;
  }
  &:hover,
  &.active {
    border: 2px solid #39bcf3;
    cursor: pointer;
  }
  .icon-people {
    color: #40c9c6;
  }
  .icon-message {
    color: #36a3f7;
  }
  .icon-money {
    color: #f4516c;
  }
  .icon-shoppingCard {
    color: #34bfa3;
  }
  .card-panel-icon-wrapper {
    float: left;
    margin: 25px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }
  .card-panel-icon {
    float: left;
    font-size: 58px;
  }
  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 40px 26px 26px;
    margin-left: 0px;
    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 18px;
      margin-bottom: 12px;
    }
    .card-panel-num {
      font-size: 26px;
    }
  }
}
</style>
