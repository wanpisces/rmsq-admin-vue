<template>
  <div class="upload-container">
    <!-- <el-upload class="upload-demo" :action="action" :file-list="fileList" :before-upload="beforeUpload" :show-file-list="false">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload> -->
    <div class="file">
      <input type="file" @change="imageChange" />
      <span style="font-size:14px;">上传文件</span>
    </div>

  </div>
</template>

<script>
// import { getToken } from "@/fetch/modules/public";
import { RequestAddMenu } from "@/fetch/modules/material";
import { getToken } from "@/utils/auth";
export default {
  name: "editorSlideUpload",
  props: {
    color: {
      type: String,
      default: "#20a0ff"
    },
    typeOne: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      fileList: [],
      state: 0,
      action: "do"
    };
  },
  methods: {
    /**
     * 图片上传前
     */
    imageChange($event) {
      let _this = this;
      let file = $event.target.files[0],
        fileType = $event.target.files[0].type;
      let isLt2M = $event.target.files[0].size / 1024 / 1024 <= 2;
      let isLt10M = $event.target.files[0].size / 1024 / 1024 <= 10;
      if (this.typeOne == 1) {
        if (fileType == "image/jpeg" || fileType == "image/png" || fileType == "image/jpeg" || fileType == "image/jpg") {
        } else {
          this.$message.error("请上传图片");
          return false;
        }
        if (!isLt2M) {
          this.$message.error("请上传2M以下的图片");
          return false;
        }
      } else if (this.typeOne == 2) {
        console.log("zhixing2");
        if (fileType == "video/mp4") {
        } else {
          this.$message.error("请上传视频");
          return false;
        }
        if (!isLt10M) {
          this.$message.error("请上传10M以下的视频");
          return false;
        }
      } else {
        return false;
      }
      let formData = new FormData();
      formData.append("file", file);
      formData.append("is_temporary", 2);
      formData.append("type", this.typeOne);
      formData.append("token", getToken());
      formData.append("group_id", 1);
      RequestAddMenu(formData).then(res => {
        $event.target.value = "";
        _this.$emit("successCall", res);
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container {
  .editor-slide-upload {
    margin-bottom: 20px;
  }
  .file {
    position: relative;
    // border: 1px #000 solid;
    overflow: hidden;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    background: #39bcf3;
    cursor: pointer;
    border-radius: 4px;
  }
  .file span {
    color: #fff;
    cursor: pointer;
  }
  .file input {
    position: absolute;
    top: 0;
    left: 0;
    width: 300px;
    height: 30px;
    opacity: 0;
    color: #fff;
    cursor: pointer;
  }
}
</style>

