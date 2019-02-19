<template>
  <div class="info-container">
    <el-card>
      <div class="info-title">{{formTitle}}</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <!-- <div v-if="admin_type == 0">
          <el-form-item label="行政级别：" prop="level" :label-width="formLabelWidth">
            <el-select v-model="ruleForm.level" placeholder="请选择行政级别">
              <el-option v-for="item in levelData" :key="item.level" :label="item.level_name" :value="item.level">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择地址：" prop="province" :label-width="formLabelWidth">
            <el-select v-model="ruleForm.province" placeholder="请选择省">
              <el-option v-for="item in provinceData" :key="item.id" :label="item.region_name_c" :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="ruleForm.city" placeholder="请选择市" v-if="ruleForm.level&&ruleForm.level<=4">
              <el-option v-for="item in cityData" :key="item.id" :label="item.region_name_c" :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="ruleForm.area" placeholder="请选择区" v-if="ruleForm.level&&ruleForm.level<=3">
              <el-option v-for="item in areaData" :key="item.id" :label="item.region_name_c" :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="ruleForm.street" placeholder="请选择街道" v-if="ruleForm.level&&ruleForm.level<=2">
              <el-option v-for="item in streetData" :key="item.id" :label="item.region_name_c" :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="ruleForm.community" placeholder="请选择社区" v-if="ruleForm.level&&ruleForm.level<=1">
              <el-option v-for="item in communityData" :key="item.id" :label="item.region_name_c" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div> -->
        <el-form-item label="账号：" :label-width="formLabelWidth" prop="account">
          <el-input v-model="ruleForm.account" auto-complete="off" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" :label-width="formLabelWidth" prop="nickname">
          <el-input v-model="ruleForm.nickname" auto-complete="off" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="设置密码：" v-if="admin_id" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.password" auto-complete="off" type="password" placeholder="请输入密码，格式为6-20位字母数字"></el-input>
        </el-form-item>
        <el-form-item label="设置密码：" v-if="!admin_id" :label-width="formLabelWidth" prop="password">
          <el-input v-model="ruleForm.password" auto-complete="off" type="password" placeholder="请输入密码，格式为6-20位字母数字"></el-input>
        </el-form-item>
        <!-- <el-form-item label="确认密码：" :label-width="formLabelWidth" prop="news_repsw">
                <el-input v-model="ruleForm.news_title" auto-complete="off" ></el-input>
            </el-form-item> -->
        <el-form-item label="联系方式：" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.tel" auto-complete="off" placeholder="请输入手机号/座机号"></el-input>
        </el-form-item>
        <!-- <el-form-item label="角色：" prop="role" :label-width="formLabelWidth">
          <el-select v-model="role_name" placeholder="角色筛选" @change="selectId">
            <el-option v-for="item in moduleData" :key="item.role" :label="item.role_name" :value="item.role">
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div class="info-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button type="" @click="callback()">取消</el-button>
      </div>
    </el-card>

  </div>
