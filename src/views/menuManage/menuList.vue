<template>
  <div class="info-container">
    <el-card>
      <div style="margin-bottom:15px;display:flex; align-items:center;justify-content: flex-end" align="right">
        <!-- <span v-if="adminType!=2" style="color:rgb(249, 167, 167)">
          <span v-if="adminType==0 || adminType==1">温馨提示:您可以设置在首页显示{{{0:newsTop.SERVICE_NUM_SYS,1:newsTop.SERVICE_NUM_COMMUNITY ,2:newsTop.SERVICE_NUM_STREET ,3:newsTop.SERVICE_NUM_AREA ,4:newsTop.SERVICE_NUM_CITY ,5:newsTop.SERVICE_NUM_PROVINCE } [role]}}个服务,下沉{{{0:newsTop.SINK_ALL_SERVICE_SYS,1:newsTop.SINK_ALL_SERVICE_COMMUNITY ,2:newsTop.SINK_ALL_SERVICE_STREET ,3:newsTop.SINK_ALL_SERVICE_AREA ,4:newsTop.SINK_ALL_SERVICE_CITY ,5:newsTop.SINK_ALL_SERVICE_PROVINCE } [role]}}个服务,超过数量限制会把最先设置(下沉)的服务自动下线。</span>
          <span v-if="adminType==3">温馨提示:您可以设置在首页显示{{{0:newsTop.AGENT_SERVICE_NUM_SYS,1:newsTop.AGENT_SERVICE_NUM_COMMUNITY ,2:newsTop.AGENT_SERVICE_NUM_STREET ,3:newsTop.AGENT_SERVICE_NUM_AREA ,4:newsTop.AGENT_SERVICE_NUM_CITY ,5:newsTop.AGENT_SERVICE_NUM_PROVINCE } [role]}}个服务,下沉{{{0:newsTop.SINK_AGENT_SERVICE_SYS,1:newsTop.SINK_AGENT_SERVICE_COMMUNITY ,2:newsTop.SINK_AGENT_SERVICE_STREET ,3:newsTop.SINK_AGENT_SERVICE_AREA ,4:newsTop.SINK_AGENT_SERVICE_CITY ,5:newsTop.SINK_AGENT_SERVICE_PROVINCE } [role]}}个服务,超过数量限制会把最先设置(下沉)的服务自动下线。</span>
        </span> -->
        <el-button v-if="perm.serviceL1Add == 1" type="primary" @click="openLevel(1,1)">添加服务类目</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" :header-row-class-name="headerName">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.service_list" style="width: 100%" :border="true">
              <el-table-column type="expand">
                <template v-if="props.row.related_tmpl == 5" slot-scope="props">
                  <el-table :data="props.row.category.attr_list" style="width: 100%" :border="true">
                    <el-table-column align="center" label="分类名称" prop="attr_value">
                    </el-table-column>
                    <el-table-column align="center" label="分类描述" prop="extra">
                    </el-table-column>
                    <el-table-column align="center" fixed="right" label="操作" width="140">
                      <template slot-scope="scope">
                        <el-button v-if="perm.serviceL3Edit == 1" :disabled="props.row.is_mine!=1" type="text" size="small" @click="handEditor(scope.row)">编辑</el-button>
                        <!-- <el-button v-if="perm.serviceL3Dele == 1" type="text" size="small" @click="deleteClassfiy(scope.row)">删除</el-button> -->
                        <el-button type="text" size="small" @click="deleteClassfiy(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column align="center" width="60" type="index">
              </el-table-column>
              <el-table-column property="service_title" label="服务名称">
              </el-table-column>
              <el-table-column property="service_desc" label="服务描述">
              </el-table-column>
              <el-table-column align="center" width="100" property="address" label="ICON">
                <template slot-scope="scope">
                  <img alt="" :src="scope.row.service_pic" class="serivice-img">
                </template>
              </el-table-column>
              <el-table-column property="related_tmpl" label="关联板块">
                <template slot-scope="scope">
                  {{{"0":"自定义","1":"活动报名","2":"随手拍","3":"投票评选","4":"问卷调查","5":"资讯"}[scope.row.related_tmpl]}}
                </template>
              </el-table-column>
              <el-table-column v-if="perm.serviceL2Show == 1" width="80" align="center" min-width="100px" label="显示设置">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2" @change="handleTwoState(scope.row)"></el-switch>
                </template>
              </el-table-column>
              <el-table-column v-if="perm.serviceL2Index == 1" width="110" align="center" min-width="100px" label="是否首页显示">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.is_home" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2" @change="handleHomeState(scope.row)"></el-switch>
                </template>
              </el-table-column>
              <el-table-column v-if="perm.serviceL2Down == 1&&type!=0&&type!=1" width="80" align="center" label="是否下沉">
                <template slot-scope="scope">
                  <el-switch :disabled="scope.row.is_mine != 1" v-model="scope.row.is_sink" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2" @change="handleServiceSink(scope.row)"></el-switch>
                </template>
              </el-table-column>
              <el-table-column v-if="perm.serviceL2Sync == 1" width="80" align="center" label="是否同步">
                <template slot-scope="scope">
                  <el-switch :disabled="scope.row.related_tmpl != 5 ||scope.row.is_mine != 1" v-model="scope.row.category.as_category" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2" @change="handleSyncNewsService(scope.row)"></el-switch>
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" min-width="100px" label="推荐设置">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.is_recom" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2" @change="handleIsRecom(scope.row)"></el-switch>
                </template>
              </el-table-column> -->
              <el-table-column v-if="perm.serviceL2Sort == 1" width="120" label="排序" align="center">
                <template slot-scope="scope">
                  <el-input-number style="width:100px" v-model="scope.row.sort" :precision="0" @change="setViews(scope.row.service_id,$event)" controls-position="right" :min="0" :max="127" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column min-width="160px" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-if="perm.serviceL3Add == 1" size="small" icon="el-icon-plus" :disabled="!(scope.row.related_tmpl == 5&&scope.row.is_mine==1)" circle @click="releaseClick(scope.row)"></el-button>

                  <el-button v-if="perm.serviceL2Edit == 1" :disabled="scope.row.is_mine != 1" size="small" type="primary" icon="el-icon-edit-outline" circle="circle" @click="openLevelTwo(scope.row,2)"></el-button>

                  <el-button v-if="perm.serviceL2Dele == 1" size="small" type="danger" icon="el-icon-delete" circle @click="handleLevelTwoDelete(scope.row)"></el-button>

                  <!-- <el-button v-if="scope.$index != 0" @click="subTabArrSort.sortUp(scope.$index,props.row.service_list)" class="sort-icon-left" size="small" icon="el-icon-sort-up" circle></el-button>
                  <el-button v-if="scope.$index != props.row.service_list.length -1" @click="subTabArrSort.sortDown(scope.$index,props.row.service_list)" class="sort-icon-right" size="small" icon="el-icon-sort-down" circle></el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" label="服务类目名称" prop="category_name">
        </el-table-column>
        <el-table-column v-if="perm.serviceL1Show == 1" min-width="100px" align="center" label="显示设置">
          <template slot-scope="scope">
            <el-switch :disabled="scope.row.is_mine != 1" v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2" @change="handleOneState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column v-if="perm.serviceL1Sort == 1" min-width="160px" label="排序" align="center">
          <template slot-scope="scope">
            <el-input-number :disabled="scope.row.is_mine != 1" v-model="scope.row.sort" :precision="0" @change="setClassSort(scope.row.category_id,$event)" controls-position="right" :min="0" :max="127" size="mini"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="180px" label="操作" prop="desc">
          <template slot-scope="scope">
            <el-button v-if="perm.serviceL2Add == 1" :disabled="scope.row.is_mine != 1" size="small" icon="el-icon-plus" circle @click="openLevelTwo(scope.row,1)"></el-button>

            <el-button v-if="perm.serviceL1Edit == 1" :disabled="scope.row.is_mine != 1" size="small" type="primary" icon="el-icon-edit-outline" circle="circle" @click="openLevel(scope.row,2)"></el-button>

            <el-button v-if="perm.serviceL1Dele == 1" size="small" type="danger" icon="el-icon-delete" circle @click="handleLevelOneDelete(scope.row)"></el-button>

            <!-- <el-button v-if="scope.$index != 0" @click="sortArr.sortUp(scope.$index)" class="sort-icon-left" size="small" icon="el-icon-sort-up" circle></el-button>
            <el-button v-if="scope.$index != tableData.length -1" @click="sortArr.sortDown(scope.$index)" class="sort-icon-right" size="small" icon="el-icon-sort-down" circle></el-button> -->
          </template>
        </el-table-column>
      </el-table>

    </el-card>
    <level-one :dialogVisibleBefore.sync="dialogVisible" :dataForm="dataForm" :title="title" :statuts="statutsOne" @sure="handleSussuce" />
    <level-two :dialogVisibleBefore.sync="dialogVisibleTwo" :dataForm="dataFormTwo" :title="titleTwo" :statuts="statutsTwo" @sure="handleSussuceTwo" />
    <!-- 发布添加 -->
    <el-dialog :title="formTitle" :visible.sync="releaseDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="分类名称：" :label-width="formLabelWidth" prop="attr_value">
          <el-input v-model="ruleForm.attr_value" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类描述：" :label-width="formLabelWidth" prop="extra">
          <el-input v-model="ruleForm.extra" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="releaseDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="btnMark">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
  </div>

