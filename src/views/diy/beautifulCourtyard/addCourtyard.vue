<template>
  <div class="info-container ">
    <view-courtyard
      @cancelPre="cancelPre"
      :itemId="item_id"
      :isPreview="true"
      :showData="form"
      v-if="isPreView"
    ></view-courtyard>
    <el-card
      v-else
      class="box-card"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <span>数据{{item_id ? '编辑':'录入' }}</span>
      </div>

      <el-form
        class="form-style diy-item"
        ref="form"
        :model="form"
        label-width="160px"
      >
        <el-form-item
          label="院落编号："
          prop="item_no"
          :rules="[{ required: true, message: '请填写院落编号' },{ validator: checkItemNo, trigger: 'blur' }]"
        >
          <!-- <el-input-number class="input-width" v-model="form.item_no" :controls="false" :min="1" @blur="checkItemNo" :max="99999"></el-input-number> -->
          <el-input
            class="input-width"
            v-model="form.item_no"
            placeholder="院落编号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="院落名称："
          prop="item_title"
          :rules="[{ required: true, message: '请填写院落名称' }]"
        >
          <el-input
            class="input-width"
            v-model="form.item_title"
            placeholder="院落名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="首页展示图："
          prop="item_pic"
          :rules="[{ required: true, message: '请上传首页展示图' }]"
        >
          <uploadFile
            class=" avatar-uploader"
            :paramsObj="{type: 1}"
            @change="handleChange"
            :maxSize="10"
          >
            <el-button
              plain
              size="mini"
              type="primary"
            >上传图片</el-button>
          </uploadFile>
          <div
            style="margin-top:10px;"
            v-if="form.item_pic"
            class="img-bg-box"
            :style="{backgroundImage: 'url(' + form.item_pic + ')'}"
          >

          </div>
        </el-form-item>
        <section
          class="item-box"
          v-for="(item,index) in form.item_content"
          :key="index"
        >
          <!-- 单选 -->
          <div v-if="isType(filedArr[index], 'Array')">
            <el-radio-group
              class="radio-check"
              @change="changeRadio"
              v-model="item.field"
              size="mini"
            >
              <el-radio
                border
                v-for="(label,indexl) in filedArr[index]"
                :key="indexl"
                :label="label"
              ></el-radio>
            </el-radio-group>
          </div>
          <div v-else>
            <!-- 其他 -->
            <el-form-item
              v-if="filedArr[index] == '其他'"
              label="其他"
              :prop="'item_content.' + index +'.field'"
            >
              <el-input
                :autosize="{ minRows: 2, maxRows: 10}"
                class=" input-width "
                v-model="item.field"
                placeholder="请输入标题 "
              ></el-input>
            </el-form-item>
          </div>
          <div v-if="filedArr[index] != '其他' ">
            <!-- :rules="[{ required: true, message: '请填写描述文字' }]" -->
            <el-form-item
              :label="item.field"
              :prop="'item_content.' + index +'.desc'"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 10}"
                class=" input-width "
                v-model="item.desc"
                placeholder="描述文字 "
              ></el-input>
            </el-form-item>
            <!-- :rules="[{ required: true, message: '请上传展示图' }]" -->
            <!-- :prop="'item_content.' + index +'.img[0].url'" -->
            <el-form-item label="展示图 ">
              <uploadFile
                class="avatar-uploader "
                :paramsObj="{type: 2,index:index}"
                @change="handleChange "
                :maxSize="10"
              >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                >上传图片</el-button>
              </uploadFile>
              <div
                style="margin-top:10px;"
                v-for="(itemImg,indexImg) in item.img"
                :key="indexImg"
                v-if="item.img.length!=0"
              >
                <div
                  v-if="itemImg.url"
                  class="img-more"
                >
                  <img
                    src="./../../../../static/images/deleteIcon.png"
                    @click="handleImg(index,indexImg)"
                    width="20"
                    alt=""
                  >
                  <div
                    class="img-bg-box "
                    :style="{backgroundImage: 'url(' + itemImg.url + ')'} "
                  >
                  </div>
                  <div style="margin-left:20px">
                    <p>图注：</p>
                    <el-input
                      :autosize="{ minRows: 3, maxRows: 5}"
                      type="textarea"
                      v-model="form.item_content[index].img[indexImg].title"
                      style="width:300px"
                      placeholder="请输入图注"
                    ></el-input>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>

          <div v-if="filedArr[index] == '其他' && item.field ">
            <!-- :rules="[{ required: true, message: '请填写描述文字' }]" -->
            <el-form-item
              :label="item.field"
              :prop="'item_content.' + index +'.desc'"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 10}"
                class=" input-width "
                v-model="item.desc"
                placeholder="描述文字 "
              ></el-input>
            </el-form-item>
            <!-- :rules="[{ required: true, message: '请上传展示图' }]" -->
            <!-- :prop="'item_content.' + index +'.img[0].url'" -->
            <el-form-item label="展示图 ">
              <uploadFile
                class="avatar-uploader "
                :paramsObj="{type: 2,index:index}"
                @change="handleChange "
                :maxSize="10"
              >
                <el-button
                  plain
                  size="mini"
                  type="primary"
                >上传图片</el-button>
              </uploadFile>
              <div
                style="margin-top:10px;"
                v-for="(itemImg,indexImg) in item.img"
                :key="indexImg"
                v-if="item.img.length!=0"
              >
                <div class="img-more">
                  <img
                    src="./../../../../static/images/deleteIcon.png"
                    @click="handleImg(index,indexImg)"
                    width="20"
                    alt=""
                  >
                  <div
                    v-if="itemImg.url"
                    class="img-bg-box "
                    :style="{backgroundImage: 'url(' + itemImg.url + ')'} "
                  >

                  </div>
                  <div style="margin-left:20px">
                    <p>图注：</p>
                    <el-input
                      :autosize="{ minRows: 3, maxRows: 5}"
                      type="textarea"
                      v-model="form.item_content[index].img[indexImg].title"
                      style="width:200px;"
                      placeholder="请输入图注"
                    ></el-input>
                  </div>

                </div>

              </div>
            </el-form-item>
          </div>
          <!-- <div v-if="filedArr[index] == '其他' && !item.field ">
            <el-form-item :label="item.field" :prop="'item_content.' + index +'.desc'">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" class=" input-width " v-model="item.desc" placeholder="描述文字 "></el-input>
            </el-form-item>
            <el-form-item label="展示图 " :prop="'item_content.' + index +'.img[0].url'">
              <uploadFile class="avatar-uploader " :paramsObj="{type: 2,index:index}" @change="handleChange " :maxSize="10">
                <el-button plain size="mini" type="primary">上传图片</el-button>
              </uploadFile>
              <div style="margin-top:10px;" v-for="(itemImg,indexImg) in item.img" :key="indexImg">
                <div v-if="itemImg.url" class="img-bg-box " :style="{backgroundImage: 'url(' + itemImg.url + ')'} ">
                </div>
              </div>
            </el-form-item>
          </div> -->

        </section>
        <el-form-item style="margin-top:30px; ">
          <el-button
            type="primary "
            @click="onSubmit( 'form',2)"
          >预览</el-button>
          <el-button
            :loading="submitStatus "
            type="primary "
            @click="onSubmit( 'form',1)"
          >发布</el-button>
          <el-button @click="backToList ">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import uploadFile from "@/components/uploadFile";
