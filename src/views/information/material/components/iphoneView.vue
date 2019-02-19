<template>
  <div>
    <!-- <img src="../../../../../static/images/iphone-bg.png" alt=""> -->
    <div id="previewbox">
      <div id="preview-content">
        <div v-if="show">
          <div class="" v-for="(items,index) in content" :key="index">
            <!-- 列表第一项 -->
            <div class="list_item" v-if="index==0" @click="handleShow(items)">
              <!-- :style="{backgroundImage: 'url(' + content[index].news_pic + ')'}" -->
              <div class="list_mask">
                <img :src="content[index].showBaseUrl?baseUrl+content[index].news_pic:content[index].news_pic" alt="" width="214px" height="120px">
                <div class="list_title">
                  <p class="line_ellipsis_2">{{ content[index].news_title == '' ? '标题' : content[index].news_title}}</p>
                </div>
              </div>
            </div>
            <!-- 列表其他项 -->
            <div class="list_item2" v-if="index>0" @click="handleShow(items)">
              <p class="ellipsos">{{content[index].news_title == '' ? '标题' : content[index].news_title }}</p>
              <div class="item2_Thumbnail" :style="{backgroundImage: 'url(' +baseUrl+ content[index].news_pic  + ')'}">
              </div>
            </div>

          </div>
        </div>

        <section v-else>
          <div class="pre-back">
            <i class="el-icon-arrow-left" @click="callBack"></i>
          </div>
          <div v-if="article.news_type==1">
            <div v-html="article.news_content" id="news-content" class="pre-article">
            </div>
          </div>
          <div v-if="article.news_type==2">
            <div v-for="(item,index) in article.content_url" :key="index">
              <img :src="item" alt="" v-if="item" width="100%">
            </div>
          </div>
          <div v-if="article.news_type==3" style="margin-top:30px">

            <video :src="article.video_url" width="100%" controls></video>
          </div>

        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { isUrl } from "@/utils/validate";
export default {
  props: {
    value: Array,
    default: function() {
      return [];
    }
  },
  data() {
    return {
      content: this.value,
      contentText: "",
      show: true,
      baseUrl: "https://img.sqydt.darongshutech.com/"
    };
  },

  // updated() {
  //   var tagP = document.getElementById("news-content").getElementsByTagName("p");
  //   var tagImg = document.getElementById("news-content").getElementsByTagName("img");
  //   for (var i = 0; i < tagP.length; i++) {
  //     tagP[i].style.textIndent = "20px";
  //   }
  //   for (var j = 0; j < tagImg.length; j++) {
  //     tagImg[j].style.display = "block";
  //     tagImg[j].style.textAlign = "center";
  //     tagImg[j].style.margin = "auto";
  //     tagImg[j].style.width = "100%";
  //   }
  // },
  updated() {
    if (document.getElementById("news-content")) {
      var tagP = document.getElementById("news-content").getElementsByTagName("p");
      var tagImg = document.getElementById("news-content").getElementsByTagName("img");
      // for (var i = 0; i < tagP.length; i++) {
      //   tagP[i].style.textIndent = "20px";
      // }
      for (var j = 0; j < tagImg.length; j++) {
        tagImg[j].style.display = "block";
        tagImg[j].style.textAlign = "center";
        tagImg[j].style.margin = "auto";
        tagImg[j].style.width = "100%";
      }
    }
  },
  created() {
    // console.log(this.content);
  },
  methods: {
    handleShow(items) {
      // console.log(items);
      this.article = items;
      this.show = false;
    },
    callBack() {
      this.show = true;
      this.article = "";
    }
  }
};
</script>

<style scoped>
#previewbox {
  /* z-index: 999999999;
  display: none;
  position: fixed;
  left: 125px;
  top: 0px;
  bottom: 100px; */
  position: relative;
  width: 411px;
  height: 839px;
  margin: 0 auto;
  background: url("../../../../../static/images/iphone-bg.png");
  background-size: cover;
  background-position: 50% 50%;
  /* background-color: #f6f8f9; */
  background-repeat: no-repeat;
  /* margin: 0px 650px;
  background-size: contain;
  padding: 120px 25px 116px 36px; */
}
#preview-content {
  position: absolute;
  top: 150px;
  left: 43px;
  width: 364px;
  height: 620px;
  margin-left: -19px;
  margin-top: -30px;
  padding-right: 0px;
  padding-top: 5px;
  overflow-y: scroll;
  /* border: 1px red solid; */
  -ms-overflow-y: scroll;
  background-color: #fff;
}
.pre-back {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 40px;
  line-height: 50px;
  border-bottom: 1px solid #eee;
  background: #fff;
  width: 100%;
}
.pre-back i {
  margin-left: 10px;
  font-size: 30px;
  cursor: pointer;
}
.pre-article {
  margin-top: 55px;
}

.list_item,
.list_item2 {
  padding: 5px;
  position: relative;
  border: 1px solid #e7e7eb;
  cursor: pointer;
}
.active_item {
  border: 2px solid #43b548 !important;
  box-sizing: border-box;
}
.list_item {
  height: 152px;
}
.list_item:hover > .list_sort,
.list_item2:hover > .list_sort {
  display: block;
}
.list_item img {
  width: 100%;
}
.list_item .list_mask {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-clip: content-box;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  overflow: hidden;
}
.list_item .list_title {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  padding: 33px 15px 5px;
  background-color: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  color: #ffffff;
  font-size: 14px;
  line-height: 24px;
  position: absolute;
  top: 0px;
  left: 0px;
}

.list_item2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: none;
  font-size: 14px;
}
.item2_Thumbnail {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background-image: url("");
  background-size: cover;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  background-repeat: no-repeat;
}
.list_item3 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 92px;
  border: 2px dotted #d9dadc;
  border-top: none;
}
</style>
