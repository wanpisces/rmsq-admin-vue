<template>
    <div class="main-theme">
        <div class="panel-group clearfix">
            <div class="main-left">
                <div class="main-header">
                    <img src="https://img.sqydt.darongshutech.com/token_file_201810121421484539.jpg" width="100%" alt="">
                </div>
                <Contact :data="item" v-for="(item, index) in dataArr.builder_tr" :tr="item.tr" :index='index' :key="index" @handleBg="handleBg" @handleDelete="handleDelete"></Contact>
            </div>
            <div class="main-right">
                <div class="main-rigth-bg">
                    <el-collapse v-model="activeName">
                        <el-collapse-item title="设置/外观" name="1">
                            <div class="main-content">
                                <p class="main-title-name"> 外观样式：</p>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <!-- 基础类组件    -->
                    <!--1000001 文本框 1000002	选择  1000003	下拉  1000004	多级下拉 1000005	日期时间  1000006	数字  1000007	附件  1000008	评分  1000009	矩阵  1000010	排序  1000011	货币  1000012	城市  1000013	商品  1000014	按钮  -->
                    <div v-if="builder.builder_id==1000001">
                        <div class="main-title">文本框</div>
                        <div class="main-content">
                            <p class="main-title-name">切换组件类型：
                                <span class="main-time">
                                    <el-select v-model="builder.builder_params.input_type" placeholder="请选择">
                                        <el-option :key="1" label="单行文本" :value="1"></el-option>
                                        <el-option :key="2" label="多行文本" :value="2"></el-option>

                                    </el-select>
                                </span>
                            </p>
                            <p class="main-title-name">标题：</p>
                            <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model>
                            <p class="main-title-name">描述：</p>
                            <div-model :value="builder.builder_params.desc" @inputChangeText="inputChangeTextDesc"></div-model>
                            <div class="main-title-name">
                                <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                            </div>
                        </div>
                    </div>
                    <div v-if="builder.builder_id==1000005">
                        <div class="main-title">{{builder.builder_name}}</div>
                        <div class="main-content">
                            <p class="main-title-name">标题：</p>
                            <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model>
                            <p class="main-title-name">描述：</p>
                            <div-model :value="builder.builder_params.desc" @inputChangeText="inputChangeTextDesc"></div-model>
                            <div class="main-title-name">
                                <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                            </div>
                            <p class="main-title-name">数据类型：
                                <span class="main-time">
                                    <el-select v-model="builder.builder_params.date_format" placeholder="请选择">
                                        <el-option :key="1" label="日期+时间" :value="1"></el-option>
                                        <el-option :key="2" label="日期" :value="2"></el-option>
                                        <el-option :key="3" label="时间" :value="3"></el-option>
                                    </el-select>
                                </span>
                            </p>
                            <p class="main-title-name">日期限制：
                                <span class="main-time">
                                    <el-select v-model="builder.builder_params.date_limit" placeholder="请选择">
                                        <el-option :key="1" label="无限制" :value="0"></el-option>
                                        <el-option :key="2" label="只能选择大于当前的日期" :value="1"></el-option>
                                        <el-option :key="3" label="只能选择小于当前的日期" :value="2"></el-option>
                                    </el-select>
                                </span>
                            </p>
                        </div>
                    </div>
                    <!-- 联系人组件    -->
                    <!-- 4000001	姓名  4000002	手机   4000003	邮箱   4000004	公司  4000005	部门  4000006	职位  4000007	头像   4000008	称谓  4000009	性别  4000010	生日  4000011	所在地  4000012	地址  4000013	网址  4000014	座机  4000015	传真 -->
                    <div v-if="builder.builder_id==4000001">
                        <div class="main-title">{{builder.builder_name}}</div>
                        <div class="main-content">
                            <p class="main-title-name">标题：</p>
                            <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model>
                            <p class="main-title-name">描述：</p>
                            <div-model :value="builder.builder_params.desc" @inputChangeText="inputChangeTextDesc"></div-model>
                            <div class="main-title-name">
                                <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                            </div>
                        </div>
                    </div>
                    <div v-if="builder.builder_id==4000002">手机</div>
                    <div v-if="builder.builder_id==4000003">邮箱</div>
                    <div v-if="builder.builder_id==4000004">公司</div>
                    <div v-if="builder.builder_id==4000005">部门</div>
                    <div v-if="builder.builder_id==4000006">职位</div>
                    <div v-if="builder.builder_id==4000007">头像</div>
                    <div v-if="builder.builder_id==4000008">称谓</div>
                    <div v-if="builder.builder_id==4000009">性别</div>
                    <div v-if="builder.builder_id==4000010">生日</div>
                    <div v-if="builder.builder_id==4000011">所在地</div>
                    <div v-if="builder.builder_id==4000012">地址</div>
                    <div v-if="builder.builder_id==4000013">网址</div>
                    <div v-if="builder.builder_id==4000014">座机</div>
                    <div v-if="builder.builder_id==4000015">传真</div>

                    <!--图片类组件 -->
                    <!-- 2000001	图片选择 2000002	图片上传 2000003	图片展示 2000004	图片轮播 -->
                    <div v-if="builder.builder_id==2000001">图片选择</div>
                    <div v-if="builder.builder_id==2000002">图片上传</div>
                    <div v-if="builder.builder_id==2000003">图片展示</div>
                    <div v-if="builder.builder_id==2000004">图片轮播</div>

                    <!-- 辅助类组件 -->
                    <!-- 3000001	文本描述   3000002	分割线  3000003	分页   3000004	静态地图  3000005	视频播放 -->
                    <div v-if="builder.builder_id==3000001">文本描述</div>
                    <div v-if="builder.builder_id==3000002">分割线</div>
                    <div v-if="builder.builder_id==3000003">分页</div>
                    <div v-if="builder.builder_id==3000004">静态地图</div>
                    <div v-if="builder.builder_id==3000005">视频播放</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FromRequst from "@/fetch/modules/formTemplate";
