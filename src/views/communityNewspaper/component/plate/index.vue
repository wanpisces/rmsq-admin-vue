<template>
  <div>
    <mian-board-one v-if="temId==1" @emitStream="emitStream" :dataObj="dataObj"></mian-board-one>
    <fit-board-one v-if="temId==2" @emitStream="emitStream" :dataObj="dataObj"></fit-board-one>
    <fit-board-two v-if="temId==3" @emitStream="emitStream" :dataObj="dataObj"></fit-board-two>
    <fit-board-three v-if="temId==4" @emitStream="emitStream" :dataObj="dataObj"></fit-board-three>
  </div>
</template>

<script>
// 副刊
import fitBoardOne from "./../plate/fitBoard/fitBoardOne";
import fitBoardTwo from "./../plate/fitBoard/fitBoardTwo";
import fitBoardThree from "./../plate/fitBoard/fitBoardThree";
// 主刊
import mianBoardOne from "./../plate/mainBoard/mianBoardOne";
export default {
  components: { fitBoardOne, fitBoardTwo, fitBoardThree, mianBoardOne },
  props: {
    temId: {
      type: Number || String,
      default: 1
    },
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
              item_images: "1", // 图片（显示在版面）
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
    return {};
  },
  methods: {
    emitStream(data) {
      // console.log("aaaa", data);
      this.$emit("emitStream", data);
    }
  }
};
</script>

<style>
</style>