import viewCourtyard from "./viewCourtyard";

// service.js 数据接口
import {
  RequestCheckItemNo,
  RequestPollItemDetail,
  RequestPollItemAdd,
  RequestPollItemEdit,
  RequestPollItemFields
} from "@/fetch/modules/service.js";
if (!Number.isInteger) {
  let floor = Math.floor,
    isFinite = global.isFinite;
  Number.isInteger = function isInteger(value) {
    return (
      typeof value === "number" && isFinite(value) && floor(value) === value
    );
  };
}
export default {
  components: { uploadFile, viewCourtyard },
  data() {
    return {
      urlLastId: "",
      isPreView: false, // 预览
      item_id: this.$route.query.item_id || "",
      form: {
        poll_id: "515312245794668544", // 投票ID
        item_no: "", // 投票项编号
        item_title: "", // 	投票项标题
        item_pic: "", // 投票项封面图
        // 投票项详情
        item_content: [],
        item_content_type: 2
      },
      filedArr: [],
      rememberIndex: {}, // 记录单选索引
      submitStatus: false //发布状态
    };
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.urlLastId = to.meta.id;
    });
  },
  created() {},
  mounted() {
    this.getPollItemFields();
  },
  methods: {
    // 检测编号是否可用
    checkItemNo(rule, value, callback) {
      if (!value) {
        return callback(new Error("请输入院落编号"));
      }
      value = parseInt(value);

      if (!Number.isInteger(value)) {
        return callback(new Error("请输入数字值"));
      }
      if (value < 1) {
        return callback(new Error("值必须大于1"));
      }

      let params = {
        poll_id: this.form.poll_id,
        item_no: this.form.item_no
      };
      this.item_id && (params.poll_id = this.item_id); // 编辑才传 item_id 字段

      RequestCheckItemNo(params).then(res => {
        if (res.code !== 2000) {
          return callback(new Error("院落编号不可用！"));
        } else {
          callback();
        }
        console.log("__RequestCheckItemNo-", res);
      });
    },
    cancelPre() {
      this.isPreView = false;
    },
    isType(params, type) {
      // 判断数据类型
      // String Number Boolean Undefined Null Object Array Function HTMLDocument HTMLDocument
      return Object.prototype.toString.call(params) === "[object " + type + "]";
    },
    getPollItemFields() {
      RequestPollItemFields({
        poll_id: this.form.poll_id
      }).then(res => {
        console.log("RequestPollItemFields", res);
        if (res.code === 2000) {
          this.filedArr = res.data;
          this.initItemContent();
        } else {
          this.$message({
            message: "获取字段数据失败！",
            type: "error"
          });
        }
      });
    },
    initItemContent() {
      if (!this.item_id) {
        /* 数据录入 */
        let _itemContent = [];
        this.filedArr.forEach((item, index) => {
          let _filed = item;
          if (this.isType(item, "Array")) {
            item.forEach(label => {
              this.rememberIndex[label] = index;
            });
            _filed = item[0];
          }
          _itemContent.push({
            field: _filed == "其他" ? "" : _filed,
            desc: "",
            img: [
              // {
              //   title: "",
              //   url: "",
              //   desc: ""
              // }
            ]
          });
        });
        this.form.item_content = _itemContent;
        console.log(this.form.item_content);
      } else {
        /* 数据编辑 */
        this.getItemDetail().then(resData => {
          console.log("resData", resData);
          this.filedArr.forEach((item, index) => {
            if (this.isType(item, "Array")) {
              item.forEach(label => {
                this.rememberIndex[label] = index;
              });
            }
          });
          resData.item_content.map(con => {
            if (con.img === null) {
              con.img = [
                {
                  title: "",
                  url: "",
                  desc: ""
                }
              ];
            }
            return con;
          });
          this.form = resData;
        });
      }
    },
    changeRadio(val) {
      const _index = this.rememberIndex[val];
      this.form.item_content[_index].field = val;
    },
    // 获取详情数据
    getItemDetail() {
      return new Promise((resolve, reject) => {
        RequestPollItemDetail({ item_id: this.item_id }).then(res => {
          if (res && res.code === 2000) {
            console.log("详情", res);
            resolve(res.data);
          }
        });
      });
    },

    // 文件上传
    handleChange(status, _file, params, resp) {
      if (status === "startUpload") {
        // imageInfo.desc = "上传中···";
      } else if (status === "uploading") {
        // imageInfo.desc = "文件已上传" + resp; // 当为状态上传中时，resp为上传进度
      } else if (status === "uploadSuccess") {
        const _baseUrl = params.baseUrl, // 上传文件存放地址
          _type = params.type;
        console.log(":asdasd", resp);
        // 记录数据
        let _img = {
          title: "",
          url: _baseUrl + resp.key,
          desc: ""
        };
        if (_type == 1) {
          this.form.item_pic = _baseUrl + resp.key;
        } else {
          const _index = params.index;
          this.form.item_content[_index].img.push(_img);
        }
      } else {
        // imageInfo.desc = "上传失败，点击重试！";
      }
    },

    onSubmit(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (type == 2) {
            /* 预览 */
            this.isPreView = true;
            return;
          }

          let _args = JSON.parse(JSON.stringify(this.form));
          _args.item_content = JSON.stringify(_args.item_content);
          console.log("_args", _args);
          // return;
          // 开始提交数据
          this.submitStatus = true;
          if (!this.item_id) {
            RequestPollItemAdd(_args).then(res => {
              this.submitStatus = false;
              if (res.code == 2000) {
                this.backToList();
              } else if (res.code == 4000) {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: "error"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: "添加失败",
                  type: "error"
                });
              }
            });
          } else {
            RequestPollItemEdit(_args).then(res => {
              this.submitStatus = false;
              if (res.code == 2000) {
                this.backToList();
              } else if (res.code == 4000) {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: "error"
                });
              } else {
                this.$message({
                  type: "error",
                  message: "修改失败"
                });
              }
            });
          }
        } else {
          this.$message({
            type: "warning",
            message: "存在必填项未填写！"
          });
        }
      });
    },
    backToList() {
      const _url = !this.item_id ? "/addCourtyard" : "/editCourtyard";
      this.$router.push({
        path: "beautifulCourtyard"
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/diy" + _url
      });
    },
    handleImg(index, imgIndex) {
      console.log(index, imgIndex);
      this.form.item_content[index].img.splice(imgIndex, 1);
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  padding: 30px 20px;
}
.form-style {
  width: 80%;
  margin: 0 auto;

  .input-width {
    width: 400px;
  }

  .item-box {
    padding: 30px 0 10px;
    border-top: 1px dashed #e6e6e6;

    .radio-check {
      margin: 0 0 18px 160px;
    }
  }
}

/* 上传 */

.avatar-uploader {
  // margin-bottom: 18px;
}

// .avatar-uploader,
// .el-upload {
// width: 200px;
// height: 125px;
// border: 1px dashed #d9d9d9;
// border-radius: 3px;
// overflow: hidden;
// cursor: pointer;
// text-align: center;
// }
// .avatar-uploader:hover,
// .avatar-uploader:focus,
// .el-upload:hover {
//   border-color: #409eff;
// }
// .el-upload,
// .el-upload--text {
//   border: 1px dashed #d9d9d9 !important;
//   text-align: center;
// }
// .avatar-uploader-icon {
//   width: 200px;
//   line-height: 125px;
//   font-size: 28px;
//   color: #8c939d;
// }
.img-bg-box {
  position: relative;
  width: 200px;
  height: 125px;
  border: 1px dashed #d9d9d9;
  background-size: cover;
  background-clip: content-box;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  flex-shrink: 0;
  // overflow: hidden;
}
.img-more img {
  position: absolute;
  right: -13px;
  top: -10px;
  cursor: pointer;
}
.img-more {
  width: 600px;
  position: relative;
  display: flex;
  align-items: center;
  border: 1px dashed #d9d9d9;
  padding: 10px 10px;
}
</style>
