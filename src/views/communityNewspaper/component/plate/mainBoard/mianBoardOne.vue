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
          <div class="board-header">
            <div class="board-header-left">
              <div class="news-header" v-for="(item,idx) in  dataStream.newspaper_page_items" :key="idx" @click="handleTransform(item,idx)" :style="{cursor: 'pointer',border:builderId==item.builder_id?'2px dotted #39bcf3':'2px dotted #fff'}" v-if="item.item_type==0">

                <img :src="baseUrl+ item.item_logo" height="64px" width="250px" v-if="item.item_logo" alt="">
                <div v-else>
                  <div> {{item.item_title || '报纸标题'}}</div>
                  <div style="font-family:'Microsoft YaHei';color:#272727">{{item.item_subtitle || '请输入副标题'}}</div>
                </div>

              </div>
              <div :class="[pageName==0?'page-name page-name-active':'page-name']" @click="handleClickName(0)" style="margin-left: 20px">
                <div>{{dataStream.newspaper_page.page_header || '填入版面名称'}}</div>
                <div>—社区特色社区报</div>
              </div>
            </div>
            <div class="board-header-right">
              <div class="board-number">{{dataStream.newspaper_page.page_num}}</div> 版
            </div>
          </div>
          <div class="board-header board-header-bg board-size">
            <div>
              <i class="iconfont3 icon-shequbao-rili"></i>
              {{dataStream.newspaper_page.lunar}}
              <!-- {{dataStream.newspaper_page.update_time | updateTime}} 星期{{{0:'日',1:'一',2:'二',3:'三',4:'四',5:'五',6:'六',}[new Date(dataStream.newspaper_page.update_time).getDay()]}}  -->
            </div>
            <div v-if="dataStream.newspaper_page.weather">
              <i class="iconfont3 icon-shequbao-tianqi"></i>
              <span> 今日市区{{dataStream.newspaper_page.weather.weather_format}}</span>
            </div>
            <div> {{dataStream.newspaper_page.create_time.substring(0,4)}}年 {{issn}} 总第{{totalIssn}}期</div>
          </div>
          <hr class="board-line board-line-m" />
        </header>
        <div v-for="(item,idx) in  dataStream.newspaper_page_items" :key="idx" @click="handleTransform(item,idx)" style="cursor: pointer" v-if="item.item_type!=0">
          <!-- {{item.points.coords[0]}} -->
          <div :style="{position:'absolute',overflow:'hidden',top:`${item.points.coords[1]}px`,left:`${item.points.coords[0]}px`,width:`${item.points.coords[2]-item.points.coords[0]}px`, height:`${item.points.coords[3]-item.points.coords[1]}px`, border:builderId==item.builder_id?'2px dotted #39bcf3':'2px dotted #fff'}">
            <section class="one" v-if="item.builder_id==1">
              <div>
                <div class="board-imagetext-top">
                  <div>
                    <img src="./../../../../../../static/images/shequbao/title-bg1.png" width="100%" height="98px" alt="">
                  </div>
                  <div>
                    {{item.item_title ?item.item_title.substring(0,9):item.item_title}}
                    <div style="width:520px;position:relative;right:100px;height:45px;overflow: hidden" class="">
                      {{item.item_title? item.item_title.substring(9,25):""}}
                    </div>
                  </div>
                  <div>
                    <img src="./../../../../../../static/images/shequbao/title-bg2.png" width="100%" height="98px" alt="">
                  </div>
                </div>
              </div>
              <div style="" class="board-bg" :style="{backgroundImage: `url(${item.item_images.length? baseUrl+item.item_images[0] : ''})`,fontSize:'0px'}">
              </div>
              <article style="padding:10px !important; font-weight: normal !important;line-height:23px;font-size:12px;background:#779FC9;color:#fff;">
                <div style="height:138px;overflow: hidden" v-html="item.item_txt">

                </div>
                <!-- {{item.item_txt | itemContent}} -->
              </article>
            </section>

            <section v-else-if="item.builder_id==2">
              <div style="height:46px;overflow: hidden">
                <div class="board-title board-title-c line_ellipsis_2"> {{item.item_title}}</div>
              </div>

              <div style="padding:8px 0">
                <img src="./../../../../../../static/images/shequbao/devide-short.png" width="100%" alt="">
              </div>
              <article style="line-height:23px;font-size:12px;height:250px;overflow: hidden">
                <div v-html="item.item_txt">
                </div>
              </article>
            </section>

            <section v-else-if="item.builder_id==3">
              <div style="height:46px;overflow: hidden">
                <div class="board-title board-title-c line_ellipsis_2"> {{item.item_title}}</div>
              </div>

              <div style="padding:8px 0">
                <img src="./../../../../../../static/images/shequbao/devide-short.png" width="100%" alt="">
              </div>
              <div class="board-build3" :style="{backgroundImage: `url(${item.item_images.length? baseUrl+item.item_images[0] : ''})`,fontSize:'0px'}"></div>
              <article style="line-height:21px;font-size:12px;height:123px;overflow: hidden;margin-top:5px">
                <div v-html="item.item_txt"></div>
              </article>
            </section>

            <section v-else-if="item.builder_id==4">
              <div style="height:46px;overflow: hidden">
                <div class="board-title board-title-c line_ellipsis_2"> {{item.item_title}}</div>
              </div>

              <div style="padding:8px 0">
                <img src="./../../../../../../static/images/shequbao/devide-short.png" width="100%" alt="">
              </div>
              <article style="line-height:21px;font-size:12px;height:126px;overflow: hidden">
                <div v-html="item.item_txt"></div>
              </article>
            </section>

            <section v-else-if="item.builder_id==5">
              <div class="board-ad">
                <div>
                  <div class="board-ad-bg" :style="{backgroundImage: `url(${item.item_images.length? baseUrl+item.item_images[0] : ''})`,fontSize:'0px',height:'78px'}"></div>
                  <div class="" style="width:186px;height:46px;overflow:hidden">
                    <!-- <img class="float-ad" src="https://img.sqydt.darongshutech.com/token_file_201812171604416048.jpg" alt=""> -->
                    <span class="board-title board-title-c"> {{item.item_title}}</span>
                  </div>
                </div>
                <article style="line-height:20px;font-size:12px;height:120px;overflow: hidden;padding-left:10px;width:270px" v-html="item.item_txt"> </article>
              </div>
            </section>

            <section v-else-if="item.builder_id==6">
              <div>
                <div style="height:44px;overflow:hidden">
                  <!-- <img src="https://img.sqydt.darongshutech.com/token_file_201812171604416048.jpg" alt=""> -->
                  <span class="board-title board-title-c"> {{item.item_title}}</span>
                </div>
                <article style="line-height:23px;font-size:12px;height:75px;overflow: hidden;" v-html="item.item_txt"> </article>
                <div class="board-build3" :style="{backgroundImage: `url(${item.item_images.length? baseUrl+item.item_images[0] : ''})`,fontSize:'0px'}"></div>
              </div>
            </section>
          </div>

        </div>
        <!-- 报尾 -->
        <div>
          <div :style="{position:'absolute',top:`${1326}px`,left:`${20}px`,width:'710px',paddingBottom:'15px'}">
            <hr class="board-line" style="margin-bottom:0;" />
            <p align="right" style="padding:8px 0;font-size:14px;cursor: pointer;" :class="[pageName==0?'page-name-active':'']" @click="handleClickName(0)">{{dataStream.newspaper_page.page_end || "点击输入报尾信息，建议填写社区地址和投稿邮箱等信息。"}}</p>
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
    type: 1, // 1图片定位 2. 非图片
    // borderAttr: 1, // 1上 2下 3左  4 右
    url: "./../../../../../../static/images/shequbao/devide-long.png",
    styleObject: {
      position: "absolute",
      top: `${770}px`,
      left: `${20}px`,
      width: "710px"
    }
  },
  {
    id: 2,
    type: 2, // 1图片定位 2. 非图片
    // borderAttr: 3, // 1上 2下 3左  4 右
    styleObject: {
      position: "absolute",
      top: `${827}px`,
      left: `${249.33}px`,
      width: "1px",
      height: "300px",
      borderLeft: "1px dotted #E5E5E5"
    },
    url: ""
  },
  {
    id: 3,
    type: 2, // 1图片定位 2. 非图片
    // borderAttr: 3, // 1上 2下 3左  4 右
    url: "",
    styleObject: {
      position: "absolute",
      top: `${827}px`,
      left: `${499.66}px`,
      width: "1px",
      height: "473px",
      borderLeft: "1px dotted #E5E5E5"
    }
  },
  {
    id: 4,
    type: 2, // 1图片定位 2. 非图片
    // borderAttr: 3, // 1上 2下 3左  4 右
    url: "",
    styleObject: {
      position: "absolute",
      top: `${1160}px`,
      left: `${20}px`,
      width: "460px",
      height: "1px",
      borderTop: "1px solid #E5E5E5"
    }
  },
  {
    id: 5,
    type: 2,
    url: "",
    styleObject: {
      position: "absolute",
      top: `${1037}px`,
      left: `${520.66}px`,
      width: "209.33px",
      height: "1px",
      borderTop: "1px dotted #E5E5E5"
    }
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
              }, // 广告// 广告
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
      // textOne: ""
      issn: JSON.parse(localStorage.getItem("newspperTitle")).issn || "第九期",
      totalIssn: JSON.parse(localStorage.getItem("newspperTitle")).total || "100",
      pageName: 1
    };
  },
  mounted() {},
  filters: {
    updateTime(val) {
      let time = null;
      try {
        time = dateFormat(val, "Y年m月d日");
      } catch (error) {
        time = "2018年12月26日";
      }
      return time;
    },
    createTime(val) {
      let time = null;
      try {
        time = dateFormat(val, "Y年");
      } catch (error) {
        time = "";
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
.page-name-active {
  outline: 2px dotted rgb(57, 188, 243) !important;
}
</style>
