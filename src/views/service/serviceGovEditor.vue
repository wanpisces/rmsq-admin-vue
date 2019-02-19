<template>
  <div class="info-container">
    <el-card class="box-card">
      <el-form :model="fromData" ref="fromData" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="news_title" :rules="[
                    { required: true, message: '不能为空'},
                     { min:1,max:30, message: '请输入1-30个字符'}
                    ]">
          <el-input v-model="fromData.news_title" auto-complete="off" style="width:400px"></el-input>

        </el-form-item>
        <el-form-item label="正文：" prop="content" :rules="[
                    { required: true, message: '不能为空'},
                    ]">
          <!-- <tinymce :height="400" :id="tinymceIds" v-model="fromData.news_content"></tinymce> -->
          <div style="position:relative">
            <Ueditor @changeCover="selectContent(0)" @changeContent="changeContent" :placeholderMsg="placeholderMsg" :isVideioShow='false' :dataObject="fromData.news_content" :config="config" :id="1+''" ref="ue"></Ueditor>
          </div>
        </el-form-item>
        <el-form-item label="发布到：" prop="pid" :rules="[
                    { required: true, message: '不能为空'},
                    ]">
          <el-select v-model="fromData.pid" placeholder="请选择">
            <el-option v-for="item in searchGov" :key="item.attr_id" :label="item.attr_value" :value="item.attr_id" :disabled="item.disabled">
            </el-option>
          </el-select>
          <el-select v-model="fromData.attr_id" placeholder="请选择" v-if="searchGovChildren.length!=0">
            <el-option v-for="item in searchGovChildren" :key="item.attr_id" :label="item.attr_value" :value="item.attr_id" :disabled="item.disabled">
            </el-option>
          </el-select>

        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('fromData')">保存编辑</el-button>
          <el-button @click="resetForm('fromData')">退 出</el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>
<script>
// import Tinymce from "@/components/Tinymce/index.vue";
// 富文本编译器
import Ueditor from "@/components/ue/ueditor.vue";
import {
  RequestGovEditor,
  RequestGovDetail,
  RequestGovClassList
} from "@/fetch/modules/service";
export default {
  components: { Ueditor },
  data() {
    return {
      fromData: {
        news_title: "",
        news_content: "",
        pid: "",
        attr_id: "",
        content: ""
      },
      tinymceIds: "tinymceIds",
      searchGov: [],
      searchGovChildren: [],
      show: false,
      config: {
        id: "myEditor",
        initialFrameWidth: 750,
        initialFrameHeight: 350,
        wordCount: false,
        elementPathEnabled: false,
        autoClearinitialContent: true
      },
      placeholderMsg: "从这里开始正文！"
    };
  },
  created() {
    this.getDetail();
    this.getClass({ pid: "0" });
  },
  watch: {
    "fromData.pid"() {
      this.getClass({ pid: this.fromData.pid });
    }
  },
  methods: {
    changeContent(val) {
      this.fromData.content = val;
    },
    selectContent(val) {},
    getDetail() {
      console.log(this.$route);
      RequestGovDetail({ news_id: this.$route.query.news_id }).then(res => {
        this.fromData = res;
      });
    },
    // 资讯分类
    getClass(obj) {
      RequestGovClassList(obj).then(res => {
        if (res.length != 0) {
          res.map((item, index) => {
            if (item.pid == 0) {
              this.searchGov.push(item);
            } else {
              this.searchGovChildren.push(item);
            }
          });
        } else {
          this.fromData.attr_id = "";
          this.searchGovChildren = [];
        }
      });
    },
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let args = this.fromData;
          args.news_content = args.content;
          RequestGovEditor(args).then(res => {
            if (res.code == 2000) {
              setTimeout(function() {
                self.$router.push({ name: "serviceGov" });
                self.$store.dispatch("delVisitedViews", {
                  path: "/service/serviceGovEditor"
                });
              }, 2000);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      // window.tinymce.get(this.tinymceIds).setContent("");
      this.$router.push({ name: "serviceGov" });
      this.$store.dispatch("delVisitedViews", {
        path: "/service/serviceGovEditor"
      });
    }
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .is-scroll-left a {
    color: #409eff;
  }
}
</style>
