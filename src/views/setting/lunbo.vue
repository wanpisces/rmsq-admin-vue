<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="轮播名称" v-model="objSearch.q"></el-input>
        </div>
        <div class="search ">
          <el-button type="primary" icon="el-icon-search" @click='searchKeyword'>搜索</el-button>
        </div>
      </div>
    </el-card>
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <el-popover ref="popover2" placement="bottom" width="100" trigger="click">
          <div class="table-choose">
            <p>
              <i class="el-icon-tickets icon-font"></i> 显示列表定制</p>
            <p>
              <i class="el-icon-upload2 icon-font"></i>时间升序</p>
            <p>
              <i class="el-icon-download icon-font"></i>时间降序</p>
          </div>
        </el-popover>
        <div class="table-title">
          <div>
            <el-button type="danger" v-if="perm.bannerDele==1" plain @click="batchDelete" :disabled="deleteMark">删除</el-button>
            <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
          </div>
          <div>
            <span v-if="perm.bannerAdd==1">
              <choose-tab @handleShowDliog="handleShowDliog" add-title="轮播新增" @handleAdd="releaseClick" @TimeOn="TimeOn">
              </choose-tab>
            </span>
            <span v-else>
              <choose-tab @handleShowDliog="handleShowDliog" @TimeOn="TimeOn">
              </choose-tab>
            </span>

          </div>
        </div>
        <el-table :data="tableData" border ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="banner_title" label="轮播名称/描述" align="center">
          </el-table-column>
          <el-table-column prop="banner_pic" label="轮播图片" align="center" width="134">
            <template slot-scope="scope">
              <img class="img-resopnse" v-if="scope.row.banner_pic" :src="scope.row.banner_pic">
            </template>
          </el-table-column>
          <el-table-column prop="inst_name" label="来源" align="center">
          </el-table-column>
          <el-table-column prop="sort" label="排序" align="center">
          </el-table-column>
          <el-table-column prop="create_time" label="发布时间" align="center">
          </el-table-column>
          <el-table-column align="center" min-width="100px" label="是否下沉" v-if="perm.bannerDown==1">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.is_sink" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2" @change="handleSinkState(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作选项" width="150" align="center" v-if="perm.bannerState==1||perm.bannerEdit==1">
            <template slot-scope="scope">
              <el-button v-if="active == 1&&perm.bannerState==1" @click="onOfflineClick(scope.row)" type="text" size="small">取消发布</el-button>
              <el-button v-if="active == 2&&perm.bannerState==1" @click="onOfflineClick(scope.row)" type="text" size="small">发布</el-button>
              <el-button type="text" size="small" v-if="perm.bannerEdit==1" @click="handEditor(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div align="right" class="lunbo-bottom">
          <!-- <span v-if="adminType!=2">
            <span v-if="adminType==0 || adminType==1">温馨提示:您可以发布{{{0:newsTop.BANNER_NUM_SYS,1:newsTop.BANNER_NUM_COMMUNITY ,2:newsTop.BANNER_NUM_STREET ,3:newsTop.BANNER_NUM_AREA ,4:newsTop.BANNER_NUM_CITY ,5:newsTop.BANNER_NUM_PROVINCE } [role]}}条轮播,下沉{{{0:newsTop.SINK_ALL_BANNER_SYS,1:newsTop.SINK_ALL_BANNER_COMMUNITY ,2:newsTop.SINK_ALL_BANNER_STREET ,3:newsTop.SINK_ALL_BANNER_AREA ,4:newsTop.SINK_ALL_BANNER_CITY ,5:newsTop.SINK_ALL_BANNER_PROVINCE } [role]}}条轮播,超过数量限制会把最先发布(下沉)的轮播自动下线。</span>

            <span v-if="adminType==3">温馨提示:您可以发布{{{0:newsTop.AGENT_TOP_RECOM_NEWS_SYS,1:newsTop.AGENT_TOP_RECOM_NEWS_COMMUNITY ,2:newsTop.AGENT_TOP_RECOM_NEWS_STREET ,3:newsTop.AGENT_TOP_RECOM_NEWS_AREA ,4:newsTop.AGENT_TOP_RECOM_NEWS_CITY ,5:newsTop.AGENT_TOP_RECOM_NEWS_PROVINCE } [role]}}条轮播,下沉{{{0:newsTop.SINK_AGENT_BANNER_SYS,1:newsTop.SINK_AGENT_BANNER_COMMUNITY ,2:newsTop.SINK_AGENT_BANNER_STREET ,3:newsTop.SINK_AGENT_BANNER_AREA ,4:newsTop.SINK_AGENT_BANNER_CITY ,5:newsTop.SINK_AGENT_BANNER_PROVINCE } [role]}}条轮播,超过数量限制会把最先发布(下沉)的轮播自动下线。</span>
          </span> -->

          <el-pagination background @current-change="pageChange" :current-page.sync="objSearch.current_page" :page-size="objSearch.page_size" layout="total,prev, pager, next, jumper" :total="count">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog :title="formTitle" :visible.sync="releaseDialog" :close-on-click-modal="false" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px">
        <el-form-item label="" prop="banner_id" style="display:none">
          <el-input v-model="form.banner_id" auto-complete="off" type="hidden"></el-input>
        </el-form-item>
        <el-form-item label="标题：" prop="banner_title">
          <el-input v-model="form.banner_title" auto-complete="off" placeholder="标题不超过30个字符"></el-input>
        </el-form-item>
        <el-form-item label="图片：" prop="banner_pic">
          <!-- <el-upload class="upload-demo" drag action="..." multiple :before-upload="bannerBeforeUploadImage">
            <img v-if="form.banner_pic" :src="img_banner_pic" class="avatar">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传jpg、jpeg、png、bmp、gif文件（建议上传大小不超过2M，宽750px，高360px尺寸）</div>
          </el-upload> -->
          <vue-cropper @change="callBackImg" :fixedRatio='[2,1]' :cropWidth="400" :cropHeight="200">
          </vue-cropper>
          <div v-if="form.banner_pic" style="margin-top:8px">
            <img :src="baseUrl+form.banner_pic" width="400" height="200" alt="">
          </div>
        </el-form-item>
        <!-- <el-form-item label="跳转方式：" :label-width="formLabelWidth" prop="banner_run_type">
          <template>
            <el-radio v-model="form.banner_run_type" label="1">H5</el-radio>
            <el-radio v-model="form.banner_run_type" label="2">原生</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="url：" :label-width="formLabelWidth" prop="banner_web_url">
          <el-input v-model="form.banner_web_url" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="排序：">
          <el-input-number v-model="form.sort" :precision="0" controls-position="right" :min="1" :max="9999"></el-input-number>
        </el-form-item>
        <div class="daliog-line "> </div>
        <el-form-item label="小程序端是否显示" prop="banner_mini_state" :rules="[{ required: true, message: '请选择'}]">
          <el-switch @change="handleChangeMini" v-model="form.banner_mini_state" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="小程序跳转方式：" prop="banner_mini_run" :rules="[{ required: true, message: '请选择跳转方式'}]" v-if="form.banner_mini_state==1">
          <el-radio-group v-model="form.banner_mini_run" @change="handleChangeMiniRedio">
            <el-radio label="0">不跳转</el-radio>
            <el-radio label="2">H5</el-radio>
            <el-radio label="1">原生</el-radio>
            <el-radio label="3">小程序 </el-radio>
          </el-radio-group>
          <div v-if="(form.banner_mini_run==1 || form.banner_mini_run==2)&&form.banner_mini_state==1">
            <div>链接地址</div>
            <el-form-item prop="banner_mini_url" :rules="[{ required: true, message: '请输入链接地址',trigger: 'blur'}]">
              <el-input placeholder="请输入链接地址" v-model="form.banner_mini_url"></el-input>
            </el-form-item>
          </div>
          <div v-if="(form.banner_mini_run==3)&&form.banner_mini_state==1">
            <div v-if="form.banner_mini_run==3" style="margin:15px 0">
              <div>小程序选择：</div>
              <el-form-item prop="app-id" :rules="[{ required: true, message: '请选择小程序'}]">
                <el-select v-model="form['app-id']" placeholder="请选择" size="small" @change="handleSelectAppId">
                  <el-option v-for="item in miniList" :key="item.app_id" :label="item.app_name" :value="item.app_id">
                  </el-option>
                </el-select>
              </el-form-item>

            </div>
            <div>选择小程序地址:</div>
            <el-form-item prop="path" :rules="[{ required: true, message: '请选择小程序地址'}]">
              <el-select v-model="form.path" placeholder="请选择小程序地址">
                <el-option v-for="item in  routeData" :key="item.route_path" :label="item.route_name" :value="item.route_path">
                </el-option>
              </el-select>
            </el-form-item>

          </div>

        </el-form-item>
        <!-- <div class="daliog-line "> </div>
        <el-form-item label="web端是否显示" prop="banner_web_state" :rules="[{ required: true, message: '请选择'}]">
          <el-switch @change="handleChangeH5" v-model="form.banner_web_state" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="Web跳转方式：" prop="banner_web_run" :rules="[{ required: true, message: '请选择跳转方式'}]" v-if="form.banner_web_state==1 ">
          <el-radio-group v-model="form.banner_web_run" @change="handleChangeH5Redio">
            <el-radio label="0">不跳转</el-radio>
            <el-radio label="2">H5</el-radio>
            <el-radio label="1">原生</el-radio>
          </el-radio-group>
          <div v-if="(form.banner_web_run==1 || form.banner_web_run==2)&&form.banner_web_state==1 ">
            <div>链接地址</div>
            <el-form-item prop="banner_web_url" :rules="[{ required: true, message: '请输入链接地址',trigger: 'blur'}]">
              <el-input placeholder="请输入链接地址" v-model="form.banner_web_url"></el-input>
            </el-form-item>
          </div>

        </el-form-item> -->
        <!-- <div class="daliog-line "> </div>
        <el-form-item label="App端是否显示" prop="banner_app_state" :rules="[{ required: true, message: '请选择'}]">
          <el-switch @change="handleChangeApp" v-model="form.banner_app_state" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="App跳转方式：" prop="banner_app_run" :rules="[{ required: true, message: '请选择跳转方式'}]" v-if="form.banner_app_state==1">
          <el-radio-group v-model="form.banner_app_run" @change="handleChangeAppRedio">
            <el-radio label="0">不跳转</el-radio>
            <el-radio label="2">H5</el-radio>
            <el-radio label="1">原生</el-radio>
          </el-radio-group>
          <div v-if="(form.banner_app_run==1 || form.banner_app_run==2)&&form.banner_app_state==1 ">
            <el-form-item prop="banner_app_url" :rules="[{ required: true, message: '请输入链接地址',trigger: 'blur'}]">
              <el-input placeholder="请输入链接地址" v-model="form.banner_app_url"></el-input>
            </el-form-item>

          </div>
        </el-form-item> -->
        <el-form-item align="right">
          <el-button @click="handleReset('form')">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')" :disabled="btnMark">确 定</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { RequestUploads, RequestMiniList } from "@/fetch/modules/public.js";
