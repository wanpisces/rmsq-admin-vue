<template>
  <div class="info-container">
    <div class="container-main-wrap">
      <el-card>
        <div class="info-title">预览社区报，点击版面进入大图模式</div>
        <div class="grid-content-wrap">
          <el-row :gutter="40">
            <el-col :span="12" v-for="(item,index) in thumbList" :key="index">
              <div class="grid-content bg-purple" @click="previewNews(index)">
                <img :src="baseUrl+item.page_pic" alt="">
              </div>
            </el-col>
          </el-row>
          <!-- <div v-if="!hasRemark">
                        <div class="textarea-wrap" style="margin-top:15px;">
                            <p class="title">驳回理由（整体）：</p>
                            <el-input class="textarea" type="textarea" placeholder="请输入驳回理由" v-model="remark"></el-input>
                        </div>
                        <div class="examine-btn">
                            <el-button icon="el-icon-arrow-left" @click="callBack"> 返回审核列表 </el-button>
                            <el-button type="primary" @click="putNewspaperRemark(newspaper_id)" v-model="remark"> 驳回 </el-button>
                            <el-button type="primary" v-if="!hasRemark" @click="passNewspaperState"> 通过 </el-button>
                        </div>
                    </div> -->
        </div>
        <div style="margin-top:30px;">
          <p style="margin:20px 0 10px;">驳回理由：</p>
          <div>
            <div class="bohui-item" v-for="(item, key, index) in remarkList" :key="index">
              <div v-if="key=='newspaper_remark'">
                <div class="round-title">
                  <el-button type="primary" round>整体</el-button>
                </div>
                <el-container>
                  <el-aside width="150px">整体驳回</el-aside>
                  <el-main style="background:#fff;">
                    <el-input v-if="!item.audit_id" class="textarea" type="textarea" placeholder="请输入驳回理由" v-model="remark" @focus="totalMark=true;" @blur="submitNewspaperRemark(3,newspaper_id)"></el-input>
                    <el-input v-if="item.audit_id" class="textarea" type="textarea" placeholder="请输入驳回理由" @focus="audit_id=item.audit_id" :value="item.remark" @blur="editNewspaperRemark1"></el-input>
                  </el-main>
                  <el-button v-if="item.remark" class="delete-btn" @click="deleteTotal(item.audit_id)" type="danger" icon="el-icon-delete" circle></el-button>
                </el-container>
              </div>
              <div v-if="key!='newspaper_remark'&&(item.page.audit_id||item.item.length>0)">
                <div class="round-title">
                  <el-button type="primary" round>{{key}}</el-button>
                </div>
                <el-container v-if="item.page.audit_id">
                  <el-aside width="150px">{{item.page.title||'基本信息驳回'}}</el-aside>
                  <el-main>
                    <el-input class="textarea" type="textarea" :value="item.page.remark" @focus="audit_id=item.page.audit_id" @blur="editNewspaperRemark3"></el-input>
                  </el-main>
                  <el-button class="delete-btn" @click="deleteNewspaperRemark(item.page.audit_id)" type="danger" icon="el-icon-delete" circle></el-button>
                </el-container>
                <el-container v-if="item.item.length>0" v-for="(child,num) in item.item" :key="num">
                  <el-aside width="150px">{{child.title}}</el-aside>
                  <el-main>
                    <el-input class="textarea" type="textarea" :value="child.remark" @focus="audit_id=child.audit_id" @blur="editNewspaperRemark2"></el-input>
                  </el-main>
                  <el-button class="delete-btn" @click="deleteNewspaperRemark(child.audit_id)" type="danger" icon="el-icon-delete" circle></el-button>
                </el-container>
              </div>
            </div>
            <div class="examine-btn">
              <el-button icon="el-icon-arrow-left" @click="callBack"> 返回审核列表 </el-button>
              <el-button type="primary" v-if="!hasRemark" @click="passNewspaperState"> 通过 </el-button>
              <el-button type="primary" @click="submitNewspaperRemarkStr" v-model="remark"> 驳回 </el-button>
            </div>
          </div>

        </div>

      </el-card>
    </div>
    <!-- 社区报预览 -->
    <div v-if="dialogVisible" class="preview-wrap">
      <el-dialog title="预览" :visible.sync="dialogVisible" width="1115px" :close-on-click-modal="false">
        <div class="preview-info">
          预览社区报，点击内容可放大查阅；<br/> 如要驳回请填写原因；
          <br/> 点击关闭页面回到小图模式，驳回原因不会被清空；
          <br/>
        </div>
        <div class="carousel-main">
          <el-carousel :interval="5000" indicator-position="none" arrow="never" :autoplay="false" ref="carousel" :initial-index="curIndex" height="810px">
            <el-carousel-item v-for="(item,index) in objData" :key="index">
              <div class="clearfix" style="padding:0 10px;">
                <div class="lf news-main-wrap">
                  <el-scrollbar ref="elscrollbar" style="height:800px;">
                    <fitBoard :temId="(+item.newspaper_page.template_id)" :dataObj="objData[index]" @emitStream="emitStream" />
                  </el-scrollbar>
                </div>
                <div class="rt edit-main-wrap">
                  <div style="padding:10px 10px 20px;">
                    <el-collapse v-model="activeNames">
                      <el-collapse-item title="基本信息" name="1">
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
                      <!-- <el-collapse-item title="报头信息" name="2" v-if="item.newspaper_page.page_num==1">
                                                <div class="main-content">
                                                    <div v-if="pageOne.item_logo">
                                                        <p class="main-title-name">LOGO标题</p>
                                                        <img :src="pageOne.item_logo" alt="" style="width:100px;">
                                                    </div>
                                                    <div v-else>
                                                        <p class="main-title-name"> 报纸标题</p>
                                                        <p class="main-input">{{pageOne.item_title}}</p>
                                                        <p class="main-title-name"> 副标题：</p>
                                                        <p class="main-input">{{pageOne.item_subtitle}}</p>
                                                    </div>
                                                </div>
                                            </el-collapse-item> -->
                    </el-collapse>
                    <div class="textarea-wrap" style="margin-top:15px;">
                      <p class="title">驳回理由：</p>
                      <el-input class="textarea" type="textarea" placeholder="请输入驳回理由" v-model="remark"></el-input>
                      <div style="margin-top:10px;text-align:center">
                        <el-button type="primary" @click='submitNewspaperRemark(2, item.newspaper_page.page_id)'> 保存 </el-button>
                      </div>
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
        <div class="textarea-wrap">
          <p class="title">驳回理由：</p>
          <el-input class="textarea" type="textarea" placeholder="请输入驳回理由" v-model="remark"></el-input>
        </div>
        <div class="fanye-wrap clearfix">
          <el-button class="lf" @click="changeDetailPage('prev')" type="primary" plain icon="el-icon-arrow-left"> 上一篇 </el-button>
          <el-button type="primary" @click='submitNewspaperRemark(1,newspaperDetailArr[detailCurIndex].item_id)'> 保存 </el-button>
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
import fitBoard from "../component/plate/index.vue";
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
      pageOne: null,
      totalMark: false
    };
  },
  created() {
    let { newspaper_id } = this.$route.query;
    this.newspaper_id = newspaper_id;
    this.getNewspaperThumb(newspaper_id);
    this.getNewspaperAllRemark();
  },
  methods: {
    //预览社区报
    previewNews(index) {
      if (
        this.objData[0] &&
        this.objData[1] &&
        this.objData[2] &&
        this.objData[3]
      ) {
        this.curIndex = Number(index);
        this.remark = "";
        this.newspaperDetailArr = this.objData[
          this.curIndex
        ].newspaper_page_items;
        this.dialogVisible = true;
      } else {
        this.$message.warning("数据还未加载完，请耐心等待");
      }
    },
    //社区报驳回
    putNewspaperRemark(newspaper_id) {
      let args = {
        newspaper_id: this.newspaper_id,
        remark: this.remark
      };
      if (args.remark === "" || !args.remark) {
        this.$confirm("您未填写驳回理由，确认是否驳回？", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            Newsparper.RequestPutNewspaperAllRemark(args).then(res => {
              if (res.code == 2000) {
                this.getNewspaperAllRemark();
              }
            });
          })
          .catch(() => {});
      } else {
        Newsparper.RequestPutNewspaperAllRemark(args).then(res => {
          if (res.code == 2000) {
            this.getNewspaperAllRemark();
          }
        });
      }
    },
    deleteTotal(audit_id) {
      this.remarkList.newspaper_remark.remark = "";
      this.remark = "";
      let args = {
        audit_id: audit_id,
        remark: this.remark
      };
      Newsparper.RequestEditNewspaperRemark(args).then(res => {
        this.getNewspaperAllRemark();
      });
    },
    //批量驳回
    submitNewspaperRemarkStr() {
      let remarkList = this.remarkList;
      let remark_str = [];
      let remark_str2 = [];
      let args = {
        newspaper_id: this.newspaper_id
      };
      for (let i in remarkList) {
        if (i == "newspaper_remark") {
          remark_str.push({
            type: 3,
            object_id: remarkList[i].newspaper_id,
            remark: remarkList[i].remark
          });
        } else {
          if (remarkList[i].page.audit_id) {
            remark_str.push({
              type: 2,
              object_id: remarkList[i].page.audit_id,
              remark: remarkList[i].page.remark
            });
            remark_str2.push({
              type: 2,
              object_id: remarkList[i].page.audit_id,
              remark: remarkList[i].page.remark
            });
          }
          if (remarkList[i].item.length > 0) {
            remarkList[i].item.map(child => {
              remark_str.push({
                type: 1,
                object_id: child.audit_id,
                remark: child.remark
              });
              remark_str2.push({
                type: 1,
                object_id: child.audit_id,
                remark: child.remark
              });
            });
          }
        }
      }
      if (
        ((!remarkList.newspaper_remark.remark &&
          this.totalMark &&
          !this.remark) ||
          (!remarkList.newspaper_remark.remark && !this.totalMark) ||
          (this.totalMark && !this.remark)) &&
        remark_str2.length == 0
      ) {
        this.$confirm("您未填写驳回理由，确认是否驳回？", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            Newsparper.RequestPutNewspaperAllRemark(args).then(res => {
              if (res.code == 2000) {
                this.$router.push({ path: "comNewspaperExamine" });
                this.$store.dispatch("delVisitedViews", {
                  path: "/comNewspaper/comNewspaperLook"
                });
              }
            });
          })
          .catch(() => {});
      } else {
        Newsparper.RequestPutNewspaperAllRemark(args).then(res => {
          if (res.code == 2000) {
            this.$router.push({ path: "comNewspaperExamine" });
            this.$store.dispatch("delVisitedViews", {
              path: "/comNewspaper/comNewspaperLook"
            });
          }
        });
      }
    },
    emitStream(data) {
      // let curIndex = 0;
      // if (data.index != null) {
      //   curIndex = Number(data.index);
      // }
      // // let curIndex = Number(data.index);
      // this.detailCurIndex = curIndex || 0;
      // this.detailVisible = true;
      if (data.builder_id != 7 && data.builder_id != 0) {
        let curIndex = Number(data.index);
        this.detailCurIndex = curIndex || 0;
        this.remark = "";
        this.detailVisible = true;
      }
    },
    // 获取社区报详情
    getNewspaperThumb(newspaper_id) {
      Newsparper.RequesNewspaperThumb({ newspaper_id: newspaper_id }).then(
        res => {
          this.thumbList = res.page_pics;
          res.page_pics.forEach((item, index) => {
            this.getNewspaperPage(item.page_id, index);
          });
        }
      );
    },
    //返回审核列表
    callBack() {
      this.$router.push({ path: "comNewspaperExamine" });
      this.$store.dispatch("delVisitedViews", {
        path: "/comNewspaper/comNewspaperLook"
      });
    },
    //审核通过
    passNewspaperState() {
      this.$confirm("通过该审核，是否确认？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          Newsparper.RequestNewspaperState({
            newspaper_id: this.newspaper_id
          }).then(res => {
            if (res.code == 2000) {
              this.$router.push({ path: "comNewspaperExamine" });
              this.$store.dispatch("delVisitedViews", {
                path: "/comNewspaper/comNewspaperLook"
              });
            }
          });
        })
        .catch(() => {});
    },
    //判断整体驳回和page驳回
    disallowance(remark, type, object_id) {
      if (remark) {
        //编辑
        this.editNewspaperRemark(type, object_id, this.remark);
      } else {
        //新增
        this.submitNewspaperRemark(type, this.newspaper_id);
      }
    },
    //判断page驳回
    disallowance1(remark, type, object_id) {
      if (remark) {
        //编辑
        let arr = [];
        Object.values(this.remarkList).map((item, index) => {
          if (index > 0) {
            arr.push(item.page);
          }
        });
        this.editNewspaperRemark(
          type,
          arr[this.curIndex].audit_id,
          this.remark
        );
      } else {
        //新增
        this.submitNewspaperRemark(type, object_id);
      }
    },
    //新增驳回
    submitNewspaperRemark(type, object_id) {
      const args = {
        remark: this.remark,
        item_id: type == 1 ? object_id : "",
        page_id: type == 2 ? object_id : "",
        newspaper_id: type == 3 ? object_id : "",
        type: type
      };
      for (let i in args) {
        if (args[i] === "") {
          delete args[i];
        }
      }
      args.remark = this.remark;
      Newsparper.RequestNewspaperRemark(args).then(res => {
        this.remark = "";
        this.getNewspaperAllRemark();
      });
      //   if (args.remark === "" || !args.remark) {
      //     this.$message({
      //       message: "请输入驳回理由",
      //       type: "warning"
      //     });
      //     return false;
      //   } else {
      //     Newsparper.RequestNewspaperRemark(args).then(res => {
      //       this.getNewspaperAllRemark();
      //     });
      //   }
    },
    //编辑驳回
    editNewspaperRemark(type, object_id, remark) {
      const args = {
        remark: remark,
        audit_id: object_id
      };
      Newsparper.RequestEditNewspaperRemark(args).then(res => {
        this.getNewspaperAllRemark();
      });
    },
    editNewspaperRemark1(e) {
      this.editNewspaperRemark(3, this.audit_id, e.target.value);
    },
    editNewspaperRemark2(e) {
      this.editNewspaperRemark(1, this.audit_id, e.target.value);
    },
    //版面驳回
    editNewspaperRemark3(e) {
      this.editNewspaperRemark(2, this.audit_id, e.target.value);
    },
    //删除驳回
    deleteNewspaperRemark(object_id) {
      const args = {
        remark: this.remark,
        audit_id: object_id
      };
      Newsparper.RequestDeleteNewspaperRemark(args).then(res => {
        this.getNewspaperAllRemark();
      });
    },
    //获取所有驳回
    getNewspaperAllRemark() {
      Newsparper.RequestNewspaperAllRemark({
        newspaper_id: this.newspaper_id
      }).then(res => {
        this.remarkList = res.remarks;
        // this.remark = this.remarkList["newspaper_remark"].remark;
        this.hasRemark = Object.values(this.remarkList).some((item, index) => {
          if (index == 0) {
            return item.remark;
          }
          if (index > 0) {
            return item.item.length > 0 || item.page.audit_id;
          }
        });
      });
    },
    //获取社区报具体某个版面信息
    getNewspaperPage(page_id, index) {
      Newsparper.RequesNewspaperPage({ page_id: page_id }).then(res => {
        let arr = [];
        res.newspaper_page_items.map(item => {
          item.item_images = item.item_images ? item.item_images : [];
          item.points = JSON.parse(item.points);
          //   if (item.item_type != 0) {
          //     arr.push(item);
          //   }
          if (item.item_type == 0) {
            this.pageOne = item;
          }
          arr.push(item);
        });
        res.newspaper_page_items = arr;
        this.objData[index] = res;
      });
    },
    changePage(status) {
      this.remark = "";
      let curIndex = this.curIndex;
      curIndex = this.curChange(status, curIndex, 3);
      this.curIndex = curIndex;
      this.newspaperDetailArr = this.objData[curIndex].newspaper_page_items;
      this.$refs.carousel.setActiveItem(curIndex);
    },
    changeDetailPage(status) {
      let curIndex = this.detailCurIndex;
      curIndex = this.curChange(
        status,
        curIndex,
        this.newspaperDetailArr.length - 1
      );
      this.detailCurIndex = curIndex;
      this.remark = "";
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


