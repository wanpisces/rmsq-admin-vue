<template>
  <div class="page_box">
    <section>
      <div class="editor_container">
        <UE @changeTitle="changeTitle" @changeAuthor="changeAuthor" :placeholderMsg="placeholderMsg" :titVal="ueTitle" :authorVal="ueAuthor" :config="config" :id="ueId" ref="ue"></UE>
      </div>
      <div class="img_article_multimedia">
        <h4 class="img_article_list_title">多媒体</h4>
      </div>
    </section>
  </div>
</template>

<script>
import UE from "@/components/ue/ue.vue";
export default {
  components: { UE },
  data() {
    return {
      placeholderMsg: "我是提示文字placeholder",
      ueTitle: "",
      ueAuthor: "",
      config: {
        id: "myEditor",
        initialFrameWidth: 750,
        initialFrameHeight: 350,
        wordCount: false,
        elementPathEnabled: false,
        initialContent: "",
        autoClearinitialContent: true
      },
      ueId: "ue1" // 不同编辑器必须不同的id
    };
  },
  created() {},
  methods: {
    getUEContent() {
      let content = this.$refs.ue.getUEContent(); // 获取编辑器html内容
      alert(content);
    },
    getUEContentTxt() {
      let content = this.$refs.ue.getUEContentTxt(); // 获取纯文本内容方法
      alert(content);
    },
    insertContent() {
      this.$refs.ue.insertContent("<p>新的段落</p>"); // 在光标处插入内容 （图片/视频等 ）
    },
    changeTitle(val) {
      this.ueTitle = val;
    },
    changeAuthor(val) {
      this.ueAuthor = val;
    }
  }
};
</script>

<style scoped>
.page_box {
  width: 1250px;
  line-height: 20px;
  padding: 20px 0;
  margin: 20px auto;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: #ffffff;
}
section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
h4 {
  font-weight: 400;
  font-size: 14px;
}
.fixed {
  position: fixed;
  top: 0;
  right: 0;
  margin-top: 0;
}
.editor_container {
  width: 750px;
}
.img_article_list,
.img_article_multimedia {
  width: 250px;
  padding: 0 20px;
}

.list_item,
.list_item2 {
  padding: 12px;
  position: relative;
  border: 1px solid #e7e7eb;
}
.list_item {
  height: 132px;
}
.list_item img {
  width: 100%;
}
.list_item .list_mask {
  width: 100%;
  height: 100%;
  background: url("https://mmbiz.qlogo.cn/mmbiz_jpg/rwzeDg6icqSyBZ2eqCcfxiapnRda1Diby5TV6H1VtNtKmACLxVJX5uJEcE7faepiaCDiaaJHhia4ggCYdcxiaMwfmQEYQ/0?wx_fmt=jpeg") no-repeat;
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
}

.list_item2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: none;
  font-size: 14px;
}
.item2_Thumbnail {
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
.add_icon {
  position: relative;
  width: 48px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  cursor: pointer;
}
.add_icon i {
  font-size: 36px;
  color: #e3e3e3;
}
.add_icon:hover > i {
  color: #999;
}
.add_icon:hover > .list_add_type {
  display: block;
}
.list_add_type {
  position: absolute;
  top: 52px;
  left: -50%;
  margin-left: -17px;
  width: 130px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  display: none;
}
.list_add_type:before {
  content: " ";
  position: absolute;
  top: -4px;
  left: 50%;
  margin-left: -4px;
  display: inline-block;
  width: 0;
  height: 0;
  border-width: 4px;
  border-style: dashed;
  border-color: transparent;
  border-top-width: 0;
  border-bottom-color: rgba(0, 0, 0, 0.8);
  border-bottom-style: solid;
}
.list_add_type .list_add_item {
  width: 100%;
  height: 44px;
  line-height: 44px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
}
.list_add_type .list_add_item i {
  margin-right: 8px;
  font-size: 14px;
}
</style>