</template>
<script>
//  数据service接口
import {
  RequestPlatAccountAdd,
  RequestPlatAccountEdit,
  RequestPlatDetail
} from "../../fetch/modules/account.js";
import { RequestArea } from "@//fetch/modules/public.js";
import { getAdminType } from "@/utils/auth.js";
let validatorPassword = (rule, value, callback) => {
  var reg = /^[A-Za-z0-9]{6,20}$/;
  if (!value) {
    callback(new Error("请输入密码"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入6-20位字母数字"));
  } else {
    callback();
  }
};
const rules = {
  level: [{ required: true, message: "请输入行政级别", trigger: "blur" }],
  province: [{ required: true, message: "请选择地址", trigger: "blur" }],
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  nickname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  password: [
    {
      required: true,
      trigger: "blur",
      validator: validatorPassword
    }
  ],
  role: [{ required: true, message: "请输入角色", trigger: "blur" }]
};
const levelData = [
  {
    level: "5",
    level_name: "省"
  },
  {
    level: "4",
    level_name: "市"
  },
  {
    level: "3",
    level_name: "区"
  },
  {
    level: "2",
    level_name: "街道"
  },
  {
    level: "1",
    level_name: "社区"
  }
];
export default {
  data() {
    return {
      // 行政级别
      levelData: levelData,
      provinceData: [], //省
      cityData: [], // 市
      areaData: [], // 区
      streetData: [], //街道
      communityData: [], // 社区
      rules,
      formTitle: "新增账号",
      admin_id: "",
      role_name: "",
      ruleForm: {
        id: "",
        account: "",
        nickname: "",
        password: "",
        tel: "",
        role: "",
        level: "",
        province: "",
        city: "",
        area: "",
        street: "",
        community: ""
      },
      admin_type: "", //用户判定
      moduleData: [
        {
          role: 1,
          role_name: "超级管理员"
        },
        {
          role: 2,
          role_name: "编辑员"
        },
        {
          role: 3,
          role_name: "审核员"
        }
      ],
      formLabelWidth: "120px",
      btnMark: true
    };
  },
  watch: {
    "ruleForm.province"() {
      this.ruleForm.area = "";
      this.ruleForm.city = ""; // 市
      this.ruleForm.street = ""; //街道
      this.ruleForm.community = ""; // 社区
      this.getArea({ upper_region: this.ruleForm.province });
    },
    "ruleForm.city"() {
      this.ruleForm.area = "";
      this.ruleForm.street = ""; //街道
      this.ruleForm.community = ""; // 社区
      this.getArea({ upper_region: this.ruleForm.city });
    },
    "ruleForm.area"() {
      this.ruleForm.street = ""; //街道
      this.ruleForm.community = ""; // 社区
      this.getArea({ upper_region: this.ruleForm.area });
    },
    "ruleForm.street"() {
      this.ruleForm.community = ""; // 社区
      this.getArea({ upper_region: this.ruleForm.street });
    },
    "ruleForm.community"() {
      this.getArea({ upper_region: this.ruleForm.community });
    }
  },
  created() {
    this.admin_type = getAdminType();
    const query = this.$route.query;
    this.getArea({ upper_region: 0 });
    if (query.admin_id) {
      this.admin_id = query.admin_id;
      this.ruleForm.id = query.admin_id;
      this.query(query.admin_id);
    }
  },
  methods: {
    //更改Id
    selectId(e) {
      this.ruleForm.role = e;
    },
    // 提交审核
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnMark = true;
          var args = this.ruleForm;
          for (var i in args) {
            if (args[i] === "") {
              delete args[i];
            }
          }
          if (this.admin_id) {
            RequestPlatAccountEdit(args).then(res => {
              oprateFn(res);
            });
          } else {
            RequestPlatAccountAdd(args).then(res => {
              oprateFn(res);
            });
          }
          function oprateFn(res) {
            _this.btnMark = false;
            if (res.code == 2000) {
              _this.$Message({
                type: "success",
                text: "操作成功"
              });
              _this.callback();
            } else if (res.code == 4000) {
              _this.$Message({
                type: "info",
                text: res.msg
              });
            } else {
              _this.$Message({
                type: "info",
                text: "出错"
              });
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    callback() {
      this.$router.push({ path: "platAccount" });
      this.$store.dispatch("delVisitedViews", {
        path: "/account/platAdd"
      });
    },
    //编辑信息
    query(admin_id) {
      this.formTitle = "编辑账号";
      RequestPlatDetail({ admin_id: admin_id }).then(res => {
        this.ruleForm.account = res.admin_account;
        this.ruleForm.nickname = res.admin_nickname;
        this.ruleForm.tel = res.admin_tel;
        this.ruleForm.role = res.role_type;
        this.ruleForm.id = res.admin_id;
        if (res.role_type == 1) {
          this.role_name = "超级管理员";
        } else if (res.role_type == 2) {
          this.role_name = "编辑员";
        } else if (res.role_type == 3) {
          this.role_name = "审核员";
        }
      });
    },
    getArea(obj) {
      let args = obj;
      RequestArea(args).then(res => {
        if (res) {
          !!res.map &&
            res.map((item, index) => {
              if (item.is_open == 1) {
                res[index]["is_show"] = false;
              } else {
                res[index]["is_show"] = true;
              }
            });
          if (res[0].level == 1) {
            this.provinceData = res;
          } else if (res[0].level == 2) {
            this.cityData = res;
            this.areaData = [];
            this.streetData = [];
            this.communityData = [];
          } else if (res[0].level == 3) {
            this.areaData = res;
            this.streetData = [];
            this.communityData = [];
          } else if (res[0].level == 4) {
            this.streetData = res;
            this.communityData = [];
          } else if (res[0].level == 5 && res.length != 0) {
            this.communityData = res;
          }
        }
      });
    },
    chooseAddress(value) {
      RequestArea({ upper_region: value }).then(res => {
        //  console.log(res);
        if (res.length != 0) {
          !!res.map &&
            res.map((item, index) => {
              if (item.is_open == 1) {
                res[index]["is_show"] = false;
              } else {
                res[index]["is_show"] = true;
              }
            });
          if (res[0].level == 1) {
            this.provinceData = res;
            // console.log('ddddd')
            this.ruleForm.city = "";
            this.ruleForm.area = "";
            this.ruleForm.community = "";
            this.ruleForm.street = "";
          } else if (res[0].level == 2) {
            this.cityData = res;
            this.areaData = [];
            this.streetData = [];
            this.communityData = [];
            this.ruleForm.city = "";
            this.ruleForm.area = "";
            this.ruleForm.community = "";
            this.ruleForm.street = "";
            console.log("sssss");
          } else if (res[0].level == 3) {
            this.areaData = res;
            console.log("执行");
            this.streetData = [];
            this.communityData = [];
            this.ruleForm.area = "";
            this.ruleForm.community = "";
            this.ruleForm.street = "";
          } else if (res[0].level == 4) {
            this.streetData = res;
            this.communityData = [];
            this.ruleForm.community = "";
            this.ruleForm.street = "";
          } else if (res[0].level == 5) {
            this.communityData = res;
            this.ruleForm.community = "";
          }
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
  .info-footer {
    margin-left: 120px;
    padding: 50px 0;
  }
  .el-tag + .el-tag {
    margin-right: 10px;
  }
  .button-new-tag {
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-right: 10px;
    vertical-align: bottom;
  }
  .info-title {
    padding: 10px;
    margin-bottom: 30px;
    font-size: 16px;
    color: #1890ff;
    border-bottom: 5px solid rgb(247, 246, 252);
  }
  .avatar-uploader,
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 178px;
    width: 178px;
    overflow: hidden;
  }
  .avatar-uploader,
  .el-upload:hover {
    border-color: #409eff;
  }
  .el-upload,
  .el-upload--text {
    border: 1px dashed #d9d9d9 !important;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
