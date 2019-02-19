<template>
  <div class="a-wrapper">
    <el-card>
      <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="demo-form">
        <el-form-item label="活动标题：" prop="activity_title">
          <el-input v-model="form.activity_title" placeholder="活动标题不能超过30个字" :maxlength="30" style="width:750px"></el-input>
        </el-form-item>
        <el-form-item label="活动封面：" prop="activity_pic">
          <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div style="color:red">点击图片重新上传</div>
          <span style="color:#ffcc00">建议上传大图上传750*360，小图上传220*150的图片，仅支持上传：".png", ".jpg", ".jpeg", ".gif"等格式文件)</span>
        </el-form-item>
        <el-form-item label="活动时间：" required prop="dataTime">
          <el-date-picker v-model="form.dataTime" type="datetimerange" :clearable='false' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change='changeTime'>
          </el-date-picker>
        </el-form-item>
        <!-- 分享end -->
        <el-form-item label=" 截止报名时间：" required prop="time">
          <el-date-picker v-model="form.time" :clearable='false' type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动地点：" prop="address">
          <el-input v-model="form.address" readonly style="width:600px"></el-input>
          <img src="../../../../static/images/login/address.png" style="position:relative;top:10px;cursor: pointer;" @click="handleMapDaliogShow" alt="">
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
        <el-form-item label="活动介绍：" prop="activity_content">
          <!-- <editor id="editor_id" height="500px" width="100%" filePostName="file" :content="form.activity_content" :afterChange="afterChange()" pluginsPath="/static/kindeditor/plugins/" :loadStyleMode="false" @on-content-change="onContentChange" :fileManagerJson="fileUpLoad" :uploadJson="uploadJson" :extraFileUploadParams="extraFileUploadParams">
          </editor> -->
          <!-- <tinymce :height="400" :id="tinymceIds" v-model="form.activity_content"></tinymce> -->
          <div style="position:relative">
            <Ueditor @changeCover="selectContent(0)" @changeContent="changeContent" :placeholderMsg="placeholderMsg" :dataObject="form.activity_content" :config="config" :id="1+''" ref="ue"></Ueditor>
          </div>
        </el-form-item>
        <el-form-item label="展示形式：">
          <div>
            <img style="width:400px;" v-if="form.need_volunteer == 1" src=" https://img.sqydt.darongshutech.com/FmLBoDVGBQ314J-RdT54XboHnF1T" alt="">
            <img style="width:400px;" v-if="form.need_volunteer == 2" src="https://img.sqydt.darongshutech.com/FnsoR0SEXfmNXfRE9CWceuDgtDu1" alt="">
          </div>
        </el-form-item>
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
        <share-template v-if="templateData.length>0" :share_desc="form.share_desc" :share_pic="form.share_pic" :curTitle="form.activity_title" :templateData="templateData" @getShare="shareChange"></share-template>
        <!-- </el-form-item> -->

        <!-- <el-form-item label="投放区域：" prop="service_id" :rules="[
      { required: true, message: '请选择投放区域', trigger: 'blur' },
    ]">
          <el-select v-model="category_id" placeholder="请选择" @change="changeCategory">
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
          <el-button @click="cancelEdit">取消</el-button>
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
                <el-form-item prop="attr_value" ref="classForm" :rules="[
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
// 富文本编译器
import Ueditor from "@/components/ue/ueditor.vue";
import ShareTemplate from "@/components/ShareTemplate/index.vue";
// service 数据接口（分类列表,活动修改,详情）
// import Tinymce from "../../../components/Tinymce/index.vue";
import { RequestActiveAttr, RequestActiveEditor, RequestActiveDetail, RequestActiveVolunteerAttr, RequestEditAttr, RequestActiviePreview, RequestServiceRun, RequestServiceIcon, RequestDeleteAttr, RequestServiceClassAdd } from "@/fetch/modules/service.js";

