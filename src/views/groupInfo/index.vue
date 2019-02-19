<template>
  <div class="info-container">
    <el-card>
      <el-form :model="form" ref="form" label-width="110px" class="demo-ruleForm">
        <el-form-item label="单位名称:" prop="group_name" :rules="[ { required: true, message: '请输入单位名称' }]">
          <el-input v-model="form.group_name" style="width:650px" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="单位地址:" prop="group_address" :rules="[ { required: true, message: '请输入单位名称' }]">
          <el-input v-model="form.group_address" style="width:650px"></el-input>
        </el-form-item>
        <el-form-item label="单位风采:" prop="group_images" :rules="[ { required: true, message: '请上传单位风采' }]">
          <!-- <el-upload class="avatar-uploader" action="..." :show-file-list="false" :before-upload="beforeUploadImage">
                        <div v-if="form.url" class="img-bg-box" :style="{backgroundImage: 'url(' + form.url + ')'}">
                        </div>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload> -->
          <div>(建议上传750*360,2M 以下的图片,最多可上传五张照片)</div>
          <div class="" style="display:flex;flex-wrap: wrap;position:relative">
            <div v-for="(item,index) in form.group_images" :key="index" class="upload-img ">
              <img :src="baseUrl+item.url" alt="" width="250px" height="120px" />
              <div class="upload-bg">
                <div class="delete-icon" @click="deleteImg(index)">
                  <!-- <Icon type="trash-a"></Icon> -->
                  <i class="el-icon-delete"></i>
                </div>
              </div>
            </div>
            <div class="upload-img up-2" v-if="form.group_images.length<5">
              <!-- <Icon type="android-camera" style="font-size:50px;margin-top:100px"></Icon> -->
              <i class="el-icon-upload" style="font-size:20px;margin-top:40px"></i>
              <div>图片上传</div>
              <input type="file" @change="handleBeforeUploadLun" />
            </div>
          </div>
        </el-form-item>
        <div style="margin:50px 0;" v-for="(item,index) in form.subjects" :key="index">
          <el-form-item label="工作人员：">
            <div class="topicOption">
              <div class="topic-option-box">
                <!-- <p v-if="item.subject_type == 1 || item.subject_type == 2"> -->
                <p>
                  <em style="color:red;">* </em>图片支持jpg、png，建议尺寸500*500
                </p>
                <div v-for="(item2,index2) in item.group_worker" :key="index2" class="topic-option-item">
                  <!-- 图文 -->
                  <!-- <div v-if="item.subject_type == 1 || item.subject_type == 2"> -->
                  <div>
                    <div>
                      <el-form-item :key="'index'+index+'index2_0_'+index2" label="" :prop="'subjects.'+index+'.group_worker.'+index2+'.url'" :rules="[{ required: true, message: '请选择选项图片'}]">
                        <el-upload class="avatar-uploader" action="..." :show-file-list="false" :before-upload="newPicBeforeUploadImage" :index="[index,index2]">
                          <div v-if="item2.url" class="img-bg-box" :style="{backgroundImage: 'url(' + baseUrl+item2.url + ')'}">
                          </div>
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                      </el-form-item>
                    </div>
                    <div class="option-item-right">
                      <el-form-item :key="'index'+index+'index2_1_'+index2" label="" :prop="'subjects.'+index+'.group_worker.'+index2+'.name'" :rules="[{ required: true, message: '输入工作人员姓名', trigger: 'blur' }]">
                        <el-input size="small" maxlength="8" placeholder="工作人员姓名" v-model="item2.name" style="width:300px;"></el-input>
                      </el-form-item>

                      <el-form-item :key="'index_'+index+'index2_2_'+index2" label="" :prop="'subjects.'+index+'.group_worker.'+index2+'.desc'" :rules="[{ required: true, message: '输入工作人员担任职务', trigger: 'blur' }]">
                        <el-input maxlength="20" :autosize="{ minRows: 3, maxRows: 4}" type="textarea" placeholder="输入工作人员担任职务" v-model="item2.desc" style="width:300px;"></el-input>
                      </el-form-item>
                    </div>

                    <i @click="removeOption(index,index2)" class=" el-icon-circle-close-outline remove-icon"></i>

                  </div>

                </div>

              </div>

              <el-button @click="addOption(index)" type="primary" plain size="mini" class="topic-option-additem">添加人员</el-button>
            </div>
          </el-form-item>
        </div>
        <el-form-item label="单位简介:" prop="group_content" :rules="[ { required: true, message: '请输入单位简介' }]">
          <!-- <tinymce :height="400" :width="750" :id="tinymceIds" v-model="form.group_content"></tinymce> -->
          <div style="position:relative">
            <Ueditor @changeCover="selectContent(0)" @changeContent="changeContent" :placeholderMsg="placeholderMsg" :dataObject="form.group_content" :config="config" :id="1+''" ref="ue"></Ueditor>
          </div>
        </el-form-item>
        <el-form-item label="小程序展示样式">
          <img src="../../../static/images/xiaochnegxu.png" width="330px" height="560px" alt="">
        </el-form-item>
        <el-form-item label="" style="margin-top:50px">
          <el-button v-if="perm.groupInfoOut == 1" type="primary" @click="submit('form')">发 布</el-button>
          <!-- <el-button type="primary"> 保存</el-button> -->
          <el-button @click="getData">重 置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 富文本编译器
