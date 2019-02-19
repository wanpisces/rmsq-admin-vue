<template>
  <div class="info-container ">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据{{isPreview ? '预览' : '查看 '}}</span>
      </div>
      <el-form class="form-style diy-item" ref="form" :model="form" label-width="180px">
        <el-form-item label="院落编号：">
          <p>{{form.item_no}}</p>
        </el-form-item>
        <el-form-item label="院落名称：">
          <p>{{form.item_title}}</p>
        </el-form-item>
        <el-form-item label="首页展示图：">
          <div v-if="form.item_pic" class="img-bg-box" :style="{backgroundImage: 'url(' + form.item_pic + ')'}">
          </div>
        </el-form-item>
        <!-- 字段 -->
        <section class="item-box" v-for="(item,index) in form.item_content" :key="index">
          <!-- 描述 -->
          <el-form-item :label="item.field || '其他'">
            <p class="word_wrap">{{item.desc}}</p>
          </el-form-item>
          <!-- 展示图 -->
          <el-form-item label="展示图 ">
            <div v-for="(itemImg,indexImg) in item.img" :key="indexImg">
              <div v-if="itemImg.url" class="img-bg-box " :style="{backgroundImage: 'url(' + itemImg.url + ')'} ">
              </div>
              <p v-if="itemImg.title" class="word_wrap">图注：{{itemImg.title}}</p>
            </div>
          </el-form-item>
        </section>
        <el-form-item style="margin-top:30px; ">
          <span v-if="isPreview">
            <el-button :loading="submitStatus " type="primary " @click="onSubmit( 'form') ">发布</el-button>
            <el-button @click="backToList">取消</el-button>
          </span>
          <el-button v-else type="primary" @click="backToList">返回列表</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import uploadFile from "@/components/uploadFile";

// service 数据接口（分类列表,活动添加,分类添加）
import { RequestCheckItemNo, RequestPollItemDetail, RequestPollItemAdd, RequestPollItemEdit, RequestPollItemFields } from "@/fetch/modules/service.js";

export default {
  components: { uploadFile },
  props: {
    isPreview: {
      type: Boolean,
      default: false
    },
    itemId: {
      type: String,
      default: ""
    },
    showData: {
      type: Object /* 预览数据 */,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      urlLastId: "",
      item_id: this.itemId || "",
      form: {
        poll_id: "515312245794668544", // 投票ID
        item_no: "", // 投票项编号
        item_title: "", // 	投票项标题
        item_pic: "", // 投票项封面图
        // 投票项详情
        item_content: []
      },
      filedArr: [],
      submitStatus: false //发布状态
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.urlLastId = to.meta.id;
    });
  },
  watch: {
    itemId(val) {
      console.log("watch---------");
      this.item_id = val;

      this.getItemDetail().then(resData => {
        console.log("resDataShouldering", resData);
        this.form = resData;
      });
    }
  },
  created() {},
  mounted() {
    console.log("mounted---------");
    if (this.isPreview) {
      this.form = this.showData;
    } else {
      this.getItemDetail().then(resData => {
        console.log("resDataShouldering", resData);
        this.form = resData;
      });
    }
  },
  methods: {
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
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _args = JSON.parse(JSON.stringify(this.form));
          _args.item_content = JSON.stringify(_args.item_content);
          console.log("_args", this.item_id, _args);
          // return;
          // 开始提交数据
          this.submitStatus = true;
          if (!this.item_id) {
            RequestPollItemAdd(_args).then(res => {
              this.submitStatus = false;
              if (res.code == 2000) {
                this.$router.push({
                  path: "beautifulCourtyard"
                });
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
                this.$router.push({
                  path: "beautifulCourtyard"
                });
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
      this.$emit("cancelPre");
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

.img-bg-box {
  width: 200px;
  height: 125px;
  border: 1px dashed #d9d9d9;
  background-size: cover;
  background-clip: content-box;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  overflow: hidden;
}
</style>