import MoPaging from "@/components/Paginations.vue";
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue";
import VueCropper from "@/components/uploadImg/uploadCropper";
// import VueCropper from "vue-cropper";
import { RequestBnnerList, RequestBnnerAdd, RequestBnnerOnline, RequestBnnerEdit, RequestLunboDetail, RequestDeleteBanner, RequestBnnerSink } from "@/fetch/modules/setting";
import { getRole, getAdminType } from "@/utils/auth";
const rules = {
  banner_title: [{ required: true, message: "请输入轮播标题", trigger: "blur" }, { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }],
  banner_pic: [{ required: true, message: "请选择网页封面 ", trigger: "blur" }],
  banner_web_url: [{ required: true, message: "请选择网页端跳转参数 ", trigger: "blur" }]
};
export default {
  components: { MoPaging, ChooseTab, VueCropper },
  beforeRouteEnter(to, from, next) {
    console.log(to);
    next(vm => {
      console.log(to.meta.perm);
      to.meta.perm.forEach((item, index) => {
        if (vm.perm[item.perm_name]) {
          vm.perm[item.perm_name] = item.is_select; // 2-不显示 1-显示
        }
      });
    });
  },
  data() {
    return {
      // 按钮权限字段管理 2 不显示 ，1显示
      perm: {
        bannerAdd: 2, // 新增栏目
        bannerEdit: 2, // 编辑栏目
        bannerState: 2, // 停用、启用栏目
        bannerDown: 2, // 下沉栏目
        bannerDele: 2
      },
      rules,
      formTitle: "",
      dialogTitle: "投放",
      releaseDialog: false, //
      oprateStatus: 2, //1为编辑，2为添加
      active: 1,
      switchData: [{ name: "已上线", active: "1" }, { name: "已下线", active: "2" }],
      value: "",
      tableData: [],
      objSearch: {
        current_page: 1,
        page_size: 5,
        q: "",
        status: 1,
        order_time: 2
      },
      count: 0,
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        IMAGE_HOST: "",
        banner_id: "",
        banner_title: "",
        banner_pic: "",
        banner_run_type: 1,
        catbanner_web_url: "",
        sort: 1,
        banner_desc: "", // 服务描述
        banner_app_state: "1", // app端是否开通 1开通 2不开通
        banner_app_url: "", // 跳转参数
        banner_app_run: "0", // app端跳转方式 0不跳转 1原生 2H5
        banner_web_state: "1", // 网页端是否开通 1开通 2不开通
        banner_web_url: "", // 跳转参数
        banner_web_run: "0", // 网页端跳转方式 0不跳转 1原生 2H5
        banner_mini_state: "1", // 小程序是否开通 1开通 2不开通
        banner_mini_url: "", // 跳转参数  banner_mini_run=3时传 {"app-id":"","path":""}
        banner_mini_run: "0", // 小程序端跳转方式 0不跳转 1原生 2H5 3小程序:{“app-id”:””,”path”:””} 4 APP
        "app-id": "",
        path: ""
      },
      formLabelWidth: "120px",
      multipleSelection: [],
      deleteMark: true,
      img_banner_pic: "",
      routeData: [],
      btnMark: false,

      // 控制h5和原生回显
      mini_h5_url: "",
      mini_native_url: "",
      web_h5_url: "",
      web_native_url: "",
      app_h5_url: "",
      app_native_url: "",
      newsTop: {},
      role: getRole(),
      adminType: getAdminType(),
      baseUrl: "https://img.sqydt.darongshutech.com/"
    };
  },
  created() {
    console.log("getAdminType()", getAdminType());
    var args = this.objSearch;
    this.getListData(args);
    this.miniData();
  },
  mounted() {
    if (localStorage.loginPermissionData) {
      this.newsTop = JSON.parse(localStorage.loginPermissionData).sys_default_conf;
    }
  },
  watch: {
    // 监听 path 变化
    "form.path"() {
      this.miniList.map((item, index) => {
        if (item.app_id == this.form["app-id"]) {
          this.routeData = item.route_list;
        }
      });
    },
    releaseDialog(val) {
      console.log("releaseDialog", val);
      if (val) {
        if (this.form.banner_web_run == "1") {
          this.web_native_url = this.form.banner_web_url;
        } else if (this.form.banner_web_run == "2") {
          this.web_h5_url = this.form.banner_web_url;
        }

        if (this.form.banner_mini_run == "1") {
          this.mini_native_url = this.form.banner_mini_url;
        } else if (this.form.banner_mini_run == "2") {
          this.mini_h5_url = this.form.banner_mini_url;
        }

        if (this.form.banner_app_run == "1") {
          this.app_native_url = this.form.banner_app_url;
        } else if (this.form.banner_app_run == "2") {
          this.app_h5_url = this.form.banner_app_url;
        }
      } else {
        this.mini_h5_url = "";
        this.mini_native_url = "";
        this.web_h5_url = "";
        this.web_native_url = "";
        this.app_h5_url = "";
        this.app_native_url = "";
      }
    }
    // "form.banner_app_run"() {
    //   // console.log(this.form.banner_app_run);
    //   if (this.form.banner_app_run == "0") this.form.banner_app_state = "2";
    // },
    // "form.banner_web_run"() {
    //   // console.log(this.form.banner_web_run);
    //   if (this.form.banner_web_run == "0") this.form.banner_web_state = "2";
    // },
    // "form.banner_mini_run"() {
    //   // console.log(this.form.banner_mini_run);
    //   if (this.form.banner_mini_run == "0") this.form.banner_mini_state = "2";
    // }
  },
  methods: {
    /**
     * 1小程序列表
     */
    miniData() {
      RequestMiniList({}).then(res => {
        this.miniList = res;
      });
    },
    // 是否下沉
    handleSinkState(row) {
      RequestBnnerSink({ banner_id: row.banner_id }).then(res => {
        if (res.code === 2000) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
          this.getData();
        }
        // this.getData();
      });
    },
    handleClose() {
      this.handleReset("form");
    },
    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      var args = this.objSearch;
      this.getListData(args);
    },
    //获取轮播列表
    getListData(args) {
      RequestBnnerList(args).then(res => {
        if (res.list.length == 0 && this.objSearch.current_page > 1) {
          this.objSearch.current_page = +this.objSearch.current_page - 1;
          this.getListData(args);
        } else {
          this.tableData = res.list;
          this.objSearch.current_page = Number(res.current_page);
          this.objSearch.page_size = Number(res.page_size);
          this.count = Number(res.total_num);
        }

        console.log(this.count);
      });
    },

    //  剪裁图片回掉
    callBackImg(status, params, data) {
      this.baseUrl = params.baseUrl;
      console.log(status, params, data);
      if (status == "uploadSuccess") {
        this.form.banner_pic = data.key;
      }
    },

    // 轮播图上传
    bannerBeforeUploadImage(file) {
      const isJPG = file.type,
        isLt2M = file.size / 1024 / 1024 < 2,
        self = this;
      var formData = new FormData();
      formData.append("file", file);
      if (isJPG == "image/jpeg" || isJPG == "image/bmp" || isJPG == "image/gif" || isJPG == "image/png" || isJPG == "image/jpeg") {
        if (isLt2M) {
          RequestUploads(formData).then(res => {
            self.form.banner_pic = res.data.key;
            this.img_banner_pic = res.data.base_url + res.data.key;
          });
        } else {
          this.$message.error("请上传2M以下图片");
        }
      } else {
        this.$message.error("请上传正确的格式图片");
        return false;
      }
    },
    // 提交表单
    submitForm(form) {
      var _this = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          this.btnMark = true;
          var args = JSON.parse(JSON.stringify(this.form));
          for (let i in args) {
            if (args[i] == "") {
              delete args[i];
            }
          }
          if (_this.oprateStatus == 1) {
            RequestBnnerEdit(args).then(res => {
              oprateFn(res);
            });
          } else {
            RequestBnnerAdd(args).then(res => {
              oprateFn(res);
              if (res.code == 2000) {
                _this.objSearch.current_page = 1;
              }
            });
          }
          function oprateFn(res) {
            _this.handleReset("form");
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
    handleReset(formName) {
      this.$refs[formName].resetFields();
      for (let i in this.form) {
        if (i != "banner_app_state" || i != "banner_web_state" || i != "banner_mini_state") {
          this.form[i] = "";
        } else {
          this.form[i] = "1";
        }
      }
      this.form.banner_web_state = "1";
      this.form.banner_mini_state = "1";
      this.form.banner_app_state = "1";
      this.form.banner_web_run = "0";
      this.form.banner_mini_run = "0";
      this.form.banner_app_run = "0";
      this.releaseDialog = false;
    },
    //切换组件函数
    switchFnSelf(opt) {
      console.log(opt.active, "aaa");
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
    // 添加
    releaseClick() {
      this.releaseDialog = true;
      // var form = this.form;
      // for (var i in form) {
      //   form[i] = "";
      // }
      this.oprateStatus = 2;
      // this.form = form;
      this.formTitle = "轮播添加";
    },
    //编辑信息
    handEditor(row) {
      const banner_id = row.banner_id;
      this.formTitle = "轮播编辑";
      RequestLunboDetail({ banner_id: banner_id }).then(res => {
        if (res.banner_mini_run == 3) {
          res["app-id"] = res.banner_mini_url["app-id"];
          res["path"] = res.banner_mini_url["path"];
          res.banner_mini_url = "";
        } else {
          res["app-id"] = "";
          res["path"] = "";
        }
        this.form = Object.assign(this.form, res);
        this.img_banner_pic = res.IMAGE_HOST + res.banner_pic;
        (this.oprateStatus = 1), (this.releaseDialog = true);
      });
    },
    // 上下线
    onOfflineClick(data) {
      RequestBnnerOnline({ banner_id: data.banner_id }).then(res => {
        var args = this.objSearch;
        this.$Message({
          type: "success",
          text: "操作成功"
        });
        this.getListData(args);
      });
    },
    // 上下线切换
    switchFn(active) {
      this.objSearch.current_page = 1;
      this.objSearch.status = active;
      this.active = active;
      var args = this.objSearch;
      this.getListData(args);
    },
    handleSelectionChange(val) {
      console.log(val);
      // for (var i = 0; i < val.length; i++) {
      //   this.multipleSelection.push(val[i].banner_id);
      // }
      this.multipleSelection = val;
      if (val.length <= 0) {
        this.deleteMark = true;
      } else {
        this.deleteMark = false;
      }
    },
    // 批量删除
    tabelDelete() {
      var banner_id = "";
      for (var i = 0; i < this.multipleSelection.length; i++) {
        banner_id += this.multipleSelection[i] + ",";
      }
      console.log();
      return;
      this.deleteFn(banner_id);
    },
    //删除
    batchDelete(row) {
      let banner_id = [];
      for (var i = 0; i < this.multipleSelection.length; i++) {
        banner_id.push(this.multipleSelection[i].banner_id);
      }
      // var banner_id = row.category_id;
      this.deleteFn(banner_id.toString());
    },
    handleShowDliog() {
      this.releaseDialog = true;
    },
    //删除请求
    deleteFn(banner_id) {
      var status = this.objSearch.status;
      if (status == 1) {
        this.$alert("如需删除，请先下线!", "提示", {
          confirmButtonText: "确定",
          type: "error"
        });
        return;
      }
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestDeleteBanner({ banner_id: banner_id }).then(res => {
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
    // 小程序redio选择
    handleChangeMiniRedio(value) {
      if (value == "3") {
        this.form.banner_mini_url = "";
      } else if (value == "2") {
        this.form.banner_mini_url = this.mini_h5_url;
      } else if (value == "1") {
        this.form.banner_mini_url = this.mini_native_url;
      } else {
        this.path = "";
      }
    },
    //h5redio选择
    handleChangeH5Redio(value) {
      if (value == "2") {
        this.form.banner_web_url = this.web_h5_url;
      } else if (value == "1") {
        this.form.banner_web_url = this.web_native_url;
      } else {
        this.form.banner_web_url = "";
      }
    },
    // app redio选择
    handleChangeAppRedio(value) {
      if (value == "2") {
        this.form.banner_app_url = this.app_h5_url;
      } else if (value == "1") {
        this.form.banner_app_url = this.app_native_url;
      } else {
        this.form.banner_app_url = "";
      }
    },
    // 小程序显示切换
    handleChangeMini(value) {
      value == 2 ? (this.form.banner_mini_url = "") : "";
      value == 2 ? (this.form["app-id"] = "") : "";
      value == 2 ? (this.form.path = "") : "";
      value == 2 ? (this.form.banner_mini_run = "") : "";
    },
    // 小程序redio选择
    // handleChangeMiniRedio(value) {
    //   if (value == 0) {
    //     (this.form.banner_mini_url = ""), (this.form["app-id"] = "");
    //     this.path = "";
    //   }
    //   value != 3 ? (this.form["app-id"] = "") : "";
    //   value != 3 ? (this.form.path = "") : "";
    //   value == 3 ? (this.form.banner_mini_url = "") : "";
    // },
    // H5切换
    handleChangeH5(value) {
      value == 2 ? (this.form.banner_web_url = "") : "";
      value == 2 ? (this.form.banner_web_run = "") : "";
    },
    //h5redio选择
    // handleChangeH5Redio(value) {
    //   value == 0 ? (this.form.banner_web_url = "") : "";
    // },
    // app切换
    handleChangeApp(value) {
      value == 2 ? (this.form.banner_app_url = "") : "";
      value == 2 ? (this.form.banner_app_run = "") : "";
    },
    // app redio选择
    // handleChangeAppRedio(value) {
    //   value == 0 ? (this.form.banner_app_url = "") : "";
    // },
    // appID选择
    handleSelectAppId(value) {
      this.form.path = "";
      this.miniList.map((item, index) => {
        if (item.app_id == value) {
          this.routeData = item.route_list;
        }
      });
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .search-box {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .daliog-line {
    height: 20px;
    border-bottom: 2px #66b1ff dotted;
    margin-bottom: 20px;
  }
  .img-resopnse {
    width: 100%;
    height: 100px;
  }
  .lunbo-bottom {
    // float: left;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 30px;
    color: rgb(249, 167, 167);
  }
  @media (min-width: 1562px) and (max-width: 1920px) {
    .img-resopnse {
      width: 80%;
    }
  }

  @media (min-width: 1920px) {
    .img-resopnse {
      width: 50%;
      text-align: center;
    }
  }
  .box-card {
    margin-bottom: 30px;
  }
  .search {
    //   width: 30%;
    display: flex;
    margin-right: 2%;
    align-items: center;
  }
  .table-list {
    margin: 10px 0;
  }
  .icon-font {
    font-size: 16px;
  }
  .table-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
  }
  .table-choose p {
    cursor: pointer;
  }
  .avatar {
    width: 100%;
    height: 100%;
  }
}
</style>

