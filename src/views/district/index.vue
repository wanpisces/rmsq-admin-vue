<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div style="margin-bottom:30px">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <span class="bread" @click="handleData(0,0,0)">全部</span>
          </el-breadcrumb-item>
          <span class="right-text" v-if="bread!=0" v-for="(item,index) in  bread" :key="index" @click="handleData(1,item,index)">
            <el-breadcrumb-item>
              <span class="bread">{{item.region_name_c}}</span>
              <i class="el-icon-arrow-right right" v-if="index<bread.length-1"></i>
            </el-breadcrumb-item>
          </span>

        </el-breadcrumb>
      </div>

      <div>
        <i class="icon-wancheng"></i>
      </div>
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>

          <el-input style="width:200px" placeholder="行政单位名称" v-model="objSearch.q"></el-input>
        </div>
        <!-- <div class="search">
                    <span>选择类型：</span>
                    <el-select v-model="objSearch.type" filterable placeholder="请选择类型">
                        <el-option :key="1" label="服务号" :value="1"></el-option>
                        <el-option :key="2" label="订阅号" :value="2"></el-option>
                    </el-select>
                </div> -->
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
            <el-button v-if="perm.districtDele==1" type="danger" plain @click="tabelDelete" :disabled="deleteMark">删除</el-button>
            <!-- <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button> -->
          </div>
          <!-- <div style="display:flex"> -->

          <!-- <choose-tab @handleShowDliog="handleShowDliog" add-title="添加" @handleAdd="releaseClick" @TimeOn="TimeOn">
            </choose-tab> -->
          <div style="display:flex;">
            <el-button v-if="perm.districtAdd==1" style="margin-right:10px" type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick">添加</el-button>

            <el-upload v-if="perm.import==1" accept='.xls,.xlsx' class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :before-upload="handleBeforeFile" :show-file-list="false">
              <el-button icon="el-icon-upload2">导入数据</el-button>
            </el-upload>
            <el-button v-if="perm.export==1" style="margin-left:10px" icon="el-icon-download" @click="exportVoteList">导出数据</el-button>
          </div>

          <!-- </div> -->
        </div>
        <el-table :data="tableData" border @selection-change="handleSelectionChange" v-loading="btnMark" :close-on-click-modal="false" key="desingerTable" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="序号" width="100" type="index">
          </el-table-column>
          <el-table-column label="行政单位名称" prop="region_name_c">
            <template slot-scope="scope">
              <div v-if="scope.row.active==true">
                <span>{{scope.row.region_name_c}}</span>
              </div>
              <div v-else>
                <el-input v-model="editorData.region_name_c"></el-input>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="行政级别" prop="level" v-if="level<5" :key="Math.random()">
            <template slot-scope="scope">
              <span>{{{1:'省',2:'市',3:'区县',4:'街道/镇/乡',5:'社区/村'}[scope.row.level]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="下辖地区数量" prop="underNum" v-if="level<5" :key="Math.random()">
          </el-table-column>
          <el-table-column label="详细地址" prop="zzz" v-if="level==5" :key="Math.random()">
            <template slot-scope="scope">
              <div v-if="scope.row.active==true">
                <span>{{scope.row.address || ""}}</span>
              </div>
              <div v-else>
                <el-input v-model="editorData.merger_name"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="地图定点" prop="aaa" v-if="level==5" :key="Math.random()">
            <template slot-scope="scope">
              <div v-if="scope.row.active==true">
                已点选
              </div>
              <div v-else>
                <span class="choose">点击选择</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="150" v-if="perm.districtDetail==1||perm.districtEdit==1||perm.districtDele==1">
            <template slot-scope="scope">
              <div v-if="scope.row.active==true">
                <el-button type="text" size="small" @click="hanldeLook(scope.row)" v-if="scope.row.level<6&&perm.districtDetail==1" :disabled="btnMark">查看</el-button>
                <el-button v-if="perm.districtEdit==1" type="text" size="small" @click="handEditor(scope.row,false,$event)">编辑</el-button>
                <el-button v-if="perm.districtDele==1" type="text" size="small" @click="batchDelete(scope.row)">删除</el-button>
              </div>
              <div v-else>
                <el-button type="text" @click="handleSure($event)"> 确定</el-button>
                <el-button type="text" @click="handEditor(scope.row,true,$event)">取消</el-button>
              </div>
              <!-- <div class="el-icon-wrapper" v-if="scope.row.active==true">
                <i class="el-icon-view" v-if="scope.row.level<5" title="查看" @click="hanldeLook(scope.row)"></i>
                <i class="el-icon-edit" title="编辑" @click="handEditor(scope.row,false,$event)"></i>
                <i class="el-icon-delete" title="删除" @click="batchDelete(scope.row)"></i>
              </div>
              <div v-else>
                <el-button type="text" @click="handleSure($event)"> 确定</el-button>
                <el-button type="text" @click="handEditor(scope.row,true,$event)">取消</el-button>
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
    <div v-if="level<5">
      <el-dialog :title="formTitle" :visible.sync="releaseDialog" :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <!-- <el-input v-model="ruleForm.app_name" type="hidden"></el-input> -->
          <el-form-item v-for="(item,index) in nameArr" :key="index" label="行政单位名称：" :label-width="formLabelWidth">
            <el-input style="width:85%;" v-model="item.name" auto-complete="off"></el-input>
            <el-button type="danger" v-if="nameArr.length>1" @click="areaDelete(index)" icon="el-icon-delete" circle></el-button>
          </el-form-item>
        </el-form>
        <el-button v-if="nameArr.length<5" @click="continueAdd" type="primary" plain>继续添加</el-button>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" :disabled="btnMark">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-show="level==5">
      <!-- 地址选择 -->
      <transition name="fade">
        <div v-show="releaseDialog" class="map">
          <div id="all">
            <div>
              单位名称：<input type="text" name="detail" class="detail" placeholder="请输入单位名称" v-model="ruleForm.name">
            </div>
            <div style="margin:10px 0">
              详细地址：<input type="text" id="suggestId" class="input_style" v-model="ruleForm.address" placeholder="点击地图获取地址">
            </div>
            <!-- <div>
              获取地址：<input type="text" id="suggestId" name="address_detail" placeholder="点击地图获取地址" v-model="ruleForm.address" class="input_style">
            </div>
            <div style="margin:10px 0">
              详细地址：<input type="text" class="detail" v-model="ruleForm.name" placeholder="请输入详细地址">
            </div> -->
            <div id="allmap"></div>
            <div align="right">
              <el-button @click="releaseDialog=false">取消</el-button>
              <el-button type="primary" @click="hangleMap" :disabled="btnMark">确定</el-button>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- 编辑 -->
  </div>
</template>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=iyUj8juV15MB8qGwiM6BfwebPs3cUMOm"></script> 
<script>
import Vue from "vue";
import coordtransform from "coordtransform";
Vue.use(coordtransform);
import MoPaging from "@/components/Paginations.vue";
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue";
import config from "@/fetch/config.js";
//  地理位置列表、添加、编辑、删除、状态切换、导入
import {
  RequestMpList,
  RequestMpAdd,
  RequestMpEditor,
  RequestMpDelete,
  RequestMpState,
  RequestMpImport
} from "@/fetch/modules/district";
import { getToken } from "@/utils/auth";
const rules = {
  name: [{ required: true, message: "请输入行政单位名称", trigger: "blur" }]
};
export default {
  components: { MoPaging, ChooseTab },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      to.meta.perm.forEach((item, index) => {
        if (vm.perm[item.perm_name]) {
          vm.perm[item.perm_name] = item.is_select; // 2-不显示 1-显示
        }
      });
    });
  },
  data() {
    return {
      perm: {
        districtDetail: 2,
        districtAdd: 2,
        districtEdit: 2,
        districtDele: 2,
        import: 2,
        export: 2
      },
      rules,
      isActive: true,
      questionData: {}, //问题详情
      detailDialog: false, //问题描述
      labelTitle: "上线时间",
      btnMark: false, //提交form的时候按钮
      oprateStatus: 1, //1为编辑，2为添加
      primary1: "parimary",
      primary2: "",
      formTitle: "添加",
      value: "",
      tableData: [],
      objSearch: {
        current_page: 1,
        page_size: 10,
        q: "",
        order_time: 1,
        type: 1, // 公众号类型 1服务号 2订阅号
        status: 1
      },
      count: 0,
      // 发布编辑
      releaseDialog: false,
      nameArr: [{ name: "" }],
      ruleForm: {
        name: "",
        address: "",
        lng: "",
        lat: ""
      },
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      bread: [],
      btnMark: false,
      editorData: {}, //编辑数据
      isFalse: true,
      level: 1,
      // loading:false,
      userlocation: { lng: "", lat: "" },
      commnity: 1
    };
  },
  created() {
    let _args = this.objSearch;
    _args["upper_region"] = 0;
    this.getListData(_args);
  },
  mounted() {
    this.mapInit();
  },

  methods: {
    // 继续添加
    continueAdd() {
      this.nameArr.push({ name: "" });
    },
    areaDelete(index) {
      this.nameArr.splice(index, 1);
    },
    handleData(val, item, index) {
      if (val == 0) {
        if (this.bread.length != 0) {
          this.bread.splice(0, this.bread.length);
        }
      } else {
        if (this.bread.length != 0) {
          this.bread.map((v, i) => {
            if (index == i && index != this.bread.length - 1) {
              this.bread.splice(i + 1, this.bread.length);
            }
          });
        }
      }

      let _args = this.objSearch;
      val == 0
        ? (_args["upper_region"] = val)
        : (_args["upper_region"] = item.id);
      _args["current_page"] = 1;
      this.getListData(_args);
    },
    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      var args = this.objSearch;
      this.getListData(args);
    },
    //获取模块列表
    getListData(args) {
      this.btnMark = true;
      // this.loading=true
      RequestMpList(args).then(res => {
        this.btnMark = false;
        // this.loading=false
        if (res.code === 2000) {
          res.data.list.map((item, index) => {
            res.data.list[index].active = true;
          });
          this.tableData = res.data.list;
          this.level = +res.data.level;
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
    questionDetail(question_id) {
      RequestQuestionDetail({ question_id, question_id }).then(res => {
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
    //  查看下一级
    hanldeLook(row) {
      this.btnMark = true;
      this.objSearch.q = "";
      let _args = this.objSearch;
      _args["upper_region"] = row.id;
      _args["current_page"] = 1;
      RequestMpList(_args).then(res => {
        this.btnMark = false;
        if (res.code === 2000) {
          res.data.list.map((item, index) => {
            res.data.list[index].active = true;
          });
          this.bread.push(row);
          this.level = +res.data.level;
          this.tableData = res.data.list;
          this.objSearch.current_page = Number(res.data.current_page);
          this.objSearch.page_size = Number(res.data.page_size);

          this.count = Number(res.data.total_num);
        }
      });
    },
    // 添加
    releaseClick() {
      this.oprateStatus = 2;
      this.commnity = 1;
      this.nameArr = [{ name: "" }];
      this.releaseDialog = true;
      this.formTitle = "新增地区";
      for (let i in this.ruleForm) {
        this.ruleForm[i] = "";
      }
      this.userlocation = { lng: "", lat: "" };
      this.mapInit();
    },
    //编辑信息
    handEditor(row, active, event) {
      // console.log(active);
      if (this.level < 5) {
        if (!active) {
          this.tableData.map((item, index) => {
            if (row.id == item.id) {
              this.tableData[index].active = active;
            } else {
              this.tableData[index].active = !active;
            }
          });
        } else {
          this.tableData.map((item, index) => {
            if (row.id == item.id) {
              this.tableData[index].active = active;
            }
          });
        }
        active == false
          ? (this.editorData = JSON.parse(JSON.stringify(row)))
          : (this.editorData = "");
      } else {
        this.commnity = 2;
        this.ruleForm = {
          name: row.region_name_c,
          address: row.address,
          lat: row.lat || "",
          lng: row.lng || "",
          id: row.id
        };
        // console.log(this.ruleForm);
        this.mapInit();
        this.releaseDialog = true;
      }
      // active == false ? (this.editorData = JSON.parse(JSON.stringify(row))) : (this.editorData = "");

      // console.log(this.editorData);
    },
    handleSure() {
      // this.stopBubble(event);
      let { upper_region, id, region_name_c } = this.editorData;
      RequestMpEditor({
        upper_region,
        id,
        name: region_name_c,
        address: ""
      }).then(res => {
        if (res.code === 2000) {
          let _args = this.objSearch;
          this.$message.success("编辑成功");
          this.bread.length != 0
            ? (_args["upper_region"] = this.bread[this.bread.length - 1].id)
            : (_args["upper_region"] = 0);
          this.getListData(_args);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //编辑,保存
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var _args = this.ruleForm;
          var nameArr = [];
          for (var i = 0; i < this.nameArr.length; i++) {
            if (this.nameArr[i].name == "") {
              this.$message.error("请输入行政单位名称");
              return false;
            }
            nameArr.push(this.nameArr[i].name);
          }
          this.btnMark = true;
          _args.name = JSON.stringify(nameArr);
          this.bread.length != 0
            ? (_args["upper_region"] = this.bread[this.bread.length - 1].id)
            : (_args["upper_region"] = 0);
          RequestMpAdd(_args).then(res => {
            oprateFn(res);
          });
          function oprateFn(res) {
            _this.resetForm("ruleForm");
            _this.releaseDialog = false;
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
    // 批量选中
    handleSelectionChange(vals) {
      console.log(vals);
      // for (var i = 0; i < vals.length; i++) {
      //   this.selectionValues.push(vals[i].id);
      // }
      this.selectionValues = vals;
      if (vals.length <= 0) {
        this.deleteMark = true;
      } else {
        this.deleteMark = false;
      }
      console.log(this.selectionValues);
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
      var id = "";
      for (var i = 0; i < this.selectionValues.length; i++) {
        id += this.selectionValues[i].id + ",";
      }
      this.deleteFn(id);
    },
    //删除
    batchDelete(row) {
      this.deleteFn(row.id);
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    //删除请求
    deleteFn(id) {
      this.$confirm("删除该行政区，下级行政区也会删除。是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestMpDelete({ id: id }).then(res => {
            var _args = this.objSearch;
            this.bread.length != 0
              ? (_args["upper_region"] = this.bread[this.bread.length - 1].id)
              : (_args["upper_region"] = 0);
            // console.log("aaaaa", _args, this.bread[this.bread.length - 1]);
            this.getListData(_args);
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
    },
    // 导入数据
    handleBeforeFile(file) {
      console.log(file);
      let formData = new FormData(),
        isVedio = file.type,
        self = this,
        fileText = "";
      // let isVedioArr = isVedio.split("/");
      // for (let i in isVedioArr) {
      //   i == 1 ? (fileText = isVedioArr[i]) : "";
      // }
      console.log("file", file);
      if (
        file.type ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        const isLt30M = file.size / 1024 / 1024 < 30;
        const loading = this.$loading({
          lock: true,
          text: "文件上传中请稍等。。。",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        // this.bread.length != 0 ? (_args["upper_region"] = this.bread[this.bread.length - 1].id) : (_args["upper_region"] = 0);
        formData.append("file", file);
        formData.append("token", getToken());
        formData.append(
          "upper_region",
          this.bread.length != 0 ? this.bread[this.bread.length - 1].id : 0
        );
        RequestMpImport(formData).then(res => {
          loading.close();
          if (res.code == 2000) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.error("请上传正确的文件类型");
      }

      // if (!isLt30M) {
      //   this.$message.error("请上传30M以下的视频");
      //   return false;
      // }
      // if (isVedio == "application/vnd.ms-excel") {
      // self.requestQiNiutoken(fileText).then(res => {
      //   let key = res.key;
      //   console.log(file);
      //   formData.append("file", file);
      //   formData.append("token", res.token);
      //   const loading = this.$loading({
      //     lock: true,
      //     text: "视频上传中请稍等。。。",
      //     spinner: "el-icon-loading",
      //     background: "rgba(0, 0, 0, 0.7)"
      //   });
      //   this.RequestQiu(formData).then(res => {
      //     this.news_media = `https://img.sqydt.darongshutech.com/${key}`;
      //     this.news_media_v1 = `https://img.sqydt.darongshutech.com/${res.hash}`;
      //     loading.close();
      //   });
      // });
      // } else {
      //   return this.$message.error("请上传正确的视频格式");
      // }
    },
    // 导出数据
    exportVoteList() {
      // console.log("this.bread.", this.bread[this.bread.length - 1].id, getToken());
      //  config.baseUrltest +
      // console.log()
      window.location.href =
        "api/admin/districtExport" +
        "?token=" +
        getToken() +
        "&upper_region=" +
        (this.bread.length != 0 ? this.bread[this.bread.length - 1].id : 0);
    },

    // 地图初始化
    mapInit() {
      // // 百度地图初始化
      // // this.$nextTick(function() {
      // var th = this;
      // // console.log("s2-1");
      // // MapJs("iyUj8juV15MB8qGwiM6BfwebPs3cUMOm").then(BMap => {
      // // 创建Map实例
      // // window.location.reload();
      // var map = new BMap.Map("allmap");
      // var maker = []; // 标记
      // // 初始化地图,设置中心点坐标，
      // var point = new BMap.Point(104.07, 30.67); // 创建点坐标，汉得公司的经纬度坐标
      // map.centerAndZoom(new BMap.Point(104.07, 30.67), 11);
      // map.enableScrollWheelZoom();
      // var geolocation = new BMap.Geolocation();
      // var geocoder = new BMap.Geocoder();
      // var ac = new BMap.Autocomplete({
      //   //建立一个自动完成的对象
      //   input: "suggestId",
      //   location: map
      // });

      // 百度地图初始化
      // this.$nextTick(function() {
      var th = this;
      // MapJs("iyUj8juV15MB8qGwiM6BfwebPs3cUMOm").then(BMap => {
      // 创建Map实例
      var map = new BMap.Map("allmap");
      var maker = [];
      let langLatArr = [];
      if (this.ruleForm.lat && this.ruleForm.lng) {
        langLatArr = coordtransform.gcj02tobd09(
          this.ruleForm.lng,
          this.ruleForm.lat
        );
        let markers = new BMap.Marker({
          lng: langLatArr[0],
          lat: langLatArr[1]
        });
        maker.push(markers);
        map.addOverlay(markers);
      }
      // 初始化地图,设置中心点坐标，
      var point = new BMap.Point(
        langLatArr[0] || 104.07,
        langLatArr[1] || 30.67
      );
      map.centerAndZoom(
        new BMap.Point(langLatArr[0] || 104.07, langLatArr[1] || 30.67),
        15
      );
      map.enableScrollWheelZoom();
      var geolocation = new BMap.Geolocation();
      var geocoder = new BMap.Geocoder();
      var ac = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: "suggestId",
        location: map
      });
      /**
      定位控件
      */
      var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
      });
      map.addControl(navigationControl);
      // 添加定位控件
      var geolocationControl = new BMap.GeolocationControl();

      geolocationControl.addEventListener("locationSuccess", function(e) {
        // // 定位成功事件
        // var address = "";
        // address += e.addressComponent.province;
        // address += e.addressComponent.city;
        // address += e.addressComponent.district;
        // address += e.addressComponent.street;
        // address += e.addressComponent.streetNumber;
        // alert("当前定位地址为：" + address);
      });
      geolocationControl.addEventListener("locationError", function(e) {
        // 定位失败事件
        alert(e.message);
      });
      map.addControl(geolocationControl);
      /**
       * 1.地图点击事件
       */
      function showInfo(e) {
        geocoder.getLocation(e.point, function(rs) {
          let title = "";
          if (rs.surroundingPois.length != 0) {
            title = rs.surroundingPois[0].title;
          }
          var mk = new BMap.Marker(rs.point); //创建一个覆盖物
          maker.push(mk);
          for (var i = 0; i < maker.length; i++) {
            map.removeOverlay(maker[i]);
          }
          map.clearOverlays(); //清除地图上所有覆盖物
          map.addOverlay(mk); //增加一个标示到地图上
          th.ruleForm.address = rs.address + title;
          th.userlocation.lng = e.point.lng;
          th.userlocation.lat = e.point.lat;
          // map.enableCloseOnClick();
          /**
           * 信息窗口
           */
          var opts = {
            width: 150, // 信息窗口宽度
            height: 100, // 信息窗口高度
            title: "您当前选择位置：", // 信息窗口标题
            enableCloseOnClick: true
          };
          var infoWindow = new BMap.InfoWindow(rs.address + title, opts); // 创建信息窗口对象
          map.openInfoWindow(infoWindow, rs.point); // 打开信息窗口
        });
      }
      map.addEventListener("click", showInfo);
      /**
       * 1.地图地理位置获取
       */
      if (!this.ruleForm.lng) {
        geolocation.getCurrentPosition(
          function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              var mk = new BMap.Marker(r.point);
              maker.push(mk);
              map.addOverlay(mk);
              map.panTo(r.point);
              //   alert("您的位置：" + r.point.lng + "," + r.point.lat);
            } else {
              alert("failed" + this.getStatus());
            }
          },
          { enableHighAccuracy: true }
        );
      }

      /**
       * 1.地图搜索
       */
      var myValue;
      ac.addEventListener("onconfirm", function(e) {
        //鼠标点击下拉列表后的事件
        console.log("jianting");
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        th.ruleForm.address = myValue;
        th.userlocation.lng = e.target.yd.src.Oe.lng;
        th.userlocation.lat = e.target.yd.src.Oe.lat;
        console.log(th.userlocation);
        setPlace();
      });

      function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
          th.userlocation = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          map.centerAndZoom(th.userlocation, 18);
          map.addOverlay(new BMap.Marker(th.userlocation)); //添加标注
        }

        var local = new BMap.LocalSearch(map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);

        //测试输出坐标（指的是输入框最后确定地点的经纬度）
        map.addEventListener("click", function(e) {
          //经度
          console.log(th.userlocation.lng);
          //维度
          console.log(th.userlocation.lat);
        });
      }
      // });
      // });
      // window.location.reload();
    },
    // 提交
    hangleMap() {
      let _this = this;
      if (!this.userlocation.lng && !this.userlocation.lat) {
        this.$message.error("请地图上确认具体位置");
        return false;
      }
      if (this.userlocation.lng && this.userlocation.lat) {
        //百度经纬度坐标转国测局坐标
        let langLatArr = coordtransform.bd09togcj02(
          this.userlocation.lng,
          this.userlocation.lat
        );
        this.ruleForm.lng = langLatArr[0];
        this.ruleForm.lat = langLatArr[1];
        this.btnMark = true;
        console.log(this.userlocation, this.ruleForm);
        var _args = this.ruleForm;
        this.bread.length != 0
          ? (_args["upper_region"] = this.bread[this.bread.length - 1].id)
          : (_args["upper_region"] = 0);
        if (this.commnity == 1) {
          RequestMpAdd(_args).then(res => {
            oprateFn(res);
          });
        } else {
          RequestMpEditor(_args).then(res => {
            oprateFn(res);
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

        // this.ruleForm.address = this.address_detail + this.address_detail_2;
        // this.mapDaliogShow = false;
      }
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
// .textarea-wrapper .el-textarea__inner{
//     min-height: 250px!important;
// }

.question_content {
  cursor: pointer;
  color: #409eff;
}
.el-icon-wrapper {
  font-size: 20px;
  color: #409eff;
}
.detail-wrapper h1 {
  font-size: 24px;
  text-align: center;
}
.detail-wrapper p {
  font-size: 16px;
}
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .bread {
    color: #39bcf3;
    cursor: pointer;
  }
  .right {
    color: #c0c4cc;
  }
  .right-text {
    margin-right: 20px;
  }
  .choose {
    color: #39bcf3;
    cursor: pointer;
  }
  #allmap {
    width: 700px;
    height: 400px;
    font-family: "微软雅黑";
    border: 1px solid #f2f2f2;
    border-radius: 5px;
    margin: 30px 0;
    position: relative;
    z-index: 100002;
  }
  .map {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    height: 100vh;
    align-items: center;
    z-index: 10002;
  }
  #all {
    background: #fff;
    padding: 30px;
    border-radius: 10px;
  }
  .tangram-suggestion-main {
    z-index: 1000;
  }
  #suggestId,
  .detail {
    border: 1px #f2f2f2 solid;
    outline: none;
    height: 40px;
    width: 450px;
    border-radius: 10px;
    text-indent: 10px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s linear;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>

