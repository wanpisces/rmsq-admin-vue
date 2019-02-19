<template>
  <div class="my-container">
    <div class="layout-head">
      <h3>{{form.newspaper_title || '社区报标题'}} &nbsp;&nbsp;&nbsp; {{form.issn || '社区报期刊'}}</h3>
      <el-steps class="head-step" :active="1" align-left>
        <el-step title="选择模板"></el-step>
        <el-step title="编辑版面一"></el-step>
        <el-step title="编辑版面二"></el-step>
        <el-step title="编辑版面三"></el-step>
        <el-step title="编辑版面四"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <p>提示：点击左侧模块可编辑该模块的详细内容</p>
    </div>
    <div class="step-container">
      <div class="step-container-top">
        <ul>
          <li v-for="(item,index) in temp_list" :key="index">
            <div class="add-template">
              <p>{{item.titleName}}：{{item.template_name}}</p>
              <el-button v-if="item.template_id" type="text" size="small" @click="selectState(index)">修改</el-button>
            </div>
            <img v-if="item.pic_demo" :src="item.pic_demo" alt="" :class="selectIndex == index?'step-selected':'step-select'" @click="selectState(index)">
            <div v-else :class="selectIndex == index?'upload-img-select':'upload-img'" @click="selectState(index)">
              <img src="/static/images/upload.png" alt="">
            </div>
          </li>
        </ul>

        <div class="step-template">
          <h1>选择模板：{{temp_title}}</h1>
          <el-scrollbar ref="elscrollbar" style="height:630px">
            <div class="step-content">
              <div v-for="(item,index) in select_list" :key="index" class="step-image">
                <div style="height:100%">
                  <!-- <img :src="item.pic_tag" alt=""> -->
                  <div class="step-select-bg" :style="{backgroundImage: 'url(' + item.pic_tag  + ')'}"></div>
                  <p>{{item.template_name}}</p>
                </div>
                <div v-if="item.template_select == 0" class="step-bg">
                  <i class="wx-manage-xuanzhong step-cursor" @click="getTempNum(index,selectIndex)"></i>
                  <img src="/static/images/big.png" class="step-cursor" alt="" @click="bigImgEvt(index)">
                </div>
                <div v-else class="step-bg-select">
                  <i v-if="item.template_del == 1" class="el-icon-delete step-cursor" @click="cancelTemp(index)"></i>
                  <img src="/static/images/big.png" class="step-cursor" alt="" @click="bigImgEvt(index)">
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>

      </div>
      <div class="step-form">
 
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="社区报标题" prop="newspaper_title" :rules="[{ required: true, message: '请输入社区报标题', trigger: 'blur' }]">
            <el-input v-model="form.newspaper_title"></el-input>
            <p class="step1-tips">注意：社区报标题将会在小程序社区报目录栏上展示，不可修改，请谨慎填写。</p>
          </el-form-item>
                 
          <el-form-item label="社区报期刊" prop="issn" :rules="[{ required: true, message: '请输入社区报期刊', trigger: 'blur' }]">
            <el-input v-model="form.all" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" plain @click="resetSel">重新选择</el-button>
            <el-button type="primary" @click="submitForm('form')">已确认模板，下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <div class="step-tip">
        <img :src="big_img" alt="">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import newspaper from "@/fetch/modules/newspaper";