// service 数据接口（图片上传）
import { RequestUploads, RequestMpActive } from "@/fetch/modules/public.js";
// 常用工具（百度地图异步加载函数,时间处理）
import { MapJs, format } from "@/fetch/tool.js";
import { activeRules } from "@/fetch/validate.js";
import { RequestShareTheme } from "@/fetch/modules/share.js";
import Vue from "vue";
import coordtransform from "coordtransform";
Vue.use(coordtransform);
export default {
  components: { Ueditor, ShareTemplate },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.service_id = to.meta.service_id;
      vm.form.service_id = to.meta.service_id;
      vm.lastUrlId = to.meta.id;
      vm.moduleList();
      vm.getMpactivity();
      vm.getServiceList(); //获取服务投放区域
      // vm.getServiceIcon(); //获取图标
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
        enlist_max_general_num: "",
        need_volunteer: "",
        enlist_max_volunteer_num: "",
        attr_id: "",
        sponsor_name: "",
        sponsor_desc: "",
        activity_content: "",
        status: "",
        dataTime: [],
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
  watch: {
    "form.need_volunteer"() {
      if (this.form.need_volunteer == 2) {
        this.form.enlist_max_volunteer_num = "";
      }
    },
    category_id() {
      // this.form.service_id = "";
      // this.createClassForm.category_id = this.category_id;
      // this.options1.map((item, index) => {
      //   if (item.category_id == this.category_id) {
      //     this.options2 = item.service_list;
      //   }
      // });
    }
  },
  created() {
    // this.moduleList();
    //this.getServiceList(); //获取服务投放区域
    this.getShareTheme();
  },

  mounted() {
    // 百度地图初始化
    // this.$nextTick(function() {
    var th = this;
    // MapJs("iyUj8juV15MB8qGwiM6BfwebPs3cUMOm").then(BMap => {
    // 创建Map实例
    var map = new BMap.Map("allmap");
    var maker = [];
    if (th.$route.query.lng) {
      let langLatArr = coordtransform.gcj02tobd09(th.$route.query.lng, th.$route.query.lat);
      let markers = new BMap.Marker({
        lng: langLatArr[0],
        lat: langLatArr[1]
      });
      maker.push(markers);
      map.addOverlay(markers);
      // 初始化地图,设置中心点坐标，
      var point = new BMap.Point(langLatArr[0] || 104.07, langLatArr[1] || 30.67);
      map.centerAndZoom(new BMap.Point(langLatArr[0] || 104.07, langLatArr[1] || 30.67), 15);
    } else {
      var point = new BMap.Point(104.07, 30.67); // 创建点坐标，汉得公司的经纬度坐标
      map.centerAndZoom(new BMap.Point(104.07, 30.67), 11);
    }

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
        // maker.push(mk);
        // for (var i = 0; i < maker.length; i++) {
        //   map.removeOverlay(maker[i]);
        // }
        map.clearOverlays(); //清除地图上所有覆盖物
        map.addOverlay(mk); //增加一个标示到地图上
        th.address_detail = rs.address + title;
        th.userlocation.lng = e.point.lng;
        th.userlocation.lat = e.point.lat;
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
        // setPlace();
      });
    }
    map.addEventListener("click", showInfo);
    if (!th.$route.query.lng) {
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
     * 1.地图地理位置获取
     */
    // geolocation.getCurrentPosition(
    //   function(r) {
    //     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
    //       var langLatArrAll = coordtransform.gcj02tobd09(
    //         th.form.lng,
    //         th.form.lat
    //       ); //国测局坐标转百度经纬度坐标
    //       var mk = new BMap.Marker({
    //         lng: langLatArrAll[0],
    //         lat: langLatArrAll[1]
    //       });
    //       maker.push(mk);
    //       map.addOverlay(mk);
    //       map.panTo(r.point);
    //     } else {
    //       alert("failed" + this.getStatus());
    //     }
    //   },
    //   { enableHighAccuracy: true }
    // );

    /**
     * 1.地图搜索
     */
    var myValue;
    ac.addEventListener("onconfirm", function(e) {
      //鼠标点击下拉列表后的事件
      // console.log("aaaaaaaaaaaaaaaa", e);
      var _value = e.item.value;
      myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      th.address_detail = myValue;
      th.userlocation.lng = e.target.yd.src.Oe.lng;
      th.userlocation.lat = e.target.yd.src.Oe.lat;
      var mk = new BMap.Marker({
        lng: e.target.yd.src.Oe.lng,
        lat: e.target.yd.src.Oe.lat
      });
      maker.push(new BMap.Marker(mk));
      setPlace();
    });

    function setPlace() {
      map.clearOverlays(); //清除地图上所有覆盖物
      function myFun() {
        th.userlocation = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        // console.log(th.userlocation);
        map.centerAndZoom(th.userlocation, 15);
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
        console.log("111", this.form);
      });
    },
    selectContent(type) {},
    changeContent(val) {
      this.form.content = val;
    },
    changeCategory() {
      this.form.service_id = "";
      this.createClassForm.category_id = this.category_id;
      this.options1.map((item, index) => {
        if (item.category_id == this.category_id) {
          this.options2 = item.service_list;
        }
      });
    },
    // 详情获取
    getDetail() {
      let _self = this;
      let args = {
        activity_id: this.$route.query.activity_id
      };
      RequestActiveDetail(args).then(res => {
        // (res.enlist_max_general_num = res.enlist_max_general_num
        //   ? res.enlist_max_general_num
        //   : 1),
        //   (res.enlist_max_volunteer_num = res.enlist_max_volunteer_num
        //     ? res.enlist_max_volunteer_num
        //     : 0);
        // console.log("this.form", res);
        // return false;
        // Object.assign(JSON.parse(JSON.stringify(res)), this.form)
        this.form = Object.assign(this.form, res);
        this.category_id = res.category_id;
        this.service_id = res.service_id;
        this.createClassForm.category_id = this.category_id;
        this.options1.map((item, index) => {
          if (item.category_id == this.category_id) {
            this.options2 = item.service_list;
          }
        });
        // console.log("________111", this.form);
        // return false;
        let arr = [];
        // window.tinymce.get(this.tinymceIds).setContent(this.form.activity_content);
        arr.push(new Date(res.activity_starttime));
        arr.push(new Date(res.activity_endtime));

        // arr.push(new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10))
        this.form.dataTime = arr;
        this.form.time = res.enlist_endtime ? new Date(res.enlist_endtime) : "";
        this.imageUrl = res.activity_pic ? res.IMG_HOST + res.activity_pic : "";
        this.form.enlist_max_volunteer_num = parseInt(this.form.enlist_max_volunteer_num ? this.form.enlist_max_volunteer_num : "0");
        this.form.enlist_max_general_num = parseInt(this.form.enlist_max_general_num ? this.form.enlist_max_general_num : "0");
        this.form.activity_list = res.link_third_miniprogram || [];
        if (res.link_third_miniprogram) {
          res.link_third_miniprogram.forEach(row => {
            this.mpActiveData.forEach(val => {
              if (row.branch_id == val.branch_id && row.service_id == val.service_id) {
                setTimeout(() => {
                  _self.$refs.mpActiveDataTable.toggleRowSelection(val, true);
                }, 1);
              }
            });
          });
        }
        console.log(res, this.form);
      });
    },
    cancelClassFiy() {
      this.modulesOptions = this.modulesOptions.map((item, index) => {
        item.editMark = false;
        return item;
      });
    },
    //服务图标
    getServiceIcon() {
      RequestServiceIcon({ page_size: 100 }).then(res => {
        this.selectArrImg = res.list;
      });
    },
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
          this.mpActiveData.forEach((val, index) => {
            if (val.service_id == this.service_id && val.branch_id == this.$route.query.activity_id) {
              // console.log("val______", val);
              this.mpActiveData.splice(index, 1);
            }
          });
          this.getDetail();
        }
      });
    },
    handleSelectionChangeMpActive(val) {
      this.form.activity_list = val;
      // console.log(this.form.activity_list);
    },
    // 活动查询
    handleSearch(val) {
      RequestMpActive({
        current_page: 1,
        page_size: 1000,
        q: this.activeSearch.q,
        type: this.activeSearch.type
      }).then(res => {
        if (res) {
          this.mpActiveData = res;
          this.mpActiveData.forEach((val, index) => {
            if (val.service_id == this.service_id && val.branch_id == this.$route.query.activity_id) {
              // console.log("val______", val);
              this.mpActiveData.splice(index, 1);
            }
          });
        }
      });
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
      console.log(this.$refs["classForm"]);
      // this.$refs["classForm"].clearValidate(); // 清除年龄的验证
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
      if (index == 0) {
        if (this.form.activity_title == "") {
          this.$message.error("请输入活动标题");
        } else {
          this.requestFn(index);
        }
        return false;
      }
      this.form.activity_content = this.form.content;
      this.$refs[formName].validate(valid => {
        if (valid) {
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
          var activity_id = this.$route.query.activity_id;
          if (status == 0) {
            this.$router.push({ path: "activeList" + this.lastUrlId });
          } else {
            this.$router.push({ path: "activeList" + this.lastUrlId });
          }
          this.$store.dispatch("delVisitedViews", {
            path: "/active" + "/activeEditor" + this.lastUrlId
          });
        })
        .catch(() => {
          // this.$router.push({ path: "activeDraft" });
          // this.$store.dispatch("delVisitedViews", {
          //   path: "/active/activeEditor"
          // });
        });
    },
    requestFn(index) {
      let self = this;
      this.form.activity_starttime = format(this.form.dataTime[0], "yyyy-MM-dd HH:mm:ss");
      this.form.activity_endtime = format(this.form.dataTime[1], "yyyy-MM-dd HH:mm:ss");
      this.form.enlist_endtime = format(this.form.time, "yyyy-MM-dd HH:mm:ss");
      if (this.form.need_volunteer == 2) {
        this.form.enlist_max_volunteer_num == 0;
      }
      let args = JSON.parse(JSON.stringify(this.form));

      args.status = index;
      if (this.$route.query.statusTwo != 1) {
        if (this.$route.query.active == 1 && index == 0) {
          this.$confirm("如果保存草稿箱，当前活动将在小程序端下架，请在草稿箱中查看，是否保存草稿箱？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              RequestActiveEditor(args).then(res => {
                var activity_id = self.$route.query.activity_id;
                var active = self.$route.query.active;
                if (res.code == 2000) {
                  if (index == 1) {
                    self.$router.push({ path: "activeList" + this.lastUrlId });
                    self.$store.dispatch("delVisitedViews", {
                      path: "/active" + "/activeEditor" + this.lastUrlId
                    });
                  } else if (index == 0) {
                    self.$router.push({ path: "activeList" + this.lastUrlId });
                    this.$store.dispatch("delVisitedViews", {
                      path: "/active" + "/activeEditor" + this.lastUrlId
                    });
                  } else {
                    self.$message.error(res.msg);
                  }
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
        } else {
          RequestActiveEditor(args).then(res => {
            var activity_id = this.$route.query.activity_id;
            if (res.code == 2000) {
              if (index == 1) {
                self.$router.push({ path: "activeList" + this.lastUrlId });
                this.$store.dispatch("delVisitedViews", {
                  path: "/active" + "/activeEditor" + this.lastUrlId
                });
              } else if (index == 0) {
                self.$router.push({ path: "activeList" + this.lastUrlId });
                self.$store.dispatch("delVisitedViews", {
                  path: "/active" + "/activeEditor" + this.lastUrlId
                });
              } else {
                this.$message.error(res.msg);
              }
            }
          });
        }
      } else {
        RequestActiveEditor(args).then(res => {
          var activity_id = this.$route.query.activity_id;
          if (res.code == 2000) {
            if (index == 1) {
              this.$router.push({ path: "activeList" + this.lastUrlId });
              this.$store.dispatch("delVisitedViews", {
                path: "/active" + "/activeEditor" + this.lastUrlId
              });
            } else if (index == 0) {
              this.$router.push({ path: "activeList" + this.lastUrlId });
              this.$store.dispatch("delVisitedViews", {
                path: "/active" + "/activeEditor" + this.lastUrlId
              });
            } else {
              this.$message.error(res.msg);
            }
          }
        });
      }
    },
    // 活动分类列表
    moduleList() {
      RequestActiveAttr({ service_id: this.service_id }).then(res => {
        this.modulesOptions = res;
        // console.log(this.modulesOptions)
      });
    },
    // 富文本 值获取
    onContentChange(val) {
      console.log("富文本", val);
      this.form.activity_content = val;
    },
    afterChange() {},
    fileUpLoad(e) {
      console.log("sdffff", e);
    },
    afterUpload(e) {},
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
    hangleMap() {
      // console.log("aaaaaaaaaaa", this.userlocation);
      if (this.userlocation.lng && this.userlocation.lat) {
        //百度经纬度坐标转国测局坐标
        // console.log(this.userlocation);
        let langLatArr = coordtransform.bd09togcj02(this.userlocation.lng, this.userlocation.lat);
        this.form.lng = langLatArr[0];
        this.form.lat = langLatArr[1];
        this.form.address = this.address_detail + this.address_detail_2;
        this.mapDaliogShow = false;
      }
    },
    handleMapDaliogShow() {
      this.mapDaliogShow = true;
      // console.log(this.form);
      this.userlocation.lng = this.form.lng;
      this.userlocation.lat = this.form.lat;
      this.address_detail = this.form.address;
    },
    callBack() {
      this.$router.go(-1);
    },
    changeTime(e) {
      // console.log("sss", e);
      this.form.dataTime = e;
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.a-wrapper {
  margin: 30px 15px;
  font-size: 14px;
}
.avatar-uploader,
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}
.avatar-uploader,
.el-upload:hover {
  border-color: #409eff;
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

