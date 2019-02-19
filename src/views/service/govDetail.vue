<template>
  <div class="info-container">
    <el-card>
      <el-button icon="el-icon-arrow-left" @click="callback">
        <router-link class="news-link" :to="{ name: 'serviceGov'}"> 返回政务公开 </router-link>
      </el-button>
      <div class="news-main">
        <h1 class="news-title">{{newsData.news_title}}</h1>
        <div class="news-info">
          <div class="news-small">来源：{{newsData.news_source}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发布者：{{newsData.editor_name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发布时间：{{newsData.update_time}}</div>
        </div>
        <div id="news-content" class="news-content" v-html="newsData.news_content">{{newsData.news_content}}</div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { RequestGovDetail } from "../../fetch/modules/service.js";
export default {
  data() {
    return {
      newsData: {
        news_title: "",
        news_source: "",
        editor_name: "",
        update_time: "",
        news_content: ""
      }
    };
  },
  created() {
    var news_id = this.$route.query.news_id;
    RequestGovDetail({ news_id: news_id }).then(res => {
      this.newsData = res;
    });
  },
  updated() {
    var tagP = document
      .getElementById("news-content")
      .getElementsByTagName("p");
    var tagImg = document
      .getElementById("news-content")
      .getElementsByTagName("img");
    for (var i = 0; i < tagP.length; i++) {
      tagP[i].style.textIndent = "20px";
    }
    for (var j = 0; j < tagImg.length; j++) {
      tagImg[j].style.display = "block";
      tagImg[j].style.textAlign = "center";
      tagImg[j].style.margin = "auto";
    }
  },
  methods: {
    callback() {
      this.$router.push({ path: "serviceGov" });
      this.$store.dispatch("delVisitedViews", {
        path: "/service/govDetail"
      });
    }
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .news-main {
    padding: 0 25px;
    .news-title {
      text-align: center;
      font-size: 30px;
      color: #353535;
    }
    .news-audit {
      color: red;
      text-align: center;
    }
    .news-info {
      padding: 10px 0px 12px;
      border-bottom: 1px solid #eee;
      .news-small {
        text-align: right;
        font-size: 14px;
      }
    }
    .news-content {
      margin: auto;
      font-size: 18px;
      & p {
        text-indent: 15px;
      }
    }
  }
}
</style>
