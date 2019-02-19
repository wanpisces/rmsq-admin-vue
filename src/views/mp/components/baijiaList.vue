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
          <el-table-column label="百家账号" prop="baijia_account">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="140">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small" @click="handEditor(scope.row,1)">编辑</el-button> -->
              <el-button type="text" size="small" @click="batchDelete(scope.row)">删除</el-button>
              <el-button type="text" size="small" @click="handEditor(scope.row,2)" :disabled="scope.row.baijia_login_state==2">{{scope.row.baijia_login_state==1?'授权':"正常"}}</el-button>

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
        <el-form-item label="账号(电话号码)：" :label-width="formLabelWidth" prop="baijia_account">
          <el-input v-model="ruleForm.baijia_account" auto-complete="off" :disabled="isVar==2"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码：" :label-width="formLabelWidth" prop="baijia_pwd">
          <el-input v-model="ruleForm.baijia_pwd" auto-complete="off" type="baijia_pwd" :disabled="isVar==2"></el-input>
        </el-form-item> -->
        <el-form-item label="验证码：" :label-width="formLabelWidth" prop="captcha">
          <!-- <div class="beg-input">
            <el-input type="text" placeholder="请输入您的验证码" v-model="ruleForm.captcha"></el-input>
            <div class="verify-img" @click="handleVerify"><img :src="captcha_img" alt="图片" style="cursor: pointer" v-if="captcha_img">
              <span v-else>验证码加载中...</span>
            </div>
          </div> -->
          <div class="beg-input" style="display:flex; align-items: center">
            <el-input type="text" placeholder="请输入您的手机验证码" v-model="ruleForm.captcha" style="width:77%"></el-input>
            <el-button @click="handleVerify" size="mini" :disabled="deleteMarkCode">{{codeMsg}}</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="btnMark">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue";

import { RequestBaijiaList, RequestBaijiaAdd, RequestBaijiaEditor, RequestBaijiaDelete, RequestBaijiaDetail, RequestBaijiaCaptcha, RequestBaijiaLogin } from "@/fetch/modules/public";

const rules = {
  baijia_account: [
    {
      required: true,
      // message: "请输入百家账号(电话号码)",
      trigger: "blur",
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入电话号码(电话号码)"));
        } else {
          if (!isvalidPhone(value)) {
            callback(new Error("请输入正确的11位手机号码"));
          } else {
            callback();
          }
        }
      }
    }
  ],
  baijia_pwd: [{ required: true, message: "请输入百家密码", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
};

// 手机号验证
function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  return reg.test(str);
}
function varFilter(arr, obj) {
  for (let i in obj) {
    for (let j = 0; j < arr.length; j++) {
      if (i == arr[j]) {
        obj[i] = "";
      }
    }
  }
  return obj;
}
export default {
  components: { ChooseTab },
  data() {
    return {
      rules,
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
        baijia_account: "",
        baijia_pwd: "",
        captcha: "",
        key: "",
        type: 1
      },
      captcha_img: "",
      formLabelWidth: "140px",
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
      // TouTiaoInnerVisible: false, // 手机验证的，
      // codeType: 22,
      // iphoneTitle: "手机安全认证",
      isVar: 1,
      deleteMarkCode: false,
      codeMsg: "验证码获取"
    };
  },
  created() {
    var args = this.objSearch;
    this.getListData(args);
  },
  methods: {
    // 获取验证码
    handleVerify() {
      let isPass;
      // this.captcha_img = "";
      // this.ruleForm.key ? (_args["codeString"] = this.ruleForm.key) : "";
      this.$refs["ruleForm"].validateField("baijia_account", vaild => {
        isPass = vaild;
      });
      if (isPass) return false;
      this.codeMsg = "验证码已发送";
      this.deleteMarkCode = true;
      RequestBaijiaCaptcha({ baijia_account: this.ruleForm.baijia_account }).then(res => {
        if (res.code != 2000) {
          this.codeMsg = "验证码获取";
          this.deleteMarkCode = false;
          this.$message.error(res.msg);
        } else {
          this.$message.success("验证码已发送至您的手机，请注意查看");
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
      RequestBaijiaList(args).then(res => {
        if (res.code === 2000) {
          this.tableData = res.data.list;
          // this.objSearch.current_page = Number(res.data.current_page);
          // this.objSearch.page_size = Number(res.data.page_size);
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
        baijia_account: "",
        // baijia_pwd: "",
        captcha: "",
        // key: "",
        type: 1
      };
      // this.handleVerify();
      this.oprateStatus = 2;
      this.releaseDialog = true;
      this.formTitle = "新增绑定";
      this.isVar = 1;
    },
    //编辑信息
    handEditor(row, val) {
      this.formTitle = "授权绑定";
      this.isVar = 2;
      this.ruleForm = Object.assign(this.ruleForm, row);
      this.ruleForm.type = 2;
      this.oprateStatus = 1;
      this.releaseDialog = true;
    },
    //编辑,保存
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnMark = true;
          var args = this.ruleForm;
          let _argsLogin = {
            baijia_account: args.baijia_account,
            // baijia_pwd: args.baijia_pwd,
            // codeString: args.key,
            captcha: args.captcha
            // type: args.type
          };
          RequestBaijiaAdd(_argsLogin).then(res => {
            oprateFn(res);
          });
          // }
          function oprateFn(res) {
            _this.btnMark = false;
            _this.codeMsg = "验证码获取";
            _this.deleteMarkCode = false;
            switch (res.code) {
              case 2000:
                _this.$message.success("操作成功");
                _this.getListData(_this.objSearch);
                _this.resetForm("ruleForm");
                break;
              default:
                varFilter(["captcha"], _this.ruleForm);
                _this.$message.error(res.msg);
                break;
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
        arr.push(vals[i].id);
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
      _arr.push(row.baijia_id);
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
          RequestBaijiaDelete({ baijia_id: id }).then(res => {
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
    handleClose() {
      this.resetForm("ruleForm");
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

