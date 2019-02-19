<template>
  <div class="my-container sheQuBao-body">
    <div class="layout-head">
      <h3>{{formControl.newspperTitle.newspaper_title}} &nbsp;&nbsp;&nbsp; {{formControl.newspperTitle.issn}}</h3>
      <el-steps class="head-step" :active="formControl.stepIndex" align-left>
        <el-step title="选择模板"></el-step>
        <el-step title="编辑版面一"></el-step>
        <el-step title="编辑版面二"></el-step>
        <el-step title="编辑版面三"></el-step>
        <el-step title="编辑版面四"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <p>提示：点击左侧模块可编辑该模块的详细内容</p>
    </div>
    <div class="layout-content">
      <!-- 报纸展示区域 -->
      <el-card class="box-card card-main" :body-style="layout.bodyStyle">
        <el-scrollbar ref="elscrollbarNews" style="height:100%;">
          <div id="plateContainer">

          </div>
        </el-scrollbar>
      </el-card>
      <!-- 右侧操作区 -->
      <el-card class="box-card card-right " :body-style="layout.bodyStyle2">
        <el-form ref="form" :model="form" label-position="top">
          <el-collapse @change="changeCollapse" accordion :value="formControl.collapseIndex">
            <!-- 版面信息 -->
            <el-collapse-item title="版面信息" name="0">
              <div>
                <el-form-item label="版面名称">
                  <el-input v-model="form.newspaper_page.page_header" placeholder="请输入版面名称"></el-input>
                  <p class="my-tips">当前已有 {{getCharLength(form.newspaper_page.page_header)}} 个字节 （建议最多输入 {{checkBook.plateName[form.newspaper_page.template_id]}} 个字节！）</p>
                </el-form-item>
                <el-form-item label="报尾">
                  <el-input v-model="form.newspaper_page.page_end" placeholder="请输入报尾"></el-input>
                  <p class="my-tips">当前已有 {{getCharLength(form.newspaper_page.page_end)}} 个字节 （建议最多输入 {{checkBook.plateEnd}} 个字节！）</p>
                </el-form-item>
              </div>
            </el-collapse-item>
            <!-- 构件信息 -->
            <el-collapse-item :title="formControl.buildWb[formControl.curBuildT]+'信息'" name="1">
              <div :style="layout.collapseStyle">
                <el-scrollbar ref="elscrollbarBuild" style="height:100%;">
                  <!--  标题类型 （只有 报头构件 有） -->
                  <el-form-item v-if="formControl.curBuildT == 0" :label="'标题类型'">
                    <el-radio-group @change="changeTitleType" v-model="formControl.titleType">
                      <el-radio label="1">文字标题</el-radio>
                      <el-radio label="2">LOGO标题</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <!--  报纸文字标题 -->
                  <!-- <el-form-item v-if="(formControl.curBuildT == 0 && formControl.titleType == '1') || formControl.curBuildT != 0" :label=" formControl.curBuildT == 0 ? '报纸标题' :'标题'">
                    <el-input v-model="form.newspaper_page_items[formControl.indexControl].item_title" :placeholder="formControl.curBuildT == 0 ? '请输入报纸标题' : '请输入标题'"></el-input>
                  </el-form-item> -->
                  <el-form-item v-if="formControl.curBuildT == 0 && formControl.titleType == '1'" label="报纸标题">
                    <el-input v-model="form.newspaper_page_items[formControl.indexControl].item_title" placeholder="请输入报纸标题"></el-input>
                    <p class="my-tips">当前已有 {{getCharLength(form.newspaper_page_items[formControl.indexControl].item_title)}} 个字节 （{{ getBestRange(form.newspaper_page_items[formControl.indexControl].rule,"item_title")}}）</p>
                  </el-form-item>

                  <!-- 报纸 LOGO 标题 （ 只有 报头构件 有 ）-->
                  <el-form-item v-if=" formControl.curBuildT == 0 && formControl.titleType == '2'" label="LOGO标题">
                    <!-- <uploadFile class="avatar-uploader" @change="handleChange" :uploadSelf="false" :maxSize="2" :paramsObj="{index:formControl.indexControl,field:'item_logo'}">
                      <div v-if="form.newspaper_page_items[formControl.indexControl].item_logo" class="img-bg-box" :style="{backgroundImage: 'url(' + formControl.baseUrl  +  form.newspaper_page_items[formControl.indexControl].item_logo + ')'}">
                      </div>
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </uploadFile> -->
                    <p v-if="form.newspaper_page_items[formControl.indexControl].item_logo">
                      <img style="max-width:100%;height:auto;border:1px dashed #39bcf3;" :src="formControl.baseUrl  + form.newspaper_page_items[formControl.indexControl].item_logo">
                    </p>
                    <uploadCropper :maxSize="2" @change="callBackImg" :fixedRatio='form.newspaper_page_items[formControl.indexControl].rule.logo_rate || [15,4]' :paramsObj="{index:formControl.indexControl,field:'item_logo'}"></uploadCropper>
                    <p class="my-tips">建议上传像素为 300 * 80 且大小不能超过 2MB 的图片</p>
                  </el-form-item>

                  <!-- 构件标题 -->
                  <el-form-item v-if="formControl.curBuildT != 0" label="标题">
                    <el-input v-model="form.newspaper_page_items[formControl.indexControl].item_title" placeholder="请输入标题"></el-input>
                    <p class="my-tips">当前已有 {{getCharLength(form.newspaper_page_items[formControl.indexControl].item_title)}} 个字节 （{{ getBestRange(form.newspaper_page_items[formControl.indexControl].rule,"item_title")}}）</p>
                  </el-form-item>

                  <!-- 副标题 （只有 报头构件 有） -->
                  <el-form-item v-if="formControl.curBuildT == '0' && formControl.titleType == '1'" label="副标题">
                    <el-input v-model="form.newspaper_page_items[formControl.indexControl].item_subtitle" placeholder="请输入副标题" :max="13"></el-input>
                    <p class="my-tips">当前已有 {{getCharLength(form.newspaper_page_items[formControl.indexControl].item_subtitle)}} 个字节 （建议最多输入 {{checkBook.newsTitleSubtitle}} 个字节！）</p>
                  </el-form-item>

                  <!-- 内容 （除了 报头构件，其他都有） -->
                  <el-form-item v-if="formControl.curBuildT != 0" label="内容">
                    <div v-html="itemText" class="build-content word_wrap" @click="formControl.editorShow = true">
                      <!-- {{itemText}} -->
                    </div>
                  </el-form-item>

                  <!-- 图片 （ 报头构件 和 纯文本构件 没有） -->
                  <el-form-item v-if=" formControl.curBuildT != 0 && formControl.curBuildT != 2 " label="图片">
                    <div>
                      <!-- <uploadFile v-for="(imgItem,imgIndex) in form.newspaper_page_items[formControl.indexControl].item_images" :key="imgIndex" class="avatar-uploader" @change="handleChange" :uploadSelf="false" :maxSize="2" :paramsObj="{index:formControl.indexControl,field:'item_images',imgIndex:imgIndex}">
                        <div class="img-bg-box" :style="{backgroundImage: 'url(' + formControl.baseUrl  + form.newspaper_page_items[formControl.indexControl].item_images[imgIndex] + ')'}">
                        </div>
                      </uploadFile>
                      <uploadFile v-if="!form.newspaper_page_items[formControl.indexControl].item_images.length" class="avatar-uploader" @change="handleChange" :uploadSelf="false" :maxSize="2" :paramsObj="{index:formControl.indexControl,field:'item_images',imgIndex:'add'}">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                      </uploadFile> -->
                      <p v-if="form.newspaper_page_items[formControl.indexControl].item_images[0]">
                        <img style="max-width:100%;height:auto;border:1px dashed #39bcf3;" :src="formControl.baseUrl  + form.newspaper_page_items[formControl.indexControl].item_images[0]">
                      </p>
                      <uploadCropper :maxSize="2" @change="callBackImg" :fixedRatio='form.newspaper_page_items[formControl.indexControl].rule.image_rate || [2,1]' :paramsObj="{index:formControl.indexControl,field:'item_images',imgIndex:0}"></uploadCropper>
                      <p class="my-tips">
                        该图片不呈现在文章详情中，仅作为社区报版面样式图
                      </p>
                    </div>
                  </el-form-item>

                  <!-- 小程序跳转方式 -->
                  <section class="el-radio-vertical" v-if="formControl.curBuildT == 3">
                    <el-form-item label="广告跳转方式：">
                      <el-radio-group v-model="form.newspaper_page_items[formControl.indexControl].item_adv.mini_run" @change="changeType">
                        <el-radio label="0">不跳转</el-radio>
                        <el-radio label="1">原生</el-radio>
                        <el-radio label="2">H5</el-radio>
                        <el-radio label="3">小程序 </el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="form.newspaper_page_items[formControl.indexControl].item_adv.mini_run == '1' || form.newspaper_page_items[formControl.indexControl].item_adv.mini_run == '2'" label="链接地址：">
                      <el-input v-model="form.newspaper_page_items[formControl.indexControl].item_adv.mini_url" placeholder="请输入链接地址"></el-input>
                    </el-form-item>
                    <el-form-item v-if="form.newspaper_page_items[formControl.indexControl].item_adv.mini_run == '3'" label="小程序选择：">
                      <el-select placeholder="请选择小程序" size="small" v-model="item_adv.miniListValue" @change="handleSelectAppId">
                        <el-option v-for="item in item_adv.miniList" :key="item.app_id" :label="item.app_name" :value="item.app_id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="form.newspaper_page_items[formControl.indexControl].item_adv.mini_run == '3'" label="选择小程序地址:">
                      <!-- {{form.newspaper_page_items[formControl.indexControl].item_adv["path"]}} -->
                      <el-select placeholder="请选择小程序地址" v-model="item_adv.routeDataValue" @change="chnageon">
                        <el-option v-for="item in  item_adv.routeData" :key="item.route_id" :label="item.route_name" :value="item.route_path">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </section>
                </el-scrollbar>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-card>
    </div>
    <div class="layout-foot">
      <el-button @click="toPreviousPlate">{{ formControl.stepIndex == 1 ? '返回上一步' : '返回上一版' }}</el-button>
      <el-button type="primary" plain v-if="formControl.isEditing" @click="toNextPlate(true)">返回预览页</el-button>
      <el-button type="primary" @click="toNextPlate(false)">{{ formControl.stepIndex == 4 ? '预览' : '编辑下一版' }}</el-button>
    </div>
    <!-- 编辑内容 -->
    <el-dialog @opened="openedEditor" :modal-append-to-body="false" title="编辑内容" :close-on-click-modal="false" :visible.sync="formControl.editorShow" width="40%" :before-close="closeEditor">
      <div class="editor-box">
        <tinymce v-if="formControl.editorShow" :toolbar="toolbarConfig" :id="'sqbTinymce'" :height="600" ref="sqbTinymce" v-model="form.newspaper_page_items[formControl.indexControl].item_content"></tinymce>
        <div class="flex-between">
          <p class="my-tips">此处上传的图片为文章详情图，不呈现在社区报版面中，仅在社区报文章全文中展示。</p>
          <p class="my-tips">当前已有 {{getCharLength(getText(form.newspaper_page_items[formControl.indexControl].item_content))}} 个字节 （{{ getBestRange(form.newspaper_page_items[formControl.indexControl].rule,"item_content")}}）</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditor">取 消</el-button>
        <el-button type="primary" @click="sureEditor">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import uploadFile from "@/components/uploadFile";

