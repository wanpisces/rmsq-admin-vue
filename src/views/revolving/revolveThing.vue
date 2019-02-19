<template>
  <div class="wrap">
    <el-card class="box-card">
      <el-form ref="form" label-width="80px">
        <el-form-item label="提交用户:">
          <span>{{formData.user_nickname}}</span>
        </el-form-item>
        <el-form-item label="提交时间:">
          <span>{{formData.create_time}}</span>
        </el-form-item>
        <el-form-item label="主题分类:">
          <span>{{formData.attr_value}}</span>
        </el-form-item>
        <el-form-item label="爆料详情:">
          <span>{{formData.case_content}}</span>
        </el-form-item>
        <el-form-item label="图片/视频:">
          <div class="img-flex">
            <!-- v-preview="formData.img_url+items" -->
            <div v-for="(items,index)  in  formData.case_pic" :key="index">
              <div>
                <img src="../../../static/images/search.png" width="20px" alt="" @click="handleImg(formData.img_url+items)">
                <!-- <div>查看大图</div> -->
              </div>
              <img :src="formData.img_url+items" alt="" width="200px" height="outo">
            </div>
          </div>
          <div v-for="(items,index)  in  formData.case_videos" :key="index" v-if="formData.case_videos.length!=0">
            <video :src="formData.img_url+items.url" controls="controls" width="300px" height="300px">
            </video>
          </div>
          <div v-if="formData.case_videos==null && formData.case_pic==null">
            无
          </div>
        </el-form-item>
        <el-form-item label="发生地点:">
          <span>{{formData.case_addr}}</span>
        </el-form-item>
        <el-form-item>
          <div id="allmap"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-edit-outline" @click="centerDialogVisible= true">办理</el-button>
          <el-button icon="el-icon-circle-close-outline" @click="cancle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="办理" :visible.sync="centerDialogVisible" width="700px" center :close-on-click-modal='false'>
      <el-form ref="form" label-width="80px" :model="form">
        <el-form-item label="跟踪人:" prop="case_tracer" :rules="[
                    { required: true, message: '请填写跟踪人的姓名', trigger: 'blur' },
                    ]">
          <el-input placeholder="请填写跟踪人的姓名" v-model="form.case_tracer"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="图片查看" :visible.sync="dialogVisible" width="750px">
      <img :src="priewImg" v-if="priewImg" width="100%" alt="">
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import coordtransform from "coordtransform";
import { RequestServiceCaseDetail, RequestServiceCaseHanle } from "@/fetch/modules/service";
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.form.service_id = to.meta.service_id;
      vm.urlLastId = to.meta.id;
      vm.getData();
    });
  },
  data() {
    return {
      formData: {},
      urlLastId: "",
      centerDialogVisible: false,
      form: {
        case_tracer: "",
        case_id: JSON.parse(this.$route.query.case_id),
        service_id: ""
      },
      priewImg: "",
      dialogVisible: false
    };
  },
  created() {},
  mounted() {
    // 百度地图初始化
    // this.$nextTick(function() {

    // geolocation.getCurrentPosition(
    //   r => {
    //     if (r.point) {
    //       this.center.lng = r.longitude;
    //       this.center.lat = r.latitude;
    //       let markers = new BMap.Marker(r.point);
    //       map.addOverlay(markers);
    //       map.panTo(r.point);
    //       map.centerAndZoom(r.point, 16);
    //     }
    //   },
    //   { enableHighAccuracy: true }
    // );
    var th = this;
    this.$nextTick(function() {
      // MapJs("iyUj8juV15MB8qGwiM6BfwebPs3cUMOm").then(BMap => {
      // 创建Map实例
      let langLatArr = coordtransform.gcj02tobd09(th.$route.query.lng, th.$route.query.lat);
      let map = new BMap.Map("allmap");
      let point = new BMap.Point(langLatArr[0], langLatArr[1]);
      map.centerAndZoom(point, 10);
      map.enableScrollWheelZoom(true);
      map.enableDoubleClickZoom(true);
      let markers = new BMap.Marker({
        lng: langLatArr[0],
        lat: langLatArr[1]
      });
      map.addOverlay(markers);
      var geolocation = new BMap.Geolocation();
    });
  },
  methods: {
    getData() {
      RequestServiceCaseDetail({
        case_id: JSON.parse(this.$route.query.case_id)
      }).then(res => {
        res.data.case_pic = JSON.parse(res.data.case_pic);
        this.formData = res.data;
      });
    },
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.case_id) {
            RequestServiceCaseHanle(this.form).then(res => {
              this.centerDialogVisible = false;
              if (res.code == 2000) {
                setTimeout(function() {
                  self.cancle();
                }, 2000);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    cancle() {
      this.$router.push({
        path: "/revolveOne/revolveList" + this.urlLastId
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/revolveOne/revolveThing" + this.urlLastId
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleImg(url) {
      this.priewImg = url;
      this.dialogVisible = true;
    }
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss" >
.wrap {
  padding: 30px 15px;
  font-size: 14px;
  .box-card {
    margin-bottom: 30px;
  }
  .img-flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .img-flex div img {
  }
  .img-flex > div {
    position: relative;
    margin-right: 20px;
    width: 200px;
    height: 200px;
    overflow: hidden;
  }
  .img-flex > div > div {
    position: absolute;
    bottom: 0;
    right: 5%;
    color: #49cbf0;
    font-size: 14px;
    cursor: pointer;
  }
  #allmap {
    width: 700px;
    height: 400px;
    font-family: "微软雅黑";
    border: 1px solid #f2f2f2;
    border-radius: 5px;
    margin: 30px 0;
  }
}
</style>
