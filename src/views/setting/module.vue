<template>
  <div class="info-container">
    <div v-if="!releaseDialog">
      <el-card class="box-card">
        <!-- 查询 -->
        <div class="search-box">
          <div class="search">
            <span>输入搜索：</span>
            <el-input style="width:200px" v-model="search.q" placeholder="按钮名称"></el-input>
          </div>

          <div class="search ">
            <el-button type="primary" icon="el-icon-search" @click="selectionCotent()">搜索</el-button>
          </div>
        </div>
      </el-card>
      <!-- tabelList -->
      <el-card class="box-card">
        <div class="table-list">

          <div class="table-title">
            <div>
              <el-button type="danger" plain :disabled="selectionValues.length===0" @click="tabelDelete()">删除</el-button>
              <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
            </div>
            <div>
              <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->
              <choose-tab @TimeOn="timeOn" @handleAdd="addModuleHandle" addTitle="按钮添加">
              </choose-tab>
            </div>

          </div>
          <el-table :data="tableData" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading" ref="table" @row-click="handleCurrentChange" @selection-change="selectionChange">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column prop="nav_title" label="按钮名称" width="180" align="center">
            </el-table-column>
            <el-table-column label="icon" align="center">
              <template slot-scope="scope">
                <img v-if="scope.row.nav_pic" :src="scope.row.nav_pic" width="50px" height="50px" alt="">
              </template>
            </el-table-column>
            <el-table-column label="所属单位" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.inst_name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="排序" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.sort}}</span>
              </template>
            </el-table-column>

            <!-- <el-table-column label="描述" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.extra}}</span>
                            </template>
                        </el-table-column> -->
            <el-table-column fixed="right" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <!-- <el-button type="text" size="small" @click="handEditor(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleState(scope.row.nav_id,scope.row.status)">{{scope.row.status==1?'禁用':'启用'}}</el-button> -->
                <div class="el-icon-wrapper">
                  <i class="el-icon-edit" @click="handEditor(scope.row)" title="编辑"></i>
                  <i :class="scope.row.status==1?'icon-ban':'icon-qiyong'" @click="handleState(scope.row)" :title="scope.row.status==1?'禁用':'启用'"></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div style="margin-left: 20px;">
              <!-- <mo-paging :page-index="current_page" :total="count" :page-size="page_size" @change="pageChange">
              </mo-paging> -->
              <el-pagination background @current-change="pageChange" :current-page.sync="current_page" :page-size="page_size" layout="total,prev, pager, next, jumper" :total="count">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 模块添加 -->
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="40%" :close-on-click-modal="false" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px" :close-on-click-modal="false">
        <el-form-item label="按钮名称:" prop="nav_title">
          <el-input v-model="form.nav_title"></el-input>
        </el-form-item>
        <el-form-item label="icon:" prop="nav_pic">
          <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :before-upload="beforeIconUpload1">
            <img v-if="addImage" :src="addImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="排序:" prop='sort'>
          <el-input-number v-model="form.sort" :precision="0" controls-position="right" :min="1" :max="9999"></el-input-number>
          <!-- <el-input-number v-model="form.sort"></el-input-number> -->
          <!-- <el-input-number v-model="editorData.sort" @change="handleChange" label="排序"></el-input-number> -->
        </el-form-item>
        <el-form-item style="display:none;" label="选择关联:" prop="inst_id">
          <el-select v-model="form.inst_id" placeholder="请选择">
            <el-option v-for="item in optionsData" :key="item.inst_id" :label="item.label" :value="item.inst_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位:" prop="inst_id" v-if="form.inst_id== 1">
          <!-- <el-select v-model="inst_id" filterable placeholder="请选择单位">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select> -->
          <!-- <el-autocomplete
                    v-model="form.company_name"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    @select="handleSelect"
                ></el-autocomplete> -->
          <div>
            <el-input @change="handleChangeText" v-model="search_name" style="width:300px"></el-input>
            <el-button slot="append" icon="el-icon-search" @click="handleChangeText"></el-button>
            <div class="aaaa" v-if="restaurants.length!=0">
              <ul style="list-style:none">
                <li v-for="(item,index) in restaurants" :key="index" @click="showText(item)" class="text-hover">
                  {{item.group_name}}
                </li>
              </ul>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="小程序端是否显示" prop="nav_mini_state" :rules="[{ required: true, message: '请选择'}]">
          <el-switch @change="handleChangeMini" v-model="form.nav_mini_state" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="小程序跳转方式：" prop="nav_mini_run" :rules="[{ required: true, message: '请选择跳转方式'}]" v-if="form.nav_mini_state==1">
          <el-radio-group v-model="form.nav_mini_run" @change="handleChangeMiniRedio">
            <el-radio label="0">不跳转</el-radio>
            <el-radio label="2">H5</el-radio>
            <el-radio label="1">原生</el-radio>
            <el-radio label="3">小程序 </el-radio>
          </el-radio-group>
          <div v-if="(form.nav_mini_run==1 || form.nav_mini_run==2)&&form.nav_mini_state==1">
            <div>链接地址</div>
            <el-form-item prop="nav_mini_url" :rules="[{ required: true, message: '请输入链接地址',trigger: 'blur'}]">
              <el-input placeholder="请输入链接地址" v-model="form.nav_mini_url"></el-input>
            </el-form-item>

          </div>
          <div v-if="(form.nav_mini_run==3)&&form.nav_mini_state==1">
            <div v-if="form.nav_mini_run==3" style="margin:15px 0">
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
        <el-form-item label="web端是否显示" prop="nav_web_state" :rules="[{ required: true, message: '请选择'}]">
          <el-switch @change="handleChangeH5" v-model="form.nav_web_state" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="Web跳转方式：" prop="nav_web_run" :rules="[{ required: true, message: '请选择跳转方式'}]" v-if="form.nav_web_state==1">
          <el-radio-group v-model="form.nav_web_run" @change="handleChangeH5Redio">
            <el-radio label="0">不跳转</el-radio>
            <el-radio label="2">H5</el-radio>
            <el-radio label="1">原生</el-radio>
          </el-radio-group>
          <div v-if="(form.nav_web_run==1 || form.nav_web_run==2)&&form.nav_web_state==1 ">
            <div>链接地址</div>
            <el-form-item prop="nav_web_url" :rules="[{ required: true, message: '请输入链接地址',trigger: 'blur'}]">
              <el-input placeholder="请输入链接地址" v-model="form.nav_web_url"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="App端是否显示" prop="nav_app_state" :rules="[{ required: true, message: '请选择'}]">
          <el-switch @change="handleChangeApp" v-model="form.nav_app_state" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="App跳转方式：" prop="nav_app_run" :rules="[{ required: true, message: '请选择跳转方式'}]" v-if="form.nav_app_state==1">
          <el-radio-group v-model="form.nav_app_run" @change="handleChangeAppRedio">
            <el-radio label="0">不跳转</el-radio>
            <el-radio label="2">H5</el-radio>
            <el-radio label="1">原生</el-radio>
          </el-radio-group>
          <div v-if="(form.nav_app_run==1 || form.nav_app_run==2)&&form.nav_app_state==1 ">
            <el-form-item prop="nav_app_url" :rules="[{ required: true, message: '请输入链接地址',trigger: 'blur'}]">
              <el-input placeholder="请输入链接地址" v-model="form.nav_app_url"></el-input>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addModule('form')" :disabled="btnMark">确 定</el-button>
          <el-button @click="handleReset('form')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import MoPaging from "../../components/Paginations.vue";
