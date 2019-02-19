<template>
  <div class="info-container">
    <div class="container-main-wrap">
      <el-card>
        <div class="info-title">预览社区报，点击版面进入大图模式</div>
        <div class="grid-content-wrap">
          <el-row :gutter="40">
            <el-col :span="12" v-for="(item,index) in thumbList" :key="index">
              <div class="grid-content bg-purple" @click="previewNews(index)">
                <img :src="baseUrl+item.page_pic" alt="" v-if="item.page_pic">
              </div>
            </el-col>
          </el-row>
          <div align="center">
            <el-button icon="el-icon-arrow-left" @click="callBack">返回社区报列表</el-button>
          </div>
        </div>
      </el-card>

    </div>
    <!-- 社区报预览 -->
    <div v-if="dialogVisible" class="preview-wrap">
      <el-dialog title="预览" :visible.sync="dialogVisible" width="1115px" :close-on-click-modal="false">
        <div class="preview-info">
          预览社区报，点击内容可放大查阅；
        </div>
        <div class="carousel-main">
          <el-carousel :interval="5000" indicator-position="none" arrow="never" :autoplay="false" ref="carousel" :initial-index="curIndex" height="810px">
            <el-carousel-item v-for="(item,index) in objData" :key="index">
              <div class="clearfix" style="padding:0 10px;">
                <div class="lf news-main-wrap">
                  <el-scrollbar ref="elscrollbar" style="height:800px;">
                    <fitBoard :temId="Number(item.newspaper_page.template_id)" :dataObj="objData[index]" @emitStream="emitStream" />
                  </el-scrollbar>
                </div>
                <div class="rt edit-main-wrap">
                  <div style="padding:10px 10px 20px;">
                    <el-collapse v-model="activeNames">
                      <el-collapse-item title="基本信息" name="1">
                        <!-- <div class="main-content">
                          <p class="main-title-name"> 报纸标题：</p>
                          <p class="main-input">{{item.newspaper_page.page_header}}</p>
                          <p class="main-title-name"> 副标题：</p>
                          <p class="main-input"></p>
                          <p class="main-title-name"> 报尾：</p>
                          <p class="main-input">{{item.newspaper_page.page_end}}</p>
                        </div> -->
                        <div class="main-content">
                          <p class="main-title-name"> 版面名称</p>
                          <p class="main-input">{{item.newspaper_page.page_header}}</p>
                          <div v-if="item.newspaper_page.page_num==1">
                            <div v-if="pageOne.item_logo">
                              <p class="main-title-name">LOGO标题</p>
                              <img :src="'https://img.sqydt.darongshutech.com/'+pageOne.item_logo" alt="" style="width:100px;">
                            </div>
                            <div v-else>
                              <p class="main-title-name"> 报纸标题</p>
                              <p class="main-input">{{pageOne.item_title}}</p>
                              <p class="main-title-name"> 副标题：</p>
                              <p class="main-input">{{pageOne.item_subtitle}}</p>
                            </div>
                          </div>
                          <p class="main-title-name"> 报尾</p>
                          <p class="main-input">{{item.newspaper_page.page_end}}</p>
                        </div>
                      </el-collapse-item>
                    </el-collapse>
                    <div class="textarea-wrap" style="margin-top:15px;">
                      <!-- <p class="title">驳回理由：</p>
                      <el-input class="textarea" type="textarea" placeholder="请输入驳回理由" v-model="remark"></el-input>
                      <div style="margin-top:10px;text-align:center">
                        <el-button type="primary" @click='submitNewspaperRemark(2, item.newspaper_page.page_id)'> 保存 </el-button>
                      </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="fanye-wrap" style="padding-bottom:15px;">
          <el-button class="lf" @click="changePage('prev')" type="primary" plain icon="el-icon-arrow-left"> 上一版 </el-button>
          <el-button class="rt" @click="changePage('next')" type="primary" plain> 下一版
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 社区报详情预览 -->
    <div v-if="detailVisible" class="preview-detail-wrap">
      <el-dialog title="详情" :visible.sync="detailVisible" width="60%" :close-on-click-modal="false">
        <div class="carousel-main">
          <el-carousel :interval="5000" indicator-position="none" arrow="never" :autoplay="false" ref="carouselDetail" :initial-index="detailCurIndex" height="530px">
            <el-carousel-item v-for="(item,index) in newspaperDetailArr" v-if="item.item_type != 0" :key="index">
              <el-scrollbar ref="elscrollbar" style="height:500px;">
                <div class="detail-container">
                  <h3>{{item.item_title}}</h3>
                  <p v-html="item.item_content"></p>
                </div>
              </el-scrollbar>
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- <div class="textarea-wrap">
          <p class="title">驳回理由：</p>
          <el-input class="textarea" type="textarea" placeholder="请输入驳回理由" v-model="remark"></el-input>
        </div> -->
        <div class="fanye-wrap clearfix">
          <el-button class="lf" @click="changeDetailPage('prev')" type="primary" plain icon="el-icon-arrow-left"> 上一篇 </el-button>
          <!-- <el-button type="primary" @click='submitNewspaperRemark(1,newspaperDetailArr[detailCurIndex].item_id)'> 保存 </el-button> -->
          <el-button class="rt" @click="changeDetailPage('next')" type="primary" plain> 下一篇
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Newsparper from "@/fetch/modules/newspaper";
import fitBoard from "./component/plate/index.vue";
export default {
  components: { fitBoard },
  data() {
    return {
      newspaper_id: "",
      page_id: "",
      dialogVisible: false,
      detailVisible: false,
      curIndex: 0,
      detailCurIndex: 0,
      activeNames: ["1"],
      thumbList: [],
      newspaperDetailArr: [], //文章的具体详情数组
      remarkList: [],
      remark: "", //整体的驳回理由
      detailRmark: "", //对详情的驳回
      pageRemark: "", //整体驳回
      hasRemark: false,
      objData: [null, null, null, null],
      audit_id: "",
      baseUrl: "https://img.sqydt.darongshutech.com/",
      pageOne: null
    };
  },
  created() {
    let { newspaper_id } = this.$route.query;
    this.newspaper_id = newspaper_id;
    this.getNewspaperThumb(newspaper_id);
    // this.getNewspaperAllRemark();
  },
  methods: {
    //预览社区报
    previewNews(index) {
      if (this.objData[0] && this.objData[1] && this.objData[2] && this.objData[3]) {
        this.curIndex = Number(index);
        this.remark = "";
        this.newspaperDetailArr = this.objData[this.curIndex].newspaper_page_items;
        this.dialogVisible = true;
      } else {
        this.$message.warning("数据还未加载完，请耐心等待");
      }
    },
    emitStream(data) {

      if (data.builder_id != 7 && data.builder_id != 0) {
        let curIndex = Number(data.index);
        this.detailCurIndex = curIndex || 0;
        this.detailVisible = true;
      }
    },
    // 获取社区报详情
    getNewspaperThumb(newspaper_id) {
      Newsparper.RequesNewspaperThumb({ newspaper_id: newspaper_id }).then(res => {
        this.thumbList = res.page_pics;
        res.page_pics.forEach((item, index) => {
          this.getNewspaperPage(item.page_id, index);
        });
      });
    },
    //返回审核列表
    callBack() {
      this.$router.push({ path: "comNewspaperList" });
      this.$store.dispatch("delVisitedViews", {
        path: "/comNewspaper/previewLook"
      });
    },

    //获取社区报具体某个版面信息
    getNewspaperPage(page_id, index) {
      Newsparper.RequesNewspaperPage({ page_id: page_id }).then(res => {
        res.newspaper_page_items.map(item => {
          item.item_images = item.item_images ? item.item_images : [];
          item.points = JSON.parse(item.points);
          if (item.item_type == 0) {
            this.pageOne = item;
          }
          return item;
        });

        this.objData[index] = res;
        console.log(this.objData);
      });
    },
    changePage(status) {
      let curIndex = this.curIndex;
      curIndex = this.curChange(status, curIndex, 3);
      this.curIndex = curIndex;
      this.newspaperDetailArr = this.objData[curIndex].newspaper_page_items;
      this.$refs.carousel.setActiveItem(curIndex);
    },
    changeDetailPage(status) {
      let curIndex = this.detailCurIndex;
      curIndex = this.curChange(status, curIndex, this.newspaperDetailArr.length - 1);
      this.detailCurIndex = curIndex;
      this.detailRmark = "";
      this.$refs.carouselDetail.setActiveItem(curIndex);
    },
    curChange(status, curIndex, total) {
      if (status == "prev") {
        curIndex--;
        curIndex < 0 ? (curIndex = total) : curIndex;
      } else {
        curIndex++;
        curIndex > total ? (curIndex = 0) : curIndex;
      }
      return curIndex;
    }
  }
};
</script>
<style scoped  rel="stylesheet/scss" lang="scss">
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .detail-container {
    padding: 0 20px;
  }
  .main-input {
    width: 100%;
    height: 30px;
    /* color: #848484; */
    outline: none;
    border: none;
    font-size: 14px;
    border-bottom: 1px #ebeef5 solid;
    /* border-bottom: 1px #17b1ed solid; */
    /* margin-top: 10px; */
  }
  .grid-content-wrap {
    margin: auto;
    max-width: 900px;
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
    text-align: center;
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
      background: #f0f2f5;
    }
    .news-main-wrap {
      width: 750px;
      background: #fff;
      box-shadow: 0px 0px 5px #e2e2e2;
    }
    .edit-main-wrap {
      width: 280px;
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
      border: 1px solid #eee;
      img {
        width: 100%;
      }
    }
    .bg-purple-light {
      background: #e5e9f2;
    }
    .grid-content {
      cursor: pointer;
      border-radius: 4px;
      min-height: 500px;
    }
    .row-bg {
      padding: 10px 0;
      background-color: #f9fafc;
    }
  }
}
</style>


