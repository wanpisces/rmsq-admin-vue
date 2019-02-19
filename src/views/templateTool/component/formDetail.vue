<template>
  <div class="main-theme" :style="{background:dataArr.theme_bg?'url(' +dataArr.theme_bg  + ')':dataArr.theme_color||'#2B3948'}">
    <div class="panel-group clearfix">
      <!-- 内容部分 -->
      <div class="main-left">
        <!-- 表头 -->
        <div class="main-header" @click="handleHeader(dataArr.form_header)">
          <img :src="dataArr.form_header.bg" width="100%" alt="">
          <div class="main-tem-one">
            <div> {{dataArr.form_header.title}}</div>
            <div> {{dataArr.form_header.desc}}</div>
          </div>
        </div>
        <!-- 中间组件 -->
        <div v-for="(dataObject, index) in dataArr.builder_tr" :key="index">
          <div style="padding:0px 10px">
            <!-- <div>{{dataObject.list[0]}}----------11111</div> -->
            <div v-if="dataObject.tr==0">
              <!-- 文本框 -->
              <div v-if="dataObject.list[0].builder_id=='1000001' " :class="[dataObject.isFalse==true ?'d-wrapper d-choose-active':'d-wrapper' ]">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                <img class="d-delete-icon" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span>
                <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div :class="[dataObject.list[0].builder_params.input_type==1?'d-input':'d-textarea']">{{dataObject.list[0].builder_params.placeholder}}</div>
              </div>
              <!-- 日期组件 -->
              <div v-if="dataObject.list[0].builder_id=='1000005' " :class="[dataObject.isFalse==true ?'d-wrapper d-choose-active':'d-wrapper' ]">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                <img class="d-delete-icon" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span>
                <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div class="d-input">{{dataObject.list[0].builder_params.placeholder}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 表尾 -->
        <div class="main-footer d-wrapper " style="background-color:rgb(248, 248, 248)">
          <div style="background-color:#70B7B4">
            {{dataArr.form_submit.title}}
          </div>
        </div>
        <!-- <Contact :data="item" v-for="(item, index) in dataArr.builder_tr" :tr="item.tr" :index='index' :key="index" @handleBg="handleBg" @handleDelete="handleDelete"></Contact> -->
      </div>
    </div>
  </div>
</template>

<script>
import FromRequst from "@/fetch/modules/formTemplate";
import { RequestThemeList } from "@/fetch/modules/service.js";
import Contact from "./contact";
import divModel from "./divComponent";
import checkCard from "@/components/checkCard";
export default {
  components: { divModel, Contact, checkCard },
  data() {
    return {
      dataArr: {
        form_header: {
          bg: "",
          isShow: false
        },
        form_submit: {
          title: ""
        }
      },
      builder: {
        builder_id: 1, // 组件ID
        builder_name: "姓名", // 组件名称
        builder_params: {
          // 组件配置
          type: 1, //类型 1-文本框；2-单选框；3-多选框；4-文件上传；5-所在地；6-地址
          title: "1", //标题
          desc: "1", //描述
          item_list: [], //选项列表 [[key:1,desc:先生],...]
          file_ext: [], //文件扩展后缀  [jpg,png,...]
          file_size: 5, //文件上传大小限制  MB
          is_required: 1, //1必填 2非必填
          submit_content_type: 1, //提交类型 1-string;2-json arr
          submit_content_keys: [], //提交的键 [province_region,city_region,...]
          other: [], //补充扩展
          submit_content: "" //提交的内容
        }
      },
      builderHeader: {
        bg: "https://img.sqydt.darongshutech.com/image_201810121422371092.png",
        desc: "DAILY REPORT",
        layout: 1,
        "text-align": 2,
        title: "工作日报",
        width: 100,
        isShow: false
      },
      activeIndex: null,
      activeName: "1",
      checkThemeColor: [],
      checkThemeImg: []
    };
  },
  created() {
    this.getThemeList();
    this.getData();
  },
  methods: {
    //  表单提交
    handleSubmit() {
      let _args = JSON.parse(JSON.stringify(this.dataArr));
      for (let i in _args) {
        console.log(typeof _args[i]);
        if (typeof _args[i] == "object") {
          _args[i] = JSON.stringify(_args[i]);
        }
      }
      FromRequst.RequesFromEditor(_args).then(res => {
        this.$message("操作成功");
        console.log(res);
      });
    },
    // 表单列表
    getData() {
      FromRequst.RequesFromDetail({
        form_id: this.$route.query.form_id || "512039742196416512"
      }).then(res => {
        if (res) {
          try {
            res.form_header.isShow = false;
            this.dataArr = res;
          } catch (error) {}
        }
      });
    },
    //  主题 颜色列表
    getThemeList() {
      RequestThemeList().then(res => {
        console.log("主题", res);
        if (res.code === 2000) {
          let _colorArr = [],
            _imgArr = [];

          res.data.forEach(item => {
            if (item.theme_type == "1") {
              _colorArr.push(item);
            } else if (item.theme_type == "2") {
              _imgArr.push(item);
            }
          });

          this.checkThemeColor = _colorArr;
          this.checkThemeImg = _imgArr;
        }

        // // 获取题目列表
        // if (this.$route.query.vote_id) {
        //   this.vote_id = this.$route.query.form_id;
        //   this.getData();
        // }
      });
    },
    changeTheme(index, data, params) {
      this.dataArr.theme_color = data.theme_color;
      // console.log(index, this.checkThemeColor[index[0]]);
    },
    handleDelete(data) {
      console.log(data);
      this.dataArr.builder_tr.map((item, index) => {
        item.list.map((itemChildren, val) => {
          if (itemChildren.form_builder_id == data.form_builder_id) {
            // console.log("aaaaaaa", this.dataArr.builder_tr);
            // this.dataArr.builder_tr.splice(index, 1);
            console.log(
              "this.dataArr",
              this.dataArr.builder_tr.splice(index, 1)
            );
          }
        });
        // for (let i = 0; i < item.list.length; i++) {
        //   if (item.list[i].form_builder_id == data.form_builder_id) {
        //     console.log("zzzzz");
        //     this.dataArr.builder_tr.splice(i, 1);
        //     i--;
        //   }
        // }
      });
      // this.dataArr[index].subject_id == this.subject.subject_id ? (this.subject.subject_id = {}) : "";
      // this.dataArr.splice(index, 1);
    },
    handleBg(val) {
      this.activeName = "2";
      this.builderHeader.isShow = false;
      // this.activeIndex = val;main-title-name
      // console.log(this.dataArr[val]);
      // this.builder_params = this.dataArr[val];
      // this.dataArr.map((items, index) => {
      //   index == val ? (this.dataArr[index].isFalse = true) : (this.dataArr[index].isFalse = false);
      // });
      this.builder = val;
    },
    inputChangeText(val) {
      console.log(val);
      this.builder.builder_params.title = val.value;
    },
    inputChangeTextDesc(val) {
      this.builder.builder_params.desc = val.value;
    },
    handleCommand() {},
    // 表头
    handleHeader(val) {
      val.isShow = true;
      this.builderHeader = val;
    }
    // handleHeaderDesc() {
    //   cons;
    // }
  }
};
</script>

<style >
.main-rigth-bg .el-collapse-item__header {
  background: #267dc5;
  color: #fff;
  height: 35px;
  line-height: 35px;
  padding-left: 10px;
}
.main-rigth-bg .el-collapse-item__arrow {
  line-height: 35px;
}
.main-header {
  position: relative;
}
.main-tem-one {
  position: absolute;
  left: 30px;
  top: 90px;
}
.main-tem-one div:nth-child(1) {
  color: #5d7297;
  font-size: 23px;
  font-weight: 600;
  letter-spacing: 5px;
  /* font-family: "Courier New", Courier, monospace; */
}
.main-tem-one div:nth-child(2) {
  margin-top: 5px;
  color: #7587aa;
  font-weight: 600;
}
.main-input {
  width: 100%;
  height: 30px;
  /* color: #848484; */
  outline: none;
  border: none;
  font-size: 14px;
  border-bottom: 1px #ebeef5 solid;
  /* border-bottom: 1px #17b1ed solid; */
  margin-top: 10px;
}
</style>
<style rel="stylesheet/scss" lang="scss"  scoped>
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
  font-size: 20px;
  color: #101010;
}