import Tinymce from "../../components/Tinymce/index.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
// import SwitchTable from "../../components/SwitchTable/index.vue"
// 数据service接口
import { RequestUploads } from "../../fetch/modules/public.js";
import { RequestQiNiutoken } from "../../fetch/tool";
import { RequestCompany, RequestMiniList } from "../../fetch/modules/public";
// import {RequestClassfiyList,RequestNewsList,RequestNewsAdd,RequestNewsEditor,RequestNewsDelete,RequestModuleList,RequestNewsOnline,RequestNewsTop} from  "../../fetch/modules/info.js"
import {
  RequestModulesList,
  RequestModulesAdd,
  RequestModulesDelete,
  RequestModulesEditor,
  RequestModulesState
} from "../../fetch/modules/setting";
// 正则匹配
const rules = {
  nav_title: [
    { required: true, message: "请输入模块名称", trigger: "blur" },
    { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
  ],
  nav_pic: [{ required: true, message: "请选择icon上传", trigger: "blur" }],
  nav_web_url: [{ required: true, message: "请选择地址", trigger: "blur" }],
  inst_id: [{ required: true, message: "请选择关联单位", trigger: "blur" }]
};
export default {
  components: { MoPaging, Tinymce, ChooseTab },
  data() {
    return {
      rules,
      search: {
        // 搜索条件
        q: "", // 搜索条件
        order_time: 2, // 时间排序
        status: 1 // 上下线
      },
      form: {
        nav_title: "",
        sort: 1,
        inst_id: "0",
        nav_web_url: "",
        nav_pic: "",
        nav_run_type: "2",
        group_id: "",
        nav_app_state: "1", // app端是否开通 1开通 2不开通
        nav_app_url: "", // 跳转参数
        nav_app_run: "", // app端跳转方式 0不跳转 1原生 2H5
        nav_web_state: "1", // 网页端是否开通 1开通 2不开通
        nav_web_url: "", // 跳转参数
        nav_web_run: "", // 网页端跳转方式 0不跳转 1原生 2H5
        nav_mini_state: "1", // 小程序是否开通 1开通 2不开通
        nav_mini_url: "", // 跳转参数  service_mini_run=3时传 {"app-id":"","path":""}
        nav_mini_run: "", // 小程序端跳转方式 0不跳转 1原生 2H5 3小程序:{“app-id”:””,”path”:””} 4 APP
        "app-id": "",
        path: ""
      },
      tableData: [],
      optionsData: [
        {
          inst_id: "0",
          label: "平台"
        },
        {
          inst_id: "1",
          label: "单位"
        }
      ],
      inst_id: "", //单位id
      current_page: 1,
      count: 0,
      page_size: 5,
      // 发布编辑
      releaseDialog: false,
      formLabelWidth: "120px",
      editorData: [],
      selectionValues: [],
      switchData: [
        { name: "已上线", active: "1" },
        { name: "已下线", active: "2" }
      ], // 上线下线,
      active: 1,
      loading: false,
      addDialogVisible: false,
      addImage: "",
      editorDialogVisible: false,
      editorImage: "",
      options: [
        {
          value: "1",
          label: "天府新区街道办"
        }
      ],
      restaurants: [],
      search_name: "",
      routeData: "",
      title: "按钮添加",
      state: 1,
      btnMark: false,

      // 控制h5和原生回显
      mini_h5_url: "",
      mini_native_url: "",
      web_h5_url: "",
      web_native_url: "",
      app_h5_url: "",
      app_native_url: ""
    };
  },
  mounted() {
    this.newList();
    this.miniData();
    // var box__message = document.getElementsByClassName(
    //   "el-message-box__message"
    // )[0];
    // box__message.style.color = "#ff0000";
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
    addDialogVisible(val) {
      console.log("addDialogVisible", val);

      if (val) {
        if (this.form.nav_web_run == "1") {
          this.web_native_url = this.form.nav_web_url;
        } else if (this.form.nav_web_run == "2") {
          this.web_h5_url = this.form.nav_web_url;
        }

        if (this.form.nav_mini_run == "1") {
          this.mini_native_url = this.form.nav_mini_url;
        } else if (this.form.nav_mini_run == "2") {
          this.mini_h5_url = this.form.nav_mini_url;
        }

        if (this.form.nav_app_run == "1") {
          this.app_native_url = this.form.nav_app_url;
        } else if (this.form.nav_app_run == "2") {
          this.app_h5_url = this.form.nav_app_url;
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
    handleClose() {
      this.handleReset("form");
    },
    // 资讯列表
    newList(_obj) {
      this.loading = true;
      let _data = Object.assign(JSON.parse(JSON.stringify(this.search)), _obj);
      for (const key in _data) {
        // 去除对象内多余的空值key
        if (_data[key] === "") {
          delete _data[key];
        }
      }
      let page = { page_size: this.page_size, current_page: 1 };
      let args = Object.assign(page, _data) || {};
      let self = this;
      RequestModulesList(args).then(res => {
        if (res) {
          self.tableData = res.list;
          self.count = res.total_num;
          this.loading = false;
        }
      });
    },
    companyList(obj, cb) {
      //    console.log(obj)
      RequestCompany(obj).then(res => {
        console.log(res);
        this.restaurants = res;
        console.log(this.restaurants);
        // cb(res)
      });
    },
    showText(item) {
      console.log(item);
      this.search_name = item.group_name;
      this.form.group_id = item.group_id;
      console.log(this.form.group_id);
      this.restaurants = [];
    },
    handleChangeText() {
      this.companyList({ search_name: this.search_name });
    },
    querySearchAsync(queryString, cb) {
      let self = this;
      this.companyList({ search_name: queryString }, function(values) {
        console.log(values);
        cb(values);
      });
    },
    handleSelect(item) {},
    // 系统模块添加
    addModuleHandle() {
      this.restaurants = [];
      this.search_name = "";
      this.title = "按钮添加";
      this.state = 1;
      this.addDialogVisible = true;
    },
    // 模块添加
    addModule(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnMark = true;
          let _data = JSON.parse(JSON.stringify(this.form));
          for (const key in _data) {
            // 去除对象内多余的空值key
            if (_data[key] === "") {
              delete _data[key];
            }
          }
          let args = {};
          if (this.form.inst_id == 0) {
            args = Object.assign({}, _data);
            args.inst_name = this.search_name;
            if (this.state == 1) {
              RequestModulesAdd(args).then(res => {
                this.newList({});
                this.btnMark = false;
                this.addDialogVisible = false;
                if (res.code == 2000) {
                  this.current_page = 1;
                }
              });
              this.handleReset("form");
            } else if (this.state == 2) {
              RequestModulesEditor(args).then(res => {
                this.newList({});
                this.btnMark = false;
                this.addDialogVisible = false;
              });
              this.handleReset("form");
            }
          } else {
            args = Object.assign(_data, this.inst_id);
            args.inst_name = this.search_name;
            if (this.state == 1) {
              RequestModulesAdd(args).then(res => {
                this.newList({});
                this.btnMark = false;
                this.addDialogVisible = false;
              });
              this.handleReset("form");
            } else if (this.state == 2) {
              RequestModulesEditor(args).then(res => {
                this.newList({});
                this.btnMark = false;
                this.addDialogVisible = false;
              });
              this.handleReset("form");
            }
          }
        } else {
          return false;
        }
      });
    },
    handleReset(formName) {
      this.$refs[formName].resetFields();
      for (let i in this.form) {
        if (
          i != "nav_app_state" ||
          i != "nav_web_state" ||
          i != "nav_mini_state" ||
          i != "inst_id"
        ) {
          this.form[i] ? (this.form[i] = "") : "";
        }
        this.form.nav_web_state = "1";
        this.form.nav_app_state = "1";
        this.form.nav_mini_state = "1";
        this.form.inst_id = "0";
      }
      this.addImage = "";
      this.addDialogVisible = false;
    },
    handleChange(values) {
      this.form = values;
    },
    // 编辑
    handEditor(row) {
      let _row = JSON.parse(JSON.stringify(row));
      if (_row.nav_mini_run == 3) {
        _row["app-id"] = _row.nav_mini_url["app-id"];
        _row["path"] = _row.nav_mini_url["path"];
        _row.nav_mini_url = "";
      } else {
        _row["app-id"] = "";
        _row["path"] = "";
      }

      _row.inst_id == 1 ? "" : _row.inst_id == null ? (_row.inst_id = "0") : "";
      this.state = 2;
      this.title = " 编辑按钮";
      this.addImage = _row.nav_pic;
      this.form = Object.assign(_row);
      this.addDialogVisible = true;
    },

    // 查询
    selectionCotent() {
      this.current_page = 1;
      let args = { q: this.search.q };
      this.newList(args);
    },

    // 时间切换
    timeOn(value) {
      this.search.order_time = value;
      let args = { order_time: value };
      this.newList(args);
    },
    // 分页选择
    pageChange(current) {
      this.current_page = current;
      let args = { current_page: current };
      this.newList(args);
    },
    // 批量选中
    selectionChange(selectionValues) {
      this.selectionValues = selectionValues;
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    //  删除
    tabelDelete() {
      let self = this,
        selectionArr = [];
      var status = this.search.status;
      if (status == 1) {
        this.$alert("如需删除，请先下线!", "提示", {
          confirmButtonText: "确定",
          type: "error"
        });
        return;
      }
      for (let i in this.selectionValues) {
        selectionArr.push(this.selectionValues[i].nav_id);
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestModulesDelete({ nav_id: selectionArr }).then(res => {
            self.newList({ current_page: this.current_page });
          });
          // this.$Message({
          //     type: 'success',
          //     text: '删除成功!'
          // });
        })
        .catch(() => {
          this.$Message({
            type: "info",
            text: "已取消删除"
          });
        });
    },
    handleState(nav_id, status) {
      let str = "";
      status == 1 ? (str = "禁用") : (str = "启用");
      this.$confirm(`此操作将${str}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestModulesState({ nav_id }).then(res => {
            if (res.code === 2000) {
              this.newList({ current_page: this.current_page });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 上下线切换
    switchFn(active) {
      this.current_page = 1;
      this.selectionValues = [];
      this.search.status = active;
      this.active = active;
      this.newList({ status: JSON.parse(active) });
    },
    // 图片上传
    beforeIconUpload1(file) {
      const isJPG = file.type,
        isLt2M = file.size / 1024 / 1024 < 2,
        self = this;
      var formData = new FormData();
      formData.append("file", file);
      if (
        isJPG == "image/jpg" ||
        isJPG == "image/png" ||
        isJPG == "image/jpeg"
      ) {
        if (!isLt2M) {
          this.$message.error("请上传2m以下的图片");
          return false;
        }
        RequestUploads(formData).then(res => {
          self.form.nav_pic = res.data.key;
          self.addImage = res.data.base_url + res.data.key;
        });
      } else {
        return this.$message.error("请上传图片");
      }
    },
    beforeIconUpload2(file) {
      const isJPG = file.type,
        isLt2M = file.size / 1024 / 1024 < 2,
        self = this;
      var formData = new FormData();
      formData.append("file", file);
      if (
        isJPG == "image/jpg" ||
        isJPG == "image/png" ||
        isJPG == "image/jpeg"
      ) {
        if (!isLt2M) {
          return this.$message.error("请上传小于2m的图片");
        }
        RequestUploads(formData).then(res => {
          self.editorData.nav_pic = res.data.key;
          self.editorImage = res.data.base_url + res.data.key;
        });
      } else {
        return this.$message.error("请上传图片");
      }
    },
    // 小程序redio选择
    handleChangeMiniRedio(value) {
      if (value == "3") {
        this.form.nav_mini_url = "";
      } else if (value == "2") {
        this.form.nav_mini_url = this.mini_h5_url;
      } else if (value == "1") {
        this.form.nav_mini_url = this.mini_native_url;
      } else {
        this.path = "";
      }
    },
    //h5redio选择
    handleChangeH5Redio(value) {
      if (value == "2") {
        this.form.nav_web_url = this.web_h5_url;
      } else if (value == "1") {
        this.form.nav_web_url = this.web_native_url;
      } else {
        this.form.nav_web_url = "";
      }
    },
    // app redio选择
    handleChangeAppRedio(value) {
      if (value == "2") {
        this.form.nav_app_url = this.app_h5_url;
      } else if (value == "1") {
        this.form.nav_app_url = this.app_native_url;
      } else {
        this.form.nav_app_url = "";
      }
    },
    // 小程序显示切换
    handleChangeMini(value) {
      value == 2 ? (this.form.nav_mini_url = "") : "";
      value == 2 ? (this.form["app-id"] = "") : "";
      value == 2 ? (this.form.path = "") : "";
      value == 2 ? (this.form.nav_mini_run = "") : "";
    },
    // 小程序redio选择
    // handleChangeMiniRedio(value) {
    //   if (value == 0) {
    //     (this.form.nav_mini_url = ""), (this.form["app-id"] = "");
    //     this.path = "";
    //   }
    //   value != 3 ? (this.form["app-id"] = "") : "";
    //   value != 3 ? (this.form.path = "") : "";
    //   value == 3 ? (this.form.nav_mini_url = "") : "";
    // },
    // H5切换
    handleChangeH5(value) {
      value == 2 ? (this.form.nav_web_url = "") : "";
      value == 2 ? (this.form.nav_web_run = "") : "";
    },
    //h5redio选择
    // handleChangeH5Redio(value) {
    //   value == 0 ? (this.form.nav_web_url = "") : "";
    // },
    // app切换
    handleChangeApp(value) {
      value == 2 ? (this.form.nav_app_url = "") : "";
      value == 2 ? (this.form.nav_app_run = "") : "";
    },
    // app redio选择
    // handleChangeAppRedio(value) {
    //   value == 0 ? (this.form.nav_app_url = "") : "";
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
  .label-choose {
    list-style: none;
    cursor: pointer;
  }
  .table-footer {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
  .switch-btn {
    position: relative;
    width: 70px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px #dcdfe6 solid;
    outline: none;
    border-radius: 5px;
    background: #fff;
    top: 2px;
    cursor: pointer;
  }
  .active {
    background: #409eff;
    color: #fff;
  }
  .active:hover {
    opacity: 0.8;
  }
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
    height: 70px;
    width: 70px;
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
    font-size: 10px;
    color: #8c939d;
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
  }

  .avatar {
    width: 70px;
    height: 70px;
    display: block;
  }
  .text-hover:hover {
    color: #1890ff;
    cursor: pointer;
  }
}
</style>

