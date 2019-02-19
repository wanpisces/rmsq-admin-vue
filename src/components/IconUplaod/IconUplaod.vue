<template>
  <div class="container">
    <el-upload class="upload-demo" drag :action="qiniuUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :on-error="handleError" :before-upload="beforeAvatarUpload" :data="qiniuData">
      <img v-if="imageUrl" :src="baseUrl+imageUrl" class="avatar2">
      <div v-else class="el-default">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          <em>点击上传</em>
        </div>
      </div>
      <div class="el-upload__tip" slot="tip">建议上传750*360，仅支持上传：".png", ".jpg", ".jpeg", ".gif"等格式文件)，且不超过2MB</div>
    </el-upload>
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
      default: "https://img.sqydt.darongshutech.com/"
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
      this.$http
        .get(this.upTokenUrl, { params: { file_ext: this.fileExt } })
        .then(function(res) {
          if (res.data.code === 2000) {
            _this.qiniuData.token = res.data.data.token;
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
      this.qiniuData.key = file.name;
      const isJPG = file.type === "image/jpg";
      const isPNG = file.type === "image/png";
      const isGif = file.type === "image/gif";
      const isJpeg = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG && !isGif && !isJpeg) {
        this.$message.error("图片只能是 JPG/jPEG/PNG/GIF 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
        return false;
      }
    },
    handleAvatarSuccess: function(res, file) {
      // this.imageUrl = _this.baseUrl + res.key;
      this.$emit("handleSuccess", res, file);
    },
    handleError: function(res) {
      this.$message({
        message: "上传失败",
        duration: 2000,
        type: "warning"
      });
    }
  }
};
</script>

<style >
.title {
  margin: 90px 0 40px 0;
  font-size: 12px;
}
.el-default .el-icon-upload {
  margin-top: 30px;
}
.el-upload-dragger {
  width: 150px;
  height: 150px;
}
.avatar2 {
  width: 150px;
  height: 150px;
  display: block;
}
.el-upload__text {
  font-size: 12px;
}
</style>