import Newsparper from "@/fetch/modules/newspaper";
import Tinymce from "@/components/Tinymce/index";
import uploadCropper from "@/components/uploadImg/uploadCropper.vue";

// 获取小程序列表
import { RequestMiniList } from "@/fetch/modules/public.js";
export default {
  components: { uploadFile, Tinymce, uploadCropper },
  data() {
    return {
      layout: {
        bodyStyle: { height: "100%", overflowY: "auto", overflowX: "hidden", padding: "0" },
        bodyStyle2: { height: "100%", overflowY: "auto", overflowX: "hidden", padding: "30px 15px" },
        collapseStyle: {
          height: "calc(100vh - 84px - 162px  - 66px  - 60px - 25px - 50px * 2)" /* 布局说明 1 */,
          overflowY: "auto"
        }
      },
      form: {
        newspaper_page: {
          page_id: 1, //报刊版面id
          newspaper_id: 1, //社区报id
          template_id: 1, //模板id
          pic_tpl: "框架图片",
          page_header: "报头",
          page_end: "报尾",
          page_num: "版号",
          page_pic: "", //版面图
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
            points: {
              shape: "default",
              coords: "25,35;200,500"
            }, // 构件位置信息
            item_type: 0, // 类型: 0报头 1图文 2纯文本 3广告 4大图模式图文区
            item_title: "主标题", // 主标题
            item_subtitle: "副标题", // 副标题
            item_link: "", // 链接
            item_logo: "", // logo
            item_content: "", // 内容详情
            item_txt: "", // 内容梗概（显示在版面）
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
            rule: {
              //构件规则
              title_max_len: 6, // 主标题最大字数
              title_min_len: 4,
              content_max_len: "", // 内容最大字数
              content_min_len: "",
              logo_rate: [15, 4],
              image_rate: [2, 1]
            }
          }
        ]
      },
      formControl: {
        baseUrl: "https://img.sqydt.darongshutech.com/",
        buildWb: ["报头", "图文", "纯文本", "广告", "大图模式图文编辑"],
        titleType: "1", // 标题类型  1 - 文字  2 - logo
        collapseIndex: "0", // 当前显示的右侧面板
        indexControl: 0, // 当前构件的索引
        curBuildT: 0, // 当前构件类型 0报头 1图文 2纯文本 3广告 4大图模式图文区
        editorShow: false, // 显示编辑器
        ckEditor: null, // 编辑器实例
        stepIndex: 1, // 步骤条 （当前版式索引）
        pageIdArr: [], // 所有版式ID
        newspperTitle: { newspaper_title: "社区报标题", issn: "社区报期刊" }, // 报纸信息
        isEditing: false, // 是否处于编辑状态
        cacheCurContent: "" // 缓存当前内容
      },
      /* 根据 构件ID 获取当前选择构建的类型以及位于 form.newspaper_page_items 中的索引 */
      wordbook: {
        /** 构件ID : 索引,类型 */
      },

      checkBook: {
        /* 根据 template_id 获取不同的 版面名称 长度限制 */
        plateName: {
          1: 14,
          2: 10,
          3: 10,
          4: 10
        },
        plateEnd: 80 /* 报尾的最大长度 */,
        newsTitleSubtitle: 20 /* 报头副标题最大长度 */
      },
      item_adv: {
        /* 辅助广告信息中的小程序跳转方式实现 */
        miniList: [],
        routeData: [],
        miniListValue: "",
        routeDataValue: ""
      },
      toolbarConfig: [" undo redo | removeformat "]
      // toolbarConfig:[" undo redo | removeformat bold italic fontsizeselect  | alignleft aligncenter alignright alignjustify outdent indent styleselect | image media | fullscreen "]
    };
  },
  computed: {
    itemText: function() {
      // `this` 指向 vm 实例
      const _val = this.form.newspaper_page_items[this.formControl.indexControl].item_txt;
      return _val ? _val.replace(/<[^>]*>/gi, "") : "";
    },
    charLength: function() {
      return this.getCharLength(this.form.newspaper_page_items[this.formControl.indexControl].item_title);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  },
  created() {},
  watch: {},
  mounted() {
    // 获取上一步选择的版式
    this.formControl.pageIdArr = JSON.parse(localStorage.getItem("pageId"));
    this.formControl.newspperTitle = JSON.parse(localStorage.getItem("newspperTitle"));

    // 编辑社区报
    this.formControl.isEditing = this.$route.query.stepIndex ? ((this.formControl.stepIndex = +this.$route.query.stepIndex), true) : false;

    this.getFormData();
    this.miniData();
    console.log("isEditing", this.formControl.isEditing, this.formControl.stepIndex);
  },
  methods: {
    //  剪裁图片回掉
    callBackImg(status, params, data) {
      this.baseUrl = params.baseUrl;
      if (status == "uploadSuccess") {
        // this.addItemData[this.activeItem].banner_pic = data.key;
        const _baseUrl = params.baseUrl, // 上传文件存放地址
          _index = params.index,
          _field = params.field;
        this.formControl.baseUrl = _baseUrl;
        if (_field == "item_images") {
          const imgIndex = params.imgIndex;
          imgIndex == "add" ? this.form.newspaper_page_items[_index][_field].push(data.key) : this.form.newspaper_page_items[_index][_field].splice(imgIndex, 1, data.key);
        } else {
          this.form.newspaper_page_items[_index][_field] = data.key;
        }
      }
    },
    // 小程序列表
    miniData() {
      RequestMiniList({}).then(res => {
        console.log(res);
        this.item_adv.miniList = res;
      });
    },
    // 小程序跳转方式变化
    changeType(type) {
      console.log(type);
      if (type == 2 || type == 1) {
        this.form.newspaper_page_items[this.formControl.indexControl].item_adv.mini_url = "";
      }
    },
    // 小程序地址变化
    chnageon(type) {
      this.form.newspaper_page_items[this.formControl.indexControl].item_adv["path"] = type;
    },
    // appID选择
    handleSelectAppId(value) {
      this.form.newspaper_page_items[this.formControl.indexControl].item_adv["path"] = "";
      this.item_adv.routeDataValue = "";

      this.form.newspaper_page_items[this.formControl.indexControl].item_adv["app-id"] = value;
      this.item_adv.miniList.map((item, index) => {
        if (item.app_id == value) {
          this.item_adv.routeData = item.route_list;
        }
      });
    },
    // 打开内容编辑
    openedEditor() {
      const curContent = this.form.newspaper_page_items[this.formControl.indexControl].item_content;
      this.$refs["sqbTinymce"].setContent(curContent);
      this.formControl.cacheCurContent = curContent;
    },
    toTop() {
      // 滚动条
      var div = this.$refs["elscrollbarNews"].$refs["wrap"];
      this.$nextTick(() => {
        div.scrollTop = 0;
      });
    },
    // 编辑完成
    sureEditor() {
      // 验证内容字数
      // this.checkFontLength("item_content");

      // 过滤 img 标签
      this.form.newspaper_page_items[this.formControl.indexControl].item_txt = this.form.newspaper_page_items[this.formControl.indexControl].item_content.replace(/<img.*?(?:>|\/>)/gi, "");

      // 关闭弹出框
      this.formControl.editorShow = false;
    },
    // 过滤标签和空白字符
    getText(html) {
      return html.replace(/<[^>]*>|[\r\n]*/gi, "").replace(/&nbsp;/gi, " ");
    },
    // 获取字节长度
    getCharLength(str) {
      return str ? str.replace(/[^\x00-\xff]/g, "aa").length : 0; // 匹配双字节字符
    },
    // 获取建议字节范围
    getBestRange(rule, filed) {
      const _isTitle = filed == "item_title"; // 当前构建类型
      const _minField = _isTitle ? "title_min_len" : "content_min_len";
      const _maxField = _isTitle ? "title_max_len" : "content_max_len";
      // console.log("rule",rule);
      if (rule && (rule[_minField] || rule[_maxField])) {
        // console.log("rule[_minField] && rule[_maxField]",rule[_minField] , rule[_maxField])
        return "建议" + (rule[_minField] && rule[_maxField] ? "输入" + rule[_minField] + " - " + rule[_maxField] : rule[_minField] && !rule[_maxField] ? "至少输入" + rule[_minField] : !rule[_minField] && rule[_maxField] ? "最多输入" + rule[_maxField] : "至少输入 2 ") + "个字节！";
      } else {
        return "建议至少输入 2 个字节！";
      }
    },
    // 检查字数
    checkFontLength(filed) {
      const _thisData = this.form.newspaper_page_items[this.formControl.indexControl];
      const _isTitle = filed == "item_title"; // 当前构建类型
      const _fieldName = _isTitle ? (this.formControl.curBuildT == 0 ? "报纸标题" : "上一个标题") : "内容";
      const _minField = _isTitle ? "title_min_len" : "content_min_len";
      const _maxField = _isTitle ? "title_max_len" : "content_max_len";
      let checkResult = true;

      // 检查内容的字数
      if (_thisData.rule) {
        const _len = _isTitle ? this.getCharLength(_thisData.item_title) : this.getCharLength(this.getText(_thisData.item_content));

        // 如果验证的是标题，且内容为空
        if (_isTitle && !_len) {
          return true;
        }

        if (_thisData.rule[_minField] && _len < _thisData.rule[_minField]) {
          checkResult = false;
        }
        if (_thisData.rule[_maxField] && _len > _thisData.rule[_maxField]) {
          checkResult = false;
        }
      }
      // if (!checkResult) {
      //   this.$message({
      //     type: "warning",
      //     message: _fieldName + (_thisData.rule[_maxField] ? "应该为 " + _thisData.rule[_minField] + " - " + _thisData.rule[_maxField] + " 个字节！（一个英文字母为一个字节，一个中文字符为半个字节）" : "至少为 " + _thisData.rule[_minField] + " 个字节！（一个英文字母为一个字节，一个中文字符为半个字节）")
      //   });
      // }
      return checkResult;
    },
    // 验证是否合格
    checkChar(rule, filed, len) {
      const _isTitle = filed == "item_title"; // 当前构建类型
      const _minField = _isTitle ? "title_min_len" : "content_min_len";
      const _maxField = _isTitle ? "title_max_len" : "content_max_len";
      if (rule && (rule[_minField] || rule[_maxField])) {
        return rule[_minField] && rule[_maxField] ? len <= rule[_maxField] && len >= rule[_minField] : rule[_minField] && !rule[_maxField] ? len >= rule[_minField] : !rule[_minField] && rule[_maxField] ? len <= rule[_maxField] : true;
      } else {
        return true;
      }
    },
    // 取消关闭编辑器
    cancelEditor() {
      console.log("con", this.formControl.cacheCurContent);
      this.form.newspaper_page_items[this.formControl.indexControl].item_content = this.formControl.cacheCurContent;
      this.formControl.editorShow = false;
    },
    // 单击右上角 X 关闭编辑器
    closeEditor(done) {
      this.$confirm("关闭将不会保存编辑的内容，确认关闭？")
        .then(_ => {
          this.form.newspaper_page_items[this.formControl.indexControl].item_content = this.formControl.cacheCurContent;
          done();
        })
        .catch(_ => {});
    },

    // 右侧折叠面板显示切换
    changeCollapse(activeNames) {
      if (!activeNames || "0") {
        this.formControl.collapseIndex = "0";
      }
    },
    // 获取版式数据
    getFormData() {
      Newsparper.RequesNewspaperPage({ page_id: this.formControl.pageIdArr[this.formControl.stepIndex - 1] || "536276844031246337" }).then(res => {
        this.toTop();
        this.form = res;
        this.form.newspaper_page_items.forEach((item, index) => {
           if (item.item_type == 0 ) {
             this.formControl.titleType =  item.item_logo ? "2" : "1"
          }

          if (!item.rule) {
            item.rule = {
              //构件规则
              title_max_len: 10, // 主标题最大字数
              title_min_len: 0,
              content_max_len: 10000, // 内容最大字数
              content_min_len: 0,
              logo_rate: [15, 4],
              image_rate: [2, 1]
            };
          } else {
            !item.rule.content_min_len && (item.rule.content_min_len = 0);
            // !item.rule.content_max_len && (item.rule.content_max_len = 10000);
            !item.rule.title_min_len && (item.rule.title_min_len = 0);
            // !item.rule.title_max_len && (item.rule.title_max_len = 10);

            !item.rule.logo_rate[0] && !item.rule.logo_rate[1] && (item.rule.logo_rate = [15, 4]);
            !item.rule.image_rate[0] && !item.rule.image_rate[1] && (item.rule.image_rate = [2, 1]);
          }

          if (item.item_images === null || item.item_images === "") {
            item.item_images = [];
          }
          if (typeof item.item_images === "string" && item.item_images) {
            item.item_images = JSON.parse(item.item_images);
          }
          if (item.item_type == 3) {
            if (typeof item.item_adv.mini_url == "object") {
              item.item_adv["app-id"] = item.item_adv.mini_url["app-id"] || "";
              item.item_adv["path"] = item.item_adv.mini_url["path"] || "";
              item.item_adv.mini_url = "";
            } else {
              item.item_adv["app-id"] = "";
              item.item_adv["path"] = "";
            }
          }
          if (item.item_content === null) {
            item.item_content = "";
          }

          item.points = JSON.parse(item.points);
          this.wordbook[item.builder_id] = {
            index: index,
            type: item.item_type
          }; /* 构件ID : 索引,类型 */
          if (!index) {
            this.formControl.curBuildT = item.item_type;
          }
        });
        console.log(this.form.newspaper_page_items);
        this.registerComponent(this.form.newspaper_page.template_id);
      });
    },
    // 动态添加需要的版式
    registerComponent(temId) {
      return import(`../component/plate/index.vue`).then(component => {
        const bcConstructor = Vue.extend(component.default);
        const instance = new bcConstructor();

        // 传入数据
        instance.dataObj = this.form;
        instance.temId = temId;

        // 监听抛出的数据
        instance.$on("emitStream", params => {
          if (params.builder_id === 0) {
            /* 如果是版面 */
            this.formControl.collapseIndex = "0"; // 显示版面信息
            return false;
          } else {
            /* 是版面中的构建 */
            const _wb = this.wordbook[params.builder_id];

            // 如果是报头构建且标题类型为文字标题，先验证报纸标题字数
            // if ((this.formControl.curBuildT == 0 && this.formControl.titleType == "1") || this.formControl.curBuildT != 0) {
            //   this.checkFontLength("item_title");
            // }

            this.formControl.indexControl = _wb.index; // 切换当前索引
            this.formControl.curBuildT = _wb.type; // 切换当前构件类型
            this.formControl.collapseIndex = "1"; // 显示右侧面板

            // 如果是广告构建
            if (this.formControl.curBuildT == 3) {
              this.item_adv.routeDataValue = this.form.newspaper_page_items[this.formControl.indexControl].item_adv["path"];
              this.item_adv.miniListValue = this.form.newspaper_page_items[this.formControl.indexControl].item_adv["app-id"];
              if (this.form.newspaper_page_items[this.formControl.indexControl].item_adv) {
                this.item_adv.miniList.map((item, index) => {
                  if (item.app_id == this.form.newspaper_page_items[this.formControl.indexControl].item_adv["app-id"]) {
                    this.item_adv.routeData = item.route_list;
                  }
                });
              }
            }
          }
        });

        document.querySelector("#plateContainer").innerHTML = "<div id='plateContent'></div>";

        // 挂载
        instance.$mount("#plateContent");

        // console.log(templateName + " 加载成功");
      });
    },
    // 改变标题类型（清空标题数据）
    changeTitleType(type) {
      if (type == "1") {
        this.form.newspaper_page_items[this.formControl.indexControl].item_logo = "";
      } else {
        this.form.newspaper_page_items[this.formControl.indexControl].item_title = "";
      }
    },
    // 文件上传回掉
    handleChange(status, _file, params, resp) {
      if (status === "startUpload") {
        console.log("上传中···", resp);
      } else if (status === "uploading") {
        console.log("文件已上传", resp); // 当为状态上传中时，resp为上传进度
      } else if (status === "uploadSuccess") {
        // const _fileName = _file.name;  // 文件名称
        // const _key = resp.key;
        const _baseUrl = params.baseUrl, // 上传文件存放地址
          _index = params.index,
          _field = params.field;
        console.log("_field", _field);
        this.formControl.baseUrl = _baseUrl;
        if (_field == "item_images") {
          const imgIndex = params.imgIndex;
          imgIndex == "add" ? this.form.newspaper_page_items[_index][_field].push(resp.key) : this.form.newspaper_page_items[_index][_field].splice(imgIndex, 1, resp.key);
        } else {
          console.log("item_logo", this.form.newspaper_page_items[_index][_field]);
          this.form.newspaper_page_items[_index][_field] = resp.key;
        }

        // console.log("uploadSuccess", resp, this.form.newspaper_page_items[_index]);
      } else {
        console.log("上传失败，点击重试！");
      }
    },
    // 返回上一版
    toPreviousPlate() {
      // 当前为第一版
      if (this.formControl.stepIndex == 1) {
        this.$confirm("此操作将删除已选版式, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delNewspaper(res => {
              this.$router.push({
                path: "/comNewspaper/comNewspaperStep1",
                query: {
                  newspaper_id: this.form.newspaper_page.newspaper_id
                }
              });
              this.$store.dispatch("delVisitedViews", {
                path: "/comNewspaper/comNewspaperStep2"
              });
            });
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(er => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else {
        this.submitForm(result => {
          this.formControl.stepIndex--;
          this.getFormData();
        });
      }
      console.log("this.stepIndex", this.formControl.stepIndex);
    },
    // 编辑下一版
    toNextPlate(isToPre) {
      this.submitForm(result => {
        if (isToPre || this.formControl.stepIndex == 4) {
          // 去预览页面
          this.drawPreImage(res => {
            console.log(res);
            this.$router.push({
              path: "/comNewspaper/stepLast",
              query: {
                newspaper_id: this.form.newspaper_page.newspaper_id
              }
            });
            this.$store.dispatch("delVisitedViews", {
              path: "/comNewspaper/comNewspaperStep2"
            });
          });
        } else {
          this.formControl.stepIndex++;
          this.getFormData();
        }
      });
      console.log("this.stepIndex", this.formControl.stepIndex);
    },
    // 提交数据
    submitForm(callback) {
      var _args = JSON.parse(JSON.stringify(this.form)),
        _isFillSubTitle = true, // 是否填写 副标题 or LOGO
        _isErrBuild = false, // 构建信息是否最优
        _isErrPlate = false; // 版面信息是否最优

      // 验证版面信息是否填写
      if (!_args.newspaper_page.page_header) {
        this.$message({
          type: "error",
          message: "未填写版面名称！"
        });
        return false;
      }
      if (!_args.newspaper_page.page_end) {
        this.$message({
          type: "error",
          message: "未填写报尾！"
        });
        return false;
      }

      // 判断版面信息是否最优
      if (true) {
        const plateTitleLen = this.getCharLength(_args.newspaper_page.page_header);
        if (plateTitleLen > this.checkBook.plateName[this.form.newspaper_page.template_id]) {
          _isErrPlate = true;
        }

        const plateEndLen = this.getCharLength(_args.newspaper_page.page_end);
        if (plateEndLen > this.checkBook.plateEnd) {
          _isErrPlate = true;
        }
      }

      // 判断构建信息是否最优
      _isErrBuild = _args.newspaper_page_items.some((item, index) => {
        // 广告处理
        if (item.item_type == 3) {
          if (item.item_adv.mini_run == 3) {
            item.item_adv.mini_url = {
              "app-id": item.item_adv["app-id"],
              path: item.item_adv["path"]
            };
          }
          delete item.item_adv["path"];
          delete item.item_adv["app-id"];
        }

        // 报头信息处理
        if (item.item_type == 0) {
          console.log("item.item_title", item.item_title);
          console.log("item.item_logo");
          console.log("item.item_subtitle", item.item_subtitle);
          // 文字标题
          if (this.formControl.titleType == "1") {

            // 是否填写标题
            if (!item.item_title) {
              _isFillSubTitle = false; 
              return true;
            }

            // 是否填写副标题
            if (!item.item_subtitle) {
              _isFillSubTitle = false; 
              return true;
            }

            // 副标题是否为最优填写
            if ( this.getCharLength(item.item_subtitle) > this.checkBook.newsTitleSubtitle) {
              return true;
            }
          } else if (item.item_type == 0 && !item.item_logo) {
            /* logo 标题 */
            _isFillSubTitle = false;
            return true;
          }
        }

        // 是否为最优填写
        if (!this.checkChar(item.rule, "item_title", this.getCharLength(item.item_title)) || !this.checkChar(item.rule, "item_content", this.getCharLength(this.getText(item.item_content)))) {
          console.log("item.item_title", item.item_title);
          return true;
        }
        console.log("-----------------------------");
        // console.log("item",item.rule)
        // console.log("item",item.item_title, this.checkChar(item.rule,"item_title",this.getCharLength(item.item_title)))
        // console.log("item",item.item_content,this.checkChar(item.rule,"item_content",this.getCharLength(this.getText(item.item_content))))
      });

      console.log(":_isFillSubTitle", _isFillSubTitle);
      // 判断是否填写副标题 
      if (!_isFillSubTitle) {
        this.$message({
          type: "error",
          message: this.formControl.titleType == "1" ? "未填写报纸的标题（副标题）！" : "未上传报纸 LOGO ！"
        });
        return false;
      }
      console.log(":_isErrPlate || _isErrBuild", _isErrPlate, _isErrBuild);
      console.log(":_args", _args);
      // return;
      if (_isErrPlate || _isErrBuild) {
        this.$confirm("当前模板内容填写过少（或版面信息 / 报头信息 / 首版大图标题填写过多），将会影响模板样式。确认是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            Promise.all([this.submintBasic(_args.newspaper_page), this.submintPageItem(_args.newspaper_page_items)])
              .then(result => {
                console.log("result", result); //['成功了', 'success']
                callback(result);
              })
              .catch(error => {
                console.log("resulterr", error);
              });
          })
          .catch(er => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else {
        Promise.all([this.submintBasic(_args.newspaper_page), this.submintPageItem(_args.newspaper_page_items)])
          .then(result => {
            console.log("result", result); //['成功了', 'success']
            callback(result);
          })
          .catch(error => {
            console.log("resulterr", error);
          });
      }

      // console.log("_args", _args);
    },

    // 提交版式基本信息
    submintBasic(newspaper_page) {
      return new Promise((resolve, reject) => {
        Newsparper.RequestNewspaperPageModify({
          page_id: newspaper_page.page_id,
          page_header: newspaper_page.page_header,
          page_end: newspaper_page.page_end
        }).then(res => {
          console.log("submintBasic", res);
          resolve(res);
        });
      });
    },
    // 提交 所有构建 信息
    submintPageItem(newspaper_page_items) {
      const submitFiled = ["item_adv", "item_type", "item_content", "item_id", "item_images", "item_link", "item_logo", "item_subtitle", "item_title", "item_txt"];
      let pageItem = newspaper_page_items.map(item => {
        for (var key in item) {
          // console.log(key, this._isInArr(key, submitFiled), item[key]);
          if (!this._isInArr(key, submitFiled)) {
            delete item[key];
          }

          if (key == "item_images" && item.item_images) {
            // console.log(item, "ddddddddd");
            let _itemImages = item[key];
            item[key] = _itemImages.map(url => {
              return url.replace(this.formControl.baseUrl, "");
            });
          }
        }
        // console.log("item", item);
        return item;
      });
      // console.log("aaaaoo", JSON.stringify(pageItem));
      // return false;
      // console.log("--------pageItem", pageItem);
      return new Promise((resolve, reject) => {
        Newsparper.RequestNewspaperPageItemStr({
          item_str: JSON.stringify(pageItem)
        }).then(res => {
          console.log("submintPageItem", res);
          resolve(res);
        });
      });
    },
    // 判断 _val 是否处于数组 _arr 中
    _isInArr(_val, _arr) {
      return _arr.some(item => {
        if (item === _val) {
          return true;
        }
      });
    },
    // 生成预览图片
    drawPreImage(callback) {
      Newsparper.RequesNewspaperPreview({
        newspaper_id: this.form.newspaper_page.newspaper_id
      }).then(res => {
        console.log("drawPreImage", res);
        callback(res);
      });
    },
    delNewspaper(callback) {
      Newsparper.RequesNewspaperDelete({
        newspaper_id: this.form.newspaper_page.newspaper_id
      }).then(res => {
        console.log("delNewspaper", res);
        callback(res);
      });
    }
  },
  destroyed() {}
};
window.axios = axios;
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = loader => {
    // Configure the URL to the upload script in your back-end here!
    return new MyUploadAdapter(loader, 10, "api/public/getUploadToken");
  };
}
// 自定义七妞云上传
class MyUploadAdapter {
  constructor(loader, maxSize, getToken) {
    // 上传期间要使用的 FileLoader 实例。
    this.loader = loader;

    // 图片大小限制
    this.maxSize = maxSize;

    // 获取上传七牛云token，接口地址
    this.upTokenUrl = getToken;

    // 允许上传的图片格式
    this.acceptString = ".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PNG,.GIF";

    // 七牛云上传地址
    this.qiniuUrl = "http://up.qiniu.com";

    // 文件存放地址
    this.baseUrl = "https://img.sqydt.darongshutech.com/";
  }

  // 上传
  upload() {
    return new Promise((resolve, reject) => {
      this._uploadFile(resolve, reject);
    });
  }

  // 中止上传
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
  _uploadFile(resolveCK, rejectCK) {
    const file = this.loader.file;
    const isLt = file.size / 1024 / 1024 < this.maxSize;

    // const fileExt = _file.type.split("/")[1]; // .mp3 在火狐和ie 读取的格式为 mpeg
    const lastIndex = file.name.lastIndexOf(".");
    const fileExt = file.name.substring(+lastIndex + 1); // 上传的文件的格式
    const allAcceptArr = this.acceptString.split(","); // 允许上传的格式

    if (!this._isInArr("." + fileExt, allAcceptArr)) {
      console.error("请上传格式为" + this.acceptString + "的文件！");
      return false;
    }

    if (this.maxSize && !isLt) {
      console.error("请上传小于" + this.maxSize + "MB的文件！");
      return false;
    }

    // 使用FormData对象上传文件
    var formData = new FormData();
    formData.append("file", file);

    // 获取七牛云TOKEN
    this._getQiniuToken(fileExt).then(resData => {
      formData.append("token", resData.data.token);
      formData.append("key", resData.data.key);

      // 上传文件至七牛云
      this._requestQiniu(formData)
        .then(response => {
          // 如果上传成功，请调用 resolve() 并传入至少包含 {default: URL} 的对象，该 URL 为上传图像在服务器上的地址。
          resolveCK({
            default: this.baseUrl + response.key // // 此 URL 将用于在内容中显示图像。
          });
        })
        .catch(err => {
          // 上传失败
          rejectCK(err);
        });
    });
  }

  _isInArr(_val, _arr) {
    return _arr.some(item => {
      if (item === _val) {
        return true;
      }
    });
  }

  _getQiniuToken(fileExt) {
    return new Promise((resolve, reject) => {
      axios.get(this.upTokenUrl, { params: { file_ext: fileExt } }).then(res => {
        if (res && res.data && res.data.code === 2000) {
          resolve(res.data);
        } else {
          console.error(res.data.msg);
        }
      });
    });
  }

  _requestQiniu(formData) {
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: progressEvent => {
        // 上传进度
        this.loader.uploadTotal = progressEvent.total;
        this.loader.uploaded = progressEvent.loaded;
      }
    };
    return new Promise((resolve, reject) => {
      axios.post(this.qiniuUrl, formData, config).then(res => {
        if (res && res.status == 200) {
          resolve(res.data);
        } else {
          console.error(res.data.msg);
        }
      });
    });
  }
}
const _formData = {
  code: "2000",
  msg: "操作成功",
  data: {
    newspaper_page: {
      page_id: 1, //报刊版面id
      newspaper_id: 1, //社区报id
      template_id: 1, //模板id
      pic_tpl: "框架图片",
      page_header: "社区治理",
      page_end: "成都市武侯区东桂街道108号 邮箱:152364258866@163.com",
      page_num: "01",
      page_pic: "", //版面图
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
        builder_id: 0, // 构件id
        points: {
          shape: "default",
          coords: [20, 20, 197, 82]
        }, // 构件位置信息
        item_type: 0, // 类型: 0报头 1图文 2纯文本 3广告 4大图模式图文区
        item_title: "东桂社区", // 主标题
        item_subtitle: "DONGGUISHEQU", // 副标题
        item_link: "", // 链接
        item_logo: "", // logo
        item_content: "", // 内容详情
        item_txt: "", // 内容梗概（显示在版面）
        item_images: [], // 图片（显示在版面）
        item_adv: "", // 广告
        sort: 11, // 排序值
        create_time: "2016-01-01 10:10", //发布时间
        update_time: "2016-01-01 10:10" //更新时间
      },
      {
        item_id: 1, // 内容id
        page_id: 1, // 报刊版面id
        newspaper_id: 1, // 社区报id
        template_id: 1, // 模板id
        builder_id: 1, // 构件id
        points: {
          shape: "default",
          coords: [20, 211, 730, 765]
        }, // 构件位置信息
        item_type: 4, // 类型: 0报头 1图文 2纯文本 3广告 4大图模式图文区
        item_title: "恒业星园“优雅妈妈 魅力瑜伽”", // 主标题
        item_subtitle: "副标题", // 副标题
        item_link: "", // 链接
        item_logo: "", // logo
        item_content: "", // 内容详情
        item_txt:
          "“瑜伽作为一种修身、修心、修行、修德的健身运动，对放松身心，瑜伽无不是一项最佳的休闲活动方式之一，将这项休闲方式带给邻里居民更是一项怡身又怡心的事。在队伍里邻里之间相识、相知、互爱互助，用真诚去灌溉友谊之花，用爱去创造我们和谐美好的幸福家园。”授课张宁老师如是说到，半月一次的瑜珈授课带给她不仅是生活的充实，更是做公益后精神的满足。<br> 本次“微幸福”示范院落评选活动是金牛区启动社区治理“百千万工程”的系列活动之一，去年，成都市“9.2”社区治理大会召开后，金牛区以建设高品质和谐宜居生活社区为目标，以社区发展治理“五大行动”工程等重点工作为抓手，形成以社区党组织为核心、社区自治组织为主导、社区居民为主体，社区社会组织、志愿服务组织和驻区单位等多元共治的社区治理新机制。", // 内容梗概（显示在版面）
        item_images: ["https://img.sqydt.darongshutech.com/token_file_201812171559162660.png"], // 图片（显示在版面）
        item_adv: "", // 广告
        sort: 11, // 排序值
        create_time: "2016-01-01 10:10", //发布时间
        update_time: "2016-01-01 10:10" //更新时间
      },
      {
        item_id: 1, // 内容id
        page_id: 1, // 报刊版面id
        newspaper_id: 1, // 社区报id
        template_id: 1, // 模板id
        builder_id: 2, // 构件id
        points: {
          shape: "default",
          coords: [20, 807, 229.33, 1140]
        }, // 构件位置信息
        item_type: 2, // 类型: 0报头 1图文 2纯文本 3广告 4大图模式图文区
        item_title: "西线阳光-打造院落治理金牛“样本”", // 主标题
        item_subtitle: "副标题", // 副标题
        item_link: "", // 链接
        item_logo: "", // logo
        item_content: "", // 内容详情
        item_txt:
          "西线阳光以打造平安智慧小区为目标，耗巨资对小区停车位、停车道、绿道及监控设施进行了全面的提档升级。一是对小区路面进行了提档升级：曾经凹凸不平的行车道被宽敞平坦的沥青路所代替。沥青路的铺设，不仅可以降低行车时的噪音、增加行车的舒适度，同时可以降低扬尘，方便后期养护维修。二是对小区内的绿道进行提档升级。西线阳光小区的绿道升级，使原本下雨天就溅水的小石板变成了平坦的水泥路，居民过往再也不用担心石板不稳、遇雨溅水了。三是实现了监控系统全覆盖。监控系统的提档升级，使整个小区实现了监控全覆盖 。   同时还把小区围墙外围纳入了监控，监控系统 。居民过往再也不用担心石板不稳、遇雨溅水了。三是实现了监控系统全覆盖。", // 内容梗概（显示在版面）
        item_images: [], // 图片（显示在版面）

        item_adv: "", // 广告
        sort: 11, // 排序值
        create_time: "2016-01-01 10:10", //发布时间
        update_time: "2016-01-01 10:10" //更新时间
      },
      {
        item_id: 1, // 内容id
        page_id: 1, // 报刊版面id
        newspaper_id: 1, // 社区报id
        template_id: 1, // 模板id
        builder_id: 3, // 构件id
        points: {
          shape: "default",
          coords: [270.33, 806, 479.66, 1140]
        }, // 构件位置信息
        item_type: 1, // 类型: 0报头 1图文 2纯文本 3广告 4大图模式图文区
        item_title: "锦西人家紧跟社治风尚，创 建更加舒适的居住环境", // 主标题
        item_subtitle: "副标题", // 副标题
        item_link: "", // 链接
        item_logo: "", // logo
        item_content: "", // 内容详情
        item_txt: "走进锦西人家，一座古色古香的同心亭映入眼帘，向前看去，休闲凉庭、老年健身区、儿童攀岩游乐区……齐全的配套设施给人以仿佛置身于公园的感觉，殊不知这里仅仅是金牛区营门口街道茶店社区的一个院，因位于锦城之西而得名，毗邻花照壁望子云亭，三国的历史故事传唱在这片地域杨雄的浩荡文气滋养着这里的人们。毗邻花照壁望子云亭，三国的历史故事传唱在这片地域杨雄的浩荡文气滋养着这里的人们。", // 内容梗概（显示在版面）
        item_images: ["https://img.sqydt.darongshutech.com/token_file_201812171600554498.png"], // 图片（显示在版面）
        item_adv: "", // 广告
        sort: 11, // 排序值
        create_time: "2016-01-01 10:10", //发布时间
        update_time: "2016-01-01 10:10" //更新时间
      },
      {
        item_id: 1, // 内容id
        page_id: 1, // 报刊版面id
        newspaper_id: 1, // 社区报id
        template_id: 1, // 模板id
        builder_id: 4, // 构件id
        points: {
          shape: "default",
          coords: [520.66, 806, 730, 1017]
        }, // 构件位置信息
        item_type: 2, // 类型: 0报头 1图文 2纯文本 3广告 4大图模式图文区
        item_title: "党建引领院落互助 养生小苑 领造幸福街区", // 主标题
        item_subtitle: "副标题", // 副标题
        item_link: "", // 链接
        item_logo: "", // logo
        item_content: "", // 内容详情
        item_txt:
          "青砖白墙、红花绿树，整齐干净，祥和 安静，这是人们走进养生苑的第一印象。与 其说这是“管理”出来的，倒不如说她是 “爱护”出来的恰当些 。院里的每一块砖、 每一方地、每一株花，每一个椅子、每一个 垃圾桶，都是居民们集体劳动的成果。各项 费用的收取率达100% 。 就连租房入住的人 员，也十分遵守院子里的各项制度，也会参 与义务劳动和各项活动，让人不得不相“千 金。都是居民们集体劳动的成果。各项费用的收取率达100% 。 就连租房入住的人员，也十分遵守院子里的各项制度，也会参与义务劳动和各项活动，让人不得不相“千金...", // 内容梗概（显示在版面）
        item_images: [], // 图片（显示在版面）
        item_adv: "", // 广告
        sort: 11, // 排序值
        create_time: "2016-01-01 10:10", //发布时间
        update_time: "2016-01-01 10:10" //更新时间
      },
      {
        item_id: 1, // 内容id
        page_id: 1, // 报刊版面id
        newspaper_id: 1, // 社区报id
        template_id: 1, // 模板id
        builder_id: 5, // 构件id
        points: {
          shape: "default",
          coords: [20, 1181, 479.66, 1306]
        }, // 构件位置信息
        item_type: 3, // 类型: 0报头 1图文 2纯文本 3广告 4大图模式图文区
        item_title: "想种牙？别等了！现报名，春节前可免费种牙", // 主标题
        item_subtitle: "副标题", // 副标题
        item_link: "", // 链接
        item_logo: "", // logo
        item_content: "", // 内容详情
        item_txt: "现在电话报名 享4大福利！1、智慧种牙检查免费：免数字口腔扫描、种牙方案设计、CT、全景片等10项检查。2、免费礼包：参加讲座送口腔护理大礼包、手推车。3、免费抽奖：惊喜抽奖（500-1000元种牙礼金；免费烤瓷冠；免费种植体），现场参与互动可送5斤大米。4、特惠种牙：每人援助1颗免费进口种植体或3000-10000元/颗种植牙补贴款。5、适应人群：多颗、半口、全口牙缺失，牙槽骨条件不佳、种植牙失败需再重种者。四川名医“智慧牙体验会”报名专线：028-69982575", // 内容梗概（显示在版面）
        item_images: ["https://img.sqydt.darongshutech.com/token_file_201812171600312417.png"], // 图片（显示在版面）
        item_adv: "", // 广告
        sort: 11, // 排序值
        create_time: "2016-01-01 10:10", //发布时间
        update_time: "2016-01-01 10:10" //更新时间
      },
      {
        item_id: 1, // 内容id
        page_id: 1, // 报刊版面id
        newspaper_id: 1, // 社区报id
        template_id: 1, // 模板id
        builder_id: 6, // 构件id
        points: {
          shape: "default",
          coords: [520.66, 1058, 730, 1306]
        }, // 构件位置信息
        item_type: 3, // 类型: 0报头 1图文 2纯文本 3广告 4大图模式图文区
        item_title: "成都市天府软件园G5栋资产出租公告", // 主标题
        item_subtitle: "副标题", // 副标题
        item_link: "", // 链接
        item_logo: "", // logo
        item_content: "", // 内容详情
        item_txt: "一、标的物介绍成都市高新区天华二路219号天府软件园C5负一层食堂，建筑面积为3395.24平米。二、出租方 成都天府软件园有限公司", // 内容梗概（显示在版面）
        item_images: ["https://img.sqydt.darongshutech.com/token_file_201812171559564029.png"], // 图片（显示在版面）
        item_adv: "", // 广告
        sort: 11, // 排序值
        create_time: "2016-01-01 10:10", //发布时间
        update_time: "2016-01-01 10:10" //更新时间
      }
    ]
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
/* 页面布局 */
.my-container {
  width: 100%;
  min-width: 1190px;
  height: calc(100vh - 84px);
}
.layout-head {
  max-width: 1190px;
  height: 162px;
  padding: 15px 25px 0;
  margin: 0 auto;

  h3 {
    margin: 8px 0 5px;
    padding: 0 16px;
  }

  .head-step {
    width: 100%;
    padding: 10px 20px 20px;
  }

  p {
    padding: 0 16px;
    font-size: 14px;
    color: #999;
  }
}
.layout-content {
  display: flex;
  justify-content: center;
  //   align-items: center;
  height: calc(100% - 162px - 66px);
  font-size: 14px;

  .card-main {
    flex-shrink: 0;
    width: 750px;
    // height: calc(100% - 40px);
    height: 100%;
    margin-right: 15px;
    overflow: hidden;
  }
  .card-right {
    flex-shrink: 0;
    width: 343px;
    height: 100%;
    overflow: hidden;
    margin: 0;
  }
}
.layout-foot {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 800px;
  height: 66px;
  margin: 0 auto;
  font-size: 14px;
}
/** 布局说明 1
 * 84px - 上侧布局的高度
 * 162px - layout-head 的高度
 * 66px - 下侧的高度
 * 60px - bodyStyle 的上下 padding
 * 25px - el-collapse-item__content 的下 padding
 * 50px * 2 - 每个 el-collapse-item 的默认高度，这里有5个
 * */

/* 页面布局END */

/* 上传 */

.avatar-uploader,
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 130px;
  height: 130px;
  overflow: hidden;
}
.avatar-uploader {
  margin-bottom: 10px;
}

.avatar-uploader:hover,
.avatar-uploader:focus,
.el-upload:hover {
  border-color: #409eff;
  color: #409eff;
}
.el-upload,
.el-upload--text {
  border: 1px dashed #d9d9d9 !important;
  text-align: center;
}
.avatar-uploader-icon {
  width: 130px;
  line-height: 130px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.img-bg-box {
  width: 130px;
  height: 130px;
  background-size: cover;
  background-clip: content-box;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  overflow: hidden;
}
.img-box {
  width: 130px;
  height: auto;
}
/* 上传END */

.item-images-box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 10px;
}
.flex-around {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.build-content {
  height: 80px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  padding: 3px 10px;
  line-height: 18px;
  font-size: 12px;
  overflow-y: auto;
  cursor: pointer;
}
.editor-box {
  // max-height: 500px;
  // overflow-x: hidden;
  // overflow-y: auto;
}
.my-tips {
  font-size: 12px;
  line-height: 36px;
  text-align: right;
  color: #39bcf3;
}
.flex-between {
  display: flex;
  justify-content: space-between;
}
</style>
