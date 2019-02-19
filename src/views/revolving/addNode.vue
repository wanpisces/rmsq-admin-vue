<template>
  <div class="wrap">
    <el-card class="box-card">

      <el-form ref="form" label-width="150px" :model="form" :rules="rules">
        <el-form-item label="爆料人归属单位:" prop="inst_name" :rules="[
                    { required: true, message: '请填写爆料人归属单位', trigger: 'blur' },
                    ]">
          <el-input placeholder="请填写爆料人归属单位" v-model="form.inst_name" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="爆料负责人:" prop="node_user" :rules="[
                    { required: true, message: '请输入爆料负责人', trigger: 'blur' },
                    ]">
          <el-input placeholder="请输入爆料负责人" v-model="form.node_user" style="width:500px"></el-input>
        </el-form-item>

        <el-form-item label="联系方式:" prop="node_user_tel">
          <el-input placeholder="座机号例如：028-87758112" v-model="form.node_user_tel" style="width:500px"></el-input>
        </el-form-item>

        <el-form-item label="爆料跟踪人:" prop="case_tracer" :rules="[
                    { required: true, message: '请输入爆料跟踪人', trigger: 'blur' },
                    ]">
          <el-input placeholder="请输入爆料跟踪人" v-model="form.case_tracer" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="爆料办理记录:" prop="node_log" :rules="[
                    { required: true, message: '请输入爆料办理记录', trigger: 'blur' },
                    ]">
          <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 10}" placeholder="请输入爆料办理记录" v-model="form.node_log" style="width:500px" :maxlength='800'>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-edit-outline" @click="submitForm('form')">提交</el-button>
          <el-button icon="el-icon-circle-close-outline" @click="cancle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>
<script>
//正则
// 手机号验证
function isvalidPhone(str) {
  const reg = /^((0\d{2,3}-\d{7,8})| (0\d{2,3}\d{7,8}) |(1[3584]\d{9}))$/;
  return reg.test(str);
}
let validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的手机号码"));
  } else {
    callback();
  }
};
let rules = {
  node_user_tel: [{ required: true, trigger: "blur", validator: validPhone }]
};
import { RequestServiceNodeAdd } from "./../../fetch/modules/service";
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.form.service_id = to.meta.service_id;
      vm.urlLastId = to.meta.id;
    });
  },
  data() {
    return {
      form: {
        case_id: JSON.parse(this.$route.query.case_id),
        inst_name: "",
        node_user: "",
        node_user_tel: "",
        case_tracer: "",
        node_log: "",
        service_id: ""
      },
      urlLastId: "",
      rules,
      case_id: this.$route.query.case_id
    };
  },
  created() {},
  methods: {
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.case_id) {
            RequestServiceNodeAdd(this.form).then(res => {
              this.centerDialogVisible = false;
              if (res.code == 2000) {
                setTimeout(function() {
                  self.cancle();
                }, 2000);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    cancle() {
      this.$router.push({
        name: "nodeList" + this.urlLastId,
        query: { case_id: this.case_id }
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/revolveOne/addNode" + this.urlLastId
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss" >
.wrap {
  padding: 30px 15px;
  font-size: 14px;
  .box-card {
    margin-bottom: 30px;
  }
  .img-flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .img-flex div img {
  }
  .img-flex > div {
    position: relative;
    margin-right: 20px;
    width: 200px;
    height: 200px;
    overflow: hidden;
  }
  .img-flex > div > div {
    position: absolute;
    bottom: 0;
    right: 5%;
    color: #49cbf0;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
