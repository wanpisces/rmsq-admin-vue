
<template>
  <div class="info-container">
    <el-card>
      <h3 align="center">街道基本信息</h3>
      <div class="info-upload-img">
        <div class="upload">
          <div align="center">街道封面图片</div>
          <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>

        <div class="info-intro">
          <div align="right">
            <el-button size="small" v-if="!show" @click="saveStreet">保存</el-button>
            <el-button size="small" v-if="!show" @click="show=true">取消</el-button>
            <el-button v-if="perm.streetChange == 1&&show" size="small" @click="editorDesc">修改</el-button>
          </div>
          <div>街道简介</div>
          <p class="text-wrap" v-if="show">
            {{tableData.group_desc}}
          </p>
          <p v-if="!show">
            <el-input type="textarea" :rows="8" placeholder="请输入一些简洁的话，介绍街道的信息、情况" v-model="group_desc">
            </el-input>
          </p>
        </div>
      </div>

    </el-card>
    <el-card>
      <h3 align="center">管辖社区</h3>
      <div class="table-title">
        <div>
          <el-button v-if="perm.streetSele ==1" type="danger" plain :disabled="selectionValues.length===0" @click="tabelDelete()">删除</el-button>
        </div>
        <div>
          <el-button v-if="perm.streetAdd ==1" type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">新增</el-button>
          <!-- <choose-tab @handleShowDliog="handleShowDliog" add-title="新增" @handleAdd="releaseClick"> -->
          <!-- </choose-tab> -->

        </div>
      </div>
      <el-table :data="tableData.group_child" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading" ref="table" @row-click="handleCurrentChange" @selection-change="selectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="sub_name" label="社区名称" width="180">
        </el-table-column>
        <el-table-column label="社区简介">
          <template slot-scope="scope">
            <span>{{scope.row.sub_desc+''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="社区电话">
          <template slot-scope="scope">
            <span>{{scope.row.sub_connect}}</span>
          </template>
        </el-table-column>
        <el-table-column label="社区地址">
          <template slot-scope="scope">
            <span>{{scope.row.sub_location}}</span>
          </template>
        </el-table-column>
        <el-table-column label="添加时间">
          <template slot-scope="scope">
            <span>{{scope.row.create_time}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <div class="el-icon-wrapper">
              <i v-if="perm.streetDetail == 1" class="el-icon-view" title="查看详情" @click="handleDetail(scope.row)"></i>
              <i v-if="perm.streetEdit == 1" class="el-icon-edit" title="编辑" @click="handEditor(scope.row)"></i>
            </div>
            <!-- <el-button type="text" size="small" @click="handEditor(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDetail(scope.row)">详情</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="table-footer">
                <div style="margin-left: 20px;" align="right">
                    <mo-paging     
                    :page-index="current_page"   
                    :total="count"     
                    :page-size="page_size"   
                    @change="pageChange">   
                </mo-paging>  
                </div>
            </div> -->
    </el-card>

    <!-- 添加编辑 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%">
      <el-form :model="addData" ref="addData" label-width="100px" :rules="rules" class="demo-ruleForm">
        <el-form-item label="社区名称" prop="sub_name">
          <el-input type="text" v-model="addData.sub_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="社区电话" prop='sub_connect'>
          <el-input v-model="addData.sub_connect" auto-complete="off" placeholder="座机号例如：028-87758112"></el-input>
        </el-form-item>
        <el-form-item label="社区地址" prop="sub_location" :rules="[
                { required: true, message: '社区地址不能为空'},
                ]">
          <el-input type="name" v-model="addData.sub_location" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="社区简介" prop="sub_desc" :rules="[
                { required: true, message: '社区简介不能为空'}, { min: 1, max: 100, message: ' 请输入1-100个字符 ' }
                ]">
          <el-input type="textarea" placeholder="请输入社区简介" v-model="addData.sub_desc">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('addData')">提交</el-button>
          <el-button @click="resetForm('addData')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加编辑 -->
    <el-dialog title="编辑" :visible.sync="dialogVisible2" width="30%">
      <el-form :model="editorData" ref="editorData" label-width="100px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="社区名称" prop="sub_name">
          <el-input v-model="editorData.sub_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="社区电话" prop="sub_connect" :rules="[
                { required: true, message: '社区电话不能为空'},
                ]">
          <el-input type="name" v-model="editorData.sub_connect" auto-complete="off" placeholder="座机号例如：028-87758112"></el-input>
        </el-form-item>
        <el-form-item label="社区地址" prop="sub_location" :rules="[
                { required: true, message: '社区地址不能为空'},
                ]">
          <el-input type="name" v-model="editorData.sub_location" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="社区简介" prop="sub_desc" :rules="[
                { required: true, message: '社区简介不能为空'}, { min: 1, max: 100, message: ' 请输入1-100个字符 ' }
                ]">
          <el-input type="textarea" v-model="editorData.sub_desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm2('editorData')">提交</el-button>
          <el-button @click="resetForm('editorData')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加编辑 -->
    <el-dialog title="社区详情" :visible.sync="dialogVisible3" width="50%">
      <div style="display:flex">
        <p class="detail-title">社区名称:</p>
        <p class="text-wrap ">{{detail.sub_name}}</p>
      </div>
      <div style="display:flex">
        <p class="detail-title">社区电话:</p>
        <p class="text-wrap ">{{detail.sub_connect}}</p>
      </div>
      <div style="display:flex">
        <p class="detail-title">社区地址:</p>
        <p class="text-wrap ">{{detail.sub_location}}</p>
      </div>
      <div style="display:flex">
        <p class="detail-title">社区简介:</p>
        <p class="text-wrap ">{{detail.sub_desc}}</p>
      </div>

    </el-dialog>

  </div>
</template>

