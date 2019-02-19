<template>
  <div class="info-container">
    <el-card class="box-card">
      <div class="preview-footer">
        <el-button @click="backToList">返回投票列表</el-button>
        <el-button @click="exportVoteList" type="primary" :disabled="tableData.length!=0?false:true">导出数据</el-button>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>投票详情</span>

      </div>
      <div v-for="(item,index) in tableData" :key="index">
        <section v-if="item.subject_type != '0'">
          <h4>{{index+1}}.{{item.subject_title}}
            <samp class="font-size-14">（{{(item.subject_type == '1' || item.subject_type == '3'|| item.subject_type == '5'|| item.subject_type == '7')?'单选':'多选，最多选'+item.max_select+'项，至少选'+item.min_select+'项'}}）</samp>
          </h4>
          <el-table max-height="290" :data="item.subject_item_list" border style="width: 100%">
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

  </div>
</template>

<script>
import { RequestSubjectList, RequestVoteUserList } from "@/fetch/modules/service.js";
import { getToken } from "@/utils/auth.js";
import config from "@/fetch/config.js";
export default {
  data() {
    return {
      urlLastId: "",
      vote_id: "",
      tableData: [],
      userTableData: [
        // {
        //   no: 1,
        //   nickname: "大菠萝",
        //   time: "2018-07-22"
        // },
        // {
        //   no: 2,
        //   nickname: "小菠萝",
        //   time: "2018-07-22"
        // }
      ]
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.urlLastId = to.meta.id;
    });
  },
  mounted() {
    console.log("vote_id", this.$route.query.vote_id);
    this.vote_id = this.$route.query.vote_id;

    if (this.vote_id) {
      this.getSubjectList();
      this.getVoteUserList();
    }
  },
  methods: {
    // 获取题目列表
    getSubjectList() {
      RequestSubjectList({
        vote_id: this.vote_id
      }).then(res => {
        console.log("RequestSubjectList", res);
        this.tableData = res.data.list;
      });
    },
    // 获取用户列表
    getVoteUserList() {
      RequestVoteUserList({
        vote_id: this.vote_id
      }).then(res => {
        console.log("RequestVoteUserList", res);
        this.userTableData = res.data.list;
      });
    },
    // 导出数据
    exportVoteList() {
      // config.baseUrl +
      window.location.href = "api/voteAdmin/voteExport" + "?token=" + getToken() + "&vote_id=" + this.vote_id;
    },
    // 用户答题详情
    toUserInfo(userID) {
      this.$router.push({
        path: "viewVotesUser" + this.urlLastId,
        query: { vote_id: this.vote_id, user_id: userID }
      });
    },
    // 返回上一页
    backToList() {
      this.$router.push({
        path: "vote" + this.urlLastId
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/voting" + this.urlLastId + "/viewVotes" + this.urlLastId
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
</style>