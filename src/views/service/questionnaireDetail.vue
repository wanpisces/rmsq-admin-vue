<template>
  <div class="info-container">
    <el-card class="box-card">
      <div class="preview-footer">
        <el-button @click="backToList">返回分享设置</el-button>
        <el-button @click="exportVoteList" type="primary">导出数据</el-button>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>问卷详情</span>

      </div>
      <div v-for="(item,index) in tableData" :key="index">
        <section v-if="item.subject_type != '0'">
          <h4>{{index+1}}.{{item.subject_title}}
            <samp class="font-size-14">（{{{'1':'单选','2':'多选，最多选'+item.max_select+'项，至少选'+item.min_select+'项','3':'填空'}[(item.subject_type == 1 || item.subject_type == 5 || item.subject_type == 7 ? '1' : (item.subject_type == 3 ? '3' : '2' ) )]}}）</samp>
          </h4>
          <el-table v-if="item.subject_type != 3" max-height="290" :data="item.subject_item_list" border style="width: 100%">
            <el-table-column prop="subject_item_title" label="选项">
            </el-table-column>
            <el-table-column prop="fill_num" label="参与人数">
            </el-table-column>

            <el-table-column label="比例">
              <template slot-scope="scope">
                <div style="display:inline-block;width:80%;">
                  <el-progress :show-text="false" :stroke-width="12" :percentage="+scope.row.fill_percent"></el-progress>
                </div>
                {{scope.row.fill_percent}}%
              </template>
            </el-table-column>
          </el-table>
          <div v-else>
            <el-button @click="seeDetail(item.subject_id)" type="primary">查看详细信息</el-button>
          </div>
        </section>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>参与用户</span>
      </div>
      <div>
        <el-table max-height="290" :data="userTableData" border style="width: 100%">
          <el-table-column label="序号">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column prop="user_nickname" label="用户昵称">
          </el-table-column>
          <el-table-column label="提交时间">
            <template slot-scope="scope">
              {{scope.row.create_time}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="toUserInfo(scope.row.user_id)" type="text">用户答题详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog title="查看详情" :visible.sync="dialogTableVisible">
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input size="mini" style="width:200px;margin-right:10px;" v-model="fillBlankForm.q" placeholder="提交内容"></el-input>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="searchDetail">搜索</el-button>
        </div>

        <div v-if="fillBlankData.length" class="search ">
          <el-button size="mini" type="primary" @click="exportDetailText">导出文本</el-button>
        </div>
      </div>
      <el-table max-height="290" :data="fillBlankData" border style="width: 100%">
        <el-table-column label="序号">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="user_nickname" label="提交用户">
          <!-- <template slot-scope="scope">
            {{ scope.row.is_anonymous == 1 ? scope.row.user_nickname.slice(0,1)+'**' : scope.row.user_nickname}}
          </template> -->
        </el-table-column>
        <el-table-column prop="fill_content" label="提交内容">
        </el-table-column>
        <el-table-column prop="create_time" label="提交时间">
        </el-table-column>

      </el-table>
      <div class="table-footer">
        <div style="margin-left: 20px;">
          <mo-paging :page-index="fillBlankForm.current_page" :total="count" :page-size="fillBlankForm.page_size" @change="pageChange">
          </mo-paging>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import MoPaging from "@/components/Paginations.vue"; // 分页
import { getToken } from "@/utils/auth.js";
import {
  RequestQuestionSubjectList,
  RequestQuestionnaireUser,
  RequestQuestionnaireSubjectFill
} from "@/fetch/modules/service.js";
import config from "@/fetch/config.js";
export default {
  components: { MoPaging },
  data() {
    return {
      dialogTableVisible: false,
      urlLastId: "",
      questionnaire_id: "",
      tableData: [],
      userTableData: [],
      fillBlankData: [],
      fillBlankForm: {
        subject_id: "", // 题目id
        q: "", // 关键字
        current_page: 1,
        page_size: 5
      },
      count: 0
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.urlLastId = to.meta.id;
    });
  },
  mounted() {
    console.log("questionnaire_id", this.$route.query.questionnaire_id);
    this.questionnaire_id = this.$route.query.questionnaire_id;

    if (this.questionnaire_id) {
      this.getSubjectList();
      this.getVoteUserList();
    }
  },
  methods: {
    // 获取所有题目
    getSubjectList() {
      RequestQuestionSubjectList({
        questionnaire_id: this.questionnaire_id
      }).then(res => {
        console.log("RequestQuestionSubjectList", res);
        this.tableData = res.data.list;
      });
    },
    // 获取所以用户
    getVoteUserList() {
      RequestQuestionnaireUser({
        questionnaire_id: this.questionnaire_id
      }).then(res => {
        console.log("RequestQuestionnaireUser", res);
        this.userTableData = res.data.list;
      });
    },
    // 导出题目
    exportVoteList() {
      //  config.baseUrl +
      window.location.href =
        "api/questionnaireAdmin/questionnaireExport" +
        "?token=" +
        getToken() +
        "&questionnaire_id=" +
        this.questionnaire_id;
    },
    // 获取填空题详情
    getFillBlankDetail() {
      let _arg = JSON.parse(JSON.stringify(this.fillBlankForm));
      for (let item in _arg) {
        if (_arg[item] == "") {
          delete _arg[item];
        }
      }
      console.log("_arg", _arg);
      RequestQuestionnaireSubjectFill(_arg).then(res => {
        if (res.code == 2000) {
          this.fillBlankData = res.data.list;
          this.count = res.data.total_num;
        }
      });
    },
    // 查看详情
    seeDetail(_subject_id) {
      this.dialogTableVisible = true;
      this.fillBlankForm.subject_id = _subject_id;
      this.getFillBlankDetail();
    },
    // 详情搜索
    searchDetail() {
      this.getFillBlankDetail();
    },
    // 分页选择
    pageChange(current) {
      this.fillBlankForm.current_page = current;
      this.getFillBlankDetail();
    },
    // 导出详情文本
    exportDetailText() {
      // config.baseUrl +
      window.location.href =
        "api/questionnaireAdmin/subjectFillExport" +
        "?token=" +
        getToken() +
        "&subject_id=" +
        this.fillBlankForm.subject_id;
    },
    // 用户答题详情
    toUserInfo(userID) {
      this.$router.push({
        name: "viewQuestioUser",
        query: { questionnaire_id: this.questionnaire_id, user_id: userID }
      });
    },
    backToList() {
      this.$router.push({
        name: "shareSetting"
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/service/questionnaireDetail"
      });
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  padding: 30px 15px;
  font-size: 14px;

  .box-card {
    margin-bottom: 30px;
  }
}
</style>
<style  rel="stylesheet/scss" lang="scss" >
.el-progress-bar__outer {
  border-radius: 0 !important;
}
.el-progress-bar__inner {
  border-radius: 0;
}
.preview-footer {
  display: flex;
  justify-content: space-between;
}
.font-size-14 {
  font-size: 14px;
  font-weight: 400;
}
.table-footer {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.search-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.search {
  //   width: 30%;
  display: flex;
  margin-right: 2%;
  align-items: center;
}
</style>