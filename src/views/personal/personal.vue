<template>
  <div class="info-container">
    <el-card>
      <div class="info-title">个人中心</div>
      <el-form ref="form" :model="ruleForm" label-width="100px" style="width:1000px;align:center;margin:0 auto">
        <el-form-item label="账号:">
          <span>{{ruleForm.admin_account}}</span>
        </el-form-item>
        <el-form-item label="姓名:">
          <span>{{ruleForm.admin_nickname}}</span>
        </el-form-item>
        <el-form-item label="联系方式:">
          <span v-if="ruleForm.admin_tel">{{ruleForm.admin_tel}}</span>
          <span v-else style="padding-left:15px;">暂无</span>
        </el-form-item>
        <el-form-item label="角色:">

          <div style="padding-left:15px;">
            <span v-if="ruleForm.role_type == 1">超级管理员</span>
            <span v-else>{{ruleForm.role_name||'暂无'}}</span>
            <!-- <span v-else-if="ruleForm.role_type == 2">编辑员</span>
            <span v-else-if="ruleForm.role_type == 3">审核员</span>
            <span v-else>其他</span> -->
          </div>
        </el-form-item>
        <el-form-item label="密码:">
          <span style="padding-left:15px;">******</span>
          <el-button v-if="perm.changePsw == 1" @click="handleEditor" style="margin-left:15px;" size="mini" type="primary">修改密码</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm2" status-icon :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm" v-if="editMark" style="width:1000px;align:center;margin:0 auto">
        <el-form-item label="旧密码:" prop="old_pwd">
          <el-input type="password" v-model="ruleForm2.old_pwd" auto-complete="off" placeholder="请输入旧密码，格式为6-20位字符"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="new_pwd">
          <el-input type="password" v-model="ruleForm2.new_pwd" auto-complete="off" placeholder="请输入新密码，格式为6-20位字符"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
//  数据service接口
import {
  RequestAccountDetail,
  EditAccountPsw
} from "../../fetch/modules/account.js";
let validatorPassword = (rule, value, callback) => {
  // var reg = /^[A-Za-z0-9]{6,20}$/;
  // var reg = /^[A-Za-z0-9]{6,20}$/;
  if (!value) {
    callback(new Error("请输入密码"));
  } else if (value.length > 20 || value.length < 6) {
    callback(new Error("请输入6-20位字符"));
  } else {
    callback();
  }
};

export default {
  beforeRouteEnter(to, from, next) {
    // console.log(to);
    next(vm => {
      to.meta.perm.forEach((item, index) => {
        vm.perm[item.perm_name] && (vm.perm[item.perm_name] = item.is_select); // 2-不显示 1-显示
        // console.log("------- vm --", item.perm_name, item.is_select);
      });
    });
  },
  data() {
    return {
      perm: {
        changePsw: 1 // 修改密码
      },
      editMark: false,
      ruleForm: {
        admin_account: "",
        admin_nickname: "",
        admin_tel: "",
        role_type: ""
      },
      ruleForm2: {
        old_pwd: "",
        new_pwd: ""
      },
      rules: {
        old_pwd: [
          {
            required: true,
            trigger: "blur",
            validator: validatorPassword
          }
        ],
        new_pwd: [
          {
            required: true,
            trigger: "blur",
            validator: validatorPassword
          }
        ]
      }
    };
  },
  watch: {
    $route(to, from) {
      this.getAccountDetail();
    }
  },
  created() {
    // console.log("zhixing ");
    this.getAccountDetail();
  },
  methods: {
    getStatus(urlStr) {
      var urlStrArr = urlStr.split("/");
      return urlStrArr[urlStrArr.length - 1];
    },
    handleEditor() {
      this.ruleForm2.old_pwd = "";
      this.ruleForm2.new_pwd = "";
      this.editMark = !this.editMark;
    },
    getAccountDetail() {
      RequestAccountDetail({}).then(res => {
        this.ruleForm = res;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var ruleForm = this.ruleForm2;
          EditAccountPsw(ruleForm).then(res => {
            if (res.code == 2000) {
              this.ruleForm2.old_pwd = "";
              this.ruleForm2.new_pwd = "";
              this.editMark = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .info-title {
    padding: 10px;
    margin-bottom: 30px;
    font-size: 16px;
    color: #1890ff;
    border-bottom: 5px solid rgb(247, 246, 252);
  }
}
</style>