import Ueditor from "@/components/ue/ueditor.vue";
import { RequestUploads } from "@/fetch/modules/public.js";
// import Tinymce from "@/components/Tinymce/index.vue";
import { RequestGroupInfoList, RequestGroupInfoAdd, RequestGroupInfoEditor } from "@/fetch/modules/groupInfo";
const _topic = {
  group_worker: [
    {
      url: "",
      name: "",
      desc: ""
    }
  ]
};
export default {
  beforeRouteEnter(to, from, next) {
    console.log(to);
    next(vm => {
      to.meta.perm.forEach((item, index) => {
        vm.perm[item.perm_name] && (vm.perm[item.perm_name] = item.is_select); // 2-不显示 1-显示
        console.log("------- vm --", item.perm_name, item.is_select);
      });
    });
  },
  components: { Ueditor },
  data() {
    return {
      perm: {
        groupInfoOut: 1 // 发布
      },
      form: {
        subjects: [JSON.parse(JSON.stringify(_topic))], // 题目
        group_images: [],
        group_content: "",
        group_name: "",
        group_address: "",
        content: ""
        // group_address: ""
      },
      config: {
        id: "myEditor",
        initialFrameWidth: 750,
        initialFrameHeight: 350,
        wordCount: false,
        elementPathEnabled: false,
        autoClearinitialContent: true
      },
      placeholderMsg: "从这里开始正文！",
      tinymceIds: "tinymceIds",
      baseUrl: ""
    };
  },
  created() {
    this.getData();
    window.addEventListener("click", this.clickWhere, false);
  },
  methods: {
    changeContent(val) {
      this.form.content = val;
    },
    // 详情列表
    getData() {
      RequestGroupInfoList().then(res => {
        if (res) {
          // console.log("group_address", res.data.group_address);
          this.baseUrl = res.data.UPLOAD_IMAGE_HOST;
          this.form = Object.assign(this.form, res.data);
          this.form.subjects[0].group_worker = JSON.parse(res.data.group_worker);
          this.form.group_images = JSON.parse(res.data.group_images);
          // this.form.content = res.data.group_content;
          // this.form.group_content = res.data.group_content;
        }
      });
    },
    // 监听页面单击事件
    clickWhere(event) {
      let _index = event.target.parentNode.parentNode.getAttribute("index");
      if (_index) {
        this.uploadIndexArr = _index.split(",");
      }
    },
    selectContent(type) {
      // this.imageType = type;
      // if (this.imageType != 2) {
      // this.dialogVisible = true;
      // }
      // console.log(this.imgChooseData, (this.videoChooseData = null));
    },

    // 工作人员移除
    removeOption(index, index2) {
      // if (this.form.subjects[index].group_worker.length > 1) {
      let _subject_item_id = this.form.subjects[index].group_worker[index2].subject_item_id;
      if (this.vote_id && _subject_item_id) {
        // 编辑
        RequestSubjectItemRemove({
          subject_item_id: _subject_item_id
        }).then(res => {
          if (res.code == 2000) {
            this.form.subjects[index].group_worker.splice(index2, 1);
            this.form.subjects[index].min_select = 1 + "";
            this.form.subjects[index].max_select = this.form.subjects[index].group_worker.length + "";
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
          }
        });
      } else {
        // 添加
        this.form.subjects[index].group_worker.splice(index2, 1);
        this.form.subjects[index].min_select = 1 + "";
        this.form.subjects[index].max_select = this.form.subjects[index].group_worker.length + "";
      }
      // } else {
      //   this.$message({
      //     showClose: true,
      //     message: "至少需要一个选项！",
      //     type: "warning"
      //   });
      // }
    },
    // 添加选项
    addOption(index) {
      this.form.subjects[index].group_worker.push({
        url: "",
        name: "",
        desc: ""
      });
      this.form.subjects[index].max_select = this.form.subjects[index].group_worker.length + "";
    },
    newPicBeforeUploadImage(file) {
      let _index = this.uploadIndexArr;
      const isJPG = file.type,
        isLt2M = file.size / 1024 / 1024 < 2,
        self = this;
      var formData = new FormData();
      formData.append("file", file);
      if (isJPG == "image/jpeg" || isJPG == "image/bmp" || isJPG == "image/gif" || isJPG == "image/png" || isJPG == "image/jpeg") {
        if (!isLt2M) {
          this.$message.error("请上传2m以下的图片");
          return false;
        }
        RequestUploads(formData).then(res => {
          this.baseUrl = res.data.base_url;
          let imageInfo = self.form.subjects[_index[0]].group_worker[_index[1]];
          imageInfo.url = res.data.key;

          imageInfo.img_url = res.data.base_url + res.data.key;
        });
      } else {
        this.$message.error("请上传图片");
        return false;
      }
    },
    deleteImg(val) {
      for (let i in this.form.group_images) {
        if (val == i) {
          this.form.group_images.splice(i, 1);
        }
      }
    },
    handleBeforeUploadLun($event) {
      let file = $event.target.files[0],
        fileType = $event.target.files[0].type,
        self = this;
      let formData = new FormData();
      formData.append("file", file);
      if (fileType == "image/jpeg" || fileType == "image/bmp" || fileType == "image/gif" || fileType == "image/png" || fileType == "image/jpeg") {
        //   if (!isLt2M) {
        //   this.$message.error("请上传2m以下的图片");
        //   return false;
        // }
        RequestUploads(formData).then(res => {
          self.IMG_HOST = res.data.base_url;
          self.form.group_images.push({ url: res.data.key });
          $event.target.value = "";
        });
      } else {
        this.$message.error("请上传正确的格式图片");
        return false;
      }
    },
    // 发布
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form.content);
          let _args = {
            group_images: JSON.stringify(this.form.group_images),
            group_content: this.form.content,
            group_worker: JSON.stringify(this.form.subjects[0].group_worker),
            group_name: this.form.group_name,
            group_address: this.form.group_address
          };
          RequestGroupInfoAdd(_args).then(res => {
            if (res.code == 2000) {
              this.$message.success("添加成功");
              this.getData();
            }
          });
          // alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },

  destroyed() {
    window.removeEventListener("click", this.clickWhere);
  }
};
</script>