.inpt-placeholder {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #adadad;
}

.hy-main {
  margin: 20px;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 0px 3px 3px #eee;
  border-radius: 10px;
  height: 200px;
}

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

.panel-group {
  margin: 18px auto auto;
  font-family: "微软雅黑";
  .active-style {
    border: 1px dotted #39bcf3;
  }
  .avatar {
    width: 100%;
    height: 100%;
  }
  .main-left {
    margin: auto;
    border: 1px #e2e2e2 solid;
    -moz-box-shadow: 0px 0px 5px #e2e2e2;
    -webkit-box-shadow: 0px 0px 5px #e2e2e2;
    box-shadow: 0px 0px 5px #e2e2e2;
    width: 500px;
    padding-bottom: 10px;
    background: #fff;
    .main-theme {
      padding: 15px 5px;
      cursor: pointer;
      border: 1px red solid;
      margin: 15px 0;
    }
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
        padding: 0 10px;
        width: 240px;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        text-align: center;
        color: #fff;
        font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
        .title {
          margin: 80px auto 10px;
          font-size: 24px;
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
    // border-radius: 5px;
    float: right;
    width: 440px;
    border: 1px #e2e2e2 solid;
    -moz-box-shadow: 0px 0px 5px #e2e2e2;
    -webkit-box-shadow: 0px 0px 5px #e2e2e2;
    box-shadow: 0px 0px 5px #e2e2e2;
    .main-rigth-bg {
      background: #fff;
      padding: 10px;
    }
    .main-title {
      background: #267dc5;
      color: #fff;
      font-size: 14px;
      height: 35px;
      line-height: 35px;
      padding-left: 10px;
      margin-top: 10px;
    }
  }
  .main-content {
    padding: 0 10px 10px 10px;
  }
  .main-title-name {
    color: #848484;
    font-size: 14px;
    padding: 10px 0;
  }
  .main-time .el-select {
    width: 120px;
  }
  .main-header {
    cursor: pointer;
  }
  .main-footer {
    padding: 10px 5px;

    display: flex;
    justify-content: center;
  }
  .main-footer div {
    padding: 5px 10px;
    text-align: center;
    color: #fff;
    // border: 1px red solid;
  }
}

.main-theme {
  // background: #2B3948;
  padding-bottom: 20px;
  min-height: calc(100vh - 120px);
}

.input {
  /* width: 200px; */
  border-radius: 8px;
  outline: none;
  /* line-height: 30px; */
  height: 25px;
  border: 1px solid #eee;
  background: #fff;
  text-indent: 5px;
}
.d-wrapper {
  position: relative;
  padding: 10px 5px;
  margin: 15px 0;
  cursor: pointer;
  border: 1px #fff solid;
}
// .d-wrapper:hover {
//   border: 1px #ccc dotted;
// }
.d-desc {
  color: #848484;
  font-size: 14px;
}

.d-delete-icon {
  display: none;
}
// .d-wrapper:hover > .d-delete-icon {
//   position: absolute;
//   top: -10px;
//   right: -10px;
//   display: block;
// }
.d-delete-icon:after {
  font-family: "iconfont";
  content: "\e7b7";
  color: #d24e46;
  font-size: 25px;
}
.d-delete-active {
  position: absolute;
  top: -10px;
  right: -10px;
  display: block;
}
.d-choose-active {
  background: #fff8dc;
  border: 1px #ccc dotted;
}
.d-textarea {
  width: 100%;
  height: 80px;
  border: 1px #17b1ed solid;
  color: #848484;
  padding: 10px 0 0 10px;
  font-size: 14px;
  margin-top: 10px;
}
.d-input {
  width: 100%;
  height: 30px;
  color: #848484;
  font-size: 14px;
  border-bottom: 1px #ebeef5 solid;
  /* border-bottom: 1px #17b1ed solid; */
  margin-top: 10px;
}
.d-start {
  margin-left: 2px;
  color: rgb(218, 40, 36);
}
</style>
