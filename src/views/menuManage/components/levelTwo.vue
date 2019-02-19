<template>
  <div>
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogVisible" width="1000px" :before-close="handleClose" @close="$emit('update:dialogVisibleBefore', false)" :dialogVisibleBefore="dialogVisibleBefore">
      <span></span>
      <el-form :model="form" ref="form" label-width="160px" class="demo-ruleForm">
        <el-form-item label="服务名称：" prop="service_title" :rules="[{ required: true, message: '服务名称不能为空'},{min:1,max:6,message: '长度在 1 到 6 个字符',trigger: 'blur'}]">
          <el-input style="width:400px;" v-model="form.service_title" placeholder="请输入服务名称" :maxlength="6"></el-input>
        </el-form-item>

        <el-form-item label="服务描述：" prop="service_desc">
          <el-input style="width:400px;" v-model="form.service_desc" placeholder="请输入服务描述" :maxlength="6"></el-input>
        </el-form-item>

        <el-form-item label="选择图标：" prop="service_pic" :rules="[
      { required: true, message: '请选择图标', trigger: 'blur' },
    ]">

          <p style="font-size:40px;padding:0;margin:0;color:#409EFF; display:inline-block;cursor: pointer" @click="selectMark = !selectMark;">
            <i v-if="!form.service_pic" class="el-icon-picture" style="font-size:70px;"></i>
            <span v-if="form.service_pic" style="font-size:14px;position:relative;top:-20px"> 正在使用：</span>
            <img v-if="form.service_pic" :src="form.service_pic" alt="" style="width:60px;height:60px;">
          </p>

        </el-form-item>
        <el-form-item>

          <div v-if="selectMark" class="selectimg-wrap">
            <div class="select-img-search">
              <div class="select-search-left">
                <span>搜索：</span>
                <el-input v-model="iconSearch.q" style="width:150px" @change="handleSearch"></el-input>
              </div>
              <div class="select-search-left">
                <span>分类选择</span>
                <el-select v-model="iconSearch.attr_id" placeholder="请选择" @change="handleAttr">
                  <el-option key="" label="所有" value="0"></el-option>
                  <el-option key="-1" label="最近使用" value="-1"></el-option>
                  <el-option v-for="item in iconItem.attr" :key="item.attr_id" :label="item.attr_value" :value="item.attr_id">
                  </el-option>
                </el-select>
              </div>
              <div class="select-img-search select-search-left">
                <span>颜色：</span>
                <div v-for="(item,index) in iconItem.color" :key="index" :style="{background:item.color_value}" :class="[ iconSearch.color==item.color_id?'select-search-color select-color-active': 'select-search-color']" @click="handleColor(item)"></div>
              </div>
            </div>
            <div class="select-img-search">
              <div v-for="(item,index) in iconItem.recom_attr" :key="index" :class="[ iconSearch.attr_id==item.attr_id?'select-search-tag select-active': 'select-search-tag']" @click="handleRecom(item)">{{item.attr_value}}</div>
            </div>
            <div v-if="selectArrImg.length!=0">
              <img v-for="item in selectArrImg" :key="Math.random()" @click="selectPicture(item)" :src="item.icon_url" alt="">
            </div>

            <div v-else style="text-align:center">暂无数据</div>
            <div align="right">
              <el-pagination small layout="prev, pager, next" :total="iconSearch.total" @current-change="pageChange" :current-page.sync="iconSearch.current_page" :page-size="iconSearch.page_size">
              </el-pagination>
              <!-- <el-pagination background @current-change="pageChange" :current-page.sync="current_page" :page-size="page_size" layout="total,prev, pager, next, jumper" :total="count">
              </el-pagination> -->
            </div>
          </div>

        </el-form-item>

        <!-- <el-form-item label="服务ICON：" prop="service_pic" :rules="[{ required: true, message: '请上传服务ICON'}]">
          <icon-uplaod :imageUrl="form.service_pic" @handleSuccess="handleSuccess" />
        </el-form-item> -->

        <el-form-item label="关联板块：">
          <el-radio-group @change="changeRelatedTmpl" v-model="form.related_tmpl">
            <el-radio label="1">活动报名</el-radio>
            <el-radio label="2">随手拍</el-radio>
            <el-radio label="3">投票评选</el-radio>
            <el-radio label="4">问卷</el-radio>
            <el-radio label="0">自定义</el-radio>
            <el-radio label="5">资讯</el-radio>
          </el-radio-group>
        </el-form-item>

        <div v-if="form.related_tmpl == 0">
          <el-form-item label="小程序端是否显示：">
            <el-switch active-value="1" inactive-value="2" v-model="form.service_mini_state">
            </el-switch>
          </el-form-item>
          <el-form-item v-if="form.service_mini_state == '1'" label="小程序跳转方式：">
            <el-radio-group v-model="form.service_mini_run" @change="handleChangeMiniRedio">
              <el-radio label="0">不跳转</el-radio>
              <el-radio label="2">H5</el-radio>
              <el-radio label="1">原生</el-radio>
              <el-radio label="3">小程序 </el-radio>
            </el-radio-group>

            <div v-if="(form.service_mini_run != 0 && form.service_mini_run != 3)">
              <div>链接地址</div>
              <el-form-item prop="service_mini_url" :rules="[{ required: true, message: '请输入链接地址', trigger: 'blur' }]">
                <el-input placeholder="请输入链接地址" v-model="form.service_mini_url"></el-input>
              </el-form-item>
            </div>

            <div v-if="form.service_mini_run==3">
              <div>小程序选择：</div>
              <el-form-item prop="app-id" :rules="[{ required: true, message: '请选择小程序'}]">
                <el-select v-model="form['app-id']" placeholder="请选择" size="small" @change="handleSelectAppId">
                  <el-option v-for="item in miniList" :key="item.app_id" :label="item.app_name" :value="item.app_id">
                  </el-option>
                </el-select>
              </el-form-item>

              <div style="margin-top:8px;">小程序地址：</div>
              <el-form-item prop="path" :rules="[{ required: true, message: '请选择小程序地址'}]">
                <el-select v-model="form.path" placeholder="请选择小程序地址">
                  <el-option v-for="item in  routeData" :key="item.route_path" :label="item.route_name" :value="item.route_path">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form-item>

          <!-- <el-form-item label="web端是否显示：">
            <el-switch active-value="1" inactive-value="2" v-model="form.service_web_state">
            </el-switch>
          </el-form-item>
          <el-form-item v-if="form.service_web_state == '1'" label="Web跳转方式：">
            <el-radio-group v-model="form.service_web_run" @change="handleChangeH5Redio">
              <el-radio label="0">不跳转</el-radio>
              <el-radio label="2">H5</el-radio>
              <el-radio label="1">原生</el-radio>
            </el-radio-group>

            <div v-if="form.service_web_run != 0">
              <div>链接地址</div>
              <el-form-item prop="service_web_url" :rules="[{ required: true, message: '请输入链接地址', trigger: 'blur' }]">
                <el-input placeholder="请输入链接地址" v-model="form.service_web_url"></el-input>
              </el-form-item>
            </div>
          </el-form-item>

          <el-form-item label="app端是否显示：">
            <el-switch active-value="1" inactive-value="2" v-model="form.service_app_state">
            </el-switch>
          </el-form-item>
          <el-form-item v-if="form.service_app_state == '1'" label="App跳转方式：">
            <el-radio-group v-model="form.service_app_run" @change="handleChangeAppRedio">
              <el-radio label="0">不跳转</el-radio>
              <el-radio label="2">H5</el-radio>
              <el-radio label="1">原生</el-radio>
            </el-radio-group>

            <div v-if="form.service_app_run != 0 ">
              <div>链接地址</div>
              <el-form-item prop="service_app_url" :rules="[{ required: true, message: '请输入链接地址', trigger: 'blur' }]">
                <el-input placeholder="请输入链接地址" v-model="form.service_app_url"></el-input>
              </el-form-item>
            </div>
          </el-form-item> -->
        </div>

        <!-- 随手拍 -->
        <div class="need-audit-box" v-if="form.related_tmpl == 2">
          <el-form-item label="选择随手拍类型：">
            <el-radio-group v-model="form.need_audit">
              <el-radio label="1">需要审核</el-radio>
              <el-radio label="2">无需审核</el-radio>
            </el-radio-group>
            <p v-if="form.need_audit == 1">需要工作人员审核后才能在用户端显示</p>
            <p v-else>用户拍照发布后可直接在用户端展示（若工作人员发现用户发布的内容不符合活动主题，可以删除）</p>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
          <el-button @click="cancle('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import iconUplaod from "@/components/IconUplaod/IconUplaod";
