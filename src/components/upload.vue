<template>
  <div class="container">
    <el-upload class="upload-demo" drag action="...." :show-file-list="false" :before-upload="beforeAvatarUpload" :data="qiniuData">
      <slot>
        <img v-if="imageUrl&& format!=3" :src="imageUrl" class="avatar">
      </slot>
      <div class="el-default">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </div>
    </el-upload>
    <slot name="vedio">
      <video v-if="imageUrl && format==3" :src="imageUrl" controls="controls"></video>
    </slot>
    <slot name="suggestion">
      <div class="el-upload__tip" slot="tip">建议上传750*420，仅支持上传：".png", ".jpg", ".jpeg", ".gif"等格式文件)</div>
    </slot>
  </div>
</template>

<script>
let _this;
export default {
  props: {
    /**
     * 1.获取上传七牛云token，接口地址，
     */
    upTokenUrl: {
      type: String,
      default: "api/public/getUploadToken"
    },
    /**
     * 1.七牛云地址
     */
    qiniuUrl: {
      type: String,
      default: "http://up.qiniu.com"
    },
    /**
     * 1.上传文件格式jpg,png,jpeg
     */
    fileExt: {
      type: String,
      default: "jpg"
    },
    /**
     * 1.图片地址
     */
    imageUrl: {
      type: String,
      default: ""
    },
    /**
     * 2.图片基础地址,需要在结尾加上'/'
     */
    baseUrl: {
      type: String,
      default: "https://img.sport.darongshutech.com/"
    },
    /**
     * 1 格式区分，兼容老板本， 1.图片，2.只针对动图 3.视频
     */
    format: {
      type: Number || String,
      default: 1
    }
  },
  data() {
    _this = this;
    return {
      qiniuData: {
        key: "",
        token: ""
      }
    };
  },
  created() {
    this.getQiniuToken();
  },
  methods: {
    getQiniuToken: function() {
      this.$http.get(this.upTokenUrl, { params: { file_ext: this.fileExt } }).then(function(res) {
        if (res.data.code === 2000) {
          _this.qiniuData.token = res.data.data.token;
          return res.data.data;
        } else {
          _this.$message({
            message: res.data.msg,
            duration: 2000,
            type: "warning"
          });
        }
      });
    },
    beforeAvatarUpload: function(file) {
      // console.log(file.type);
      let formatName = this.format == 1 ? "图片" : this.format == 2 ? "动图" : "视频";
      let _this = this;
      this.qiniuData.key = file.name;
      const isJPG = file.type === "image/jpg";
      const isPNG = file.type === "image/png";
      const isGif = file.type === "image/gif";
      const isJpeg = file.type === "image/jpeg";
      const isMp4 = file.type == "video/mp4";
      const isLt2M = file.size / 1024 / 1024 < 1000;
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (this.format == 1) {
        if (!isJPG && !isPNG && !isGif && !isJpeg) {
          this.$message.error(formatName + "只能是 JPG/jPEG/PNG/GIF 格式!");
          return false;
        }
        if (!isLt2M) {
          this.$message.error(formatName + "大小不能超过 2MB!");
          return false;
        }
      }
      if (this.format == 2) {
        if (!isGif) {
          this.$message.error(formatName + "只能是 GIF 格式!");
          return false;
        }
        if (!isLt2M) {
          this.$message.error(formatName + "大小不能超过 2MB!");
          return false;
        }
      }
      if (this.format == 3) {
        if (!isMp4) {
          this.$message.error(formatName + "只能是mp4格式!");
          return false;
        }
        // if (!isLt10M) {
        //   this.$message.error(formatName + "大小不能超过 10MB!");
        //   return false;
        // }
      }
      let isVedioArr = file.type.split("/"),
        fileText = "";
      for (let i in isVedioArr) {
        i == 1 ? (fileText = isVedioArr[i]) : "";
      }
      _this.$http.get(this.upTokenUrl, { params: { file_ext: fileText } }).then(function(res) {
        if (res.data.code === 2000) {
          var formData = new FormData();
          formData.append("file", file);
          formData.append("token", res.data.data.token);
          formData.append("key", res.data.data.key);
          _this.RequestQiu(formData).then(resopnse => {
            // console.log("aaaaa______111111111111111111111", resopnse);
            _this.$emit("handleSuccess", resopnse, res.data.data, file);
          });
          // return res.data.data;
        } else {
          _this.$message({
            message: res.data.msg,
            duration: 2000,
            type: "warning"
          });
        }
      });
    },
    RequestQiu(formData) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      return new Promise((resolve, reject) => {
        this.$http.post("https://up.qbox.me", formData, config,1).then(res => {
          if (res.status == 200) {
            resolve(res.data);
          }
        });
      });
    }
    // handleAvatarSuccess: function(res, file) {
    //   // this.imageUrl = _this.baseUrl + res.key;
    //   this.$emit("handleSuccess", res, file);
    // },
    // handleError: function(res) {
    //   this.$message({
    //     message: "上传失败",
    //     duration: 2000,
    //     type: "warning"
    //   });
    // }
  }
};
</script>

<style>
.title {
  margin: 90px 0 40px 0;
}
.el-default .el-icon-upload {
  margin-top: 125px;
}
.el-upload-dragger {
  width: 350px;
  height: 250px;
}
.avatar {
  width: 350px;
  height: 250px;
  display: block;
}
</style>