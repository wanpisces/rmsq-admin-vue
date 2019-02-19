<template>
  <div>
    <el-card>
      <div class="i-substance">
        <nav class="i-nav">

          <div v-for="(item,index)  in  nav" :key="index" :class="[item.attr_id==attrId?'ellipsos i-nav-active i-nav-1':'ellipsos i-nav-1' ]" @click="handleNav(item)">
            <div class="i-icon" v-if="item.attr_id != -1">
              <i class="el-icon-delete" @click.stop="handleOperation(item,1)" v-if="item.attr_id!=attrId && permArr.materialDele==1"></i>
              <i class="el-icon-edit" @click.stop="handleOperation(item,2)" v-if="permArr.materialEdit==1"></i>
            </div>
            <span v-if="item.attr_id== -1">
              {{item.attr_value + `(${all})`}}
            </span>
            <span v-else> {{item.attr_value+ `（${item.num}）`}}</span>
          </div>
          <el-button icon="el-icon-plus" size="max" @click="handleUpload(2)" style="margin-top:20px" v-if="permArr.materialArr==1"> 添加分类</el-button>
        </nav>
        <div>
          <div class="i-upload" align="right">
            <!-- <span style="padding-right:5px;color:#999;font-size:13px;">大小不超过2M</span> -->
            <!-- <editor-image color="#20a0ff" class="editor-upload-btn" @successCall="imageSuccessCBK" :typeOne="1"></editor-image> -->
            <el-button type="primary" icon="el-icon-upload" @click="handleUpload(1)" v-if="permArr.picUpload==1">图片上传</el-button>
          </div>
          <div v-if="state==1" v-loading="loading">
            <section class="img-list" v-if="list.length!=0">
              <div v-for="(items,index) in list" :key="index" class="img-content">
                <!-- <div :style="{backgroundImage: 'url(' + items.material_url + ')'}"> -->
                <div>
                  <!-- <div style="backgroundImage: url('../../../static/images/login/weixin.jpg')"> -->
                  <img :src="items.material_pic" alt="">
                </div>
                <p class="word_wrap line_ellipsis_2">
                  {{items.material_name}}
                </p>
                <div class="img-delete">
                  <span @click="handleDelete(items)" v-if="permArr.picDelete==1">
                    <i class="el-icon-delete"></i>
                  </span>
                </div>
              </div>
            </section>
            <div v-if="list.length==0&& !loading" style="text-align:center;margin:50px 0">
              <img src="https://img.sqydt.darongshutech.com/FssON4FZTDmclZI0Ty9e9kXzEaCb" alt="">
              <div style="margin:20px 0">您还没上传过图片哦，点击上传文件按钮～</div>
            </div>
          </div>
          <div v-if="state==2" v-loading="loading">
            <section style="height:430px;overflow-y:auto;" class="img-list" v-if="list.length!=0">
              <div v-for="(items,index) in list" :key="index" class="img-content" @click="handleShow(items)">
                <div>
                  <!-- <div :style="{backgroundImage: 'url(' + items.material_url  + ')'}"> -->
                  <!-- <div style="backgroundImage: url('../../../static/images/login/weixin.jpg')"> -->
                  <img :src="items.material_pic" alt="">
                </div>
                <p class="word_wrap line_ellipsis_2">
                  {{items.material_name}}
                </p>
                <div :class="[showIndex==items.material_id?'img-delete img-delete-active':'img-delete img-delete-one']">
                  <span class="img-delete-one">
                    <i class="wx-manage-xuanzhong"></i>
                  </span>
                </div>
              </div>
            </section>
            <div v-if="list.length==0&& !loading" style="text-align:center;margin:50px 0">
              <img src="https://img.sqydt.darongshutech.com/FssON4FZTDmclZI0Ty9e9kXzEaCb" alt="">
              <div style="margin:20px 0">您还没上传过图片哦，点击上传文件按钮～</div>
            </div>
          </div>

          <div align="right">
            <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pages.current_page" :page-size="pages.page_size" layout="prev, pager, next, jumper" :total="pages.count">
            </el-pagination> -->
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pages.current_page" :page-size="pages.page_size" layout="total, prev, pager, next, jumper" :total="pages.count">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog width="30%" :title="dialogDTitle" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false" :before-close="handleClose">
      <div v-if="dialogShow==1">
        <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="图片名：" prop="material_name">
            <el-input v-model="form.material_name" auto-complete="off" placeholder="图片名称不填，默认图片上传名"></el-input>
          </el-form-item>
          <el-form-item label="是否剪裁：">
            <!-- <el-input v-model="isCropper" auto-complete="off" placeholder="图片名称不填，默认图片上传名"></el-input> -->
            <el-radio-group v-model="isCropper">
              <el-radio :label="1">否</el-radio>
              <el-radio :label="2">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="图片上传：" prop="material_url" :rules="[{ required: true, message: '请上传图片', trigger: 'blur' },]">
            <div v-if="isCropper==1">
              <upload @handleSuccess="handleSuccess" :image-url="form.material_url">
                <img v-if="form.material_url&&isCropper==1" :src="baseImg+form.material_url" alt="" class="avatar">
              </upload>
            </div>
            <div v-else>
              <vue-cropper @change="callBackImg" :fixedRatio='[4,3]' :cropWidth="400" :cropHeight="300">
              </vue-cropper>
            </div>

            <div v-if="form.material_url&&isCropper==2" style="margin-top:8px">
              <img :src="baseImg+form.material_url" width="400" height="300" alt="">
            </div>
          </el-form-item>
          <el-form-item>
            <!-- <div>{{baseImg+form.material_url}}</div> -->
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
            <el-button @click="resetForm('form')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-form :model="formClass" ref="formClass" label-width="80px" class="demo-ruleForm">
          <el-form-item label="分类名：" prop="attr_value" :rules="[{ required: true, message: '请上填写分类名', trigger: 'blur' },]">
            <el-input v-model="formClass.attr_value" auto-complete="off" placeholder="最多只能填写8个字" maxlength="8"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('formClass')" :disabled="btnMark">提交</el-button>
            <el-button @click="resetForm('formClass')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 自定义组件
