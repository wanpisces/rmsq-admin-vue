<template>
    <div>
        <el-select v-model="category_id" placeholder="请选择">
            <el-option v-for="(item,index) in options1" :key="index" :label="item.category_name" :value="item.category_id">
            </el-option>
        </el-select>
        <el-select v-model="service_id" collapse-tags style="margin-left: 20px;" placeholder="请选择">
            <el-option v-for="(item,index) in options2" :key="index" :label="item.service_title" :value="item.service_id">
            </el-option>
        </el-select>
        <el-button type="primary" @click="createdClassfiy">创建分类</el-button>

        <!-- 添加分类 -->
        <el-dialog title="创建分类" :visible.sync="classMark" width="700px">
            <el-form :model="createClassForm" ref="createClassForm" label-width="150px" style="margin-top:20px;" class="demo-ruleForm">
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

<script>
// service 数据接口（分类列表,icon列表,分类添加）
import {
  RequestServiceRun,
  RequestServiceIcon,
  RequestServiceClassAdd
} from "@/fetch/modules/service.js";

export default {
  data() {
    return {
      service_id: "", // 服务ID
      category_id: "", // 分类ID
      classMark: false,
      selectMark: false,
      addMark: false,
      options1: [],
      options2: [],
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
      selectArrImg: []
    };
  },
  watch: {
    category_id() {
      this.service_id = "";
      this.createClassForm.category_id = this.category_id;
      this.options1.map((item, index) => {
        if (item.category_id == this.category_id) {
          this.options2 = item.service_list;
        }
      });
    },
    service_id(val) {
      console.log("changeServiceId", val);
      this.$emit("changeServiceId", val);
    }
  },
  mounted() {
    this.getServiceList(); //获取服务投放区域
    this.getServiceIcon(); //获取图标
  },
  methods: {
    // 获取投放区域一级分类
    getServiceList() {
      RequestServiceRun({
        related_tmpl: 1
      }).then(res => {
        console.log("RequestServiceRun", res);
        this.options1 = res;
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
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
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
</style>
