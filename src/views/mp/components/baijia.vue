<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="百家账号" v-model="objSearch.q"></el-input>
        </div>
        <div class="search">
          <el-button type="primary" icon="el-icon-search" @click='searchKeyword'>搜索</el-button>
        </div>

      </div>
    </el-card>
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <div class="table-title">
          <div>
            <el-button type="danger" plain @click="tabelDelete" :disabled="deleteMark">删除</el-button>
            <!-- <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button> -->
          </div>

          <div style="display:flex;align-items: center">

            <div class="table-title-rigth">
              <el-button class="el-icon-circle-plus-outline title-rigth-add" @click="releaseClick" type="primary"> 新增绑定</el-button>
              <!-- <choose-tab @handleShowDliog="handleShowDliog" @TimeOn="TimeOn">
              </choose-tab> -->
            </div>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="序号" width="100" type="index">
          </el-table-column>
          <el-table-column label="百家账号" prop="kuaichuan_account">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handEditor(scope.row,1)">编辑</el-button>
              <el-button type="text" size="small" @click="batchDelete(scope.row)">删除</el-button>

              <el-button type="text" size="small" @click="handEditor(scope.row,2)" :disabled="scope.row.kuaichuan_login_state==2">{{scope.row.kuaichuan_login_state==1?'授权':"正常"}}</el-button>

            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="margin-left: 20px;">
            <!-- <mo-paging :page-index="objSearch.current_page" :total="count" :page-size="objSearch.page_size" @change="pageChange">
            </mo-paging> -->
            <el-pagination background @current-change="pageChange" :current-page.sync="objSearch.current_page" :page-size="objSearch.page_size" layout="total,prev, pager, next, jumper" :total="count">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 编辑 -->
    <!-- 发布添加 -->
    <el-dialog :title="formTitle" :visible.sync="releaseDialog" :before-close="handleClose" :close-on-click-modal="false" width="400px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="账号：" :label-width="formLabelWidth" prop="kuaichuan_account">
          <el-input v-model="ruleForm.kuaichuan_account" auto-complete="off" :disabled="isVar==2"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth" prop="kuaichuan_pwd">
          <el-input v-model="ruleForm.kuaichuan_pwd" auto-complete="off" type="password" :disabled="isVar==2"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" :label-width="formLabelWidth" prop="captcha">
          <div class="beg-input">
            <el-input type="text" placeholder="请输入您的验证码" v-model="ruleForm.captcha"></el-input>
            <div class="verify-img" @click="handleVerify"><img :src="captcha_img" alt="验证码"></div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="btnMark">确 定</el-button>
      </div>

      <el-dialog width="300px" :title="iphoneTitle" :visible.sync="TouTiaoInnerVisible" append-to-body :before-close="handleCloseIphone">
        <el-form :model="ruleFormIphone" :rules="rulesFormIphone" ref="ruleFormIphone">
          <el-form-item label="手机号：" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="ruleFormIphone.mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="验证码：" :label-width="formLabelWidth" prop="captcha">
            <div class="beg-input">
              <el-input type="text" placeholder="请输入您的验证码" v-model="ruleFormIphone.captcha"></el-input>
              <div class="verify-img" @click="handleVerifyIphone"><img :src="captcha_imgIphone" alt="验证码"></div>
            </div>
          </el-form-item>
          <el-form-item label="手机验证码：" :label-width="formLabelWidth" prop="code">
            <div class="beg-input" style="display:flex; align-items: center">
              <el-input type="text" placeholder="请输入您的手机验证码" v-model="ruleFormIphone.code" style="width:77%"></el-input>
              <!-- <div class="verify-img-code" ></div> -->
              <el-button @click="handleIphoneCode" size="mini" :disabled="deleteMarkCode">{{codeMsg}}</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <div style="text-align:center">
              <el-button @click="resetFormIphone('ruleFormIphone')">取 消</el-button>
              <el-button type="primary" @click="submitFormIphone('ruleFormIphone')" :disabled="btnMarkIphone">提 交</el-button>
            </div>

          </el-form-item>

        </el-form>
      </el-dialog>
    </el-dialog>

  </div>
</template>
<script>
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue";

// import {
//   RequestMpList,
//   RequestMpDetail,
//   RequestMpAdd,
//   RequestMpEditor,
//   RequestMpDelete,
//   RequestMpState
// } from "@/fetch/modules/mp";
import { RequestKuaichuanList, RequestKuaichuanAdd, RequestKuaichuanEditor, RequestKuaichuanDelete, RequestKuaichuanDetail, RequestKuaichuanCaptcha, RequestKuaichuanLogin, RequestToutiaoIphoneCode, RequestToutiaoSec, RequestToutiaoByMobile } from "@/fetch/modules/public";

