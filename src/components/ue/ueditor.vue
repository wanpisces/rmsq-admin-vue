<template>
  <div style="text-align:left;">
    <div :id=id></div>
    <div id="message_box">
    </div>
    <div id="message_footer">

    </div>
    <div class="upload-btn">
      <editorImage
        color="#20a0ff"
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
      ></editorImage>
      <editor-vedio
        color="#20a0ff"
        class="editor-upload-btn"
        @successCBK="vedioSuccessCBK"
        v-if="isVideioShow"
      ></editor-vedio>
    </div>
  </div>
</template>
<script>
import editorImage from "./components/editorImage";
import editorVedio from "./components/editorVedio";
export default {
  name: "UE",
  components: { editorImage, editorVedio },
  data() {
    return {
      editor: null,
      editorId: this.id,
      editorData: this.dataObject,
      placeholderHtml: "",
      // titleLength: 0,
      // titleLenBoxHidden: true,
      // authorLength: 0,
      // authorLenBoxHidden: true,
      original: false,
      show_cover_pic: "1"
    };
  },
  props: {
    dataObject: {
      //  内容
      type: String,
      default: ""
    },
    placeholderMsg: {
      type: String, // placeholder
      default: "从这里开始正文！"
    },
    hasTitle: {
      type: Boolean, // 是否有标题和作者
      default: true
    },
    config: {
      type: Object // UE配置
    },
    id: {
      type: String // 编辑区ID
    },
    isVideioShow: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    id() {
      this.editorId = this.id;
    },
    dataObject: function() {
      this.editorData = this.dataObject;
      this.editorData = this.editorData.replace("data-src", "src");
      this.editor.setContent(
        this.editorData ? this.editorData : this.placeholderHtml
      );
    },
    editorData() {
      this.$emit("changeContent", this.editorData);
    }
  },
  created() {
    this.placeholderHtml =
      '<p style="color: rgb(153, 153, 153);">' + this.placeholderMsg + "</p>";
  },
  mounted() {
    this.initEditor();
    // console.log("dataObject", this.dataObject);
  },

  methods: {
    // changeCoverShow(val) {
    //   this.editorData.show_cover_pic = +val;
    // },
    imageSuccessCBK(arr) {
      console.log(arr);
      let self = this;
      arr.forEach(v => {
        this.insertContent(
          `<img  width="100%" src=' ${
            v.url
          }' style="position:relative" alt='文章图片'>`
        );
      });
    },
    vedioSuccessCBK(url) {
      this.insertContent(
        `<video  width="100%" src="${url}" controls="controls">${url ||
          "开发者"}</video> `
      );
    },

    initEditor() {
      const _this = this;
      this.editor = UE.getEditor(this.id, this.config); // 初始化UE
      // 确保UE加载完成后，放入内容。
      this.editor.addListener("ready", function() {
        let editorArea = _this.qS("#" + _this.config.id + "_iframeholder");
        let toolBar = _this.qS("#" + _this.config.id + "_toolbarboxouter");
        editorArea.style.width = _this.hasTitle ? "70%" : "99%";
        editorArea.style.margin = "5px auto";
        // 加载默认内容
        _this.editor.setContent(
          _this.editorData ? _this.editorData : _this.placeholderHtml
        );
        // 编辑区域
        _this.hasTitle
          ? _this
              .qS("#" + _this.config.id)
              .insertBefore(_this.qS("#message_box"), editorArea)
          : (_this.qS("#message_box").style.display = "none");

        // 编辑区域后插入 message_footer
        _this
          .qS("#" + _this.config.id)
          .appendChild(_this.qS("#message_footer"));

        toolBar.onclick = function() {
          _this.clearEditor();
        };
      });

      // 文本框获取焦点时清空默认显示的内容（bug：单击标题和作者有时也会触发）
      // this.editor.addListener("focus", function() {
      //   console.log("focus");
      //   if (_this.editor.getContentTxt() == _this.placeholderMsg)
      //     _this.editor.setContent("");
      // });

      // 文本框失去焦点时,若内容为空则显示默认显示的内容
      this.editor.addListener("blur", function(eType, event) {
        // console.log("___中兴");
        if (!_this.editor.getContent()) {
          _this.editor.setContent(_this.placeholderHtml);
          _this.editorData = _this.getUEContent();
          // console.log("aaaa_aaa", _this.editorData);
        } else {
          // console.log("aaaaa_______");
          _this.editorData = _this.getUEContent();
          // _this.dataObject = _this.getUEContent();
          console.log(_this.editorData, this.dataObject);
          // _this.editorData.contentText = _this.getUEContentTxt();
        }
      });

      // 编辑区域单击事件
      this.editor.addListener("click", function() {
        _this.clearEditor();
        // 编辑区域获得焦点
        if (!_this.editor.isFocus) _this.editor.focus();
      });
    },

    getUEContent() {
      // 获取编辑器html内容
      let _content = this.editor.getContent();
      return _content == this.placeholderHtml ? "" : _content;
    },
    getUEContentTxt() {
      // 获取纯文本内容方法
      let _content = this.editor.getContentTxt();
      return _content == this.placeholderMsg ? "" : _content;
    },
    clearEditor() {
      // 清空默认显示的内容
      if (this.editor.getContent() == this.placeholderHtml)
        this.editor.setContent("");
    },
    chooseCover() {
      this.$emit("changeCover");
    },
    qS(el) {
      // DOM获取
      return document.querySelector(el);
    },
    qsAll(el) {
      // DOM获取
      return document.querySelectorAll(el);
    },
    insertContent(_content) {
      // 在光标处插入内容
      this.editor.execCommand("inserthtml", _content);
    }
  },
  bedoreDestroy() {
    this.editor.setContent("");
  },
  destroyed() {
    this.editor.destroy();
  }
};
</script>

<style scoped>
.edui-editor div {
  width: 100%;
}
.edui-editor {
  border-top: 1px solid #e7e7eb !important;
}
#message_box {
  padding: 130px 15% 0;
}
.message_title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 10px 0 20px;
}
.message_title input {
  height: 100%;
  font-size: 22px;
  font-weight: 500;
}
#message_box span {
  font-size: 14px;
  color: #999;
}
input::-webkit-input-placeholder {
  color: #999;
}
.message_author {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.message_author input {
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
}
input {
  width: 90%;
  outline: none;
  border: 0;
}

#message_footer {
  width: 70%;
  /* margin: 0 auto;
  padding: 40px 0;
  border-top: 1px solid #eee; */
  /* margin-left: 10px; */
}
#message_footer .cover_img {
  margin-top: 10px;
  width: 120px;
  height: 120px;
  background-image: url("");
  background-size: cover;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  background-repeat: no-repeat;
}
#message_footer .cover_img2 {
  width: 214px;
}
.cover_img:hover > .cover_img_mask {
  display: flex;
}
.cover_img_mask {
  display: none;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
}
.upload-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 30px 0;
}
.upload-btn div {
  margin-right: 10px;
}

.cover_img_mask i {
  padding: 3px;
  cursor: pointer;
}
</style>
