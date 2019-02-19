<template>
  <div class="container">
    <el-upload ref="uploadComponent" class="upload-demo" :drag="dragAble" :limit="limitNum" :multiple="multipleAble" action="customize" :accept="acceptString" :auto-upload="autoUpload" :show-file-list="showFileList" :http-request="uploadFile">
      <slot>
        <el-button slot="trigger" size="mini" type="primary">上传文件</el-button>
      </slot>
      <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      <!-- <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
  </div>
</template>

<script>
import { RequestUploads } from "@/fetch/modules/public.js";
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
      default: "http://up.qiniu.com" /* 地址二：https://up.qbox.me */
    },
    /**
     * 2.文件存放地址,需要在结尾加上'/'
     */
    baseUrl: {
      type: String,
      default: "https://img.sqydt.darongshutech.com/"
    },
    uploadSelf: {
      type: Boolean,
      default: false /* 上传文件到自己服务器，否则就上传到七牛云 */
    },
    multipleAble: {
      type: Boolean,
      default: false /* 是否支持多选文件 */
    },
    dragAble: {
      type: Boolean,
      default: false /* 是否启用拖拽上传 */
    },
    autoUpload: {
      type: Boolean,
      default: true /* 自动上传 */
    },
    showFileList: {
      type: Boolean,
      default: false /* 显示上传文件列表 */
    },
    acceptString: {
      type: String,
      default: ".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PNG,.GIF" /* 允许的上传格式 */
    },
    maxSize: {
      type: Number,
      default: 2 /* 文件大小限制 单位：MB */
    },
    limitNum: {
      type: Number,
      default: 0 /* 最大允许上传个数 0为无限制 */
    },
    paramsObj: {
      type: Object /* 载荷 */,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      file: null
    };
  },
  created() {},
  methods: {
    isInArr(_val, _arr) {
      return _arr.some(item => {
        if (item === _val) {
          return true;
        }
      });
    },
    uploadFile: function(params) {
      const _file = params.file;
      this.file = _file;
      // console.log("file", _file, _file.size / 1024 / 1024);
      const isLt = _file.size / 1024 / 1024 < this.maxSize;

      // const _fileExt = _file.type.split("/")[1]; // .mp3 在火狐和ie 读取的格式为 mpeg
      const _index = _file.name.lastIndexOf(".");
      const _fileExt = _file.name.substring(+_index + 1);
      const _allAcceptArr = this.acceptString.split(",");
      // console.log("文件类型_fileExt", _file, _fileExt, _allAcceptArr);

      if (!this.isInArr("." + _fileExt, _allAcceptArr)) {
        this.$message.error("请上传格式为" + this.acceptString + "的文件！");
        return false;
      }

      if (this.maxSize && !isLt) {
        this.$message.error("请上传小于" + this.maxSize + "MB的文件！");
        return false;
      }

      // 使用FormData对象上传文件
      var formData = new FormData();
      formData.append("file", _file);

      this.$emit("change", "startUpload", _file, this.paramsObj);

      if (this.uploadSelf) {
        RequestUploads(formData).then(res => {
          // console.log("上传至自己的服务器", res);
          if (res && res.code == 2000) {
            this.paramsObj.baseUrl = res.data.base_url;
            this.$emit("change", "uploadSuccess", _file, this.paramsObj, res.data);
          } else {
            this.$message({
              message: "上传失败！",
              duration: 2000,
              type: "warning"
            });
            this.$emit("change", "uploadFailed", _file, this.paramsObj, res.data);
          }
        });
      } else {
        // 获取七牛云TOKEN
        this.getQiniuToken(_fileExt).then(resData => {
          // console.log("文件token", resData);
          formData.append("token", resData.data.token);
          formData.append("key", resData.data.key);
          // 上传文件至七牛云
          this.RequestQiniu(formData).then(resopnse => {
            this.paramsObj.baseUrl = this.baseUrl;
            this.$emit("change", "uploadSuccess", _file, this.paramsObj, resopnse);
          });
        });
      }
    },
    getQiniuToken(_fileExt) {
      return new Promise((resolve, reject) => {
        this.$http.get(this.upTokenUrl, { params: { file_ext: _fileExt } }).then(res => {
          if (res && res.data && res.data.code === 2000) {
            resolve(res.data);
          } else {
            this.$message({
              message: res.data.msg,
              duration: 2000,
              type: "warning"
            });
            this.$emit("change", "getTokenErr", this.file, this.paramsObj, res.data);
          }
        });
      });
    },
    RequestQiniu(formData) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: progressEvent => {
          let complete = (((progressEvent.loaded / progressEvent.total) * 100) | 0) + "%";
          this.$emit("change", "uploading", this.file, this.paramsObj, complete);
        }
      };
      return new Promise((resolve, reject) => {
        this.$http.post(this.qiniuUrl, formData, config).then(res => {
          if (res && res.status == 200) {
            resolve(res.data);
          } else {
            this.$message({
              message: res.data.msg,
              duration: 2000,
              type: "warning"
            });
            this.$emit("change", "uploadFailed", this.file, this.paramsObj, res.data);
          }
        });
      });
    }
  }
};
</script>

<style scode>
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