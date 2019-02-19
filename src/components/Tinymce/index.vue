<template>
  <div class="tinymce-container editor-container">
    <textarea class="tinymce-textarea" :id="tinymceId" @blur="blurTinymc()"></textarea>
    <div class="editor-custom-btn-container">
      <editorImage color="#20a0ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
      <!-- <editor-vedio color="#20a0ff" class="editor-upload-btn" @successCBK="vedioSuccessCBK"></editor-vedio> -->
    </div>
       
  </div>
</template>
<script type="text/ecmascript-6">
import editorImage from "./components/editorImage";
import editorVedio from "./components/editorVedio";
export default {
  name: "tinymce",
  components: { editorImage, editorVedio },
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return ["styleselect | formatselect | fontselect fontsizeselect | fontFamily  |forecolor backcolor | bold italic underline strikethrough | image  media | table | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | preview removeformat  hr | paste code  link | undo redo | fullscreen "];
        //  return ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link image charmap	 preview anchor pagebreak fullscreen insertdatetime media table emoticons forecolor backcolor']
      }
    },
    styleFormats: {
      type: Array,
      default() {
        return [
          {
            title: "首行缩进",
            block: "p",
            styles: { "text-indent": "2em" }
          },
          {
            title: "行高",
            items: [
              { title: "1", styles: { "line-height": "1" }, inline: "span" },
              {
                title: "1.5",
                styles: { "line-height": "1.5" },
                inline: "span"
              },
              { title: "2", styles: { "line-height": "2" }, inline: "span" },
              {
                title: "2.5",
                styles: { "line-height": "2.5" },
                inline: "span"
              },
              { title: "3", styles: { "line-height": "3" }, inline: "span" }
            ]
          }
        ];
      }
    },
    menubar: {
      default: "insert"
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || "vue-tinymce-" + +new Date()
    };
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val));
      }
    }
  },
  mounted() {
    this.initTinymce();
  },
  activated() {
    this.initTinymce();
  },
  deactivated() {
    this.destroyTinymce();
  },
  methods: {
    blurTinymc() {
      console.log("ssssssssssss");
    },
    initTinymce() {
      const _this = this;

      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language_url: "../../../static/tinymce4.7.5/langs/zh_CN.js",
        height: 500,
        theme: "modern",
        menubar: false,
        toolbar: _this.toolbar,
        // toolbar: `styleselect | formatselect | fontselect fontsizeselect | fontFamily  |forecolor backcolor | bold italic underline strikethrough | image  media | table | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | preview removeformat  hr | paste code  link | undo redo | fullscreen `,
        //  toolbar: "styleselect | undo redo | removeformat | bold italic underline |  aligncenter alignjustify  | bullist numlist outdent indent | link | print | fontselect fontsizeselect",
        // toolbar: `styleselect | fontselect | formatselect | fontsizeselect | fontFamily |forecolor backcolor | bold italic underline strikethrough | image  media | table | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | preview removeformat  hr | paste code  link | undo redo | fullscreen `,
        plugins: `
            paste
            importcss
            image
            code
            table
            advlist
            fullscreen
            link
            media
            lists
            textcolor
            colorpicker
            hr
            preview
          `,

        // CONFIG

        forced_root_block: "p",
        force_p_newlines: true,
        importcss_append: true,

        // CONFIG: ContentStyle 这块很重要， 在最后呈现的页面也要写入这个基本样式保证前后一致， `table`和`img`的问题基本就靠这个来填坑了
        content_style: `
            *                         { padding:0; margin:0; }
            html, body                { height:100%; }
            img                       { max-width:100%; display:block;height:auto; }
            a                         { text-decoration: none; }
            iframe                    { width: 100%; }
            p                         { line-height:1.5; margin: 0px; }
            table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
            ul,ol                     { list-style-position:inside; }
          `,

        insert_button_items: "image link | inserttable",

        // CONFIG: Paste
        paste_retain_style_properties: "all",
        paste_word_valid_elements: "*[*]", // word需要它
        paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: false, // 插入word文档需要该属性
        paste_webkit_styles: "all",
        paste_merge_formats: true,
        nonbreaking_force_tab: false,
        paste_auto_cleanup_on_paste: false,

        // CONFIG: Font
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",

        // FontSelect
        font_formats: `
            微软雅黑=微软雅黑;
            宋体=宋体;
            黑体=黑体;
            仿宋=仿宋;
            楷体=楷体;
            隶书=隶书;
            幼圆=幼圆;
            Andale Mono=andale mono,times;
            Arial=arial, helvetica,
            sans-serif;
            Arial Black=arial black, avant garde;
            Book Antiqua=book antiqua,palatino;
            Comic Sans MS=comic sans ms,sans-serif;
            Courier New=courier new,courier;
            Georgia=georgia,palatino;
            Helvetica=helvetica;
            Impact=impact,chicago;
            Symbol=symbol;
            Tahoma=tahoma,arial,helvetica,sans-serif;
            Terminal=terminal,monaco;
            Times New Roman=times new roman,times;
            Trebuchet MS=trebuchet ms,geneva;
            Verdana=verdana,geneva;
            Webdings=webdings;
            Wingdings=wingdings,zapf dingbats`,

        // CONFIG: StyleSelect
        style_formats: this.styleFormats,

        // Tab
        tabfocus_elements: ":prev,:next",
        object_resizing: true,

        // Image
        imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions",
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("NodeChange Change KeyUp", () => {
            this.hasChange = true;
            this.$emit("input", editor.getContent());
          });
          _this.$nextTick(() => {
            let _node = document.getElementsByClassName("mce-last");
            _node.length != 0 ? (_node[_node.length - 1].style.display = "none") : "";
          });
        }
      });
    },

    // initTinymce() {
    //   const _this = this;
    //   window.tinymce.init({
    //     language: this.language,
    //     selector: `#${this.tinymceId}`,
    //     height: this.height,
    //     body_class: "panel-body ",
    //     object_resizing: false,
    //     toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
    //     menubar: this.menubar,
    //     plugins: `
    //         paste
    //         importcss
    //         image
    //         code
    //         table
    //         advlist
    //         fullscreen
    //         link
    //         media
    //         lists
    //         textcolor
    //         colorpicker
    //         hr
    //         preview
    //       `,
    //     end_container_on_empty_block: true,
    //     powerpaste_word_import: "clean",
    //     code_dialog_height: 450,
    //     code_dialog_width: 1000,
    //     advlist_bullet_styles: "square",
    //     advlist_number_styles: "default",
    //     imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
    //     default_link_target: "_blank",
    //     link_title: false,
    //     nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
    //     init_instance_callback: editor => {
    //       if (_this.value) {
    //         editor.setContent(_this.value);
    //       }
    //       _this.hasInit = true;
    //       editor.on("NodeChange Change KeyUp SetContent", () => {
    //         this.hasChange = true;
    //         this.$emit("input", editor.getContent());
    //       });
    //     },
    //     setup(editor) {
    //       editor.on("FullscreenStateChanged", e => {
    //         _this.fullscreen = e.state;
    //       });
    //     }
    //   });
    // },
    destroyTinymce() {
      console.log("destroyTinymce", window.tinymce.get(this.tinymceId));
      if (window.tinymce.get(this.tinymceId)) {
        console.log("destroyTinymce====in");
        window.tinymce.get(this.tinymceId).destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(arr) {
      const _this = this;
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`);
      });
    },
    vedioSuccessCBK(url) {
      console.log(url);
      const _this = this;
      if (url) {
        window.tinymce.get(_this.tinymceId).insertContent(`<video class="wscnph" src="${url}" controls="controls"></video>`);
      }
      // window.tinymce.get(_this.tinymceId).insertContent(`<video class="wscnph" src="${url}" >`)
    }
  },
  // beforeDestroy() {
  //   this.$emit("on-destroy");
  //   // window.tinymce.remove(`#${this.id}`);
  //   this.destroyTinymce();
  // }
  destroyed() {
    // console.log(";ssssssssssss________", this.tinymceId);
    tinymce.get(this.tinymceId).destroy();
  }
};
</script>

<style scoped>
.tinymce-container {
  position: relative;
}
.tinymce-textarea {
  width: 750px;
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  bottom: 21px;
  left: 6px;

  /*z-index: 2005;*/
}
.editor-upload-btn {
  display: inline-block;
}
</style>