</template>

<script>
// service 数据接口
/**
 * 1 一级类目列表，一级类目状态切换
 */
import {
  RequestServiceManagerList,
  RequestServiceCategoryState,
  RequestServiceCategoryDelete,
  RequestServiceDelete,
  RequestServiceDetail,
  RequestServiceSort,
  RequestServiceRecom,
  RequestServiceState,
  RequestServiceHome,
  RequestSyncNewsServiceToCategory,
  RequestServiceSink
} from "@/fetch/modules/service";

import { RequestModuleSort, DeleteNewsClassfiy, RequestClassfiyEdit, RequestClassfiyAdd, RequestClassfiyDetail } from "@/fetch/modules/info";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";

// 自定义组件（）
import levelOne from "./components/levelOne";
import levelTwo from "./components/levelTwo";
import { arraySort } from "@/utils/index.js";
import { getRole, getAdminType } from "@/utils/auth";
const rules = {
  name: [{ required: true, message: "请输入资讯标题", trigger: "blur" }, { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }],
  attr_value: [{ required: true, message: "请输入分类名称", trigger: "blur" }, { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }],
  extra: [{ min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }]
};

let self;
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
  components: { levelOne, levelTwo, ChooseTab },
  data() {
    self = this;
    return {
      type: "",
      perm: {
        serviceL1Add: 2, // 添加一级服务
        serviceL1Edit: 2, // 编辑一级服务
        serviceL1Dele: 2, // 删除一级服务
        serviceL1Show: 2, // 一级服务显示设置
        serviceL1Sort: 2, // 一级服务排序

        serviceL2Show: 2, // 二级服务显示
        serviceL2Index: 2, // 二级服务是否首页显示
        serviceL2Down: 2, // 二级服务是否下沉
        serviceL2Sync: 2, // 二级服务是否同步
        serviceL2Sort: 2, // 二级服务排序

        serviceL2Add: 1, // 二级服务添加
        serviceL2Edit: 1, // 二级服务编辑
        serviceL2Dele: 1, // 二级服务删除

        serviceL3Add: 1, // 三级服务添加
        serviceL3Edit: 1, // 三级服务编辑
        serviceL3Dele: 1 //  三级服务删除
      },
      rules,
      formTitle: "添加分类",
      btnMark: false,
      value2: true,
      tableData: [],
      /**
       * 1。一级分类
       */
      dialogVisible: false,
      releaseDialog: false,
      title: "",
      dataForm: {
        category_name: "",
        category_id: ""
      },
      statutsOne: "",
      /**
       * 1. 二级分类
       */
      dialogVisibleTwo: false,
      titleTwo: "",
      ruleForm: {
        category_id: "",
        attr_id: "",
        attr_value: "",
        extra: "",
        pid: 0
      },
      formLabelWidth: "120px",
      baseUrl: "https://img.sqydt.darongshutech.com/",
      dataFormTwo: {
        service_title: "", // 服务名称
        service_pic: "", // 服务ICON
        service_desc: "", // 服务描述
        category_id: "", // 服务分类ID 上级
        // service_type: "2", // 服务类型： 1系统(平台端默认) 2自定义（其他端默认）
        need_audit: "2", // 是否需要审核 1是 2否
        related_tmpl: "5", // 关联板块  0不关联模板 1活动报名 2随手拍 3投票评选 4问卷调查
        // service_id: "", // 服务ID 本级

        service_app_state: "2", // app端是否开通 1开通 2不开通
        service_app_url: "", // 跳转参数
        service_app_run: "0", // app端跳转方式 0不跳转 1原生 2H5

        service_web_state: "2", // 网页端是否开通 1开通 2不开通
        service_web_url: "", // 跳转参数
        service_web_run: "0", // 网页端跳转方式 0不跳转 1原生 2H5

        service_mini_state: "2", // 小程序是否开通 1开通 2不开通
        service_mini_url: "", // 跳转参数  service_mini_run=3时传 {"app-id":"","path":""}
        service_mini_run: "0", // 小程序端跳转方式 0不跳转 1原生 2H5 3小程序4 APP

        "app-id": "", // 小程序ID
        path: "" // 小程序路径
      },
      statutsTwo: "",
      timer: null,
      newsTop: {},
      role: getRole(),
      adminType: getAdminType()
      // sortArr: null,
      // subTabArrSort: null
    };
  },
  created() {
    this.type = JSON.parse(localStorage.getItem("loginPermissionData")).type;
    this.getData();
  },
  mounted() {
    if (localStorage.loginPermissionData) {
      this.newsTop = JSON.parse(localStorage.loginPermissionData).sys_default_conf;
    }
  },
  methods: {
    getData() {
      let args = {};
      RequestServiceManagerList(args).then(res => {
        // console.log("res", res);
        !!res.data &&
          res.data.map((items, index) => {
            if ("status" in items) {
              items.status = items.status.toString();
            }
            if ("service_list" in items) {
              items.service_list.map((value, j) => {
                // console.log(value, "val");
                value.status = value.status.toString();
                if ("category" in value) {
                } else {
                  value["category"] = [];
                }
              });
            }
          });
        this.tableData = res.data;
        // this.sortArr = Object.create(arraySort);
        // this.subTabArrSort = Object.create(arraySort);
        // this.sortArr.init(this.tableData);
      });
    },
    //同步
    handleSyncNewsService(row) {
      var args = {
        service_id: row.service_id,
        category_id: row.category.category_id
      };
      RequestSyncNewsServiceToCategory(args).then(res => {
        if (res.code != 2000) {
          this.getData();
        }
      });
    },
    //服务下沉
    handleServiceSink(row) {
      var args = {
        service_id: row.service_id
      };
      RequestServiceSink(args).then(res => {
        if (res.code !== 2000) {
          this.$message.error(res.msg);
          this.getData();
        }
      });
    },
    //删除
    deleteClassfiy(row) {
      var attr_id = row.attr_id;
      this.deleteFn(attr_id);
    },
    //删除请求
    deleteFn(attr_id) {
      this.$confirm("此操作将删除选中分类和相关资讯, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          DeleteNewsClassfiy({ attr_id: attr_id }).then(res => {
            this.getData();
            this.$Message({
              type: "success",
              text: "删除成功!"
            });
          });
        })
        .catch(() => {});
    },
    // 添加
    releaseClick(row) {
      var ruleForm = this.ruleForm;
      for (var i in ruleForm) {
        ruleForm[i] = "";
      }
      ruleForm.category_id = row.category.category_id;
      this.oprateStatus = 2;
      this.ruleForm = ruleForm;
      this.releaseDialog = true;
      this.formTitle = "分类添加";
    },
    //编辑信息
    handEditor(row) {
      const attr_id = row.attr_id;
      this.formTitle = "分类编辑";
      RequestClassfiyDetail({ attr_id: attr_id }).then(res => {
        this.ruleForm = res;
        this.oprateStatus = 1;
        this.releaseDialog = true;
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
            RequestClassfiyEdit(args).then(res => {
              oprateFn(res);
            });
          } else {
            RequestClassfiyAdd(args).then(res => {
              oprateFn(res);
              if (res.code == 2000) {
                this.objSearch.current_page = 1;
              }
            });
          }
          function oprateFn(res) {
            _this.releaseDialog = false;
            _this.btnMark = false;
            if (res.code == 2000) {
              _this.$Message({
                type: "success",
                text: "操作成功"
              });
              _this.getData();
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
    // 是否下沉
    handleSinkState(row) {
      RequestServiceState({ service_id: row.service_id }).then(res => {
        if (res.code === 2000) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
          this.getData();
        }
        // this.getData();
      });
    },
    // table header 样式修改
    headerName({ row, rowIndex }) {
      return ".el-table th";
    },
    // 服务类目弹框打开（包含编辑/添加）
    openLevel(row, index) {
      if (index == 2) {
        this.title = "编辑服务类目";
        this.statutsOne = "2";
        let _data = {
          category_name: row.category_name,
          category_id: row.category_id
        };
        this.dataForm = Object.assign(this.dataForm, _data);
      } else {
        this.title = "添加服务类目";
        this.statutsOne = "1";
        for (let i in this.dataForm) {
          this.dataForm[i] ? (this.dataForm[i] = "") : "";
        }
      }
      this.dialogVisible = true;
    },
    // 服务二级类目打开（包含编辑/添加）
    openLevelTwo(row, index) {
      if (index == 2) {
        this.titleTwo = "编辑下级服务类目";
        this.statutsTwo = "2";
        RequestServiceDetail({ service_id: row.service_id }).then(res => {
          // console.log("RequestServiceDetail", res);
          if (res.service_mini_run == 3) {
            res["app-id"] = res.service_mini_url["app-id"];
            res["path"] = res.service_mini_url["path"];
            res["service_mini_url"] = "";
          }

          this.dataFormTwo = Object.assign(this.dataFormTwo, res);
          this.dataFormTwo.need_audit = String(this.dataFormTwo.need_audit);
          // console.log("RequestServiceDetail22", this.dataFormTwo);
          this.dialogVisibleTwo = true;
        });
      } else {
        this.titleTwo = "添加下级服务类目";
        this.statutsTwo = "1";
        // 清空数据
        for (let i in this.dataFormTwo) {
          this.dataFormTwo[i] ? (this.dataFormTwo[i] = "") : "";
        }
        // 初始化添加数据
        this.dataFormTwo = Object.assign(this.dataFormTwo, {
          category_id: row.category_id,
          related_tmpl: "5", // 关联板块
          need_audit: "2", // 随手拍类型
          service_app_run: "0", // app端跳转方式 0不跳转 1原生 2H5
          service_web_run: "0", // 网页端跳转方式 0不跳转 1原生 2H5
          service_mini_run: "0", // 小程序端跳转方式 0不跳转 1原生 2H5 3小程序 4 APP
          service_app_state: "2", // app端是否开通 1开通 2不开通
          service_web_state: "2", // 网页端是否开通 1开通 2不开通
          service_mini_state: "2" // 小程序是否开通 1开通 2不开通
        });

        this.dialogVisibleTwo = true;
      }
    },
    // 一级类目删除
    handleLevelOneDelete(row) {
      if (row.service_list.length != 0) {
        this.$message.error("该服务类目下有二级服务，请先删除二级服务！！！");
        return false;
      }
      self
        .$confirm("此操作将永久删除该服务类目, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          RequestServiceCategoryDelete({ category_id: row.category_id }).then(res => {
            if (res.code == 2000) {
              // this.getData();
              setTimeout(function() {
                // _self.$router.go(0);
                window.location.reload();
              }, 200);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 二级服务删除
    handleLevelTwoDelete(row) {
      this.$confirm("此操作将永久删除该服务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestServiceDelete({ service_id: row.service_id }).then(res => {
            // console.log(res);
            if (res.code === 2000) {
              // self.$message.success(res.msg);
              // this.tableData.map((item, index) => {
              //   if ("service_list" in item && item.service_list.length != 0) {
              //     item.service_list.map((val, i) => {
              //       if (val.service_id == row.service_id) {
              //         item.service_list.splice(i, 1);
              //       }
              //     });
              //   }
              // });
              // self.getData();
              // self.$router.go(0);
              setTimeout(function() {
                // _self.$router.go(0);
                window.location.reload();
              }, 200);
            } else {
              self.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 一级类目状态切换（显示设置）
    handleOneState(row) {
      // console.log(";ssssss", row);
      RequestServiceCategoryState({ category_id: row.category_id }).then(res => {
        if (res.code === 2000) {
          this.$message(res.msg);
        } else {
          this.$message.error(res.msg);
        }
        this.getData();
      });
    },
    // 二级类目状态切换（显示设置）
    handleTwoState(row) {
      RequestServiceState({ service_id: row.service_id }).then(res => {
        if (res.code === 2000) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
          this.getData();
        }
        // this.getData();
      });
    },
    // 二级类目状态切换（首页显示设置）
    handleHomeState(row) {
      RequestServiceHome({ service_id: row.service_id }).then(res => {
        if (res.code === 2000) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
          this.getData();
        }
        // this.getData();
      });
    },
    // 二级类目是否推荐
    handleIsRecom(row) {
      RequestServiceRecom({ service_id: row.service_id }).then(res => {
        if (res.code === 2000) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
          this.getData();
        }
      });
    },
    handleSussuce() {
      this.getData();
    },
    handleSussuceTwo() {
      this.getData();
    },
    setViews(id, e) {
      const self = this;
      if (self.timer) clearTimeout(self.timer);
      self.timer = setTimeout(function() {
        RequestServiceSort({
          service_id: id,
          sort: e
        }).then(res => {
          // console.log("RequestServiceSort", res);
          if (res.code == 2000) {
            self.$message({
              type: "success",
              message: res.msg
            });
          }
        });

        self.timer = null;
      }, 300);
    },
    setClassSort(id, e) {
      const self = this;
      if (self.timer) clearTimeout(self.timer);
      self.timer = setTimeout(function() {
        RequestModuleSort({
          category_id: id,
          sort: e
        }).then(res => {
          // console.log("RequestClassfiyEdit", res);
          if (res.code == 2000) {
            self.$message({
              type: "success",
              message: res.msg
            });
          }
        });

        self.timer = null;
      }, 300);
    }
  }
};
</script>
<style  rel="stylesheet/scss" lang="scss" >
.sort-icon-left {
  padding: 9px 13px 9px 7px !important;
}
.sort-icon-right {
  padding: 9px 5px 9px 13px !important;
}

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
  .serivice-img {
    width: 50px;
    height: 50px;
    border: 1px #f2f2f2 solid;
    border-radius: 50px;
    // background: #f2f2f2;
    overflow: hidden;
  }
}
.el-table th {
  // background: #f5f7fa !important;
  // font-size: 16px;
  // color: #999;
}
</style>