import upload from "@/components/upload.vue";
import VueCropper from "./../uploadImg/uploadCropper";
/**
 * 1数据接口 （图片列表,删除）
 */
import { RequestMpMaterialList, RequestMpMaterialAdd, RequestMpMaterialDelete, RequestMpMaterialAttrDelete, RequestMpMaterialAttrEdit, RequestMpMateriaAttrlList, RequestMpMaterialAttrAdd } from "@/fetch/modules/info";
export default {
  name: "imgarticle",
  components: { upload, VueCropper },

  /**
   * 1是列表 2是勾选
   */
  props: {
    state: {
      type: Number,
      default: 1
    },
    perm: {
      type: Object,
      default: function() {
        return {
          materialArr: 1, //添加分类
          materialEdit: 1, // 编辑分类
          materialDele: 1, // 删除分类
          picDelete: 1, // 图片删除
          picUpload: 1 // 图片上传
        };
      }
    }
  },

  data() {
    return {
      pages: {
        current_page: 1,
        page_size: 10,
        count: 0
      },
      permArr: this.perm,
      list: [],
      loading: false,
      showIndex: "",
      innerVisible: false,
      dialogDTitle: "添加",
      form: {
        type: 1,
        material_name: "",
        material_url: ""
      },
      isCropper: 1,
      formClass: {
        attr_value: ""
      },
      baseUrl: "",
      baseImg: "https://img.sqydt.darongshutech.com/",
      attrId: -1,
      nav: [],
      dialogShow: null,
      btnMark: false,
      all: 0,
      fileName: ""
    };
  },
  created() {
    this.getImageData();
    this.getClassList();
    // console.log(this.permArr);
  },

  methods: {
    /**
     *1 图片列表
     */
    getImageData() {
      this.loading = true;
      RequestMpMaterialList({
        type: 1,
        attr_id: this.attrId,
        current_page: this.pages.current_page,
        page_size: this.pages.page_size
      }).then(res => {
        this.loading = false;
        if (res) {
          if (res.data.list.length == 0 && this.pages.current_page > 1) {
            this.pages.current_page = +this.pages.current_page - 1;
            this.getImageData();
          } else {
            this.list = res.data.list;
            this.pages.current_page = +res.data.current_page;
            this.pages.count = res.data.total_num;
            if (this.attrId == -1) {
              this.all = res.data.total_num;
            }
          }
        }
      });
    },
    // 分类列表
    getClassList() {
      RequestMpMateriaAttrlList({ type: 1, current_page: 1, page_size: 1000 }).then(res => {
        if (res.code == 2000) {
          let allNav = {
            attr_id: -1, // 分组ID 【注意0表示未分组， 这个是约定】
            attr_value: "全部",
            num: 7 // 拥有数据条数
          };
          this.nav = [allNav, ...new Set(res.data)];
        }
        // console.log(res);
      });
    },
    //  剪裁图片回掉
    callBackImg(status, params, data) {
      this.baseUrl = params.baseUrl;
      // console.log(status, params, data);
      if (status == "uploadSuccess") {
        this.form.material_name == "" && (this.form.material_name = params.fullName || "");
        this.form.material_url = data.key;
      }
    },

    handleUpload(val) {
      this.formClass = {
        attr_id: "",
        attr_value: ""
      };
      this.dialogShow = val;
      val == 1 ? (this.dialogDTitle = "图片素材添加") : (this.dialogDTitle = "添加分类");
      this.innerVisible = true;
    },
    // 分组切换
    handleNav(item) {
      this.attrId = item.attr_id;
      this.getImageData();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogShow == 1 ? this.material() : this.materialAttr();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    material() {
      this.btnMark = true;
      let _args = this.form;
      _args.material_name = _args.material_name || this.fileName;
      _args["attr_id"] = this.attrId;
      RequestMpMaterialAdd(_args).then(res => {
        this.btnMark = false;
        if (res.code === 2000) {
          this.getImageData();
          this.getClassList();
          this.resetForm("form");
        }
      });
    },
    materialAttr() {
      this.btnMark = true;
      let _args = JSON.parse(JSON.stringify(this.formClass));
      _args["type"] = 1;
      if (!this.formClass.attr_id) {
        delete _args.attr_id;
        RequestMpMaterialAttrAdd(_args).then(res => {
          this.btnMark = false;
          if (res.code === 2000) {
            this.getClassList();
            this.resetForm("formClass");
          }
        });
      } else {
        RequestMpMaterialAttrEdit(_args).then(res => {
          this.btnMark = false;
          if (res.code === 2000) {
            this.getClassList();
            this.resetForm("formClass");
          }
        });
      }
    },
    resetForm(formName) {
      this.innerVisible = false;
      if (formName == "form") {
        this.material_url = "";
      }
      this.isCropper = 1;
      this.$refs[formName].resetFields();
    },
    handleClose() {
      this.dialogShow == 1 ? this.resetForm("form") : this.resetForm("formClass");
    },
    handleSuccess(val, item, file) {
      // console.log("file", item, file);
      this.form.material_name == "" && (this.form.material_name = file.name || "");
      // this.fileName = file.name;
      this.form.material_url = val.key;
    },
    /**
     * 图片上传成功回调函数
     */
    // imageSuccessCBK(res) {
    //   console.log(res);
    //   if (res.code === 2000) {
    //     console.log("执行");
    //     this.getImageData();
    //   }
    // },
    /**1图片删除
     */
    handleDelete(items) {
      this.$confirm("此操作将永久删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let args = {
            material_id: items.material_id
          };

          RequestMpMaterialDelete(args).then(res => {
            if (res.code === 2000) {
              this.$message.success("删除成功");
              this.getImageData();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleShow(items) {
      this.showIndex = items.material_id;
      // console.log("ssss", items, this.showIndex);
      this.$emit("onSuccess", items);
    },
    /**
     * current_page获取
     */
    handleCurrentChange(val) {
      this.pages.current_page = val;
      this.getImageData();
    },
    handleSizeChange(val) {
      // console.log("SizeChange", val);
    },
    //  编辑，删除
    handleOperation(item, val) {
      let _this = this;
      if (val == 1) {
        this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let _args = { attr_id: item.attr_id };

            RequestMpMaterialAttrDelete(_args).then(res => {
              // console.log("aaa");
              if (res.code === 2000) {
                _this.getClassList();
              }
            });
            // this.$message({
            //   type: "success",
            //   message: "删除成功!"
            // });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.formClass = JSON.parse(JSON.stringify(item));
        this.dialogDTitle = "编辑分类";
        this.dialogShow = 2;
        this.innerVisible = true;
      }
    }
  }
};
</script>

<style scoped>
.i-substance {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.i-nav {
  width: 200px;
  /* padding: 10px 5px; */
  text-align: left;
  text-indent: 10px;
  /* padding: 10px 40px; */
  /* background: #f3f5f8; */
  flex-shrink: 0;
  font-size: 14px;
}

.i-icon {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 55px;
  height: 55px;
  padding: 0 10px;
  /* border: 1px red solid; */
  background: rgba(0, 0, 0, 0.1);
  color: #fff;
  opacity: 0;
}
.i-nav-1,
.i-icon {
  transition: all 0.3s linear;
}
.i-icon {
  text-indent: 0;
}
.i-nav-1:hover > .i-icon {
  opacity: 1;
}
.i-nav-1:hover {
  background: #39bcf3;
  color: #fff;
}
.i-nav-active {
  color: #fff;
  background: #39bcf3;
}
.i-nav > div {
  position: relative;
  cursor: pointer;
  padding: 20px 0;
  border-bottom: 1px #f2f2f2 solid;
}
.i-substance > div {
  border-left: 1px #f2f2f2 solid;
  width: 100%;
}
.i-upload {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 4px 0px;
  width: 100%;
}
.editor-upload-btn {
  /* display: inline-block; */
}
.img-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 10px 0 10px 40px;
  cursor: pointer;
}
.img-content {
  position: relative;
  border: 1px #f2f2f2 solid;
  margin: 0 20px 20px 0;
  width: 180px;
  height: 175px;
  overflow: hidden;
  background-color: #fff;
  border-radius: 3px;
}
.img-content div:nth-child(1) {
  width: 179px;
  height: 120px;
  overflow: hidden;
  /* background-image: url(""); */
  background-size: cover;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  background-repeat: no-repeat;
}
.img-delete {
  position: absolute;
  top: 0;
  left: 0;
  width: 180px;
  height: 200px;
  color: #fff;
  font-size: 20px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  opacity: 0;
  transition: opacity 0.2s linear;
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-delete-active {
  opacity: 1;
}
.img-delete-none {
  opacity: 0;
}
.img-delete span {
  cursor: pointer;
}
.img-content:hover > .img-delete {
  opacity: 1;
}
.img-content img {
  width: 179px;
  height: 120px;
  overflow: hidden;
}
.img-content > p {
  /* width: 160px; */
  font-size: 16px;
  padding: 10px 0 0 10px;
  /* border: 1px red solid; */
  /* display: block;
  word-break: break-all; */
}
.img-delete-one {
}
.wx-manage-xuanzhong {
  color: #fff;
  font-size: 50px;
}
</style>
