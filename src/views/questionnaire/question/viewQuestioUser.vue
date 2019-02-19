<template>
  <div class="info-container">
    <el-card class="box-card">
      <div class="preview-footer">
        <el-button @click="backToList">返回查看问卷</el-button>
        <!-- <el-button @click="exportVoteList" type="primary">导出数据</el-button> -->
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>答题详情</span>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="subject_title" label="题目">
          <template slot-scope="scope">
            <span> {{ scope.row.subject_title || scope.row.builder_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="答案">
          <template slot-scope="scope">
            <div v-if="scope.row.subject_type == '0'">
              <div v-if="scope.row.builder_id == '4000007'" class="img-bg-box" :style="{backgroundImage: 'url(' + scope.row.fill_content + ')'}">
              </div>
              <span v-else> {{ scope.row.fill_content}}</span>
            </div>
            <div v-else>
              <!-- 填空 -->
              <span v-if="scope.row.subject_type == '3'"> {{ scope.row.fill_content}}</span>
              <div v-else>
                <p v-for="(item,index) in scope.row.fill_content" :key="index">选项： {{ item}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { RequestQuestionUserFill } from "@/fetch/modules/service.js";
import config from "@/fetch/config.js";
export default {
  data() {
    return {
      urlLastId: "",
      questionnaire_id: "",
      user_id: "",
      tableData: []
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
    this.user_id = this.$route.query.user_id;

    if (this.questionnaire_id && this.user_id) {
      this.getUserTopic();
    }
  },
  methods: {
    getUserTopic() {
      RequestQuestionUserFill({
        questionnaire_id: this.questionnaire_id,
        user_id: this.user_id
      }).then(res => {
        console.log("RequestQuestionUserFill--", res);
        this.tableData = res.data.list;
        this.tableData.map(function(item) {
          if (item.subject_type != "0" && item.subject_type != "3") {
            item.fill_content = item.fill_content.split(",");
          } else {
            if (item.builder_id == "4000008" || item.builder_id == "4000009") {
              const _choose = item.fill_content;
              item.builder_params.item_list.forEach(element => {
                if (element.key == _choose) {
                  item.fill_content = element.desc;
                }
              });
            }
          }
          return item;
        });
      });
    },

    backToList() {
      this.$router.push({
        path: "viewQuestion" + this.urlLastId,
        query: { questionnaire_id: this.questionnaire_id }
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/questionModule/viewQuestioUser" + this.urlLastId
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
.img-bg-box {
  width: 100px;
  height: 100px;
  background-size: cover;
  background-clip: content-box;
  background-position: 50% 50%;
  //   background-color: #f6f8f9;
  overflow: hidden;
}
</style>
