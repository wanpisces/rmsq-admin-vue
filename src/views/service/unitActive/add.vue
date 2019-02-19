<template>
  <div class="a-wrapper">
    <el-card>
      <div>

      </div>
      <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="demo-form">
        <el-form-item label="活动标题：" prop="activity_title">
          <el-input v-model="form.activity_title" placeholder="标题不能超过30个字" :maxlength="30" :minlength="1" style="width:750px"></el-input>
        </el-form-item>
        <el-form-item label="活动封面：" prop="activity_pic">
          <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span style="color:#ffcc00">建议上传大图上传750*360，小图上传220*150的图片，仅支持上传：".png", ".jpg", ".jpeg", ".gif"等格式文件)</span>
        </el-form-item>
        <el-form-item label=" 截止报名时间：" required prop="time">
          <el-date-picker v-model="form.time" type="datetime" :clearable='false' placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动时间：" required prop="dataTime">
          <el-date-picker v-model="form.dataTime" :clearable='false' type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeTime">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="活动地点：" prop="address">
          <el-input v-model="form.address" readonly style="width:600px"></el-input>
          <img src="../../../../static/images/login/address.png" style="position:relative;top:10px;cursor: pointer;" @click="mapDaliogShow=true" alt="">
          <span style="color:#ffcc00">温馨提示：获取活动地点请点击左方的地址按钮！！</span>
        </el-form-item>
        <el-form-item label="报名人数：" prop="enlist_max_general_num">
          <el-input v-model.number="form.enlist_max_general_num" :minlength="1" :maxlength="5000" style="width:750px"></el-input>
        </el-form-item>
        <el-form-item label="是否需要志愿者：" prop="need_volunteer">
          <el-radio-group v-model="form.need_volunteer">
            <el-radio label="1">需要</el-radio>
            <el-radio label="2">不需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="志愿者人数：" v-if="form.need_volunteer==1" prop="enlist_max_volunteer_num">
          <el-input v-model.number="form.enlist_max_volunteer_num" :minlength="1" :maxlength="5000" style="width:750px"></el-input>
        </el-form-item>
        <el-form-item label="活动主办方：" prop="sponsor_name">
          <el-input v-model="form.sponsor_name" placeholder="活动主办方名不能超过20个字" :maxlength="20" style="width:750px"></el-input>
        </el-form-item>
        <el-form-item label="活动分类：" prop="attr_id">
          <el-select v-model="form.attr_id" placeholder="请选择分类">
            <el-option v-for="item in modulesOptions" :key="item.attr_id" :label="item.attr_value" :value="item.attr_id">
            </el-option>
          </el-select>
          <el-button type="primary" @click="handleAdd">管理活动类型</el-button>
        </el-form-item>
        <el-form-item label="主办方简介：" prop="sponsor_desc">
          <el-input type="textarea" v-model="form.sponsor_desc" style="width:750px"></el-input>
        </el-form-item>
        <el-form-item label="活动介绍：" prop="content">
          <!-- <editor id="editor_id" height="500px" width="100%" filePostName="file" :content="form.activity_content" :afterChange="afterChange()" pluginsPath="/static/kindeditor/plugins/" :loadStyleMode="false" @on-content-change="onContentChange" :fileManagerJson="fileUpLoad" :uploadJson="uploadJson" :extraFileUploadParams="extraFileUploadParams"> -->

          <!-- </editor> -->
          <!-- <tinymce :height="400" :id="tinymceIds" v-model="form.activity_content"></tinymce> -->
          <div style="position:relative">
            <Ueditor @changeCover="selectContent(0)" @changeContent="changeContent" :placeholderMsg="placeholderMsg" :dataObject="form.activity_content" :config="config" :id="1+''" ref="ue"></Ueditor>
          </div>
        </el-form-item>
        <!-- <el-form-item label="展示形式：">
          <div>
            <img style="width:400px;" v-if="form.need_volunteer == 1" src=" https://img.sqydt.darongshutech.com/FmLBoDVGBQ314J-RdT54XboHnF1T" alt="">
            <img style="width:400px;" v-if="form.need_volunteer == 2" src="https://img.sqydt.darongshutech.com/FnsoR0SEXfmNXfRE9CWceuDgtDu1" alt="">
          </div>
        </el-form-item> -->

        <el-form-item label=" 是否关联活动： ">
          <el-radio-group v-model="form.link_miniprogram">
            <el-radio :label="2">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="已选择:" v-show="form.link_miniprogram==1">
          <ol class="">
            <li v-for="(item,index) in form.activity_list" :key="index">{{ item.service_title || item.title}}</li>
          </ol>
        </el-form-item>
        <el-form-item label="关联活动:" v-show="form.link_miniprogram==1" style="600px">

          <div style="margin-bottom:10px">
            <el-input v-model="activeSearch.q" placeholder="请输入活动名称" style="width:200px"></el-input>
            <el-select v-model="activeSearch.type" placeholder="请选择">
              <el-option key="0" label="全部" :value="0"></el-option>
              <el-option key="1" label="社区活动" :value="1"></el-option>
              <!-- <el-option key="2" label="随手拍（审核）" :value="2"></el-option> -->
              <el-option key="3" label="随手拍（不审核）" :value="3"></el-option>
              <el-option key="4" label="投票" :value="4"></el-option>
              <el-option key="5" label="评选" :value="5"></el-option>
              <el-option key="6" label="问卷调查" :value="6"></el-option>
            </el-select>
            <el-button @click="handleSearch(2)" type="primary"> 搜索</el-button>
          </div>
          <el-table ref="mpActiveDataTable" height="200" :data="mpActiveData" tooltip-effect="dark" style="width: 80%" @selection-change="handleSelectionChangeMpActive">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label="类型" width="120">
              <template slot-scope="scope">{{{1:'社区活动',2:'随手拍（审核）',3:"随手拍（不审核）",4:'投票',5:'评选',6:'问卷调查'}[scope.row.type] }}</template>
            </el-table-column>
            <el-table-column prop="service_title" label="活动名称" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- <el-form-item label="分享样式设置："> -->
        <share-template v-if="templateData.length>0" :share_desc="form.share_desc" :share_pic="form.share_pic" :curTitle="form.activity_title" @getShare="shareChange" :templateData="templateData"></share-template>
        <!-- </el-form-item> -->
        <!-- <el-form-item label="投放区域：" prop="service_id" :rules="[
      { required: true, message: '请选择投放区域', trigger: 'blur' },
    ]">
          <el-select v-model="category_id" placeholder="请选择">
            <el-option v-for="(item,index) in options1" :key="index" :label="item.category_name" :value="item.category_id">
            </el-option>
          </el-select>
          <el-select v-model="form.service_id" collapse-tags style="margin-left: 20px;" placeholder="请选择">
            <el-option v-for="(item,index) in options2" :key="index" :label="item.service_title" :value="item.service_id">
            </el-option>
          </el-select>
          <el-button type="primary" @click="createdClassfiy">创建分类</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('form',1)">发布活动</el-button>
          <!-- <el-button type="primary" @click="submitForm('form',2)">活动预览</el-button> -->
          <el-button type="primary" @click="submitForm('form',0)">保存草稿箱</el-button>
          <el-button @click="cancelEdit">
            取消
            <!-- <router-link :to="{path:'activeList'}"> 取消</router-link> -->
          </el-button>

        </el-form-item>
      </el-form>

      <div>
        <!-- <div id="all">
                    <input type="text" id="suggestId" name="address_detail" placeholder="地址" v-model="address_detail" class="input_style">
                    <div id="allmap"></div>
              </div> -->
        <div style="margin-top:30px"></div>
      </div>

    </el-card>
    <!-- 地址选择 -->
    <transition name="fade">
      <div v-show="mapDaliogShow" class="map">
        <div id="all">
          <div>
            获取地址：<input type="text" id="suggestId" name="address_detail" placeholder="点击地图获取地址" v-model="address_detail" class="input_style">
          </div>
          <div style="margin:10px 0">
            详细地址：<input type="text" class="detail" v-model="address_detail_2" placeholder="请输入详细地址">
          </div>
          <div id="allmap"></div>
          <div align="right">
            <el-button @click="mapDaliogShow=false">取消</el-button>
            <el-button type="primary" @click="hangleMap">确定</el-button>
          </div>
        </div>
      </div>
    </transition>
    <!-- 添加分类 -->
    <el-dialog title="管理活动分类" :visible.sync="attrDialogVisible" width="700px">
      <el-form :model="formAddAttr" ref="formAddAttr" label-width="100px" style="margin-top:20px;" class="demo-form">
        <el-form-item label="分类名称：" prop="attr_value" :rules="[
      { required: true, message: '请输入分类名称', trigger: 'blur' },
      { message: '分类名称不能超过10个字',min:1,max:10, trigger: 'blur'}]">
          <el-input v-model="formAddAttr.attr_value" style="width:400px;" placeholder="分类名称不能超过10个字"></el-input>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAddAttr('formAddAttr')">添加</el-button>
        </el-form-item>
      </el-form>
      <div style="max-height:400px;overflow-y:scroll">
        <el-table :data="modulesOptions" style="width: 100%" ref="table" element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading">
          <el-table-column label="分类名称">
            <template slot-scope="scope">
              <span v-if="!scope.row.editMark">{{scope.row.attr_value}}</span>
              <el-form :model="formAddAttr1" ref="formAddAttr1" v-if="scope.row.editMark">
                <el-form-item prop="attr_value" :rules="[
      { required: true, message: '请输入分类名称', trigger: 'blur' },
      { message: '分类名称不能超过10个字',min:1,max:10, trigger: 'blur'}]">
                  <el-input v-model="formAddAttr1.attr_value" style="width:400px;" placeholder="分类名称不能超过10个字"></el-input>
                  <el-button type="text" @click="handelSaveAttr(scope.row,'formAddAttr1')">确定</el-button>
                  <el-button type="text" @click="cancelClassFiy">取 消</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <!-- v-if="scope.row.attr_type == 1" -->
            <template slot-scope="scope" v-if="scope.row.attr_type == 1">
              <el-button type="primary" size="mini" circle icon="el-icon-edit-outline" @click="handleEditAttr(scope)"></el-button>
              <el-button type="danger" size="mini" circle icon="el-icon-delete" @click="handleDeleteAttr(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="attrDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加分类 -->
    <el-dialog title="创建分类" :visible.sync="classMark" width="700px">
      <el-form :model="createClassForm" ref="createClassForm" label-width="150px" style="margin-top:20px;" class="demo-form">
        <div v-if="!addMark">
          <div class="classfiy-tit">选择一级分类</div>
          <el-form-item label="选择分类：" prop="category_id" :rules="[
      { required: true, message: '请选择分类', trigger: 'blur' }]">
            <el-select v-model="createClassForm.category_id" placeholder="请选择分类">
              <el-option v-for="(item,index) in options1" :key="index" :label="item.category_name" :value="item.category_id">
              </el-option>
            </el-select>
            <p>如没有您需要的分类，点击
              <el-button type="text" @click="addAttr">添加分类</el-button>
            </p>
          </el-form-item>
        </div>
        <div v-if="addMark">
          <div class="classfiy-tit">创建一级分类</div>
          <el-form-item label="输入分类：" prop="category_name" :rules="[
      { required: true, message: '请输入分类名称', trigger: 'blur' },
      { message: '分类名称不能超过6个字',min:1,max:6, trigger: 'blur' }
    ]">
            <el-input v-model="createClassForm.category_name" placeholder="请输入一级分类，名称不能超过6个字"></el-input>
            <p>已有一级分类，点击
              <el-button type="text" @click="selectAttr">选择分类</el-button>
            </p>
          </el-form-item>
        </div>
        <div class="classfiy-tit">创建二级分类</div>
        <el-form-item label="分类名称：" prop="service_title" :rules="[
      { required: true, message: '请输入分类名称', trigger: 'blur' },
       { message: '分类名称不能超过6个字',min:1,max:6, trigger: 'blur' }
    ]">
          <el-input v-model="createClassForm.service_title" placeholder="请输入二级分类，名称不能超过6个字"></el-input>
        </el-form-item>
        <el-form-item label="选择图标：" prop="service_pic" :rules="[
      { required: true, message: '请选择图标', trigger: 'blur' },
    ]">
          <p style="font-size:40px;padding:0;margin:0;color:#409EFF; display:inline-block;cursor: pointer;" @click="selectMark = !selectMark;">
            <i v-if="!createClassForm.service_pic" class="el-icon-picture" style="font-size:70px;"></i>
            <img v-if="createClassForm.service_pic" :src="createClassForm.service_pic" alt="" style="width:60px;height:60px;">
            <div v-if="selectMark" class="selectimg-wrap">
              <img v-for="(item,index) in selectArrImg" :key="index" @click="selectPicture(item)" :src="item.icon_url" alt="">
            </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="classMark = false">取 消</el-button>
        <el-button type="primary" @click="handleAddServiceAttr('createClassForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=iyUj8juV15MB8qGwiM6BfwebPs3cUMOm"></script>  