<script>
//正则
// 手机号验证
function isvalidPhone(str) {
  const reg = /^((0\d{2,3}-\d{7,8})| (0\d{2,3}\d{7,8}) |(1[3584]\d{9}))$/;
  return reg.test(str);
}
let validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的手机号码"));
  } else {
    callback();
  }
};
let rules = {
  sub_connect: [{ required: true, trigger: "blur", validator: validPhone }],
  sub_name: [
    { required: true, message: "社区名称不能为空" },
    { min: 1, max: 20, message: "请输入1-20个字符" }
  ]
};
// 组件
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
import MoPaging from "../../components/Paginations.vue";
// 数据接口
import {
  RequestStreet,
  RequestSubAdd,
  RequestSubEditor,
  RequestSubDelete,
  RequestGroupEditor
} from "../../fetch/modules/service";
import { getToken, RequestUploads } from "../../fetch/modules/public";
export default {
  components: { ChooseTab, MoPaging },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      to.meta.perm.forEach((item, index) => {
        vm.perm[item.perm_name] = item.is_select;
      });
    });
  },
  data() {
    return {
      perm: {
        streetChange: 2,
        streetAdd: 2,
        streetDetail: 2,
        streetEdit: 2,
        streetSele: 2
      },
      imageUrl: "",
      show: true,
      tableData: [],
      current_page: 1,
      page_size: 1,
      count: 0,
      selectionValues: [],
      handleShowDliog: false,
      active: 1,
      loading: false,
      textarea3: "",
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      title: "",
      group_desc: "",
      addData: {
        sub_name: "",
        sub_location: "",
        sub_desc: "",
        sub_connect: ""
      },
      editorData: {
        sub_name: "",
        sub_location: "",
        sub_desc: "",
        sub_connect: ""
      },
      detail: {},
      rules
    };
  },
  created() {
    this.getStreet({});
  },
  methods: {
    // 街道图片上传
    beforeAvatarUpload(file) {
      let formData = new FormData(),
        isJPG = file.type,
        self = this,
        fileText = "",
        isLt2M = file.size / 1024 / 1024 < 2;
      let isVedioArr = isJPG.split("/");
      for (let i in isVedioArr) {
        i == 1 ? (fileText = isVedioArr[i]) : "";
      }
      if (
        isJPG == "image/jpeg" ||
        isJPG == "image/png" ||
        isJPG == "image/jpeg"
      ) {
        if (isLt2M) {
          formData.append("file", file);
          RequestUploads(formData).then(res => {
            let keyOne = res.data.key;
            self.upImage(keyOne);
            self.imageUrl = `https://img.sqydt.darongshutech.com/${res.hash}`;
            this.getStreet({});
          });
        } else {
          this.$message.error("请上传2M以下的图片");
        }
      } else {
        return this.$message.error("请上传正确的图片格式");
      }
    },
    upImage(pic) {
      let args = {
        group_id: this.tableData.group_id,
        group_pic: pic
      };
      RequestGroupEditor(args);
    },
    saveStreet() {
      let args = {
        group_id: this.tableData.group_id,
        group_desc: this.group_desc
      };
      RequestGroupEditor(args).then(res => {
        this.getStreet({});
        this.show = true;
      });
    },
    getStreet(obj) {
      RequestStreet(obj).then(res => {
        this.tableData = res;
        if (res.group_pic) {
          this.imageUrl = res.IMG_HOST + res.group_pic;
        }
      });
    },

    editorDesc() {
      this.group_desc = this.tableData.group_desc;
      this.show = false;
    },
    handEditor(item) {
      this.editorData = Object.assign(this.editorData, item);
      // console.log("sss",this.editorData)
      this.dialogVisible2 = true;
    },
    // 分页选择
    pageChange(current) {
      this.current_page = current;
      let args = { current_page: current };
      this.getStreet(args);
    },
    releaseClick() {
      this.title = "新增社区";
      this.dialogVisible = true;
    },
    // 批量选中
    selectionChange(selectionValues) {
      this.selectionValues = selectionValues;
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    //  删除
    tabelDelete() {
      // console.log(this.selectionValues);
      let self = this,
        selectionArr = [];
      for (let i in this.selectionValues) {
        selectionArr.push(this.selectionValues[i].sub_id);
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestSubDelete({ sub_id: selectionArr }).then(res => {
            self.getStreet();
          });
        })
        .catch(() => {
          this.$Message({
            type: "info",
            text: "已取消删除"
          });
        });
    },
    // 详情
    handleDetail(row) {
      this.dialogVisible3 = true;
      this.detail = row;
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          RequestSubAdd(this.addData).then(res => {
            this.dialogVisible = false;
            this.resetForm("addData");
            this.getStreet({});
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          RequestSubEditor(this.editorData).then(res => {
            this.dialogVisible2 = false;
            this.resetForm("editorData");
            this.getStreet({});
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible2 = false;
      this.dialogVisible = false;
    },
    RequestQiu(formData) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      return new Promise((resolve, reject) => {
        this.$http.post("https://up.qbox.me", formData, config).then(res => {
          if (res.status == 200) {
            resolve(res.data);
          }
        });
      });
    },
    // 七牛云获取
    requestQiNiutoken() {
      return (
        (!this.qiniuToken &&
          getToken({ file_ext: "jpg" }).then(res => {
            return res;
          })) ||
        Promise.resolve()
      );
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.info-container {
  margin: 30px 15px;
  font-size: 14px;

  .info-intro {
    width: 300px;
  }
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
.upload {
  overflow: hidden;
}
.info-upload-img {
  margin: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
}
.detail-title {
  min-width: 80px;
  font-weight: 600;
}
.text-wrap {
  word-break: break-all;
  word-wrap: break-word;
}
</style>
