<template>
    <div class="info-container">
        <el-card class="box-card">
            <div class="preview-footer">
                <el-button @click="backToList">返回查看投票</el-button>
                <!-- <el-button @click="exportVoteList" type="primary">导出数据</el-button> -->
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>答题详情</span>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="subject_title" label="题目">
                </el-table-column>
                <el-table-column label="答案">
                    <template slot-scope="scope">
                        <!-- <div v-if="scope.row.subject_type == '0' && scope.row.subject_builder_list[0].builder_id == '4000007'" class="img-bg-box" :style="{backgroundImage: 'url(' + scope.row.fill_content + ')'}">
            </div>
            <span v-else> {{ scope.row.fill_content}}</span> -->

                        <div v-if="scope.row.subject_type == '0'">
                            <div v-if="scope.row.builder_id == '4000007'" class="img-bg-box" :style="{backgroundImage: 'url(' + scope.row.fill_content + ')'}">
                            </div>
                            <span v-else> {{ scope.row.fill_content}}</span>
                        </div>
                        <div v-else>
                            <p v-for="(item,index) in scope.row.fill_content" :key="index">选项： {{ item}}</p>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import { RequestVoteUserVoteFill } from "@/fetch/modules/service.js";
import config from "@/fetch/config.js";
export default {
  data() {
    return {
      urlLastId: "",
      vote_id: "",
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
    console.log("vote_id", this.$route.query.vote_id);
    this.vote_id = this.$route.query.vote_id;
    this.user_id = this.$route.query.user_id;

    if (this.vote_id && this.user_id) {
      this.getUserTopic();
    }
  },
  methods: {
    // 判断是否在数组中
    isInArr(_val, _arr) {
      return _arr.some(item => {
        if (item === _val) {
          return true;
        }
      });
    },
    getUserTopic() {
      RequestVoteUserVoteFill({
        vote_id: this.vote_id,
        user_id: this.user_id
      }).then(res => {
        console.log("RequestVoteUserVoteFill", res);
        const _seif = this;
        this.tableData = res.data;
        this.tableData.map(function(item) {
          if (item.subject_type != "0") {
            let _fillArr = [];
            const _fillCon = item.fill_content;
            item.subject_item_list.forEach(item2 => {
              if (typeof _fillCon === "string") {
                /* 单选 */
                if (item2.subject_item_id === _fillCon) {
                  _fillArr.push(item2.subject_item_title);
                }
              } else {
                /* 多选 */
                if (_seif.isInArr(item2.subject_item_id, _fillCon)) {
                  _fillArr.push(item2.subject_item_title);
                }
              }
            });
            item.fill_content = _fillArr;
          } else {
            item.builder_id = item.subject_builder_list[0].builder_id;
          }
          return item;
        });
      });
    },

    backToList() {
      this.$router.push({
        name: "votesDetail",
        query: { vote_id: this.vote_id }
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/service/viewVotesUser"
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
