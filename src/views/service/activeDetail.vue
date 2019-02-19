<template>
  <div class="d-wrapper">
    <el-card>
      <div class="d-title">查看活动</div>
      <div class="d-content">
        <el-form label-width="140px">
          <el-form-item label="活动标题:">
            <span>{{ruleForm.activity_title}}</span>
          </el-form-item>
          <el-form-item label="活动封面:">
            <img :src="ruleForm.IMG_HOST+ruleForm.activity_pic" width="250px" height="180px" alt="">
          </el-form-item>
          <el-form-item label="活动时间:">
            <span>{{ruleForm.activity_starttime}} 至 {{ruleForm.activity_endtime}}</span>
          </el-form-item>
          <el-form-item label="活动报名截止时间:">
            <span>{{ruleForm.enlist_endtime}}</span>
          </el-form-item>
          <el-form-item label="活动地点:">
            <span>{{ruleForm.address}}</span>
          </el-form-item>
          <el-form-item label="报名人数:">
            <span style="color:red">{{ruleForm.enlist_general_num}}</span>/{{ruleForm.enlist_max_general_num}}
          </el-form-item>
          <el-form-item label="志愿者人数:">
            <span v-if="ruleForm.enlist_max_volunteer_num!=0">
              <span style="color:red">{{ruleForm.enlist_volunteer_num}}</span>/{{ruleForm.enlist_max_volunteer_num}}</span>
            <span v-else>--</span>
          </el-form-item>
          <el-form-item label="活动类型:">
            <span>{{ruleForm.attr_value}}</span>
          </el-form-item>
          <el-form-item label="活动主办方:">
            <span>{{ruleForm.sponsor_name}}</span>
          </el-form-item>
          <el-form-item label="主办方简介:">
            <span>{{ruleForm.sponsor_desc}}</span>
          </el-form-item>
          <el-form-item label="活动简介:">
            <div v-html="ruleForm.activity_content"></div>
          </el-form-item>
          <el-form-item label="是否关联活动:">
            {{ruleForm.link_miniprogram == 1 ? '是' : '否'}}
          </el-form-item>
          <el-form-item label="已关联活动:">
            <ol class="">
              <li v-for="(item,index) in ruleForm.link_third_miniprogram" :key="index" v-if="ruleForm.link_third_miniprogram">{{ item.service_title || item.title}}</li>
            </ol>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-if="active==2" @click="submitForm()">发布活动</el-button>

            <el-button type="primary" v-if="active==2" @click="editActive">
              编辑活动
              <!-- <router-link :to="{path:'/active/activeEditor/'+ruleForm.activity_id}">编辑活动</router-link> -->
            </el-button>
            <el-button @click="callBack">返回</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-card>
  </div>
</template>

<script>
// service 数据接口（分类列表,活动修改,详情,发布）
import {
  RequestActiveAttr,
  RequestActiveEditor,
  RequestActiveDetail,
  RequestActivieState
} from "@/fetch/modules/service.js";
// import {delVisitedViews} from "@/store/"
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.lastUrlId = to.meta.id;
    });
  },
  data() {
    return {
      ruleForm: {},
      active: this.$route.query.active,
      lastUrlId: ""
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 详情获取
    getDetail() {
      let args = {
        activity_id: this.$route.query.activity_id
      };
      RequestActiveDetail(args).then(res => {
        this.ruleForm = res;
      });
    },
    //编辑活动
    editActive() {
      let active = this.$route.query.active || "";
      let activity_id = this.ruleForm.activity_id;
      this.$router.push({
        path: "activeEditor" + this.lastUrlId,
        query: { activity_id: activity_id, active: active }
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/service/activeDetail"
      });
    },
    // 发布活动
    submitForm() {
      this.$confirm("确定发布此活动?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestActivieState({
            activity_id: this.$route.query.activity_id
          }).then(res => {
            this.$router.push({ path: "shareSetting" });
            this.$store.dispatch("delVisitedViews", {
              path: "/service/activeDetail"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    callBack() {
      let active = this.$route.query.active || "";
      let activity_id = this.ruleForm.activity_id;
      this.$router.push({
        path: "/shareSetting/index"
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/service/activeDetail"
      });
    }
  }
};
</script>
<style scoped>
.d-wrapper {
  margin: 30px 15px;
  font-size: 14px;
}
.d-title {
  padding: 20px 20px;
  border-bottom: 10px #f2f2f2 solid;
  color: #409eff;
}
.d-content {
  padding: 20px 40px;
}
</style>