import { RequestMiniList } from "@/fetch/modules/public";
/**
 * service  服务接口
 * RequestServiceAdd（服务添加）
 */
import { RequestServiceAdd, RequestServiceIcon, RequestServiceIconItem, RequestServiceEditor } from "@/fetch/modules/service";

let self;
export default {
  components: { iconUplaod },
  props: {
    /**
     * 1.弹框显示隐藏（外部控制）
     */
    dialogVisibleBefore: {
      type: Boolean,
      default: false
    },
    /**
     * 1. 标题自定义
     */
    title: {
      type: String,
      default: "标题"
    },
    /**
     * 1.表单数据
     */
    dataForm: {
      type: Object,
      default: function() {
        return {
          service_title: "", // 服务名称
          service_pic: "", // 服务ICON
          service_desc: "", // 服务描述

          related_tmpl: "5", // 关联板块
          need_audit: "2", // 随手拍类型

          service_app_state: "1", // app端是否开通 1开通 2不开通
          service_app_url: "", // 跳转参数
          service_app_run: "0", // app端跳转方式 0不跳转 1原生 2H5

          service_web_state: "1", // 网页端是否开通 1开通 2不开通
          service_web_url: "", // 跳转参数
          service_web_run: "0", // 网页端跳转方式 0不跳转 1原生 2H5

          service_mini_state: "1", // 小程序是否开通 1开通 2不开通
          service_mini_url: "", // 跳转参数  service_mini_run=3时传 {"app-id":"","path":""}
          service_mini_run: "0", // 小程序端跳转方式 0不跳转 1原生 2H5 3小程序 4 APP

          category_id: "", // 服务分类ID 上级
          service_id: "", // 服务ID 本级

          "app-id": "", // 小程序ID
          path: "" // 小程序地址
        };
      }
    },
    /**
     * 1判断是编辑状态还是添加
     *  1为添加 2为编辑
     */
    statuts: {
      type: String,
      default: ""
    }
  },
  watch: {
    /**
     * 监听外部传回的 显隐
     */
    dialogVisibleBefore() {
      this.dialogVisible = this.dialogVisibleBefore;

      if (this.form.service_web_run == "1") {
        this.web_native_url = this.form.service_web_url;
      } else if (this.form.service_web_run == "2") {
        this.web_h5_url = this.form.service_web_url;
      }

      if (this.form.service_mini_run == "1") {
        this.mini_native_url = this.form.service_mini_url;
      } else if (this.form.service_mini_run == "2") {
        this.mini_h5_url = this.form.service_mini_url;
      }

      if (this.form.service_app_run == "1") {
        this.app_native_url = this.form.service_app_url;
      } else if (this.form.service_app_run == "2") {
        this.app_h5_url = this.form.service_app_url;
      }
    },
    // 监听 path 变化
    "dataForm.path"() {
      this.miniList.map((item, index) => {
        if (item.app_id == this.form["app-id"]) {
          this.routeData = item.route_list;
        }
      });
    },
    "dataForm.service_id"() {
      this.form = Object.assign(this.form, this.dataForm);
    }
  },
  data() {
    self = this;
    return {
      form: this.dataForm,
      dialogVisible: this.dialogVisibleBefore,
      baseUrl: "https://img.sqydt.darongshutech.com/",
      miniList: [],
      routeData: [],
      selectMark: true,
      selectArrImg: [],

      mini_h5_url: "",
      mini_native_url: "",
      web_h5_url: "",
      web_native_url: "",
      app_h5_url: "",
      app_native_url: "",
      iconItem: {
        attr: [],
        color: [],
        recom_attr: []
      },
      iconSearch: {
        attr_id: "0",
        current_page: 1,
        page_size: 33,
        color: "",
        q: "",
        total: 0
      }
    };
  },
  created() {
    this.miniData();

    this.getServiceIconItem();
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
    /**
     * 1.取消弹框，并且清除数据
     * */
    cancle(formName) {
      this.$refs[formName].resetFields();
      this.update();
      this.dialogVisible = false;
    },
    /**
     * 1.form表单提交
     * 2.验证表单
     * 3.数据回调
     * 4.关闭弹框，清除内容
     */
    submitForm(formName) {
      let _self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _data = JSON.parse(JSON.stringify(this.form));

          if (_data.related_tmpl != "0") {
            _data.service_app_state = "1";
            _data.service_app_url = "";
            _data.service_app_run = "0";
            _data.service_web_state = "1";
            _data.service_web_url = "";
            _data.service_web_run = "0";
            _data.service_mini_state = "1";
            _data.service_mini_url = "";
            _data.service_mini_run = "0";
          } else if (_data.related_tmpl != "2") {
            _data.need_audit = "2";
          }

          if (this.statuts == 1) {
            for (let i in _data) {
              if (_data[i] == "") {
                delete _data[i];
              }
            }
            // 添加
            RequestServiceAdd(_data).then(res => {
              if (res.code == 2000) {
                this.$message.success(res.msg);
                setTimeout(function() {
                  // _self.$router.go(0);
                  window.location.reload();
                }, 200);
              } else {
                this.$message.error(res.msg);
              }
              self.$refs["form"].resetFields();
              for (let i in this.form) {
                this.form[i] ? (this.form[i] = "") : "";
              }
              self.dialogVisible = false;
              // self.$emit("sure", res);
            });
          } else if (this.statuts == 2) {
            RequestServiceEditor(_data).then(res => {
              if (res.code == 2000) {
                this.$message.success(res.msg);
                setTimeout(function() {
                  // _self.$router.go(0);
                  window.location.reload();
                }, 2000);
              } else {
                this.$message.error(res.msg);
              }
              self.$refs["form"].resetFields();
              self.update();
              self.dialogVisible = false;
              // self.$emit("sure", res);
            });
          }
          self.$emit("sure");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 1.关闭前的回调，并且清除内容
     */
    handleClose() {
      this.$refs["form"].resetFields();
      this.update();
      this.dialogVisible = false;
    },
    /**
     * 1. 图片上传成功回调
     */
    handleSuccess(res, file) {
      this.form = Object.assign(this.form, { service_pic: res.key });
      console.log(this.form.service_pic);
    },
    // update更新数据
    update() {
      for (let i in this.form) {
        this.form[i] ? (this.form[i] = "") : "";
      }
      for (let i in this.dataForm) {
        this.dataForm[i] ? (this.dataForm[i] = "") : "";
      }
    },

    // 小程序redio选择
    handleChangeMiniRedio(value) {
      if (value == "2") {
        this.form.service_mini_url = this.mini_h5_url;
      } else if (value == "1") {
        this.form.service_mini_url = this.mini_native_url;
      } else {
        this.form.service_mini_url = "";
      }
    },
    //h5redio选择
    handleChangeH5Redio(value) {
      if (value == "2") {
        this.form.service_web_url = this.web_h5_url;
      } else if (value == "1") {
        this.form.service_web_url = this.web_native_url;
      } else {
        this.form.service_web_url = "";
      }
    },
    // app redio选择
    handleChangeAppRedio(value) {
      if (value == "2") {
        this.form.service_app_url = this.app_h5_url;
      } else if (value == "1") {
        this.form.service_app_url = this.app_native_url;
      } else {
        this.form.service_app_url = "";
      }
    },

    // appID选择
    handleSelectAppId(value) {
      this.form.path = "";
      this.miniList.map((item, index) => {
        if (item.app_id == value) {
          this.routeData = item.route_list;
        }
      });
    },
    // 关联板块切换
    changeRelatedTmpl(val) {
      console.log("val", val);
    },
    //选择图片
    selectPicture(item) {
      this.form.service_pic = item.icon_url;
    },
    //服务图标
    getServiceIcon() {
      RequestServiceIcon(this.iconSearch).then(res => {
        this.iconSearch.total = res.total_num;
        this.selectArrImg = res.list;
      });
    },
    getServiceIconItem() {
      RequestServiceIconItem({}).then(res => {
        // console.log(res);
        res.color.map((item, index) => {
          if (item.color_value == "#00A2FF") {
            this.iconSearch.color = item.color_id;
          }
        });
        res.recom_attr.map((item, index) => {
          // console.log(typeof item.attr_id)
          if (typeof item.attr_id == "number") {
            item.attr_id = item.attr_id.toString();
          }
        });
        this.iconItem = Object.assign(this.iconItem, res);
        this.getServiceIcon();
      });
    },
    handleColor(val) {
      this.iconSearch.color = val.color_id;
      this.getServiceIcon();
    },
    handleRecom(val) {
      // if(val.attr_id!=-1){
      this.iconSearch.attr_id = val.attr_id;
      this.iconSearch.current_page = 1;
      this.getServiceIcon();
      // }
    },
    handleSearch() {
      this.getServiceIcon();
    },
    handleAttr(val) {
      this.iconSearch.attr_id = val;
      this.iconSearch.current_page = 1;
      this.getServiceIcon();
    },
    pageChange(val) {
      this.iconSearch.current_page = val;
      this.getServiceIcon();
    }
  }
};
</script>

<style scoped>
.daliog-line {
  height: 20px;
  border-bottom: 2px #66b1ff dotted;
  margin-bottom: 20px;
}
.selectimg-wrap {
  border: 1px #f2f2f2 solid;
  padding: 0 10px 10px 10px;
  border-radius: 5px;
}
.selectimg-wrap img {
  margin-right: 10px;
  width: 60px;
  height: 60px;
  cursor: pointer;
}

.need-audit-box p {
  line-height: 20px;
  margin: 0;
  color: #ffa8a8;
}
.select-img-search {
  display: flex;
  align-items: center;
  align-items: center;
  justify-content: flex-start;
  margin: 15px 0;
}
.select-search-tag {
  padding: 3px 5px;
  border: 1px #f2f2f2 solid;
  cursor: pointer;
}
.select-search-tag + .select-search-tag {
  border-left: none;
}
.select-active {
  background: #39bcf3;
  border: 1px #39bcf3 solid;
  color: #fff;
}
.select-search-color {
  width: 30px;
  height: 28px;
  cursor: pointer;
}
.select-color-active {
  border: 3px #000 solid;
}
.select-search-left + .select-search-left {
  margin-left: 20px;
}
</style>