const rules = {
  kuaichuan_account: [{ required: true, message: "请输入百家账号", trigger: "blur" }],
  kuaichuan_pwd: [{ required: true, message: "请输入百家密码", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
};
const rulesFormIphone = {
  mobile: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  code: [{ required: true, message: "请输入手机验证码", trigger: "blur" }]
};
// 手机号验证
function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  return reg.test(str);
}
export default {
  components: { ChooseTab },
  data() {
    return {
      rules,
      rulesFormIphone,
      isActive: true,
      questionData: {}, //问题详情
      detailDialog: false, //问题描述
      labelTitle: "上线时间",
      btnMark: false, //提交form的时候按钮
      oprateStatus: 1, //1为编辑，2为添加
      primary1: "parimary",
      primary2: "",
      formTitle: "问题添加",
      value: "",
      tableData: [],
      objSearch: {
        current_page: 1,
        page_size: 10,
        q: "",
        order_time: 2,
        type: 0, // 公众号类型 1服务号 2订阅号
        status: 1
      },
      count: 0,
      // 发布编辑
      releaseDialog: false,
      ruleForm: {
        kuaichuan_account: "",
        kuaichuan_pwd: "",
        captcha: "",
        key: "",
        type: 1
      },
      captcha_img: "",
      formLabelWidth: "120px",
      ruleFormIphone: {
        mobile: "",
        captcha: "",
        key: ""
      },
      captcha_imgIphone: "",
      codeMsg: "验证码获取",
      deleteMarkCode: false,
      btnMarkIphone: false,
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      switchData: [{ name: "启用", active: 1 }, { name: "禁用", active: 2 }],
      active: 1,
      dialogTableVisible: false,
      TouTiaoInnerVisible: false, // 手机验证的，
      codeType: 22,
      iphoneTitle: "手机安全认证",
      isVar: 1
    };
  },
  created() {
    var args = this.objSearch;
    this.getListData(args);
  },
  methods: {
    // 获取验证码
    handleVerify() {
      let _args = {};
      this.ruleForm.kuaichuan_account ? (_args["kuaichuan_account"] = this.ruleForm.kuaichuan_account) : "";
      RequestKuaichuanCaptcha(_args).then(res => {
        console.log(res);
        if (res.code == 2000) {
          this.ruleForm.key = res.data.key;
          this.captcha_img = res.data.captcha;
        }
        // "data:image/png;base64," +
        // this.ruleForm. = res.verify_img;
        // this.loginForm.verify_id = res.verify_id;
      });
    },
    // 获取验证码
    handleVerifyIphone() {
      let _args = {};
      this.ruleForm.kuaichuan_account ? (_args["kuaichuan_account"] = this.ruleForm.kuaichuan_account) : "";
      RequestKuaichuanCaptcha(_args).then(res => {
        if (res.code == 2000) {
          this.ruleFormIphone.key = res.data.key;
          this.captcha_imgIphone = res.data.captcha;
        }
      });
    },
    // 获取手机验证码
    handleIphoneCode() {
      // console.log()
      if (!this.ruleFormIphone.captcha || !this.ruleFormIphone.mobile) {
        this.$message.error("请输入验证码或手机号");
      } else {
        console.log(isvalidPhone(this.ruleFormIphone.mobile));
        if (isvalidPhone(this.ruleFormIphone.mobile)) {
          let { mobile, captcha, key, type = this.codeType } = this.ruleFormIphone;
          this.codeMsg = "验证码已发送";
          this.deleteMarkCode = true;
          RequestToutiaoIphoneCode({ mobile, captcha, key, type }).then(res => {
            if (res.code == 2000) {
            } else if (res.code == 1102) {
              // this.$message.error(res.msg);
              // this.codeMsg = "验证码获取";
              // this.deleteMarkCode = false;
              // this.ruleFormIphone.captcha = "";
              // this.captcha_imgIphone = res.data.captcha;
              this.$message.error(res.msg);
              this.codeMsg = "验证码获取";
              this.deleteMarkCode = false;
              this.ruleFormIphone.captcha = "";
              this.handleVerifyIphone();
            } else if (res.code == 4000) {
              this.$message.error(res.msg);
              this.codeMsg = "验证码获取";
              this.deleteMarkCode = false;
              this.ruleFormIphone.captcha = "";
              this.handleVerifyIphone();
            }
          });
        } else {
          this.$message.error("请输入正确的电话号码");
        }
      }
    },
    // 手机安全 或手机号 验证提交
    submitFormIphone(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnMarkIphone = true;
          var args = this.ruleFormIphone;
          args["kuaichuan_account"] = this.ruleForm.kuaichuan_account;
          if (this.codeType == 22) {
            RequestToutiaoSec(args).then(res => {
              oprateFnIphone(res);
            });
          } else if (this.codeType == 24) {
            RequestToutiaoByMobile(args).then(res => {
              oprateFnIphone(res);
            });
          }
          function oprateFnIphone(res) {
            _this.btnMarkIphone = false;
            if (res.code == 2000) {
              _this.$message.success("操作成功");
              _this.resetFormIphone("ruleFormIphone");
              _this.resetForm("ruleForm");
              _this.getListData(this.objSearch);
            } else if (res.code == 4000) {
              _this.$message.error(res.msg);
              _this.ruleFormIphone.captcha = "";
              _this.ruleFormIphone.key = "";
              _this.handleVerifyIphone();
            } else if (res.code == 1102) {
              // this.ruleFormIphone.captcha = "";
              // this.captcha_imgIphone = res.data.captcha;
              _this.ruleFormIphone.captcha = "";
              _this.ruleFormIphone.key = "";
              _this.handleVerifyIphone();
              _this.$message.error(res.msg);
            } else if (res.code == 2222) {
              //  该情况针对  手机号登陆异常，请使用手机号验证
              _this.$message.error(res.msg);
              _this.iphoneTitle = "手机安全认证";
              _this.codeMsg = "验证码获取";
              _this.deleteMarkCode = false;
              _this.ruleFormIphone.captcha = "";
              _this.ruleFormIphone.code = "";
              _this.TouTiaoInnerVisible = true;
              _this.codeType = 22;
              _this.handleVerifyIphone();
            } else {
              _this.$message.error(res.msg);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      var args = this.objSearch;
      this.getListData(args);
    },
    //获取模块列表
    getListData(args) {
      if (args.type == 0) {
        delete args.type;
      }
      RequestKuaichuanList(args).then(res => {
        if (res.code === 2000) {
          this.tableData = res.data.list;
          this.objSearch.current_page = Number(res.data.current_page);
          this.objSearch.page_size = Number(res.data.page_size);
          this.count = Number(res.data.total_num);
        }
      });
    },
    // 搜索关键词
    searchKeyword() {
      this.objSearch.current_page = 1;
      var args = this.objSearch;
      this.getListData(args);
    },
    //排序
    TimeOn(sort) {
      this.objSearch.order_time = sort;
      var args = this.objSearch;
      this.getListData(args);
    },
    //问题详情
    questionDetail(mp_id) {
      RequestQuestionDetail({ mp_id, mp_id }).then(res => {
        this.questionData = res;
        this.detailDialog = true;
      });
    },
    // 上下线切换
    switchFn(active) {
      if (active == 1) {
        this.labelTitle = "上线时间";
      } else if (active == 2) {
        this.labelTitle = "下线时间";
      }
      this.current_page = 1;
      this.objSearch.status = active;
      this.active = active;
      this.getListData({ status: JSON.parse(active) });
    },
    // 上下线
    handleOnline(mp_id) {
      RequestQuestionOnline({ mp_id }).then(res => {
        this.getListData({});
      });
    },
    // 添加
    releaseClick() {
      this.ruleForm = {
        kuaichuan_account: "",
        kuaichuan_pwd: "",
        captcha: "",
        key: "",
        type: 1
      };
      console.log("aaa____");
      this.handleVerify();
      this.oprateStatus = 2;
      this.releaseDialog = true;
      this.formTitle = "新增绑定";
      this.isVar = 1;
    },
    //编辑信息
    handEditor(row, val) {
      this.handleVerify();

      val == 1 ? (this.formTitle = "编辑绑定") : (this.formTitle = "授权绑定");
      val == 1 ? (this.isVar = 1) : (this.isVar = 2);
      RequestKuaichuanDetail({ kuaichuan_id: row.kuaichuan_id }).then(res => {
        if (res.code == 2000) {
          res.data.type = Number(res.data.type);
          this.ruleForm = Object.assign(this.ruleForm, res.data);
          this.ruleForm.type = 2;
          this.oprateStatus = 1;
          this.releaseDialog = true;
        }
      });
    },
    //编辑,保存
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnMark = true;
          var args = this.ruleForm;
          // if (this.oprateStatus == 1) {
          //   RequestKuaichuanEditor(args).then(res => {
          //     oprateFn(res);
          //   });
          // } else {
          let _argsLogin = {
            account: args.kuaichuan_account,
            password: args.kuaichuan_pwd,
            key: args.key,
            captcha: args.captcha,
            type: args.type
          };
          RequestKuaichuanLogin(_argsLogin).then(res => {
            oprateFn(res);
          });
          // }
          function oprateFn(res) {
            _this.btnMark = false;

            if (res.code == 2000) {
              _this.$message.success("操作成功");
              _this.resetForm("ruleForm");
              // _this.$Message({
              //   type: "success",
              //   text: "操作成功"
              // });
              _this.getListData(_this.objSearch);
            } else if (res.code == 4000) {
              _this.ruleForm.captcha = "";
              _this.ruleForm.key = "";
              _this.handleVerify();
              _this.$message.error(res.msg);
            } else if (res.code == 78000) {
              _this.ruleForm.captcha = "";
              _this.ruleForm.key = "";
              _this.handleVerify();
              _this.$message.error(res.msg);
            } else if (res.code == 220 || res.code == 1036) {
              for (let i in _this.ruleForm) {
                _this.ruleForm[i] = "";
              }
              _this.handleVerify();
              _this.$message.error(res.msg);
            } else if (res.code == 1102) {
              _this.ruleForm.captcha = "";
              _this.ruleForm.key = "";
              _this.handleVerify();
              _this.$message.error(res.msg);
            } else if (res.code == 2222) {
              // 模拟 2222情况
              _this.iphoneTitle = "手机安全认证";
              _this.TouTiaoInnerVisible = true;
              _this.codeType = 22;
              _this.handleVerifyIphone();
            } else if (res.code == 1039) {
              // 模拟 1039
              _this.iphoneTitle = "手机号登陆";
              _this.codeType = 24;
              _this.TouTiaoInnerVisible = true;
              _this.handleVerifyIphone();
            } else {
              _this.$message.error(res.msg);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 批量选中
    handleSelectionChange(vals) {
      let arr = [];
      for (var i = 0; i < vals.length; i++) {
        arr.push(vals[i].kuaichuan_id);
      }
      this.selectionValues = arr;
      if (vals.length <= 0) {
        this.deleteMark = true;
      } else {
        this.deleteMark = false;
      }
      //   console.log("handleSelectionChange", vals);
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 批量删除
    tabelDelete() {
      if (this.selectionValues.length == 0) {
        this.$message({
          showClose: true,
          message: "未选中任何选项！",
          type: "error"
        });
        return;
      }
      this.deleteFn(this.selectionValues);
    },
    //删除
    batchDelete(row) {
      let _arr = [];
      _arr.push(row.kuaichuan_id);
      this.deleteFn(_arr);
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(id) {
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestKuaichuanDelete({ kuaichuan_id: id }).then(res => {
            var args = this.objSearch;
            // this.getListData(args);
            // this.$Message({
            //   type: "success",
            //   text: "删除成功!"
            // });

            if (res.code == 2000) {
              this.getListData(args);
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.releaseDialog = false;
    },
    resetFormIphone(formName) {
      this.$refs[formName].resetFields();
      this.TouTiaoInnerVisible = false;
      this.codeMsg = "验证码获取";
      this.deleteMarkCode = false;
      this.ruleFormIphone.captcha = "";
    },
    handleClose() {
      this.resetForm("ruleForm");
    },
    handleCloseIphone() {
      this.resetFormIphone("ruleFormIphone");
    }
  }
};
</script>

<style scoped  >
@import url("./compoents");
.beg-input {
  height: 40px;
  /* border-bottom: 1px solid #f2f2f2; */
  display: flex;
  justify-content: space-between;

  /* align-items: baseline; */
}
.beg-input > input {
  border: none;
  outline: none;
}
.beg-info {
  position: relative;
  top: 10px;
}
.verify-img {
  float: right;
  width: 30%;
}
.verify-img-code {
  float: right;
  width: 50%;
}
.verify-img img {
  width: 100%;
  height: 100%;
}
.beg-btn {
  width: 200px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #ffd100;
  border-radius: 20px;
  margin-top: 45px;
  cursor: pointer;
}
</style>

