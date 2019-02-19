<template>
  <div class="wrap">
    <el-card class="box-card">
      <el-form ref="form" :model="formData" label-width="80px">
        <!-- <h6>爆料详情:</h6> -->
        <el-form-item label="提交用户:">
          <span>{{formData.user_nickname}}</span>
        </el-form-item>
        <el-form-item label="提交时间:">
          <span>{{formData.create_time}}</span>
        </el-form-item>
        <el-form-item v-if="needAudit == 1" label="主题分类:">
          <span>{{formData.attr_value}}</span>
        </el-form-item>
        <el-form-item label="爆料内容:">
          <span>{{formData.case_content || "无"}}</span>
        </el-form-item>
        <el-form-item label="图片/视频:">
          <div class="img-flex">
            <!-- v-preview="formData.img_url+items" -->
            <div v-for="(items,index)  in  formData.case_pic" :key="index" v-if="formData.case_pic.length!=0">
              <div>
                <img src="../../../static/images/search.png" width="20px" alt="" @click="handleImg(formData.img_url+items)">
              </div>
              <img :src="formData.img_url+items" alt="" width="200px" height="100%">
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
          <div>
            <span>{{formData.case_addr || "无" }}</span>
          </div>

        </el-form-item>
        <div id="allmap" v-show="needAudit==1"></div>
        <h6 v-if="needAudit==1">办理详情:</h6>
      </el-form>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane :label="JSON.stringify(index+1)" :name="JSON.stringify(index)" v-for="(items,index) in nodeData" :key="index">
          <el-form ref="form" label-width="150px">
            <el-form-item label="爆料归属单位:">
              <span>{{items.inst_name}}</span>
            </el-form-item>
            <el-form-item label="爆料负责人:">
              <span>{{items.node_user}}</span>
            </el-form-item>
            <el-form-item label="联系方式:">
              <span>{{items.node_user_tel}}</span>
            </el-form-item>
            <el-form-item label="爆料跟踪人:">
              <span>{{items.case_tracer}}</span>
            </el-form-item>
            <el-form-item label="爆料办理记录:">
              <span>{{items.node_log}}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>

      </el-tabs>

      <div class="node">
        <div>
          <el-button v-if="needAudit==2" type="primary" style="width:100px" icon="el-icon-delete" @click="handleDelete">删除</el-button>
          <el-button type="" style="width:100px" icon="el-icon-circle-close-outline" @click="closeLink">关闭</el-button>
        </div>
      </div>

    </el-card>
    <el-dialog title="图片查看" :visible.sync="dialogVisible" width="750px">
      <img :src="priewImg" v-if="priewImg" width="100%" alt="">
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import coordtransform from "coordtransform";
Vue.use(coordtransform);
import { RequestServiceCaseDetail, RequestServiceNode, RequestRevolveDelete } from "../.././fetch/modules/service";
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.form.service_id = to.meta.service_id;
      vm.urlLastId = to.meta.id;
      vm.needAudit = to.meta.need_audit;
      console.log("aaa", to.meta.need_audit);
      vm.getData();
      RequestServiceNode({
        case_id: JSON.parse(vm.$route.query.case_id),
        service_id: to.meta.service_id
      }).then(res => {
        vm.nodeData = res.list;
      });
    });
  },
  data() {
    return {
      urlLastId: "",
      needAudit: "",
      formData: {},
      centerDialogVisible: false,
      form: {
        case_tracer: "",
        case_id: JSON.parse(this.$route.query.case_id),
        service_id: ""
      },
      nodeData: [],
      activeName: "0",
      priewImg: "",
      dialogVisible: false
    };
  },
  created() {},
  mounted() {
    // 百度地图初始化
    // this.$nextTick(function() {
    var th = this;
    // MapJs("iyUj8juV15MB8qGwiM6BfwebPs3cUMOm").then(BMap => {
    // 创建Map实例
    let langLatArr = null;
    if (th.$route.query.lng) {
      langLatArr = coordtransform.gcj02tobd09(th.$route.query.lng, th.$route.query.lat);
    } else {
      return;
    }

    // console.log(langLatArr);
    let map = new BMap.Map("allmap");
    let point = new BMap.Point(langLatArr[0], langLatArr[1]);
    let markers = new BMap.Marker({
      lng: langLatArr[0],
      lat: langLatArr[1]
    });
    map.addOverlay(markers);
    map.centerAndZoom(point, 10);
    map.enableScrollWheelZoom(true);
    map.enableDoubleClickZoom(true);

    var geolocation = new BMap.Geolocation();
  },
  methods: {
    getData() {
      RequestServiceCaseDetail({
        case_id: JSON.parse(this.$route.query.case_id)
      }).then(res => {
        res.data.case_pic = JSON.parse(res.data.case_pic);
        this.formData = res.data;
        console.log(this.formData);
      });
    },
    closeLink() {
      this.$router.push({
        path: "/revolveOne/revolveList" + this.urlLastId
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/revolveOne/revolveDetail" + this.urlLastId
      });
    },
    handleDelete() {
      this.$confirm("确实要删除该爆料?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestRevolveDelete({
            case_id: JSON.parse(this.$route.query.case_id)
          }).then(res => {
            if (res.code == 2000) {
              this.closeLink();
            }
          });
        })
        .catch(() => {});
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
}
#allmap {
  width: 700px;
  height: 400px;
  font-family: "微软雅黑";
  border: 1px solid #f2f2f2;
  border-radius: 5px;
  margin: 30px 0;
}
</style>
