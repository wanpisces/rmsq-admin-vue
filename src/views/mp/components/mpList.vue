<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="公众号名称" v-model="objSearch.q"></el-input>
        </div>
        <div class="search">
          <span>选择类型：</span>
          <el-select v-model="objSearch.type" filterable placeholder="请选择类型">
            <el-option :key="0" label="全部" :value="0"></el-option>
            <el-option :key="1" label="服务号" :value="1"></el-option>
            <el-option :key="2" label="订阅号" :value="2"></el-option>
          </el-select>
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
            <div style="margin-right:30px;color:#39bcf3;cursor: pointer;" @click="dialogTableVisible=true">
              <i class="el-icon-question
"></i>帮助</div>

            <div class="table-title-rigth">
              <el-button class="el-icon-circle-plus-outline title-rigth-add" @click="releaseClick" type="primary"> 新增绑定</el-button>
              <choose-tab @handleShowDliog="handleShowDliog" @TimeOn="TimeOn">
              </choose-tab>
            </div>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="序号" width="100" type="index">
          </el-table-column>
          <el-table-column label="类型" prop="question_content">
            <template slot-scope="scope">
              <span>{{{1:'服务号',2:"订阅号"}[scope.row.type]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="公众号名称" prop="app_name">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handEditor(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="batchDelete(scope.row)">删除</el-button>
              <!-- <div class="el-icon-wrapper">
                <i v-if="perm.mpEdit == 1" class="el-icon-edit" title="编辑" @click="handEditor(scope.row)"></i>
                <i v-if="perm.mpDele == 1" class="el-icon-delete" title="删除" @click="batchDelete(scope.row)"></i>
              </div> -->
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
    <!-- 发布添加 -->
    <!-- <el-dialog title="问题详情" :visible.sync="detailDialog">
            <div class="detail-wrapper">
                <h1>{{questionData.question_content}}</h1>
                <p>{{questionData.question_reply}}</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="detailDialog = false">取 消</el-button>
            </div>
        </el-dialog> -->
    <!-- 编辑 -->
    <!-- 发布添加 -->
    <el-dialog :title="formTitle" :visible.sync="releaseDialog" :before-close="handleClose" :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <!-- <el-input v-model="ruleForm.app_name" type="hidden"></el-input> -->
        <el-form-item label="公众号名称：" :label-width="formLabelWidth" prop="app_name">
          <el-input v-model="ruleForm.app_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="公众号类型：" :label-width="formLabelWidth" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio :label="1">服务号</el-radio>
            <el-radio :label="2">订阅号</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="公众号ID：" :label-width="formLabelWidth" prop="mp_id">
          <el-input v-model="ruleForm.mp_id" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="公众号ID：" :label-width="formLabelWidth" prop="app_id">
          <el-input v-model="ruleForm.app_id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="公众号密钥：（AppSecret）" :label-width="formLabelWidth" prop="secret">
          <el-input v-model="ruleForm.secret" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="btnMark">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 帮助 -->
    <el-dialog title="帮助 各字段获取方法" :visible.sync="dialogTableVisible" width="80%">
      <div style="font-size:18px">1.判断自己属于哪种类型的公众号</div>
      <img src="https://img.sqydt.darongshutech.com/FvWk1_V1S43rrno7PCF4Tkz0D8zu" width="100%" alt="">
      <div style="font-size:18px;margin:20px 0">2.获取AppID与AppSecret</div>
      <div style="font-size:18px ;margin:20px 0">（1）打开要绑定的微信公众号，选择【开发】—【基本配置】</div>
      <img src="https://img.sqydt.darongshutech.com/Fk-pMYbKvazYFvCUhQ8QQVYdOxCn" width="100%" alt="">
      <div style="font-size:18px;margin:20px 0">（2）复制所需内容，粘贴至管理后台</div>
      <img src="https://img.sqydt.darongshutech.com/Fpx5UTnciX8qxKlZQC42TvnaHPmq" width="100%" alt="">
    </el-dialog>
    <!-- 编辑 -->
  </div>
</template>
<script>
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue";
import { RequestQuestionList, RequestQuestionOnline, DeleteQuestion, RequestQuestionDetail, RequestQuestionEdit, RequestQuestionAdd } from "@/fetch/modules/questionFeedback.js";
import { RequestMpList, RequestMpDetail, RequestMpAdd, RequestMpEditor, RequestMpDelete, RequestMpState } from "@/fetch/modules/mp";
const rules = {
  app_name: [{ required: true, message: "请输入公众号名称", trigger: "blur" }],
  app_id: [{ required: true, message: "请输入开发者app-id", trigger: "blur" }],
  secret: [{ required: true, message: "请输入开发者密码", trigger: "blur" }],
  type: [{ required: true, message: "请选择公众号类型" }],
  mp_id: [{ required: true, message: "请输入公众号ID" }]
};
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
        // gid: "", //	是	int	层级 group_id
        // gid: 1,
        // mp_id: "", //	是	int	公众号ID
        app_name: "", //	是	string	公众号名称
        type: 1, //	是	int	公众号类型 1服务号 2订阅号
        app_id: "", //是	string	公众号APPID
        secret: "" //	是	string	公众号SRCRET
      },
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      switchData: [{ name: "启用", active: 1 }, { name: "禁用", active: 2 }],
      active: 1,
      dialogTableVisible: false
    };
  },
  created() {
    var args = this.objSearch;
    this.getListData(args);
  },
  methods: {
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
      RequestMpList(args).then(res => {
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
        // gid: 1,
        // mp_id: "", //	是	int	公众号ID
        app_name: "", //	是	string	公众号名称
        type: 1, //	是	int	公众号类型 1服务号 2订阅号
        app_id: "", //是	string	公众号APPID
        secret: "" //	是	string	公众号SRCRET
      };
      this.oprateStatus = 2;
      this.releaseDialog = true;
      this.formTitle = "新增绑定";
    },
    //编辑信息
    handEditor(row) {
      const mp_id = row.mp_id;
      this.formTitle = "编辑绑定";
      RequestMpDetail({ mp_id: mp_id }).then(res => {
        if (res.code == 2000) {
          res.data.type = Number(res.data.type);
          this.ruleForm = Object.assign(this.ruleForm, res.data);
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
          if (this.oprateStatus == 1) {
            RequestMpEditor(args).then(res => {
              oprateFn(res);
            });
          } else {
            RequestMpAdd(args).then(res => {
              oprateFn(res);
            });
          }
          function oprateFn(res) {
            _this.resetForm("ruleForm");
            _this.btnMark = false;
            if (res.code == 2000) {
              _this.$Message({
                type: "success",
                text: "操作成功"
              });
              _this.getListData(_this.objSearch);
            } else if (res.code == 4000) {
              _this.$Message({
                type: "info",
                text: res.msg
              });
            } else {
              _this.$Message({
                type: "info",
                text: res.msg
              });
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
      for (var i = 0; i < vals.length; i++) {
        this.selectionValues.push(vals[i].mp_id);
      }
      if (vals.length <= 0) {
        this.deleteMark = true;
      } else {
        this.deleteMark = false;
      }
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
      var mp_id = "";
      for (var i = 0; i < this.selectionValues.length; i++) {
        mp_id += this.selectionValues[i] + ",";
      }
      this.deleteFn(mp_id);
    },
    //删除
    batchDelete(row) {
      var mp_id = row.mp_id;
      this.deleteFn(mp_id);
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(mp_id) {
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestMpDelete({ mp_id: mp_id }).then(res => {
            var args = this.objSearch;
            this.getListData(args);
            this.$Message({
              type: "success",
              text: "删除成功!"
            });
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
</style>