<script>
// service 数据接口（分类列表,活动添加,分类添加）
// 富文本编译器
import Ueditor from "@/components/ue/ueditor.vue";
import ShareTemplate from "@/components/ShareTemplate/index.vue";
import Vue from "vue";
// import Tinymce from "../../../components/Tinymce/index.vue";
import { RequestActiveAttr, RequestDeleteAttr, RequestActiveAdd, RequestActiveVolunteerAttr, RequestEditAttr, RequestActiviePreview, RequestServiceRun, RequestServiceIcon, RequestServiceClassAdd } from "@/fetch/modules/service.js";
// service 数据接口（图片上传）
import { RequestUploads, RequestMpActive } from "@/fetch/modules/public.js";
// 常用工具（百度地图异步加载函数,时间处理,时间大小判定）
import { MapJs, format, compareTime } from "@/fetch/tool.js";
import { activeRules } from "@/fetch/validate.js";
import { RequestShareTheme } from "@/fetch/modules/share.js";
// import BMap from "BMap";
// import Vue from "vue";
import coordtransform from "coordtransform";
Vue.use(coordtransform);
export default {
  components: { Ueditor, ShareTemplate },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.service_id = to.meta.service_id;
      vm.form.service_id = to.meta.service_id;
      // console.log(vm.service_id, to.meta.service_id);
      vm.lastUrlId = to.meta.id;
      vm.moduleList();
    });
  },
  data() {
    return {
      rules: activeRules,
      tinymceIds: "tinymceIds",
      form: {
        activity_title: "",
        activity_pic: "",
        activity_starttime: "",
        activity_endtime: "",
        enlist_endtime: "",
        address: "",
        delivery: false,
        lng: "",
        lat: "",
        type: [],
        enlist_max_general_num: null,
        need_volunteer: "",
        enlist_max_volunteer_num: null,
        attr_id: "",
        sponsor_name: "",
        sponsor_desc: "",
        activity_content: "",
        status: "",
        dataTime: "",
        time: "",
        service_id: "",
        activity_list: [],
        link_miniprogram: 2, // 是否关联活动
        content: "",
        share_pic: "",
        share_desc: ""
      },
      activeSearch: {
        q: "",
        type: 0
      },
      mpActiveData: [],
      category_id: "",
      service_id: "",
      lastUrlId: "",
      formAddAttr: { attr_value: "" }, //
      formAddAttr1: { attr_value: "", attr_id: "" }, //
      createClassForm: {
        service_title: "",
        service_pic: "",
        service_desc: "",
        category_id: "",
        service_web_state: 2,
        category_name: "",
        service_title: "",
        related_tmpl: 1
      },
      classMark: false,
      selectMark: false,
      addMark: false,
      selectArrImg: [],
      options1: [],
      options2: [],
      uploadJson: "api/public/kindeditor/uploads",
      extraFileUploadParams: [],
      imageUrl: "",
      mapDaliogShow: false,
      address_detail: "",
      address_detail_2: "",
      userlocation: { lng: "", lat: "" },
      modulesOptions: [],
      attrDialogVisible: false,
      config: {
        id: "myEditor",
        initialFrameWidth: 750,
        initialFrameHeight: 350,
        wordCount: false,
        elementPathEnabled: false,
        autoClearinitialContent: true
      },
      placeholderMsg: "从这里开始正文！",
      templateData: []
    };
  },
  created() {
    this.getShareTheme();
    this.getServiceList(); //获取服务投放区域
    // this.getServiceIcon(); //获取图标
    this.getMpactivity();
  },
  watch: {
    "form.need_volunteer"() {
      if (this.form.need_volunteer == 2) {
        this.form.enlist_max_volunteer_num = "";
      }
    },
    category_id() {
      this.form.service_id = "";
      this.createClassForm.category_id = this.category_id;
      this.options1.map((item, index) => {
        if (item.category_id == this.category_id) {
          this.options2 = item.service_list;
        }
      });
    }
  },

  mounted() {
    // 百度地图初始化
    // this.$nextTick(function() {
    var th = this;
    // console.log("s2-1");
    // MapJs("iyUj8juV15MB8qGwiM6BfwebPs3cUMOm").then(BMap => {
    // 创建Map实例
    // window.location.reload();
    var map = new BMap.Map("allmap");
    var maker = []; // 标记
    // 初始化地图,设置中心点坐标，
    var point = new BMap.Point(104.07, 30.67); // 创建点坐标，汉得公司的经纬度坐标
    map.centerAndZoom(new BMap.Point(104.07, 30.67), 11);
    map.enableScrollWheelZoom();
    var geolocation = new BMap.Geolocation();
    var geocoder = new BMap.Geocoder();
    var ac = new BMap.Autocomplete({
      //建立一个自动完成的对象
      input: "suggestId",
      location: map
    });
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
        th.address_detail = rs.address + title;
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

    /**
     * 1.地图搜索
     */
    var myValue;
    ac.addEventListener("onconfirm", function(e) {
      //鼠标点击下拉列表后的事件
      console.log("jianting");
      var _value = e.item.value;
      myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      th.address_detail = myValue;
      th.userlocation.lng = e.target.yd.src.Oe.lng;
      th.userlocation.lat = e.target.yd.src.Oe.lat;
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
  updated() {
    // location.reload();
  },
  methods: {
    //分享设置
    shareChange(obj) {
      this.form.share_desc = obj.share_desc;
      this.form.share_pic = obj.share_pic;
    },
    getShareTheme() {
      RequestShareTheme({ theme_type: 1 }).then(res => {
        this.templateData = res;
        this.form.share_pic = res[0].share_pic;
      });
    },
    selectContent(type) {},
    changeContent(val) {
      this.form.content = val;
    },
    cancelClassFiy() {
      this.modulesOptions = this.modulesOptions.map((item, index) => {
        item.editMark = false;
        return item;
      });
    },
    //服务图标
    // getServiceIcon() {
    //   RequestServiceIcon({ page_size: 100 }).then(res => {
    //     this.selectArrImg = res.list;
    //   });
    // },
    //服务分类添加
    handleAddServiceAttr(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var args = this.createClassForm;
          for (let i in args) {
            if (args[i] === "") {
              delete args[i];
            }
          }
          RequestServiceClassAdd(args).then(res => {
            if (res.code == 2000) {
              this.classMark = false;
              this.getServiceList();
            }
          });
        }
      });
    },
    // 获取活动列表
    getMpactivity() {
      RequestMpActive({
        current_page: 1,
        page_size: 1000,
        q: this.activeSearch.q,
        type: this.activeSearch.type
      }).then(res => {
        if (res) {
          this.mpActiveData = res;
        }
      });
    },
    handleSelectionChangeMpActive(val) {
      this.form.activity_list = val;
      // console.log(this.form.activity_list);
    },
    // 活动查询
    handleSearch(val) {
      this.getMpactivity();
    },
    //投放区域
    getServiceList() {
      let args = {
        related_tmpl: 1
      };
      RequestServiceRun(args).then(res => {
        this.options1 = res;
      });
    },
    //添加分类
    addAttr() {
      this.addMark = true;
      this.createClassForm.category_name = "";
      this.createClassForm.category_id = "";
    },
    //选择分类
    selectAttr() {
      this.addMark = false;
      this.createClassForm.category_id = "";
      this.createClassForm.category_name = "";
    },
    //选择图片
    selectPicture(item) {
      this.createClassForm.service_pic = item.icon_url;
    },
    //创建分类
    createdClassfiy() {
      this.classMark = true;
      this.createClassForm.service_title = "";
      this.createClassForm.service_pic = "";
      this.selectMark = false;
      if (!this.category_id) {
        this.addMark = true;
      } else {
        this.addMark = false;
      }
      //
    },
    //预览活动
    previewActivity() {
      let args = this.form;
      RequestActiviePreview(args).then(res => {
        console.log(res);
      });
    },
    // 分类添加
    handleAdd() {
      this.formAddAttr.attr_value = "";
      this.attrDialogVisible = true;
    },
    //编辑
    handleEditAttr(scope) {
      var modulesOptions = this.modulesOptions;
      this.formAddAttr1.attr_value = scope.row.attr_value;
      this.modulesOptions = modulesOptions.map((item, index) => {
        item.editMark = false;
        if (index == scope.$index) {
          item.editMark = true;
        }
        return item;
      });
    },
    handelSaveAttr(row, formName) {
      var attr_value = row.attr_value;
      var modulesOptions = this.modulesOptions;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var args = {
            attr_value: this.formAddAttr1.attr_value,
            attr_id: row.attr_id
          };
          RequestEditAttr(args).then(res => {
            if (res.code == 2000) {
              this.moduleList();
              this.modulesOptions = modulesOptions.map((item, index) => {
                item.editMark = false;
                return item;
              });
              this.formAddAttr1 = {
                attr_value: "",
                attr_id: ""
              };
            }
          });
        }
      });
    },
    handleAddAttr(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let args = {
            attr_value: this.formAddAttr.attr_value,
            service_id: this.service_id
          };
          RequestActiveVolunteerAttr(args).then(res => {
            if (res.code == 2000) {
              this.formAddAttr.attr_value = "";
              this.moduleList();
            }
          });
        }
      });
    },
    //分类删除
    handleDeleteAttr(row) {
      var args = {
        attr_id: row.attr_id
      };
      RequestDeleteAttr(args).then(res => {
        if (res.code == 2000) {
          this.moduleList();
        }
      });
    },
    // 提交
    submitForm(formName, index) {
      let self = this;
      if (index == 0) {
        if (this.form.activity_title == "") {
          this.$message.error("请输入活动标题");
        } else {
          this.requestFn(index);
        }
        return false;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          // compareTime(this.form.time,this.form.dataTime[0],self)
          let startDate = format(this.form.time, "yyyy-MM-dd HH:mm:ss");
          let endDate = format(this.form.dataTime[0], "yyyy-MM-dd HH:mm:ss");
          // if (startDate.length > 0 && endDate.length > 0) {
          var startDateTemp = startDate.split(" ");
          var endDateTemp = endDate.split(" ");

          var arrStartDate = startDateTemp[0].split("-");
          var arrEndDate = endDateTemp[0].split("-");

          var arrStartTime = startDateTemp[1].split(":");
          var arrEndTime = endDateTemp[1].split(":");

          var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);
          var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);

          // if (allStartDate.getTime() >= allEndDate.getTime()) {
          //   self.$message.error("报名截止时间不能超过活动开始时间");
          //   return false;
          // }
          if (this.form.link_miniprogram == 1 && this.form.activity_list.length == 0) {
            this.$message.error("请选择活动");
            return false;
          }
          if (!this.form.share_pic) {
            this.$message.error("请上传分享图片");
            return false;
          }
          if (index == 0 || index == 1) {
            this.requestFn(index);
          } else if (index == 2) {
            this.previewActivity();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消编辑
    cancelEdit() {
      var status = this.$route.query.status;
      this.$confirm("是否取消编辑?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // if (this.form.activity_title == "") {
          //   this.$message.error("请输入活动标题");
          // } else {
          //   this.requestFn(0);
          // }
          if (status == 0) {
            this.$router.push({
              path: "activeList" + this.lastUrlId
            });
          } else {
            this.$router.push({ path: "activeList" + this.lastUrlId });
          }

          this.$store.dispatch("delVisitedViews", {
            path: "/active" + "/activeAdd" + this.lastUrlId
          });
        })
        .catch(() => {
          // this.$router.push({ path: "activeList" });
          // this.$store.dispatch("delVisitedViews", {
          //   path: "/active/activeAdd"
          // });
        });
    },
    requestFn(index) {
      this.form.activity_starttime = format(this.form.dataTime[0], "yyyy-MM-dd HH:mm:ss");
      this.form.activity_endtime = format(this.form.dataTime[1], "yyyy-MM-dd HH:mm:ss");
      this.form.enlist_endtime = format(this.form.time, "yyyy-MM-dd HH:mm:ss");
      if (this.form.need_volunteer == 2) {
        this.form.enlist_max_volunteer_num == 0;
      }
      let args = JSON.parse(JSON.stringify(this.form));
      args.activity_content = args.content;
      args.status = index;
      args.share_desc = args.share_desc || args.activity_title;
      RequestActiveAdd(args).then(res => {
        // console.log(this.lastUrlId);
        if (res.code == 2000) {
          if (index == 1) {
            this.$router.push({ path: "activeList" + this.lastUrlId });
            this.$store.dispatch("delVisitedViews", {
              path: "/active" + "/activeAdd" + this.lastUrlId
            });
          } else if (index == 0) {
            this.$router.push({ path: "activeList" + this.lastUrlId });
            this.$store.dispatch("delVisitedViews", {
              path: "/active" + "/activeAdd" + this.lastUrlId
            });
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 活动分类列表
    moduleList() {
      RequestActiveAttr({ service_id: this.service_id }).then(res => {
        this.modulesOptions = res;
      });
    },
    // 富文本 值获取
    onContentChange(val) {
      this.form.activity_content = val;
    },
    afterChange() {},
    fileUpLoad(e) {
      console.log("sdffff", e);
    },
    afterUpload(e) {
      console.log("aaaaaaaaaaa");
    },
    // 图片上传
    beforeAvatarUpload(file) {
      const isJPG = file.type,
        isLt2M = file.size / 1024 / 1024 < 2,
        self = this;
      var formData = new FormData();
      formData.append("file", file);
      if (!isLt2M) {
        this.$message.error("请上传2M以下的图片");
        return false;
      }
      if (isJPG == "image/jpeg" || isJPG == "image/png" || isJPG == "image/jpeg" || isJPG == "image/gif") {
        RequestUploads(formData).then(res => {
          self.form.activity_pic = res.data.key;
          self.imageUrl = res.data.base_url + res.data.key;
        });
      } else {
        return this.$message.error("请上传图片");
      }
    },
    //地图
    hangleMap() {
      if (this.userlocation.lng && this.userlocation.lat) {
        //百度经纬度坐标转国测局坐标
        let langLatArr = coordtransform.bd09togcj02(this.userlocation.lng, this.userlocation.lat);
        console.log(langLatArr);
        this.form.lng = langLatArr[0];
        this.form.lat = langLatArr[1];
        this.form.address = this.address_detail + this.address_detail_2;
        this.mapDaliogShow = false;
      }
    },
    changeTime(e) {
      console.log("s", e);
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.a-wrapper {
  margin: 30px 15px;
  font-size: 14px;
}
.classfiy-tit {
  margin-bottom: 10px;
  padding-left: 35px;
}
.selectimg-wrap img {
  margin-right: 10px;
  width: 60px;
  height: 60px;
  cursor: pointer;
}
.avatar-uploader,
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 250px;
  height: 180px;
}
.avatar-uploader,
.el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 250px;
  height: 180px;
  line-height: 180px;
  text-align: center;
}
.avatar {
  width: 250px;
  height: 180px;
  display: block;
}
#allmap {
  width: 700px;
  height: 400px;
  font-family: "微软雅黑";
  border: 1px solid #f2f2f2;
  border-radius: 5px;
  margin: 30px 0;
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
  z-index: 1000;
}
#all {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
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
</style>

