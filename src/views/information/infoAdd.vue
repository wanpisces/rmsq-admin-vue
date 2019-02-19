<template>
  <div class="info-container">
    <el-card>
      <div class="info-title">编辑区域</div>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="资讯标题：" :label-width="formLabelWidth" prop="news_title">
          <el-input v-model="form.news_title" auto-complete="off" style="width:500px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="资讯标签：" :label-width="formLabelWidth">
                <el-tag
                :key="tag"
                v-for="tag in form.tags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
                </el-tag>
                <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+添加</el-button>
            </el-form-item> -->
        <el-form-item label="资讯来源：" :label-width="formLabelWidth">
          <el-input v-model="form.news_source" auto-complete="off" style="width:500px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="发布者：" :label-width="formLabelWidth" >
                <el-input v-model="form.news_author" auto-complete="off" ></el-input>
            </el-form-item> -->
        <el-form-item label="资讯正文：" :label-width="formLabelWidth" prop="news_content">
          <tinymce :height="400" :id="tinymceIds" v-model="form.news_content"></tinymce>
        </el-form-item>
        <div class="topicOption">
          <div class="info-title"> 投放区域：</div>
          <el-form-item label="投放区域：" :label-width="formLabelWidth">
            <el-radio-group v-model="form.run_in" @change="runInHanleClick">
              <el-radio :label="1">模块区</el-radio>
              <el-radio :label="2">轮播</el-radio>
              <el-radio :label="3">官方快报</el-radio>
              <el-radio :label="4">推荐</el-radio>
              <!-- <el-radio :label="5">按钮</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="投放模块：" :label-width="formLabelWidth" v-if="form.run_in==1" prop="category_id">
            <el-select v-model="form.category_id" placeholder="请选择">
              <el-option v-for="item in moduleData" :key="item.category_id" :label="item.category_name" :value="item.category_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投放分类：" :label-width="formLabelWidth" v-if="form.run_in==1">
            <el-select v-model="form.attr_id" placeholder="请选择">
              <el-option v-for="item in classificationData" :key="item.attr_id" :label="item.attr_value" :value="item.attr_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投放置顶：" :label-width="formLabelWidth" v-if="form.run_in==1 ||form.run_in==3 ||form.run_in==4">
            <el-checkbox v-model="checked">置顶</el-checkbox>
          </el-form-item>
          <div v-if="form.run_in==2">
            <el-form-item label="轮播标题：" :label-width="formLabelWidth" prop="banner_title">
              <el-input v-model="form.banner_title" style="width:500px" controls-position="right"></el-input>
            </el-form-item>
            <!-- asdasd:{{form.banner_pic}} -->
            <el-form-item label="轮播上传：" :label-width="formLabelWidth" prop="banner_pic" :rules="[{ required: true, message:'上传轮播图片', trigger: 'blur'}]">
              <el-upload class="avatar-uploader" action="...." :show-file-list="false" :before-upload="beforeUploadImage">
                <img v-if="lunboImageUrl" :src="lunboImageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <!-- <el-input v-model="form.banner_pic" style="width:500px" controls-position="right"></el-input> -->
            </el-form-item>
            <el-form-item label="排序：" :label-width="formLabelWidth">
              <el-input-number v-model="form.bsort" controls-position="right" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="轮播下沉：" :label-width="formLabelWidth">
              <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="关联活动：" :label-width="formLabelWidth">
              <el-radio-group v-model="isLink" @change="runInHanleClick">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
                <!-- <el-radio :label="5">按钮</el-radio> -->
              </el-radio-group>
            </el-form-item>
          </div>

        </div>
        <div v-if="form.run_in!=2">
          <div class="info-title"> 资讯列表样式：</div>
          <el-form-item label="上传封面：" :label-width="formLabelWidth">
            <el-radio-group v-model="form.news_pic_type" @change="picTypeHanleClick">
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="1">小图</el-radio>
              <el-radio :label="2">大图</el-radio>
              <!-- <el-radio :label="3">视频</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="展现样式：" :label-width="formLabelWidth" v-if="form.news_pic_type==0">
            <img src="https://img.sqydt.darongshutech.com/Fp7zz0JdvgYr9v1hkDPc5bRUZ1Yj" alt="">
          </el-form-item>
          <el-form-item label="资讯封面：" :label-width="formLabelWidth" v-if="form.news_pic_type==1||form.news_pic_type==2">
            <el-upload class="avatar-uploader" action="...." :show-file-list="false" :before-upload="newPicBeforeUploadImage">
              <img v-if="news_pic" :src="news_pic" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span>建议上传大小{{form.news_pic_type == 1 ? '220*150' : '750*375'}}，仅支持上传：".png", ".jpg", ".jpeg", ".gif"等格式文件)</span>
          </el-form-item>
          <el-form-item label="展现样式：" :label-width="formLabelWidth" v-if="form.news_pic_type==1">
            <img src="https://img.sqydt.darongshutech.com/FrsmuMnZSpBEeMRyUXeG1sffh1kF" alt="">
          </el-form-item>
          <el-form-item label="展现样式：" :label-width="formLabelWidth" v-if="form.news_pic_type==2">
            <img src="https://img.sqydt.darongshutech.com/FoYGhXfz8-Y79w6M5Vn3-Je7zpme" alt="">
          </el-form-item>

          <el-form-item label="资讯视频：" :label-width="formLabelWidth" v-if="form.news_pic_type==3 ">
            <div>
              <el-upload class="upload-demo" action="...." :on-change="vedioBeforeUpload" v-loading.fullscreen.lock="fullscreenLoading">
                <el-button size="small" type="primary" v-if="form.news_media==''">视频上传</el-button>
              </el-upload>
              <video :src="news_media" controls="controls" width="500" height="300" v-if="news_media">您的浏览器不支持 video 标签。</video>
            </div>
          </el-form-item>
          <el-form-item label="展现样式：" :label-width="formLabelWidth" v-if="form.news_pic_type==3">
            <img src="https://img.sqydt.darongshutech.com/FqyGEQdmTNmGx8ubOovRWgI16as_" alt="">
          </el-form-item>

        </div>

      </el-form>

      <div class="info-footer">
        <el-button type="success" @click="submitExamine('form',1)" icon="el-icon-refresh">提交审核</el-button>
        <el-button type="primary" @click="submitExamine('form',2)" icon="el-icon-document">保存编辑</el-button>
        <el-button type="primary" @click="codeView('form')" icon="el-icon-document">二维码预览</el-button>
        <!-- <img id="code" src="" @click="codeView('form');"/> -->
      </div>
    </el-card>

    <img src="" id="code" alt="">
    <el-dialog title="扫码预览" :visible.sync="codeDialogVisible" width="30%" center>
      <div style="text-align:center">
        <img :src="codeUrl" alt="" style="width:100%">
      </div>

    </el-dialog>
    <!-- <el-dialog title="" :visible.sync="listShowDialog" width="560PX">
                
       </el-dialog> -->

  </div>
