<template>
  <div>
    <el-form-item label="分享样式设置:">
      <el-radio-group v-model="radio" @change="changeStyle">
        <el-radio label="1">默认样式</el-radio>
        <el-radio label="2">自定义样式</el-radio>
      </el-radio-group>
    </el-form-item>
    <div v-if="radio==1">
      <el-form-item label="">
        <!-- <div class="style-wrapper">
          <div class="show-wrap1">
            <img class="show-img1" :src="default_share_pic" alt="">
          </div>
          <el-radio @change="changeStyle" v-model="radio1" label="1111">默认样式(小程序自动截屏)</el-radio>
        </div> -->
        <div class="style-wrapper" v-for="(item,index) in templateData" :key="index">
          <div class="show-wrap">
            <h3 class="word_wrap">{{curTitle}}</h3>
            <img class="show-img" :src="item.share_pic" alt="">
          </div>
          <el-radio @change="changeStyle1" v-model="radio1" :label="item.theme_id">{{item.theme_name}}</el-radio>
        </div>
      </el-form-item>
    </div>
    <div v-if="radio==2">
      <el-form-item label="上传分享封面:" prop="share_pic" :rules="[{ required: true, message: '请上传分享', trigger: 'blur' }]">
        <!-- <el-upload class="upload-demo" drag action="..." multiple :before-upload="bannerBeforeUploadImage">
          <img v-if="img_banner_pic" :src="img_banner_pic" class="avatar">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传jpg、jpeg,png文件,上传大小不超过2M（建议上传宽500px，高400px图片）</div>
        </el-upload> -->
        <vue-cropper @change="callBackImg" :fixedRatio='[5,4]' :cropWidth="250" :cropHeight="200">
        </vue-cropper>
        <div v-if="img_banner_pic" style="margin-top:8px">
          <img :src="img_banner_pic" width="300" height="240" alt="">
        </div>
      </el-form-item>
      <el-form-item label="分享文案:">
        <el-input type="text" style="width:220px" maxlength="16" :rows="1" placeholder="请输入内容,最大长度为16个字符" @change="changeValue" v-model="share_desc1">
        </el-input>
      </el-form-item>
      <el-form-item label="分享展示样式:">
        <div class="show-wrap">
          <h3 class="word_wrap">{{share_desc1}}</h3>
          <img class="show-img" :src="img_banner_pic" alt="">
        </div>
      </el-form-item>
    </div>
    <el-form-item v-if="markBtn">
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      <el-button @click="cancleForm">取 消</el-button>
    </el-form-item>
  </div>
</template>

<script>
import { RequestUploads } from "@/fetch/modules/public.js";
import VueCropper from "./../uploadImg/uploadCropper";
export default {
  name: "share-template",
  components: { VueCropper },
  props: {
    share_desc: {
      type: String,
      default: ""
    },
    share_pic: {
      type: String,
      default: ""
    },
    curTitle: {
      type: String,
      default: ""
    },
    templateData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    markBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      img_banner_pic: "",
      radio: "1",
      radio1: "",
      share_desc1: this.share_desc,
      share_pic1: this.share_pic
    };
  },
  created() {
    this.getShareTheme();
  },
  watch: {
    curTitle() {
      this.getShareTheme();
    }
  },
  methods: {
    changeStyle() {
      this.share_desc1 = "";
      this.share_pic1 = "";
      this.img_banner_pic = "";
      if (this.radio == 1) {
        this.share_desc1 = this.curTitle;
        this.share_pic1 = this.templateData[0].share_pic;
        this.radio1 = this.templateData[0].theme_id;
      }
      this.changeValue();
    },
    changeStyle1(e) {
      this.share_desc1 = this.curTitle;
      this.templateData.forEach((item, index) => {
        if (item.theme_id == e) {
          this.share_pic1 = item.share_pic;
        }
      });
      this.changeValue();
    },
    //  剪裁图片回掉
    callBackImg(status, params, data) {
      // this.baseUrl = params.baseUrl;
      console.log(status, params, data);
      if (status == "uploadSuccess") {
        // this.form.banner_pic = data.key;
        this.share_pic1 = params.baseUrl + data.key;
        this.img_banner_pic = params.baseUrl + data.key;
        this.changeValue();
      }
    },

    getShareTheme() {
      var templateData = this.templateData;
      this.radio1 = templateData[0].theme_id;
      this.radio = "2";
      this.img_banner_pic = this.share_pic;
      if (!this.share_pic && !this.share_desc) {
        this.radio = "1";
        this.share_desc1 = this.share_desc;
      } else {
        this.share_desc1 = this.curTitle;
      }
      if (this.share_pic) {
        templateData.map((item, index) => {
          if (item.share_pic == this.share_pic) {
            this.radio = "1";
            this.radio1 = item.theme_id;
          }
        });
      } else {
        this.radio = "1";
        this.share_pic1 = templateData[0].share_pic;
      }
      this.changeValue();
    },
    changeValue() {
      let obj = {
        share_desc: this.share_desc1,
        share_pic: this.share_pic1
      };
      this.$emit("getShare", obj);
    },
    submitForm() {
      let obj = {
        share_desc: this.share_desc1 || this.curTitle,
        share_pic: this.share_pic1
      };
      // this.$emit("submitForm", obj);
      if (!this.share_pic1) {
        this.$message.error("请上传分享图片");
      } else {
        this.$emit("submitForm", obj);
      }
    },
    cancleForm() {
      this.img_banner_pic = "";
      this.radio1 = "1111";
      this.radio = "1";
      this.share_pic1 = "";
      this.$emit("cancleForm");
    },
    // 图片上传
    bannerBeforeUploadImage(file) {
      const isJPG = file.type,
        isLt2M = file.size / 1024 / 1024 < 2,
        self = this;
      var formData = new FormData();

      formData.append("file", file);
      if (isJPG == "image/jpeg" || isJPG == "image/jpg" || isJPG == "image/png") {
        if (isLt2M) {
          RequestUploads(formData).then(res => {
            self.share_pic1 = res.data.base_url + res.data.key;
            this.img_banner_pic = res.data.base_url + res.data.key;
            this.changeValue();
          });
        } else {
          this.$message.error("请上传2M以下图片");
        }
      } else {
        this.$message.error("请上传正确的格式图片");
        return false;
      }
    }
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.style-wrapper {
  width: 200px;
  margin: 0 20px 0 0;
  display: inline-block;
}
.show-wrap {
  display: inline-block;
  width: 200px;
  min-height: 230px;
  margin-top: 10px;
  padding: 20px 10px;
  background: url("../../../static/images/show-iframe.png") center top no-repeat;
  background-size: 100% 100%;
  font-family: "微软雅黑";
}
.show-wrap > h3 {
  min-height: 30px;
  line-height: 16px;
  font-weight: normal;
  font-size: 12px;
  letter-spacing: 1px;
  margin: 0;
  padding: 12px 0 3px;
  color: #777;
}
.show-img {
  width: 100%;
  // height: 160px;
  padding: 0;
  margin: 0;
}
.show-wrap1 {
  height: 310px;
}
.show-img1 {
  width: 100%;
  height: 290px;
  padding: 0;
  margin: 0;
  border: 1px solid #eee;
  border-radius: 5px;
}
.avatar {
  width: 100%;
  height: 100%;
}
.el-upload__tip {
  line-height: 20px;
  color: #aaa;
}
</style>


