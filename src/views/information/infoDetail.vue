<template>
  <div class="info-container">
    <el-card>
      <el-button icon="el-icon-arrow-left" @click="callbackTo">
        返回资讯列表
      </el-button>
      <div class="news-main">
        <h1 class="news-title">{{tmpExamineData.news_title}}</h1>
        <div class="news-info">
          <div class="news-small">来源：{{tmpExamineData.news_source || '本地'}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发布者：{{tmpExamineData.editor_name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发布时间：{{tmpExamineData.update_time}}</div>
        </div>

        <div v-if="tmpExamineData" style="width:750px;margin:0 auto">
          <h3> 是否关联公众号：{{{1:'是',2:'否'}[tmpExamineData.to_mp]}}</h3>
          <h3>资讯名称：{{tmpExamineData.news_title}}</h3>
          <h3>资讯来源：{{tmpExamineData.news_source || '本地'}}</h3>
          <h3 v-if="tmpExamineData.to_mp==1">原文链接：{{tmpExamineData.news_link}}</h3>
          <h3>资讯类型：{{{1:'图文',2:'图片',3:'视频'}[tmpExamineData.news_type]}}</h3>
          <h3 v-if="tmpExamineData.news_type==3 || tmpExamineData.news_type==2">资讯描述： {{tmpExamineData.news_intro}}</h3>
          <h3>资讯内容：</h3>

          <div v-if="tmpExamineData.news_type==1" style="width:750px" v-html="tmpExamineData.news_content" id="news-content" class="news-content"></div>
          <div v-if="tmpExamineData.news_type==2">
            <img :src="baseUrl+item.url" v-for="(item,index) in tmpExamineData.news_content" :key="index" width="240px" height="120px" alt="">
          </div>
          <div v-if="tmpExamineData.news_type==3">
            <video :src="baseUrl+tmpExamineData.news_content[0].url" width="400" controls></video>
          </div>
          <h3>
            <span>投放区域: </span>
            <span>{{{5:'服务资讯',2:'轮播',3:'官方快报',4:'推荐',1:'栏目资讯',6:'最热',7:'新时代',8:"全视界",9:'洞鉴'}[tmpExamineData.run_in]}}</span>
          </h3>
          <h3>
            <span>展现形式: </span>
            <span>{{tmpExamineData.news_pic_type=='0'?'无图':tmpExamineData.news_pic_type=='1' ?'小图':tmpExamineData.news_pic_type=='2'?'大图':'视频'}}</span>
          </h3>
          <div v-if="tmpExamineData.run_in==2">
            <h3>轮播标题：{{tmpExamineData.banner_title}}</h3>
            <h4 v-if="tmpExamineData.banner_pic">banner图:</h4>
            <img :src="tmpExamineData.banner_pic" v-if="tmpExamineData.banner_pic" width="240px" alt="">
          </div>
          <h3> 展示方式：{{{1:'原生',2:'H5'}[tmpExamineData.show_at]}}</h3>
          <!-- <h3> 是否显示封面：{{{1:'是',2:'否'}[tmpExamineData.show_pic]}}</h3> -->
          <!-- <h3> 是否关联活动：{{{1:'是',2:'否'}[tmpExamineData.link_miniprogram]}}</h3> -->
          <h3> 是否关联活动：{{{1:'是',2:'否'}[tmpExamineData.link_miniprogram]}}</h3>
          <div v-if="tmpExamineData.run_in==4 && tmpExamineData.is_top==2">
            <!--  0当前级 1全国 2全省 3全市 4全区 5全街道 -->
            <h3>置顶类型:{{{0:'当前级', 1:'全国', 2:'全省', 3:'全市', 4:'全区', 5:'全街道'}[tmpExamineData.to_top_type]}}</h3>
            <h3 v-if="tmpExamineData.to_top_type>=3">到期时间：{{{2:'全省', 3:'全市', 4:'全区/县', 5:'全街道'}[tmpExamineData.to_top_type]}}{{newsTop[{2:'province', 3:'city', 4:'area', 5:'street'}[tmpExamineData.to_top_type]].expiredate}}</h3>
          </div>
          <h3> 小程序发布时间：{{tmpExamineData.put_time}}</h3>
          <h3 v-if="tmpExamineData.to_mp==1">公众号发布时间：{{tmpExamineData.put_mp_time}}</h3>
          <h3 v-if="tmpExamineData.to_weibo==1">微博发布时间：{{tmpExamineData.put_weibo_time}}</h3>
          <h3 v-if="tmpExamineData.to_toutiao==1">头条发布时间：{{tmpExamineData.put_toutiao_time}}</h3>
          <h3 v-if="tmpExamineData.to_kuaichuan==1">快传发布时间：{{tmpExamineData.put_kuaichuan_time}}</h3>
          <h3 v-if="tmpExamineData.to_baijia==1">百家号发布时间：{{tmpExamineData.put_baijia_time}}</h3>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { RequestNewsDetail } from "../../fetch/modules/info.js";
export default {
  data() {
    return {
      newsData: {
        news_title: "",
        news_source: "",
        editor_name: "",
        update_time: "",
        news_content: ""
      },
      tmpExamineData: {},
      baseUrl: "https://img.sqydt.darongshutech.com/",
      newsTop: {},
      query: 1
    };
  },
  created() {
    // console.log(this.$route.query, "this.$route.query.");
    var news_id = this.$route.query.news_id;
    this.query = this.$route.query;
    RequestNewsDetail({ news_id: news_id }).then(res => {
      res.banner_pic = res.IMAGE_HOST + res.banner_pic;
      this.tmpExamineData = res;
    });
    if (localStorage.loginPermissionData) {
      this.newsTop = JSON.parse(localStorage.loginPermissionData).customer_conf.cross_recom_news_top_conf;
    }
  },
  updated() {
    // var tagP = document.getElementById("news-content").getElementsByTagName("p");
    // var tagImg = document.getElementById("news-content").getElementsByTagName("img");
    // for (var i = 0; i < tagP.length; i++) {
    //   tagP[i].style.textIndent = "20px";
    // }
    // for (var j = 0; j < tagImg.length; j++) {
    //   tagImg[j].style.display = "block";
    //   tagImg[j].style.textAlign = "center";
    //   tagImg[j].style.margin = "auto";
    //   tagImg[j].style.width = "100%";
    // }
  },
  methods: {
    callbackTo() {
      let _this = this;
      // this.$router.push({ name: "infoList", query: { active: this.query.active, currentPage: this.query.currentPage } });
      this.$router.push({
        name: "infoList",
        query: { active: this.query.active, currentPage: this.query.currentPage }
        // params: {}
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/information/infoDetail"
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
