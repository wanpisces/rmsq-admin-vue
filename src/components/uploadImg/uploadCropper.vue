<template>
  <div class="cropper-box">
    <label class="btn" for="upload2">上传图片</label>
    <input type="file" id="upload2" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="readImg($event)">
    <el-dialog title="剪切" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" append-to-body>
      <div class="showBox">
        <vueCropper ref="cropper2" :original="true" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="option.info" :canScale="option.canScale" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :fixed="option.fixed" :fixedNumber="option.fixedNumber"></vueCropper>
      </div>
      <div class="flex-between row">
        <div>
          请选择截图比例：
          <el-select :clearable="false" style="width:120px" :value="fixedStr" @change="changeFixedNumber" placeholder="截图比例">
            <el-option v-for="(item,index) in allFixedNumber" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-button type="primary" plain @click="rotateRight">顺时针</el-button>
          <el-button type="primary" plain @click="rotateLeft">逆时针</el-button>
        </div>
      </div>

      <div v-if="isCustemFix" class="row">
        自定义截图比例：
        <el-input-number style="width:100px" v-model="num1" controls-position="right" @change="changeNum1" :min="0.1" :max="100"></el-input-number> :
        <el-input-number style="width:100px" v-model="num2" controls-position="right" @change="changeNum2" :min="0.1" :max="100"></el-input-number>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消上传</el-button>
        <el-button type="primary" :loading="isUpload" @click="getImg">确认上传</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueCropper from "./vue-cropper/vue-cropper";

