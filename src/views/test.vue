 
<template>
  <div>
    <!-- element 上传图片按钮 -->
    <div tabindex="0" class="el-upload el-upload--text">

      <label for="uploads">
        <div class="el-upload-dragger">
          <!---->
          <img v-if="img_banner_pic" :src="img_banner_pic" alt="">
          <div v-if="!img_banner_pic">
            <i data-v-32ec2b46="" class="el-icon-upload"></i>
            <div data-v-32ec2b46="" class="el-upload__text">
              <em data-v-32ec2b46="">点击上传</em>
            </div>
          </div>

        </div>
      </label>
      <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event)"></div>
    <div class="el-upload__tip" slot="tip">只能上传jpg、jpeg、png、bmp、gif文件（建议上传大小不超过2M，宽750px，高360px尺寸）</div>
    <el-dialog title="图片裁剪" :visible.sync="isShowCropper" :close-on-click-modal="false">
      <div class="vue-cropper-box">
        <div class="vue-cropper-content">
          <vueCropper ref="cropper" :img="option.img" :outputSize="option.outputSize" :outputType="option.outputType" :info="option.info" :canScale="option.canScale" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :fixed="option.fixed" :fixedNumber="option.fixedNumber"></vueCropper>
        </div>
        <div class="operate-wrap clearfix">
          <div class="lf">
            <el-button type="danger" plain @click="turnLeft">左旋转</el-button>
            <el-button type="danger" plain @click="turnRight">右旋转</el-button>
            <el-button type="danger" @click="onCubeImg">确定裁剪图片</el-button>
          </div>
          <div class="rt">
            <el-button type="primary" @click="cancleCropper">取消</el-button>
          </div>
        </div>

      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import { RequestUploads } from "@/fetch/modules/public.js";
import { VueCropper } from "vue-cropper";
export default {
  components: {
    VueCropper
  },
  data() {
    return {
      upTokenUrl: "api/public/getUploadToken",
      /**
       * 1.七牛云地址
       */
      qiniuUrl: "http://up.qiniu.com" /* 地址二：https://up.qbox.me */,
      /**
       * 2.文件存放地址,需要在结尾加上'/'
       */
      baseUrl: "https://img.sqydt.darongshutech.com/",
      imgFile: "",
      //裁剪组件的基础配置option
      option: {
        img: "",
        outputSize: 1, //剪切后的图片质量（0.1-1）
        full: false, //输出原图比例截图 props名full
        outputType: "jpeg",
        canMove: true,
        original: false,
        canMoveBox: true,
        canScale: true,
        autoCrop: true,
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: true,
        fixedNumber: [4, 3]
      },
      fileinfo: {},
      fileUpload: null,
      img_banner_pic: "",
      isShowCropper: false //是否显示截图框
    };
  },
  methods: {
    //选择本地图片
    handleUploadSuccess(response, file, fileList) {
      console.log("Upload response is %o", response);
      this.fileinfo = response;
      this.fileUpload = file;
      //上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = file.url;
        this.isShowCropper = true;
      });
    },
    turnLeft() {
      this.$refs.cropper.rotateLeft();
    },
    turnRight() {
      this.$refs.cropper.rotateRight();
    },
    cancleCropper() {
      this.isShowCropper = false;
    },
    uploadImg(e) {
      //上传图片
      // this.option.img
      var file = e.target.files[0];
      this.fileinfo = file;
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message.error("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.option.img = data;
        this.isShowCropper = true;
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
    },

    // 确定裁剪图片
    onCubeImg() {
      // 获取cropper的截图的base64 数据
      this.$refs.cropper.getCropData(data => {
        // this.fileinfo.url = data;
        this.isShowCropper = false;
        //先将显示图片地址清空，防止重复显示
        this.option.img = "";
        //将剪裁后base64的图片转化为file格式
        let file = this.convertBase64UrlToBlob(data);
        file.name = this.fileinfo.name;
        var formData = new FormData();
        formData.append("file", file);
        const isLt2M = file.size / 1024 / 1024 < 2;
        //将剪裁后的图片执行上传
        if (isLt2M) {
          this.getQiniuToken().then(obj => {
            // console.log("文件token", resData);
            formData.append("token", obj.data.token);
            formData.append("key", obj.data.key);
            // 上传文件至七牛云
            this.RequestQiniu(formData).then(res => {
              this.img_banner_pic = this.baseUrl + res.key;
              this.isShowCropper = false;
            });
          });
        } else {
          this.$message.error("请上传2M以下图片");
        }
      });
    },
    // 将base64的图片转换为file文件
    convertBase64UrlToBlob(urlData) {
      let bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/jpeg" });
    },
    getQiniuToken() {
      return new Promise((resolve, reject) => {
        this.$http
          .get(this.upTokenUrl, {
            params: { file_ext: this.option.outputType }
          })
          .then(res => {
            if (res && res.data && res.data.code === 2000) {
              resolve(res.data);
            } else {
              this.$message({
                message: res.data.msg,
                duration: 2000,
                type: "warning"
              });
              this.$emit("change", "getTokenErr", this.paramsObj, res.data);
            }
          });
      });
    },
    RequestQiniu(formData) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: progressEvent => {
          let complete =
            ((progressEvent.loaded / progressEvent.total * 100) | 0) + "%";
          console.log("uploading", complete);
          this.$emit("change", "uploading", this.paramsObj, complete);
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
            this.$emit("change", "uploadFailed", this.paramsObj, res.data);
          }
        });
      });
    }
  }
};
</script>
<style scoped>
.vue-cropper-content {
  width: 100%;
  height: 500px;
}
/* .vue-cropper-box{

} */
.operate-wrap {
  margin-top: 30px;
}
</style>
