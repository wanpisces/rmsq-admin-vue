<template>
  <div class="info-container">
    <div class="container-main-wrap">
      <div class="layout-head">
        <h3>{{newspaperTitle.newspaper_title }} &nbsp;&nbsp;&nbsp; {{newspaperTitle.issn}} </h3>
        <el-steps class="head-step" :active="5" align-left>
          <el-step title="选择模板"></el-step>
          <el-step title="编辑版面一"></el-step>
          <el-step title="编辑版面二"></el-step>
          <el-step title="编辑版面三"></el-step>
          <el-step title="编辑版面四"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!-- <p>提示：点击左侧模块可编辑该模块的详细内容</p> -->
      </div>
      <el-card>

        <div class="grid-content-wrap">
          <el-row :gutter="40">
            <el-col :span="12" v-for="(item,index) in page_pics" :key="index">
              <div class="grid-content bg-purple">
                <img :src="baseUrl+item.page_pic" v-if="item.page_pic" width="100%" />
              </div>
              <div class="examine-editor" @click="handleEditor(index+1)">编辑</div>
            </el-col>
          </el-row>
          <div class="examine-btn">
            <el-button icon="el-icon-delete" type="danger" @click="submitData(1)" :disabled="!newspaper_id"> 删除 </el-button>
            <el-button type="success" @click="submitData(2)" :disabled="!newspaper_id"> 保存 </el-button>
            <el-button @click="submitData(3)" type="primary" :disabled="!newspaper_id"> 提交审核 </el-button>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>
<script>
import newspaper from "@/fetch/modules/newspaper";
export default {
  data() {
    return {
      dialogVisible: false,
      detailVisible: false,
      curIndex: 0,
      detailCurIndex: 0,
      activeNames: ["1"],
      newspaper_id: "",
      page_pics: [], //详情缩略图
      newspaperTitle: {
        newspaper_title: "社区报",
        issn: "期刊"
      },
      baseUrl: "https://img.sqydt.darongshutech.com/"
    };
  },
  created() {
    this.newspaper_id = this.$route.query.newspaper_id;
    if (localStorage.getItem("newspperTitle")) {
      let title = JSON.parse(localStorage.getItem("newspperTitle"));
      this.newspaperTitle = {
        newspaper_title: title.newspaper_title,
        issn: title.issn
      };
    }
  },
  mounted() {
    if (this.$route.query.newspaper_id) {
      this.getDataNewImg();
    } else {
      this.backList();
    }
  },
  methods: {
    // 获取社区报详情缩略图
    getDataNewImg() {
      newspaper.RequesNewspaperThumb({ newspaper_id: this.newspaper_id }).then(res => {
        this.page_pics = res.page_pics;
      });
    },
    submitData(index) {
      if (index == 1) {
        newspaper.RequesNewspaperDelete({ newspaper_id: this.newspaper_id }).then(res => {
          console.log(res);
          if (res.code == 2000) {
            localStorage.removeItem("newspperTitle");
            localStorage.removeItem("pageId");
            this.backList();
          } else {
            this.$message.success(res.msg);
          }
        });
      } else if (index == 3) {
        newspaper.RequestNewspaperCheck({ newspaper_id: this.newspaper_id }).then(res => {
          if (res.code == 2000) {
            this.$message.success("提交成功");
            localStorage.removeItem("newspperTitle");
            localStorage.removeItem("pageId");
            this.backList();
          } else {
            this.$message.success(res.msg);
          }
        });
      } else {
        this.backList();
      }
    },
    backList() {
      this.$router.push({
        path: "/comNewspaper/comNewspaperList"
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/comNewspaper/stepLast"
      });
    },
    handleEditor(index) {
      this.$router.push({
        path: "/comNewspaper/comNewspaperStep2",
        query: {
          stepIndex: index
        }
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/comNewspaper/stepLast"
      });
    }
  }
};
</script>
<style scoped  rel="stylesheet/scss" lang="scss">
.layout-head {
  width: 100%;
  height: 150px;
  padding: 5px 25px 0;
  margin: 0 auto;
}
.info-container {
  max-width: 1190px;
  margin: 0 auto;
  padding: 30px 0;
  font-size: 14px;

  .detail-container {
    min-height: 500px;
  }
  .main-input {
    width: 100%;
    height: 30px;
    outline: none;
    border: none;
    font-size: 14px;
    border-bottom: 1px #ebeef5 solid;
  }
  .grid-content-wrap {
    margin: auto;
    // max-width: 900px;
  }
  .main-content {
    padding: 0 10px 10px 10px;
  }
  .main-title-name {
    color: #848484;
    font-size: 14px;
    padding: 10px 0;
  }

  .main-time .el-select {
    width: 120px;
  }
  .preview-info {
    margin-bottom: 20px;
    line-height: 26px;
  }
  .fanye-wrap {
    margin-top: 20px;
    text-align: center;
  }
  .textarea-wrap {
    .title {
      margin: 0 0 10px;
    }
  }
  .preview-wrap {
    .carousel-main {
      padding: 20px 5px;
      background: #2b3948;
    }
    .news-main-wrap {
      width: 60%;
      background: #fff;
      box-shadow: 0px 0px 5px #e2e2e2;
    }
    .edit-main-wrap {
      width: 38%;
      background: #fff;
      box-shadow: 0px 0px 5px #e2e2e2;
    }
  }

  .container-main-wrap {
    .info-title {
      padding: 10px;
      margin-bottom: 30px;
      font-size: 16px;
      color: #1890ff;
      border-bottom: 5px solid rgb(247, 246, 252);
    }
    .round-title {
      margin-bottom: 10px;
      // text-align: center;
    }
    .bohui-item {
      margin-bottom: 20px;
    }
    .el-container {
      position: relative;
      margin-bottom: 10px;
      // border-bottom: 1px solid #353535;
    }
    .delete-btn {
      position: absolute;
      right: -10px;
      top: -5px;
    }
    .el-aside {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #d3dce6;
      color: #333;
      text-align: center;
      padding: 15px 10px;
    }

    .el-main {
      background-color: #e9eef3;
      color: #333;
      text-align: left;
      line-height: 20px;
    }
    .examine-btn {
      margin: 30px auto;
      text-align: center;
    }
    .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-col {
      margin-bottom: 30px;
      border-radius: 4px;
    }
    .bg-purple-dark {
      background: #99a9bf;
    }
    .bg-purple {
      background: #d3dce6;
    }
    .bg-purple-light {
      background: #e5e9f2;
    }
    .grid-content {
      //   cursor: pointer;
      // border-radius: 4px;
      min-height: 500px;
    }
    .row-bg {
      padding: 10px 0;
      background-color: #f9fafc;
    }
  }
}
.examine-editor {
  text-align: center;
  padding: 10px 0;
  color: #39bcf3;
  cursor: pointer;
}
</style>


