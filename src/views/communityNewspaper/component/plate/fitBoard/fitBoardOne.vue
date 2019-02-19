<template>
  <div>
    <div>
      <!-- <p>{{dataStream.newspaper_page.page_header}}</p>
      <news-header builderId="1" :dataObj="dataStream.newspaper_page_items[0]" @emitClick="handleClick"></news-header> -->
      <div class="main-board-wrapper">
        <!-- 分割线定位 -->
        <div v-for="item in borderData" :key="item.id + '-label'" :style="item.styleObject">
          <img :src="item.url" v-if="item.type==1" width="100%" alt="">
        </div>
        <header>
          <div class="board-header board-header-size " style="padding: 40px 20px 10px 20px;">
            <div class="board-header-left ">
              <strong style="font-family: 'SimSun'; cursor: pointer;border:2px  solid #fff" :class="[pageName==0?'page-name-acitve':'']" @click="handleClickName(0)">{{dataStream.newspaper_page.page_header || '填入版面名称'}}</strong>
              <span>{{issn}} </span>
              <!-- <span>{{dataStream.newspaper_page.update_time | updateTime}} 星期{{{0:'日',1:'一',2:'二',3:'三',4:'四',5:'五',6:'六',}[new Date(dataStream.newspaper_page.update_time).getDay()]}}</span> -->
              <span>{{dataStream.newspaper_page.lunar.substring(0,14)}}</span>
            </div>
            <div class="board-header-right">
              <div class="board-number">{{dataStream.newspaper_page.page_num}}</div> 版
            </div>
          </div>
          <hr class="board-line board-line-m" />
        </header>
        <div v-for="(item,idx) in  dataStream.newspaper_page_items" :key="idx" @click="handleTransform(item,idx)" style="cursor: pointer" v-if="item.item_type!=0">
          <!-- {{item.points.coords[0]}} -->
          <div :style="{position:'absolute',overflow: 'hidden',top:`${item.points.coords[1]}px`,left:`${item.points.coords[0]}px`,width:`${item.points.coords[2]-item.points.coords[0]}px`, height:`${item.points.coords[3]-item.points.coords[1]}px`, border:builderId==item.builder_id?'2px dotted #39bcf3':'2px dotted #fff'}">
            <section class="one" v-if="item.builder_id==8">
              <div class="board-bg" :style="{backgroundImage: `url(${item.item_images.length? baseUrl+item.item_images[0] : ''})`,fontSize:'0px',height:'250px'}">
              </div>
              <article style="padding:10px 25px;line-height:23px;font-size:12px;background:#779FC9;color:#fff;">
                <div style="height:73px;overflow: hidden" v-html="item.item_txt">
                </div>
              </article>
            </section>

            <section v-else-if="item.builder_id==9">
              <div class="board-build3" :style="{backgroundImage: `url(${item.item_images.length? baseUrl+item.item_images[0] : ''})`,fontSize:'0px',height:'180px'}"></div>
              <div class="board-title  " style="margin:15px 0">
                <div class="board-title-border"></div>

                <div class="line_ellipsis_2" style="height:46px">{{item.item_title}}</div>

              </div>
              <article style="line-height:26px;font-size:12px;height:180px;overflow: hidden;">
                <div v-html="item.item_txt"></div>
              </article>
            </section>

            <section v-else-if="item.builder_id==10">
              <div class="board-build3" :style="{backgroundImage: `url(${item.item_images.length? baseUrl+item.item_images[0] : ''})`,fontSize:'0px',height:'110px'}"></div>
              <div class="board-title  " style="margin:15px 0">
                <div class="board-title-border"></div>
                <div class="ellipsos" style="height:24px">{{item.item_title}}</div>
              </div>
              <article style="line-height:23px;font-size:12px;height:95px;overflow: hidden;">
                <div v-html="item.item_txt"></div>
              </article>
            </section>

            <section v-else-if="item.builder_id==11">
              <div class="board-title" style="margin-bottom:15px">
                <div class="board-title-border"></div>
                <div class="ellipsos">{{item.item_title}}</div>
              </div>
              <article style="line-height:19px;font-size:12px;height:95px;overflow: hidden;">
                <div v-html="item.item_txt"></div>
              </article>
            </section>

            <section v-else-if="item.builder_id==12">
              <div class="board-title" style="margin-bottom:15px">
                <div class="board-title-border"></div>
                <div class="ellipsos">{{item.item_title}}</div>
              </div>
              <article style="line-height:18px;font-size:12px;height:165px;overflow: hidden;">
                <div v-html="item.item_txt"></div>
              </article>
            </section>

            <section v-else-if="item.builder_id==13">
              <div class="board-build3" :style="{backgroundImage: `url(${item.item_images.length? baseUrl+item.item_images[0] : ''})`,fontSize:'0px',height:'90px'}"></div>
              <div class="board-title" style="margin:15px 0">
                <div class="ellipsos" style="width:100%;text-align:center">{{item.item_title}}</div>
              </div>
              <article style="line-height:20px;font-size:12px;height:75px;overflow: hidden;">
                <div v-html="item.item_txt"></div>
              </article>
            </section>
            <section v-else-if="item.builder_id==14">
              <div class="board-flex">
                <div class="board-build3" :style="{flexShrink: '0',backgroundImage: `url(${item.item_images.length? baseUrl+item.item_images[0] : ''})`,fontSize:'0px',height:'70px',width:'300px'}"></div>
                <div class="board-one-m">
                  <strong>{{item.item_title}}</strong>
                  <article style="line-height:18px;font-size:12px;height:34px;overflow: hidden;width:386px">
                    <div v-html="item.item_txt"></div>
                  </article>
                </div>
              </div>
            </section>
          </div>

        </div>
        <!-- 报尾 -->
        <div>
          <div :style="{position:'absolute',top:`${1326}px`,left:`${20}px`,width:'710px',paddingBottom:'15px'}">
            <hr class="board-line" style="margin-bottom:0;" />
            <p align="right" style="padding:8px 0;font-size:14px;cursor: pointer;border:2px  solid #fff" :class="[pageName==0?'page-name-acitve':'']" @click="handleClickName(0)">{{dataStream.newspaper_page.page_end || '点击输入报尾信息，建议填写社区地址和投稿邮箱等信息。'}}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