import Contact from "./component/contact";
import divModel from "./component/divComponent";
export default {
  components: { divModel, Contact },
  data() {
    return {
      dataArr: [],
      builder: {
        builder_id: 1, // 组件ID
        builder_name: "姓名", // 组件名称
        builder_params: {
          // 组件配置
          type: 1, //类型 1-文本框；2-单选框；3-多选框；4-文件上传；5-所在地；6-地址
          title: "1", //标题
          desc: "1", //描述
          item_list: [], //选项列表 [[key:1,desc:先生],...]
          file_ext: [], //文件扩展后缀  [jpg,png,...]
          file_size: 5, //文件上传大小限制  MB
          is_required: 1, //1必填 2非必填
          submit_content_type: 1, //提交类型 1-string;2-json arr
          submit_content_keys: [], //提交的键 [province_region,city_region,...]
          other: [], //补充扩展
          submit_content: "" //提交的内容
        }
      },
      activeIndex: null,
      activeName: "1"
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 表单列表
    getData() {
      FromRequst.RequesFromDetail({
        form_id: this.$route.query.form_id || "153939860852490000"
      }).then(res => {
        if (res) {
          this.dataArr = res;
        }
      });
    },
    handleDelete(index) {
      this.dataArr[index].subject_id == this.subject.subject_id
        ? (this.subject.subject_id = {})
        : "";
      this.dataArr.splice(index, 1);
    },
    handleBg(val) {
      this.activeName = "2";
      // this.activeIndex = val;main-title-name
      // console.log(this.dataArr[val]);
      // this.builder_params = this.dataArr[val];
      // this.dataArr.map((items, index) => {
      //   index == val ? (this.dataArr[index].isFalse = true) : (this.dataArr[index].isFalse = false);
      // });
      this.builder = val;
      console.log("ssdddd", this.builder);
    },
    inputChangeText(val) {
      console.log(val);
      this.builder.builder_params.title = val.value;
    },
    inputChangeTextDesc(val) {
      this.builder.builder_params.desc = val.value;
    },
    handleCommand() {}
  }
};
</script>

<style >
.main-rigth-bg .el-collapse-item__header {
  background: #267dc5;
  color: #fff;
  height: 35px;
  line-height: 35px;
  padding-left: 10px;
}
.main-rigth-bg .el-collapse-item__arrow {
  line-height: 35px;
}
</style>