<style scoped lang="scss">
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
}
.topic-option-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;

  width: auto;
  height: auto;

  > p {
    margin-bottom: 10px;
    font-size: 14px;
    color: #94c7fa;
  }
  .topic-option-item {
    width: 530px;

    padding: 20px 0px;
    position: relative;

    > div {
      display: flex;
      justify-content: space-between;

      .option-item-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
  .topic-option-additem {
    margin: 16px 35px;
  }

  .remove-icon {
    position: absolute;
    right: -20px;
    top: -10px;
    z-index: 88;
    font-size: 18px;
    color: #d9d9d9;
    cursor: pointer;
  }
  .remove-icon:hover {
    color: #409eff;
  }
}

/* 上传 */
.avatar-uploader,
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 135px;
  height: 135px;
  overflow: hidden;
}
.avatar-uploader,
.el-upload:hover {
  border-color: #409eff;
}
.el-upload,
.el-upload--text {
  border: 1px dashed #d9d9d9 !important;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 135px;
  height: 135px;
  line-height: 135px;
  text-align: center;
}
.img-bg-box {
  width: 135px;
  height: 135px;
  background-size: cover;
  background-clip: content-box;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  overflow: hidden;
}
.avatar {
  height: 400px;
  width: auto;
}
.upload-img {
  position: relative;
  width: 250px;
  height: 120px;
  // line-height: 90px;
  text-align: center;
  border: 1px #999 dotted;
  overflow: hidden;
  margin: 20px 30px 0 0;
}
.upload-img:hover {
  border: 1px #3399ff dotted;
}
.up-2 {
  position: relative;
}
.up-2 input {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 120px;
  opacity: 0;
  cursor: pointer;
}
.delete-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
  z-index: 100;
  color: #fff;
  cursor: pointer;
}
div.upload-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 120px;
  background: rgba(0, 0, 0, 0.5);
  content: "";
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s linear;
}
.upload-bg:hover {
  opacity: 1;
}
</style>