const BORDERDATA = [
  {
    id: 1,
    type: 2, // 1图片定位 2. 非图片
    // borderAttr: 3, // 1上 2下 3左  4 右
    styleObject: {
      position: "absolute",
      top: `${480}px`,
      left: `${20}px`,
      width: "710px",
      height: "1px",
      borderTop: "1px solid #E5E5E5"
    },
    url: ""
  },
  {
    id: 2,
    type: 2, // 1图片定位 2. 非图片
    // borderAttr: 3, // 1上 2下 3左  4 右
    styleObject: {
      position: "absolute",
      top: `${502}px`,
      left: `${374}px`,
      width: "1px",
      height: "678px",
      borderLeft: "1px solid #E5E5E5"
    },
    url: ""
  },
  {
    id: 3,
    type: 2, // 1图片定位 2. 非图片
    // borderAttr: 3, // 1上 2下 3左  4 右
    styleObject: {
      position: "absolute",
      top: `${1210}px`,
      left: `${20}px`,
      width: "710px",
      height: "1px",
      borderTop: "1px solid #E5E5E5"
    },
    url: ""
  }
];
import { dateFormat } from "@/utils/time";
export default {
  props: {
    dataObj: {
      type: Object,
      default: function() {
        return {
          newspaper_page: {
            page_id: 1, //报刊版面id
            newspaper_id: 1, //社区报id
            template_id: 1, //模板id
            page_header: "报头",
            page_end: "报尾",
            page_num: "版号",
            page_pic: "http://", //版面图
            sort: 1, //排序值
            create_time: "2016-01-01 10:10", //发布时间
            update_time: "2016-01-01 10:10" //更新时间
          },
          newspaper_page_items: [
            {
              item_id: 1, // 内容id
              page_id: 1, // 报刊版面id
              newspaper_id: 1, // 社区报id
              template_id: 1, // 模板id
              builder_id: 1, // 构件id
              item_type: 0, // 类型: 0报头 1图文 2纯文本 3广告 4大图模式图文区
              item_title: "默认", // 主标题
              item_subtitle: "1", // 副标题
              item_link: "1", // 链接
              item_logo: "", // logo
              item_content: "1", // 内容详情
              item_txt: "aaa", // 内容梗概（显示在版面）
              item_images: [], // 图片（显示在版面）
              item_adv: {
                mini_run: "",
                mini_url: "",
                web_run: "",
                web_url: "",
                app_run: "",
                app_url: "",
                "app-id": "",
                path: ""
              }, // 广告
              sort: 11, // 排序值
              create_time: "2016-01-01 10:10", //发布时间
              update_time: "2016-01-01 10:10", //更新时间
              points: {
                shape: "default",
                coords: [20, 211, 730, 765]
              }
            }
          ]
        };
      }
    }
  },
  data() {
    return {
      dataStream: this.dataObj,
      builderId: null,
      borderData: BORDERDATA,
      baseUrl: "https://img.sqydt.darongshutech.com/",
      issn: JSON.parse(localStorage.getItem("newspperTitle")).issn || "第九期",
      pageName: 1
    };
  },
  filters: {
    updateTime(val) {
      let time = null;
      try {
        time = dateFormat(val, "Y年m月d日");
      } catch (error) {
        time = "2018年12月26日";
      }
      return time;
    }
  },
  watch: {
    dataObj(val) {
      this.dataStream = val;
    }
  },
  methods: {
    handleTransform(data, idx) {
      this.pageName = 1;
      this.builderId = data.builder_id;
      this.$emit("emitStream", { builder_id: data.builder_id, index: idx });
    },
    handleClickName(val) {
      this.pageName = val;
      this.builderId = null;
      this.$emit("emitStream", { builder_id: val, index: null });
    }
  }
};
</script>

<style  scoped>
@import url("./../index.css");
.board-header-left-m {
  margin-right: 30px;
}
.board-header-left span,
.board-header-left strong {
  margin-right: 30px;
}
.board-header-left strong {
  letter-spacing: 3px;
}
.board-title {
  display: flex;
  align-items: stretch;
}
.board-title-border {
  height: 17px;
  width: 10px;
  border-left: 3px solid #779fc9;
  position: relative;
  top: 3px;
  margin-right: 5px;
}
.board-flex {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}
.board-one-m {
  margin-left: 20px;
}
.board-one-m strong {
  display: block;
  margin: 10px 0;
  height: 16px;
  overflow: hidden;
}
.page-name-acitve {
  border: 2px dotted rgb(57, 188, 243) !important;
}
</style>