export default {
  data() {
    return {
      selectIndex: 0,
      temp_title: "版面1",
      big_img: "",
      dialogVisible: false,
      form: {
        newspaper_title: "",
        issn: "",
        template_ids: "",
        total:'',
        all:'',
      },
      select_list: [], //可选择的模板（区分正刊，副刊）
      list: [], //所有模板
      temp_list: [
        {
          titleName: "版面1",
          template_name: "",
          pic_demo: "",
          template_id: ""
        },
        {
          titleName: "版面2",
          template_name: "",
          pic_demo: "",
          template_id: ""
        },
        {
          titleName: "版面3",
          template_name: "",
          pic_demo: "",
          template_id: ""
        },
        {
          titleName: "版面4",
          template_name: "",
          pic_demo: "",
          template_id: ""
        }
      ]
    };
  },
  mounted() {
    this.getDataTemp();
    this.getISSN();
  },
  methods: {
    // 获取所有模板
    getDataTemp() {
      newspaper.RequestNewspaperTemplate().then(res => {
        this.list = res.list;
        this.initTemp();
        this.isSelect();
      });
    },
    getISSN() {
      newspaper.RequesNewspaperISSN().then(res => {
        if (res) {
          this.form.issn = "第" + (res.issn + 1) + "期";
          this.form.total= res.total+1;
          this.form.all= new Date().getFullYear() +'年 '+'第'+(res.issn+1)+'期'+' 总第'+(res.total+1)+'期'
        }
      });
    },
    // 初始状态
    initTemp() {
      this.select_list = [];
      this.list.forEach(msg => {
        if (msg.type == 1) {
          this.select_list.push(msg);
        }
      });
      this.temp_list[0].pic_demo = this.select_list[0].pic_demo;
      this.temp_list[0].template_name = this.select_list[0].template_name;
      this.temp_list[0].template_id = this.select_list[0].template_id;
    },
    // 判断模板中的数据是否选中
    isSelect() {
      this.select_list.forEach(msg => {
        msg.template_select = 0;
        msg.template_del = 0;
      });
      for (let i = 0; i < this.temp_list.length; i++) {
        for (let j = 0; j < this.select_list.length; j++) {
          if (this.temp_list[i].template_id == this.select_list[j].template_id) {
            this.select_list[j].template_select = 1;
          }
          if (this.temp_list[this.selectIndex].template_id == this.select_list[j].template_id) {
            this.select_list[j].template_del = 1;
          }
        }
      }
    },
    // 取消选中
    cancelTemp(index) {
      let selectIndex = this.selectIndex;
      if (this.temp_list[selectIndex].template_id == this.select_list[index].template_id) {
        this.temp_list[selectIndex].template_id = "";
        this.temp_list[selectIndex].pic_demo = "";
        this.temp_list[selectIndex].template_name = "";
      } else {
        this.$message({
          message: "不能取消其他版面的模板",
          type: "error"
        });
      }
      this.isSelect();
    },
    // 放大图片
    bigImgEvt(index) {
      this.dialogVisible = true;
      this.big_img = this.select_list[index].pic_demo;
    },
    // 选中模板
    getTempNum(index, selectIndex) {
      console.log("aa", this.select_list[index]);
      this.temp_list[selectIndex].template_name = this.select_list[index].template_name;
      this.temp_list[selectIndex].pic_demo = this.select_list[index].pic_demo;
      this.temp_list[selectIndex].template_id = this.select_list[index].template_id;
      this.isSelect();
    },
    // 选中版面,修改版面
    selectState(index) {
      this.selectIndex = index;
      this.temp_title = this.temp_list[index].titleName;
      if (index == 0) {
        this.select_list = [];
        this.list.forEach(msg => {
          if (msg.type == 1) {
            this.select_list.push(msg);
          }
        });
      } else {
        this.select_list = [];
        this.list.forEach(msg => {
          if (msg.type == 2) {
            this.select_list.push(msg);
          }
        });
      }
      this.isSelect();
    },
    // 重新选择
    resetSel() {
      // 清空form表单的值
      // Object.keys(this.form).forEach(key => (this.form[key] = ""));
      this.temp_list.forEach(msg => {
        Object.keys(msg).forEach(key => {
          if (key !== "titleName") {
            msg[key] = "";
          }
        });
      });
      this.temp_title = "版面1";
      this.selectIndex = 0;
      this.initTemp();
    },
    // 确认模板，进行下一步
    submitForm(formName) {
      let tempArray = [];
      this.temp_list.forEach(msg => {
        if (!msg.template_id) {
          this.$message({
            message: "版面信息不能为空",
            type: "warning"
          });
        } else {
          tempArray.push(msg.template_id);
          this.form.template_ids = JSON.stringify(tempArray);
        }
      });
      if (tempArray.length >= 4) {
        // 提交
        this.$refs[formName].validate(valid => {
          if (valid) {
            let args = JSON.parse(JSON.stringify(this.form));
            newspaper.RequestChooseTemplate(args).then(res => {
              if (res.code == 2000) {
                this.$router.push({
                  name: "comNewspaperStep2",
                  params: JSON.stringify(res.data.page_id)
                });
                this.$store.dispatch("delVisitedViews", {
                  path: "/comNewspaper/comNewspaperStep1"
                });
                localStorage.setItem("newspperTitle", JSON.stringify(this.form));
                localStorage.setItem("pageId", JSON.stringify(res.data.page_id));
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.my-container {
  max-width: 1190px;
  height: calc(100vh - 84px);
  margin: auto;
}
.layout-head {
  width: 100%;
  height: 200px;
  padding: 15px 25px 0;
  margin: 0 auto;
  .head-step {
    width: 100%;
    padding: 10px 20px 30px;
  }

  p {
    padding: 0 16px;
    font-size: 14px;
    color: #999;
  }
}
.step-container {
  width: 100%;
  margin: 20px 0;
  background-color: #ffffff;
  padding: 50px 0;
}
.step-container-top {
  display: flex;
  justify-content: center;
  background-color: #ffffff;
}
.step-form {
  width: 450px;
  padding: 30px 0;
  margin: 0 auto;
}
ul {
  width: 450px;
  margin: 60px 30px;
  list-style: none;
  margin: 0px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  li {
    width: 43%;
    .add-template {
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 14px;
      }
    }
    .step-select {
      width: 100%;
      min-width: 176px;
      height: 300px;
      overflow: hidden;
    }
    .step-selected {
      width: 100%;
      min-width: 176px;
      height: 300px;
      overflow: hidden;
      outline: 2px dashed #61c9f5;
    }
    .upload-img {
      width: 100%;
      height: 300px;
      min-width: 176px;
      border: 1px solid #f2f2f2;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 50px;
      }
    }
    .upload-img-select {
      width: 100%;
      height: 300px;
      outline: 2px dashed #61c9f5;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 50px;
      }
    }
  }
}
.step-template {
  width: 550px;
  border: 1px solid #f2f2f2;
  margin: 30px;
  h1 {
    font-size: 20px;
    line-height: 50px;
    font-weight: 600;
    padding: 0 20px;
    margin: 0;
    border-bottom: 1px solid #f2f2f2;
  }
  .step-content {
    width: 100%;
    height: 500px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    // overflow-y: scroll;
    .step-image {
      width: 200px;
      height: 280px;
      margin: 10px;
      overflow: hidden;
      position: relative;
      .step-bg {
        width: 200px;
        height: 280px;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: space-around;
        .wx-manage-xuanzhong {
          color: #fff;
          font-size: 35px;
        }
        img {
          width: 35px;
          height: 35px;
        }
      }
      .step-bg-select {
        width: 200px;
        height: 280px;
        opacity: 1;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: space-around;
        .wx-manage-xuanzhong {
          color: #fff;
          font-size: 35px;
        }
        .el-icon-delete {
          color: #fff;
          font-size: 30px;
        }
        img {
          width: 35px;
          height: 35px;
        }
      }
      .step-bg:hover {
        opacity: 1;
      }
      img {
        display: block;
        width: 200px;
        height: 250px;
        overflow: hidden;
      }
      p {
        font-size: 16px;
        line-height: 30px;
        text-align: center;
      }
    }
  }
}
.step-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 80%;
  }
}
.step-select-bg {
  width: 100%;
  height: 250px;
  overflow: hidden;
  /* background-image: url(""); */
  background-size: cover;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  background-repeat: no-repeat;
}
.step-cursor {
  cursor: pointer;
}
.step1-tips{
  padding: 5px 0;
  font-size: 12px;
  line-height: 18px;
  color: #39BCF3;
}
</style>
