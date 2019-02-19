<template>
  <div>
    <div class="panel-group clearfix">
      <div class="main-left">
        <div :class="curIndex==1?'banner-wrap active-style':'banner-wrap' " @click="showEidt(1)">
          <img class="hy-img" :src="dataObj.form_header.bg">
          <div class="banner-main">
            <div class="title">{{dataObj.form_header.title}}</div>
            <div class="title-info">{{dataObj.form_header.desc}}</div>
          </div>
        </div>
        <div class="hy-main">
          <div :class="curIndex==2?'common-left active-style':'common-left'">
            <div class="text-wrap" @click="showEidt(2)">
              <h2 class="template-title">{{form.textTitle}}</h2>
              <div class="inpt-placeholder">请输入</div>
            </div>
            <div class="delete-wrap" v-if="curIndex == 2" @click.stop="deleteModule(1)">x</div>
          </div>
          <div :class="curIndex==3?'common-left active-style':'common-left'">
            <div class="text-wrap" @click="showEidt(2)">
              <h2 class="template-title">{{form.textTitle}}</h2>
              <div class="inpt-placeholder">2018-10-08 10:30</div>
              <div class="delete-wrap" v-if="curIndex == 3" @click.stop="deleteModule(3)">x</div>
            </div>
          </div>
        </div>
      </div>
      <div class="main-right">
        <el-form ref="form" :model="form" label-width="80px">
          <div class="banner-edit" v-if="curIndex==1">
            <div class="edite-title">编辑区域</div>
            <el-form-item label="标题：">
              <div-component :value="dataObj.form_header.title" @inputChangeText="inputChangeText" :min='1' :max='10' nameVal="title">
              </div-component>
              <!-- <el-input maxlength="8" v-model="dataObj.form_header.title"></el-input> -->
            </el-form-item>
            <el-form-item label="信息：">
              <!-- <el-input maxlength="14" v-model="dataObj.form_header.desc"></el-input> -->
              <div-component :value="dataObj.form_header.desc" @inputChangeText="inputChangeText" :min='1' :max='10' nameVal="desc">
              </div-component>
            </el-form-item>
            <el-form-item label="背景图:">
              <el-upload class="upload-demo" drag action="..." multiple :before-upload="bannerBeforeUploadImage">
                <img v-if="dataObj.form_header.bg" :src="dataObj.form_header.bg" class="avatar">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">只能上传jpg、jpeg,png文件,上传大小不超过2M（建议上传宽750px，高400px图片）</div>
              </el-upload>
            </el-form-item>
          </div>
          <div v-if="curIndex==2">
            <div class="edite-title">编辑区域</div>
            <el-form-item label="标题：">
              <el-input maxlength="20" v-model="form.textTitle"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { RequestUploads } from "@/fetch/modules/public.js";
import FromRequst from "@/fetch/modules/formTemplate.js";
import divComponent from "./divComponent";
export default {
  components: { divComponent },
  data() {
    return {
      curIndex: 0,
      form: {
        hyTitle: "会议记录",
        hySmall: "会议结束后请及时记录",
        textTitle: "讨论主题",
        hyPic:
          "https://img.sqydt.darongshutech.com/image_201809072008473474.png"
      },
      dataObj: {}
    };
  },
  computed: {},
  created() {
    this.getTemplateDetail("511640972010979319");
  },
  methods: {
    getTemplateDetail(group_template_id) {
      FromRequst.RequesFromDetail({
        group_template_id: group_template_id
      }).then(res => {
        this.dataObj = res;
        console.log(res);
      });
    },
    showEidt(index) {
      this.curIndex = index;
    },
    deleteModule() {
      this.curIndex = 222;
    },
    inputChangeText(obj) {
      this.dataObj.form_header[obj.nameVal] = obj.value;
    },
    // 图片上传
    bannerBeforeUploadImage(file) {
      const isJPG = file.type,
        isLt2M = file.size / 1024 / 1024 < 2,
        self = this;
      var formData = new FormData();
      formData.append("file", file);
      if (isJPG == "image/jpeg" || "image/jpg" || isJPG == "image/png") {
        if (isLt2M) {
          RequestUploads(formData).then(res => {
            self.dataObj.form_header.bg = res.data.base_url + res.data.key;
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

<style rel="stylesheet/scss" lang="scss" scoped>
.delete-wrap {
  position: absolute;
  top: -7px;
  right: -7px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background: #39bcf3;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.template-title {
  margin: 10px auto;
  font-size: 18px;
  color: #101010;
}
.inpt-placeholder {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #adadad;
}
.hy-main {
  padding: 30px 0;
}
// 文本框
.text-wrap {
  position: relative;
  border-bottom: 1px solid #f2f2f2;
}
.edite-title {
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
  background: #39bcf3;
  color: #fff;
  font-size: 16px;
  margin-bottom: 30px;
}
.common-left {
  position: relative;
  padding: 0 20px;
  border: 1px solid #fff;
}
.panel-group {
  margin: 18px auto auto;
  width: 950px;
  font-family: "微软雅黑";
  .active-style {
    border: 1px dotted #39bcf3;
  }
  .avatar {
    width: 100%;
    height: 100%;
  }
  .main-left {
    float: left;
    width: 500px;
    background: #fff;
    .banner-wrap {
      position: relative;
      width: 100%;
      height: 250px;
      .hy-img {
        width: 100%;
        height: 100%;
      }
      .banner-main {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 5px;
        width: 200px;
        height: 100%;
        text-align: center;
        color: #fff;
        font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
        .title {
          margin: 80px auto 10px;
          font-size: 20px;
        }
        .title-info {
          display: inline;
          padding: 3px 10px;
          font-size: 12px;
          background: rgb(81, 75, 90);
          border-radius: 15px;
        }
      }
    }
  }
  .main-right {
    float: right;
    width: 440px;
  }
}
</style>