</template>
<script>
import Tinymce from "../../components/Tinymce/index.vue";

//  数据service接口
import {
  RequestNewsAdd,
  RequestModuleList,
  RequestClassfiyList,
  RequestCodeView
} from "../../fetch/modules/info.js";
import { RequestUploads } from "../../fetch/modules/public.js";
import { RequestQiNiutoken } from "../../fetch/tool";
import { getToken } from "../../fetch/modules/public";
const rules = {
  news_title: [
    { required: true, message: "请输入资讯标题", trigger: "blur" },
    { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
  ],
  news_content: [{ required: true, message: "不能为空", trigger: "blur" }],
  category_id: [{ required: true, message: "不能为空", trigger: "blur" }],
  // banner_pic: ,
  banner_title: [
    { required: true, message: "请输入轮播标题", trigger: "blur" },
    { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
  ],
  news_pic: [{ required: true, message: "上传图片", trigger: "blur" }]
};
export default {
  components: { Tinymce },
  data() {
    return {
      rules,
      value2: 1,
      isLink: 1,
      form: {
        news_title: "",
        news_content: "",
        news_thumb: "",
        news_pic_type: 0,
        news_pic: "",
        category_id: null,
        attr_id: null,
        // tags: [],
        run_in: 2,
        news_intro: "",
        news_media: "",
        news_source: "",
        news_link: "",
        news_author: "",
        // attach: [{title:'文件名',url:'文件地址'},{title:'文件名',url:'文件地址'}],
        is_comment: "",
        is_lock: 1, // 1=未锁定 2=锁定
        is_top: 1, // 1=未置顶 2=置顶
        sort: 1,
        news_source: "",
        bsort: 1,
        banner_pic: "",
        banner_title: "",
        submit_type: "" // 提交状态 1提交审核，2保存编辑
      },
      formLabelWidth: "120px",
      inputVisible: false,
      inputValue: "",
      checked: false,
      // 投放区域
      regionData: 0,
      // 投放模块
      moduleData: [],
      // 获取投放分类
      classificationData: [],
      imageUrl: "",
      fileList: [],
      lunboImageUrl: "",
      news_pic: "",
      news_media: "",
      fullscreenLoading: false,
      tinymceIds: "tinymceIds",
      codeDialogVisible: false,
      codeUrl: ""
    };
  },
  created() {
    this.getModule();
    // this.getClassification();
  },
  watch: {
    "form.category_id"() {
      this.form.attr_id = "";
      let args = { category_id: this.form.category_id, pid: 0 };
      this.getClassification(args);
    }
  },
  methods: {
    // 获取投放模块
    getModule() {
      RequestModuleList().then(res => {
        this.moduleData = res.list;
      });
    },
    // 获取 投放分类
    getClassification(_obj) {
      RequestClassfiyList(_obj).then(res => {
        this.classificationData = res.list;
      });
    },

    // 资讯封面
    picTypeHanleClick(value) {
      if (value == 0) {
        this.form.news_pic = "";
        this.news_pic = "";
        this.news_media = "";
        this.form.news_media = "";
      }
      if (value != 1 || value != 2) {
        this.form.news_pic = "";
        this.news_pic = "";
      }
      if (value != 4) {
        this.form.news_media = "";
        this.news_media = "";
      }
    },
    // 清除选项验证结果
    clearValidate() {
      let _dom = document.querySelectorAll(".topicOption .el-form-item__error");
      console.log(_dom);
      _dom.forEach(element => {
        element.style.display = "none";
      });

      let _dom2 = document.querySelectorAll(".topicOption .el-input__inner");
      _dom2.forEach(element => {
        element.style.border = "1px solid #dcdfe6";
      });
    },

    // 投放区域单选框
    runInHanleClick(value) {
      this.clearValidate();
      if (value != 1) {
        this.form.attr_id = "";
        this.form.category_id = "";
      }
      if (value != 2) {
        this.lunboImageUrl = "";
        this.form.news_pic = "";
      }
      if (value != 3 || value != 4 || value != 1) {
        this.form.is_top = 2;
        this.form.news_pic_type = 0;
      }
    },
    // 提交审核
    submitExamine(formName, type) {
      let self = this;
      this.$nextTick(function() {
        self.$refs.form.validate(valid => {
          if (valid) {
            if (
              self.form.news_title != "" &&
              self.form.news_content.trim() != ""
            ) {
              self.form.submit_type = type;
              let _data = JSON.parse(JSON.stringify(self.form));
              self.checked == false ? (_data.is_top = 1) : (_data.is_top = 2);
              for (const key in _data) {
                // 去除对象内多余的空值key
                if (_data[key] === "") {
                  delete _data[key];
                }
              }
              // console.log(JSON.parse(_data.tags));
              let args = _data;
              RequestNewsAdd(args).then(res => {
                if (res.code == 2000) {
                  for (let i in this.form) {
                    //    if(i=='tags'){
                    //        this.form[i]=[];
                    //    }
                    if (i == "news_content") {
                      window.tinymce.get(this.tinymceIds).setContent("");
                    }
                    if (typeof self.form[i] == "string") {
                      self.form[i] = "";
                    }
                  }
                  self.lunboImageUrl = "";
                  self.news_pic = "";
                  self.news_media = "";
                  self.$router.push({ name: "infoList" });
                }
              });
            } else {
              return false;
            }
          }
        });
      });
    },
    // 二维码预览
    codeView(formName, type) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          if (
            self.form.news_title != "" &&
            self.form.news_content.trim() != ""
          ) {
            self.form.submit_type = type;
            let _data = JSON.parse(JSON.stringify(self.form));
            self.checked == false ? (_data.is_top = 1) : (_data.is_top = 2);
            for (const key in _data) {
              // 去除对象内多余的空值key
              if (_data[key] === "") {
                delete _data[key];
              }
              if (key == "news_media" && _data[key] != "") {
                _data.news_media = self.news_media;
              }
              if (key == "news_pic" && _data[key] != "") {
                _data.news_pic = self.news_pic;
              }
            }
            let args = _data;
            RequestCodeView(args).then(res => {
              if (res.code == 2000) {
                self.codeUrl = res.data.base_url + res.data.key;
                self.codeDialogVisible = true;
              }
            });
          } else {
            return false;
          }
        }
      });
    },

    // 轮播上传
    beforeUploadImage(file) {
      const isJPG = file.type,
        isLt2M = file.size / 1024 / 1024 < 2,
        self = this;
      var formData = new FormData();
      formData.append("file", file);
      if (
        isJPG == "image/jpeg" ||
        isJPG == "image/png" ||
        isJPG == "image/jpeg"
      ) {
        if (!isLt2M) {
          this.$message.error("请上传2m以下的图片");
          return false;
        }
        RequestUploads(formData).then(res => {
          self.form.banner_pic = res.data.key;
          self.lunboImageUrl = res.data.base_url + res.data.key;
        });
      } else {
        return this.$message.error("请上传图片");
      }
    },
    // 资讯封面上传
    newPicBeforeUploadImage(file) {
      console.log(file);
      const isJPG = file.type,
        isLt2M = file.size / 1024 / 1024 < 2,
        self = this;
      var formData = new FormData();
      formData.append("file", file);
      if (
        isJPG == "image/jpeg" ||
        isJPG == "image/png" ||
        isJPG == "image/jpeg"
      ) {
        if (!isLt2M) {
          this.$message.error("请上传2m以下的图片");
          return false;
        }
        RequestUploads(formData).then(res => {
          self.form.news_pic = res.data.key;
          self.news_pic = res.data.base_url + res.data.key;
        });
      } else {
        return this.$message.error("请上传图片");
      }
    },
    // 视频上传
    vedioBeforeUpload(file) {
      const isVedio = file.raw.type,
        self = this;
      let fileText = "";
      var formData = new FormData();

      let isVedioArr = isVedio.split("/");
      for (let i in isVedioArr) {
        i == 1 ? (fileText = isVedioArr[i]) : "";
      }
      if (
        isVedio == "video/mp4" ||
        isVedio == "video/mp3" ||
        isVedio == "video/rmvb" ||
        isVedio == "video/avi" ||
        isVedio == "video/rm" ||
        isVedio == "video/flv"
      ) {
        var config = {
          onUploadProgress: progressEvent => {
            var complete =
              ((progressEvent.loaded / progressEvent.total * 100) | 0) + "%";
          }
        };
        const loading = this.$loading({
          lock: true,
          text: "视频上传中请稍等。。。",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        getToken({ file_ext: fileText }).then(res => {
          let key = res.key;
          formData.append("file", file.raw);
          formData.append("token", res.token);
          const loading = self.$loading({
            lock: true,
            text: "视频上传中请稍等。。。",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          self.RequestQiu(formData).then(res => {
            //  self.news_media= `https://img.sqydt.darongshutech.com/${res.hash}`;
            self.news_media = `https://img.sqydt.darongshutech.com/${res.hash}`;
            self.form.news_media = key;
            loading.close();
          });
        });
        // this.$http.post(`public/uploads`, formData, config).then(res => {
        //   if (res.data.code === 2000) {
        //     this.news_media= res.data.data.base_url + res.data.data.key;
        //     this.form.news_media = res.data.data.key;
        //   }
        // });
        // RequestUploads(formData).then(res=>{
        //         console.log(res)
        //         if(res.code==4000){
        //                this.$message.error(res.msg)
        //         }else{
        //             self.form.news_pic= res.data.base_url+res.data.key;
        //         }

        // })
      } else {
        return this.$message.error("请上传视频文件");
      }
    },

    RequestQiu(formData) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      return new Promise((resolve, reject) => {
        this.$http.post("https://up.qbox.me", formData, config).then(res => {
          if (res.status == 200) {
            resolve(res.data);
          } else {
            this.$message.error("上传失败");
          }
        });
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    //  form标签,删除标签
    handleClose(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
    },
    //  form标签
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //  form标签处理
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue && this.form.tags.length <= 2) {
        this.form.tags.push(inputValue);
      } else {
        this.$message("标签最多只能添加三个");
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .info-footer {
    margin-left: 120px;
    padding: 50px 0;
  }
  .el-tag + .el-tag {
    margin-right: 10px;
  }
  .button-new-tag {
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-right: 10px;
    vertical-align: bottom;
  }
  .info-title {
    padding: 10px;
    margin-bottom: 30px;
    font-size: 16px;
    color: #1890ff;
    border-bottom: 5px solid rgb(247, 246, 252);
  }
  .avatar-uploader,
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 178px;
    width: 178px;
    overflow: hidden;
  }
  .avatar-uploader,
  .el-upload:hover {
    border-color: #409eff;
  }
  .el-upload,
  .el-upload--text {
    border: 1px dashed #d9d9d9 !important;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