export default {
  components: {
    VueCropper
  },
  props: {
    upTokenUrl: {
      type: String /* 获取上传七牛云token，接口地址 */,
      default: "api/public/getUploadToken"
    },
    qiniuUrl: {
      type: String /* 七牛云地址 */,
      default: "http://up.qiniu.com" /* 地址二：https://up.qbox.me */
    },
    baseUrl: {
      type: String /* 文件存放地址,需要在结尾加上'/' */,
      default: "https://img.sqydt.darongshutech.com/"
    },
    maxSize: {
      type: Number,
      default: 0 /* 文件大小限制 单位：MB，0为无限制*/
    },
    isCrop: {
      type: Boolean /* 是否剪切 */,
      default: true
    },
    fixedRatio: {
      type: Array /* 真实的输出宽高比例 */,
      default: function() {
        return [4, 3];
      }
    },
    cropWidth: {
      type: Number /* 初始剪切框宽度 */,
      default: function() {
        return this.fixedRatio[0] * 100;
      }
    },
    cropHeight: {
      type: Number /* 初始剪切框高度 */,
      default: function() {
        return this.fixedRatio[1] * 100;
      }
    },
    paramsObj: {
      type: Object /* 载荷 */,
      default: function() {
        return {
          baseUrl: this.baseUrl
        };
      }
    }
  },
  data: function() {
    return {
      dialogVisible: false,
      isUpload: false,
      model: false,
      modelSrc: "",
      crap: false,
      previews: {},
      option: {
        img: "",
        info: true,
        size: 1,
        outputType: "png",
        canScale: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: this.cropWidth,
        autoCropHeight: this.cropHeight,
        fixed: true, // 是否开启固定宽高比
        // 真实的输出宽高
        infoTrue: true,
        high: true,
        fixedNumber: this.fixedRatio
      },
      fixedStr: this.fixedRatio.join(" : "),
      allFixedNumber: ["1 : 1", "2 : 1", "4 : 3", "5 : 3", "5 : 4", "自定义"],
      num1: this.fixedRatio[0], // 自定义比例 1
      num2: this.fixedRatio[1], // 自定义比例 2
      isCustemFix: false, // 是否为自定义比例
      imgName: "image",
      fullName: ""
    };
  },
  watch: {
    fixedRatio(val) {
      // console.log("fixedRatio", val);
      const [wid, high] = this.controlCropBound(val, [750, 500], 100);
      // console.log("fixArr", val);
      // console.log("wid", wid, high);
      this.option.fixedNumber = val;
      this.fixedStr = val.join(" : ")
      this.addScale(val);
    }
  },
  mounted() {
    // 判断传入的比例是否存在，不存在就添加
    this.addScale(this.fixedRatio);
  },
  methods: {
    changeNum1(val) {
      console.log("num1", val);
      this.setFixNum([val, this.num2]);
    },
    changeNum2(val) {
      console.log("num2", val);
      this.setFixNum([this.num1, val]);
    },
    // 添加比例
    addScale(arr) {
      // 判断传入的比例是否存在，不存在就添加
      const _fixedRatioStr = arr.join(" : ");
      if (!this.isHasFixNum(_fixedRatioStr)) {
        this.allFixedNumber.unshift(_fixedRatioStr);
      }
    },
    // 比例是否存在
    isHasFixNum(fixStr) {
      return !!~this.allFixedNumber.indexOf(fixStr);
    },
    // 改变比例尺
    changeFixedNumber(val) {
      if (val == "自定义") {
        this.num1 = this.fixedRatio[0];
        this.num2 = this.fixedRatio[1];
        this.fixedStr = val;
        this.isCustemFix = true;
      } else {
        this.isCustemFix = false;
        this.setFixNum(val.split(" : "));
      }
    },
    // 设置自定义比例
    // setFixNum(fixArr) {
    //   this.option.fixedNumber = fixArr;
    //   this.$refs.cropper2.changeCrop(fixArr[0] * 100, fixArr[1] * 100);
    //   !this.isCustemFix && (this.fixedStr = fixArr.join(" : "));
    // },
    // 设置自定义比例
    setFixNum(fixArr) {
      const [wid, high] = this.controlCropBound(fixArr, [750, 500], 100);
      console.log("fixArr", fixArr);
      console.log("wid", wid, high);
      this.option.fixedNumber = fixArr;
      this.$refs.cropper2.changeCrop(wid, high);
      !this.isCustemFix && (this.fixedStr = fixArr.join(" : "));
    },
    controlCropBound(fixArr, boundArr, $multiple) {
      return fixArr[0] * $multiple < boundArr[0] && fixArr[1] * $multiple < boundArr[1] ? [fixArr[0] * $multiple, fixArr[1] * $multiple] : this.controlCropBound(fixArr, boundArr, $multiple / 2);
    },
    // 取消上传
    handleClose(done) {
      this.$confirm("确认取消上传？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 逆时针
    rotateLeft() {
      this.$refs.cropper2.rotateLeft();
    },
    // 顺时针
    rotateRight() {
      this.$refs.cropper2.rotateRight();
    },
    // 读取图片
    readImg(e) {
      var file = e.target.files[0];
      const fileFullName = file.name;
      const isLt = file.size / 1024 / 1024 < this.maxSize;

      document.getElementById("upload2").value = ""; // 解决上传同一文件不触发上传问题

      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|JPEG|PNG)$/.test(fileFullName)) {
        this.$message.error("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种！");
        return false;
      }

      if (this.maxSize && !isLt) {
        this.$message.error("请上传小于" + this.maxSize + "MB的文件！");
        return false;
      }
      const _index = fileFullName.lastIndexOf(".");
      this.imgName = fileFullName.substring(0, +_index); // 文件名称
      this.option.outputType = fileFullName.substring(+_index + 1); // 文件格式

      // console.log("--------outputType", this.option.outputType);

      // 如果是gif图片则不剪切
      // if (this.option.outputType === "gif" || this.option.outputType === "GIF") {
      //   this.uploadImg(file);
      //   return;
      // }

      // 如果不剪切
      if (!this.isCrop) {
        this.uploadImg(file);
        return;
      }

      var reader = new FileReader();
      reader.onload = e => {
        console.log("loadend", e.target.result);
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.option.img = data;
        this.dialogVisible = true;
      };
      // 读取后为 base64
      // reader.readAsDataURL(file)
      // 读取后为 blob
      reader.readAsArrayBuffer(file);
    },
    // 获取blob，并上传
    getImg() {
      this.$refs.cropper2.getCropBlob(data => {
        this.uploadImg(data);
      });
    },
    // 上传图片
    uploadImg: function(_blob) {
      // 使用FormData对象上传文件
      var formData = new FormData();
      const fullName = this.imgName + "." + this.option.outputType;
      // console.log("fullName", fullName);
      formData.append("file", _blob, fullName);

      this.paramsObj.baseUrl = this.baseUrl;
      this.$emit("change", "startUpload", this.paramsObj);
      this.isUpload = true;
      // 获取七牛云TOKEN
      this.getQiniuToken().then(resData => {
        // console.log("文件token", resData);
        formData.append("token", resData.data.token);
        formData.append("key", resData.data.key);
        // 上传文件至七牛云
        this.RequestQiniu(formData).then(resopnse => {
          this.isUpload = false;
          this.dialogVisible = false;
          // console.log("resopnse", resopnse);
          this.fullName = this.paramsObj.baseUrl + resopnse.key;
          this.paramsObj.fullName = fullName;
          this.$emit("change", "uploadSuccess", this.paramsObj, resopnse);
        });
      });
    },
    // 获取七牛云 token
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
    // 上传到七牛云
    RequestQiniu(formData) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: progressEvent => {
          // 上传进度
          let complete = ((progressEvent.loaded / progressEvent.total * 100) | 0) + "%";
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

<style>
.row {
  margin: 15px 0;
}
.flex-between {
  display: flex;
  justify-content: space-between;
}
.cropper-box {
  display: inline-block;
}
.btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c0ccda;
  color: #1f2d3d;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
  color: #fff;
  background-color: #39bcf3;
  border-color: #39bcf3;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}

.showBox {
  height: 500px;
}

@media screen and (max-width: 1200px) {
  .showBox {
    height: 400px;
  }
}
</style>
