<template>
  <div class="wrapper">
    <el-card>
      <div class="i-substance">
        <nav class="i-nav">
          <div v-for="(item,index)  in  nav" :key="index" :class="[item.attr_id==attrId?'ellipsos i-nav-active i-nav-1':'ellipsos i-nav-1']" @click="handleNav(item)">
            <div class="i-icon" v-if="item.attr_id != -1">
              <i class="el-icon-delete icon-delete" @click.stop="handleOperation(item,1)" v-if="item.attr_id!=attrId && permArr.materialDele==1"></i>
              <i class="el-icon-edit" @click.stop="handleOperation(item,2)" v-if="permArr.materialEdit==1"></i>
            </div>
            <span v-if="item.attr_id==-1">
              {{item.attr_value + `(${all})`}}
            </span>
            <span v-else> {{item.attr_value+ `(${item.num})`}}</span>
          </div>
          <el-button icon="el-icon-plus" size="max" @click="handleUpload(2)" style="margin-top:20px" v-if="permArr.materialArr==1"> 添加分类</el-button>
        </nav>
        <div>
          <div class="i-upload" align="right">
            <!-- <span style="padding-right:10px;color:#999;font-size:13px;">大小不超过10M</span>
            <el-button type="success" size="small" @click="handleUpload">视频上传</el-button> -->
            <el-button type="primary" icon="el-icon-upload" @click="handleUpload(1)" v-if="permArr.picUpload==1">视频上传</el-button>
          </div>
          <div v-if="state==1" v-loading="loading">
            <section class="img-list" v-if="list.length!=0">
              <div v-for="(items,index) in list" :key="index" class="img-content">
                <div :style="{backgroundImage: 'url(' + items.material_pic || '../../../static/images/video.png'   + ')'}">
                  <!-- <div style="backgroundImage: url('../../../static/images/login/weixin.jpg')"> -->
                  <!-- <img :src="items.url" alt=""> -->
                </div>
                <!-- <p class=" ellipsos">
                  {{items.name}}
                </p> -->
                <p class="word_wrap line_ellipsis_2">
                  {{items.material_name}}
                </p>
                <div class="img-delete">
                  <span @click="handlePreview(items)">
                    <i class="wx-manage-bofang"></i>
                  </span>
                  <!-- <span @click="handleEditor(items)">
                    <i class="wx-manage-bianji"></i>
                  </span> -->
                  <span @click="handleDelete(items)" v-if="permArr.picDele==1">
                    <i class="el-icon-delete "></i>
                  </span>

                </div>
              </div>
            </section>
            <div v-if="list.length==0&& !loading" style="text-align:center;margin:50px 0">
              <img src="https://img.sqydt.darongshutech.com/FssON4FZTDmclZI0Ty9e9kXzEaCb" alt="">
              <div style="margin:20px 0">您还没上传过视频哦，点击上传文件按钮～</div>
            </div>
          </div>
          <div v-if="state==2" v-loading="loading">
            <section style="height: 430px; overflow-y: auto;" class="img-list" v-if="list.length!=0">
              <div v-for="(items,index) in list" :key="index" class="img-content" @click="handleShow(items)">
                <!-- <div :style="{backgroundImage: 'url(' + items.material_url   + ')'}"> -->
                <div>
                  <!-- <div :style="{backgroundImage: url('../../../static/images/login/weixin.jpg')}"> -->
                  <img :src="items.material_pic || '../../../static/images/video.png'" alt="">
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
              <div style="margin:20px 0">您还没上传过视频哦，点击上传文件按钮～</div>
            </div>
          </div>

          <div align="right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pages.current_page" :page-size="pages.page_size" layout="prev, pager, next, jumper" :total="pages.count">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog :close-on-click-modal="false" width="50%" title="视频素材" :visible.sync="innerVisibleVideo" append-to-body>
      <div class="i-video">
        <video :src="baseImg+url" controls="controls" v-if="url" width="90%" height="300px"></video>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="innerVisibleVideo=false">确定</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog :close-on-click-modal="false" :before-close="handleCloseVideo" width="50%" title="视频素材" :visible.sync="showVideo" append-to-body>
      <div>
        <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm" v-loading="loading" element-loading-text="视频上传中，请稍等。。。" element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-form-item label="视频上传:" prop="url">
            <div align="left" style="width:80px">
              <div class="file">
                <input type="file" @change="imageChange" />
                <span style="font-size:14px;">上传文件</span>
              </div>
            </div>
            <video :src="form.url" controls="controls" v-show="form.url" width="90%" height="300px"></video>
          </el-form-item>
          <el-form-item label="标题:" prop="title" :rules="[{required: true, message:'标题不能为空'}, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }]">
            <el-input type="text" v-model="form.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="视频描述:" prop="introduction" :rules="[{required: true, message:'视频描述不能为空'}, { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' }]">
            <el-input type="textarea" :rows="4" v-model="form.introduction" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
            <el-button @click="resetForm('form')">取消</el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-dialog> -->

    <el-dialog width="30%" :title="dialogDTitle" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false" :before-close="handleClose">
      <div v-if="dialogShow==1">
        <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="视频名：" prop="material_name">
            <el-input v-model="form.material_name" auto-complete="off" placeholder="视频名称不填，默认视频上传名"></el-input>
          </el-form-item>
          <el-form-item label="视频上传：" prop="material_url" :rules="[{ required: true, message: '请上传视频', trigger: 'blur' },]">
            <!-- <upload @handleSuccess="handleSuccess" :image-url="form.material_url" :format='3'>
              <template slot="vedio">
                <video v-if="form.material_url" :src="baseImg+form.material_url" controls="controls" width="400"></video>
              </template>
              <template slot="suggestion">
                <div class="el-upload__tip" slot="tip">仅支持上传： ".mp4"等格式文件)</div>
              </template>
            </upload> -->
            <uploadFile class="uploadClick" @change="handleChange" :acceptString="'.mp4'" :maxSize="10000">
              <el-button v-if="!form.material_desc" plain size="mini">添加视频</el-button>
              <span style="width:220px;" class="ellipsos " v-else>{{form.material_desc}}</span>
            </uploadFile>
            <div style="font-size:12px;">温馨提示：只支持mp4格式</div>
          </el-form-item>
          <el-form-item>
            <!-- <div>{{baseImg+form.material_url}}</div> -->
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
            <el-button @click="resetForm('form')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-form :model="formClass" ref="formClass" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名：" prop="attr_value" :rules="[{ required: true, message: '请上填写分类名', trigger: 'blur' },]">
            <!-- <el-input v-model="formClass.attr_value" auto-complete="off" placeholder="请输入分类名"></el-input> -->
            <el-input v-model="formClass.attr_value" auto-complete="off" placeholder="最多只能输入8个字" maxlength="8"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('formClass')">提交</el-button>
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
/**
 * 1数据接口 （图片列表,删除）
 */
import { RequestMenuList, RequestDeleteMenu, RequestAddMenu } from "@/fetch/modules/material";
import { RequestMpMaterialList, RequestMpMaterialAdd, RequestMpMaterialDelete, RequestMpMaterialAttrDelete, RequestMpMaterialAttrEdit, RequestMpMateriaAttrlList, RequestMpMaterialAttrAdd } from "@/fetch/modules/info";
import { getToken } from "@/utils/auth";
import UploadFile from "@/components/uploadFile";
export default {
  name: "imgarticle",
  components: { upload, UploadFile },
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
          picDele: 1, // 图片删除
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
      list: [],
      loading: false,
      showIndex: "",
      innerVisibleVideo: false,
      url: "",
      showVideo: false,
      permArr: this.perm,
      // form: {
      //   title: "",
      //   url: "",
      //   introduction: "",
      //   media_id: ""
      // },
      formData: null,
      loading: false,
      innerVisible: false,
      dialogDTitle: "添加",
      form: {
        type: 2,
        material_name: "",
        material_url: "",
        material_desc: ""
      },
      formClass: {
        attr_value: ""
      },
      baseImg: "https://img.sqydt.darongshutech.com/",
      attrId: -1,
      nav: [],
      dialogShow: null,
      all: 0,
      fileName: ""
    };
  },
  created() {
    console.log(this.permArr);
    this.getImageData();
    this.getClassList();
  },
  methods: {
    /**
     *1 图片列表
     */
    getImageData() {
      this.loading = true;
      RequestMpMaterialList({
        type: 2,
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
      RequestMpMateriaAttrlList({
        type: 2,
        current_page: 1,
        page_size: 1000
      }).then(res => {
        if (res.code == 2000) {
          let allNav = {
            attr_id: -1, // 分组ID 【注意0表示未分组， 这个是约定】
            attr_value: "全部",
            num: this.all // 拥有数据条数
          };
          this.nav = [allNav, ...new Set(res.data)];
        }
        // console.log(res);
      });
    },
    handleUpload(val) {
      this.formClass = {
        attr_id: "",
        attr_value: ""
      };
      this.dialogShow = val;
      val == 1 ? (this.dialogDTitle = "视频素材添加") : (this.dialogDTitle = "添加分类");
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
    //  素材
    material() {
      let _args = this.form;
      _args.material_name = _args.material_name || this.fileName;
      _args["attr_id"] = this.attrId;
      RequestMpMaterialAdd(_args).then(res => {
        if (res.code === 2000) {
          this.getImageData();
          this.getClassList();
          this.resetForm("form");
        }
      });
    },
    // 分类
    materialAttr() {
      this.btnMark = true;
      let _args = JSON.parse(JSON.stringify(this.formClass));
      _args["type"] = 2;
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
      // console.log("formName", formName);
      (this.form.material_desc = ""), (this.form.material_url = "");
      this.innerVisible = false;
      this.$refs[formName].resetFields();
    },
    handleClose() {
      this.dialogShow == 1 ? this.resetForm("form") : this.resetForm("formClass");
    },
    // handleSuccess(val, item, file) {
    //   this.fileName = file.name;
    //   this.form.material_url = val.key;
    // },
    // 文件上传
    handleChange(status, _file, params, resp) {
      const _baseUrl = params.baseUrl; // 上传文件存放地址
      let imageInfo = this.form;
      if (status === "startUpload") {
        imageInfo.material_desc = "上传中···";
      } else if (status === "uploading") {
        imageInfo.material_desc = "文件已上传" + resp; // 当为状态上传中时，resp为上传进度
      } else if (status === "uploadSuccess") {
        imageInfo.url = resp.key;
        imageInfo.material_url = resp.key;
        imageInfo.material_desc = _file.name;
        this.fileName = _file.name;
        // console.log("uploadSuccess", resp);
      } else {
        imageInfo.material_desc = "上传失败，点击重试！";
      }
    },

    /**
     * 图片上传成功回调函数
     */
    imageSuccessCBK(res) {
      if (res.code === 2000) {
        this.getImageData();
      }
    },
    /**
     * 1视频播放
     */
    handlePreview(items) {
      // console.log(items);
      this.url = items.material_url;
      this.innerVisibleVideo = true;
    },
    /**1 视频删除
     */
    handleDelete(items) {
      this.$confirm("此操作将永久删除该视频, 是否继续?", "提示", {
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
    /**
     * 视频编辑
     */
    // handleEditor(items) {
    //   this.form.title = items.name;
    //   this.form.media_id = items.media_id;
    //   this.form = Object.assign(this.form, items);
    //   this.showVideo = true;
    // },
    handleShow(items) {
      this.showIndex = items.material_id;
      this.$emit("onSuccess", items);
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
    /**
     * 获取本地视频
     */
    imageChange($event) {
      let file = $event.target.files[0],
        fileType = $event.target.files[0].type,
        isLt10M = $event.target.files[0].size / 1024 / 1024 <= 10;
      if (fileType == "video/mp4") {
      } else {
        this.$message.error("请上传视频");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("请上传10M以下的视频");
        return false;
      }
      this.formData = new FormData();
      this.formData.append("file", file);
      this.formData.append("is_temporary", 2);
      this.formData.append("type", 2);
      this.formData.append("group_id", 1);
      this.formData.append("token", getToken());
      this.form.url = URL.createObjectURL(file);
      $event.target.value = "";
    },
    /**
     * form视频上传提交
     */
    // submitForm(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       if (this.form.url == "") {
    //         this.$message.error("请上传视频");
    //         return false;
    //       }
    //       this.loading = true;
    //       // console.log("ssss", this.form.media_id);
    //       this.formData.append("introduction", this.form.introduction);
    //       this.formData.append("title", this.form.title);
    //       if (this.form.media_id) {
    //         let media_id = this.form.media_id;
    //         this.formData.append("media_id", media_id);
    //       }
    //       RequestAddMenu(this.formData).then(res => {
    //         this.resetForm("form");
    //         this.getImageData();

    //         this.loading = false;
    //         this.showVideo = false;
    //       });
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },
    /**
     * update
     */
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    //   for (let i in this.form) {
    //     if (i) {
    //       this.form[i] = "";
    //     }
    //   }
    //   this.showVideo = false;
    // },
    handleCloseVideo() {
      this.resetForm("form");
    }
  }
};
</script>

<style scoped>
.wrapper {
  margin: 30px 20px;
}
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
  padding: 8px 0px;
  width: 100%;
  /* border: 1px red solid; */
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
  width: 300px;
  height: 180px;
  overflow: hidden;
}
.img-content div:nth-child(1) {
  width: 299px;
  height: 120px;
  overflow: hidden;
  background-image: url("");
  background-size: cover;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  background-repeat: no-repeat;
}
.img-delete {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
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
.i-video {
  margin: 0 auto;
  text-align: center;
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
  width: 300px;
  height: 120px;
  overflow: hidden;
}
.img-content > p {
  width: 100%;
  padding: 10px 15px 0;
  font-size: 16px;
  /* border: 1px red solid; */
  word-break: break-all;
}
.img-delete > span:nth-child(1) {
  margin-right: 30px;
}
.img-delete > span:nth-child(2) {
  margin-right: 30px;
}
.wx-manage-xuanzhong {
  color: #fff;
  font-size: 50px;
}
.wx-manage-bofang,
.el-icon-delete,
.wx-manage-bianji {
  font-size: 30px;
}
.icon-delete {
  font-size: 16px;
}

.editor-slide-upload {
  margin-bottom: 20px;
}
.file {
  position: relative;
  overflow: hidden;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  background: #1aad19;
  cursor: pointer;
}
.file span {
  color: #fff;
  cursor: pointer;
}
.file input {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 30px;
  opacity: 0;
  color: #fff;
}
</style>
