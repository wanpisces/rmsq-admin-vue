<template>
  <div id="app">
    <el-scrollbar style="height:100vh">
      <router-view></router-view>
    </el-scrollbar>
    <!-- <lg-preview></lg-preview> -->
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {}
};
</script>

<style  rel="stylesheet/scss" lang="scss" >
.lf {
  float: left;
}
.rt {
  float: right;
}

html {
  height: auto;
  width: 100%;
  min-width: 1200px;
  /* font-size: 20px; */
}
.ke-edit {
  width: 500px;
  margin: 0 auto;
  // padding:30px 150px;
  // border:1px solid #eee;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.template-form .el-form-item__content {
  margin-left: 0 !important;
}

.carousel-main .el-collapse-item__header {
  color: #353535;
  height: 35px;
  line-height: 35px;
  padding-left: 10px;
}
.carousel-main .el-collapse-item__arrow {
  line-height: 35px;
}
.bohui-item .el-input--mini {
  height: 100%;
}
.bohui-item .el-textarea__inner {
  background: #e9eef3;
  border-radius: 0;
  padding: 15px;
  height: 100%;
  // border-left: 1px solid #e9eef3;
}

.bohui-item .el-main {
  padding: 0;
}

// /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
// ::-webkit-scrollbar {
//   width: 0px;
//   height: 16px;
//   background-color: #f5f5f5;
// }

// /*定义滚动条轨道 内阴影+圆角*/
// ::-webkit-scrollbar-track {
//   -webkit-box-shadow: inset 0 0 6px #f0f2f5;
//   border-radius: 3px;
//   background-color: #f5f5f5;
// }

// /*定义滑块 内阴影+圆角*/
// ::-webkit-scrollbar-thumb {
//   border-radius: 3px;
//   -webkit-box-shadow: inset 0 0 6px #dfe6ec;
//   background-color: #dfe6ec;
// }
.el-icon-wrapper {
  font-size: 18px;
  color: #409eff;
}
.el-icon-wrapper > i {
  margin: 0 2px;
}
#app {
  font-family: "futura-pt", Helvetica, Arial, "Hiragino Sans GB", "Hiragino Sans GB W3", Microsoft JhengHei, WenQuanYi Micro Hei, "Microsoft YaHei", sans-serif;
}

p {
  margin: 0;
}
.clearfix:after,
.clearfix:before {
  content: ""; /*加一段内容*/
  display: table; /*创建匿名的表格单元，触发bfc*/
}
.clearfix:after {
  clear: both; /*清除浮动*/
}
.clearfix {
  zoom: 1; /*为IE6，7的兼容性设置*/
}
/* 截取为 ... */
.ellipsos {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
}
/* 换行 */
.word_wrap {
  word-wrap: break-word;
  word-break: break-all;
}
/* 2行截取为 ... */
.line_ellipsis_2 {
  word-wrap: break-word;
  text-align: left;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /*! autoprefixer: on */
}
/* 不可选中文字 */
.no_select_text {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}
audio {
  width: 100%;
}
.app-main {
  background: #f0f2f5;
}
.el-dialog {
  min-width: 800px;
}
.el-pager li,
.btn-prev,
.btn-next {
  border-radius: 50% !important;
}
.el-checkbox {
  margin-right: 10px !important;
  margin-left: 0 !important;
}
.info-container .search-box {
  width: 100%;
  display: inline-block;
  align-items: center;
}
.info-container .search-box .search {
  display: inline-block !important;
}
.table-title > div {
  display: inline-block;
}
.table-title > div:nth-last-of-type(1) {
  float: right;
}
.newsView .el-input--mini .el-input__inner {
  text-align: center !important;
}

body .el-table th.gutter {
  display: table-cell !important;
}
body .el-table colgroup.gutter {
  display: table-cell !important;
}
.tangram-suggestion-main {
  z-index: 100000;
}
.category_name .el-radio + .el-radio {
  padding: 10px 0;
  // margin-right: 10px !important;
  margin-right: 10px !important;
  margin-left: 0;
}
.category_name .el-radio:nth-child(1) {
  margin-right: 10px;
}
// .category_name .el-radio ~ .el-radio {
//   padding: 10px 0;
//   margin-right: 10px !important;
//   margin-left: 0 !important;
// }
.category_name .el-radio__label {
  padding-left: 3px !important;
}
/* div >>> .el-table th {
  display: table-cell !important;
} */

/* 题目选项 上传音频  */
.topicOption .el-upload {
  text-align: left;
}

/* 单选选项竖直排列 */
.radio-vertical-box {
  width: 95px;
}
.radio-vertical-box .el-radio {
  margin: 7px 10px 5px 0;
}

/* 投票评选布局 */
:root {
  --theme-color: #39bcf3;
}

.fix-content {
  display: flex;
  // min-width: 960px;
  // min-width: 986px;
  min-width: 1344px;
  width: 50%;
  margin: 0 auto;
  padding: 30px 0;
  font-size: 14px;

  .card-left {
    width: 350px;
    min-width: 350px;
    position: relative;
    overflow: hidden;
    margin: 0;
    /* 手机界面布局 */
    .phone-box {
      width: 320px;
      height: 568px;
      background-repeat: no-repeat;
      background-size: cover;
      background-color: whitesmoke;
      // background-color: #fff2ea;

      .phone-head {
        width: 100%;
        height: 53px;
        background-color: #39bcf3;
        background-color: var(--theme-color);
        background-image: url("../static/images/preview.png");
        background-size: 320px;

        h4 {
          margin: 0;
          padding-top: 26px;
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          color: white;
        }
      }

      .phone-body {
        height: 515px;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: rgba(255, 255, 255, 0.8);

        .phone-scrollbar {
          padding: 18px 8px 0;

          ul,
          li {
            padding: 0;
            margin: 0;
            list-style: none;
          }

          h5 {
            margin: 0 0 10px;
            font-size: 16px;
            font-weight: 600;
          }

          .pbody-detail {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #777;
          }
          > p {
            line-height: 20px;
            margin: 15px 0 18px;
            font-size: 13px;
          }

          .phone-content {
            width: 100%;
            min-height: 365px;
            box-sizing: border-box;
            padding: 13px 15px;
            margin-bottom: 18px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 7px;
            font-family: "Microsoft YaHei";
            letter-spacing: 1px;

            .iconfont2 {
              color: #39bcf3;
              color: var(--theme-color);
              font-size: 13px;
              margin-right: 5px;
            }

            .phone-topic {
              padding: 6px 0 18px;

              h6 {
                line-height: 22px;
                font-size: 14px;
                font-weight: 400;
                margin: 0;
              }
              .radio-vertical-box {
                width: 80px;
                padding: 4px 0;
                font-size: 13px;
              }

              .topic-item {
                margin-top: 12px;
                font-size: 12px;

                p {
                  width: 120px;
                  margin-top: 8px;
                  font-size: 12px;
                }
              }

              /* 组件样式 */
              .component-input {
                padding: 10px 3px 6px;
                border-bottom: 1px solid #39bcf3;
                border-bottom: 1px solid var(--theme-color);
                font-size: 12px;
                color: #aaa;
              }
              .component-radio {
                width: calc(100% - 70px);
                p {
                  min-width: 50px;
                  margin: 2px 6px 5px;
                  color: #666;
                  cursor: pointer;
                }
              }
              .component-avatar {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px 0 0;
                div {
                  width: 90px;
                  height: 90px;
                  line-height: 90px;
                  text-align: center;
                  background-color: #f6f6f6;
                  color: #999;
                  cursor: pointer;
                }
                p {
                  color: #666;
                  padding: 5px 0;
                }
              }
              .component-select {
                padding: 10px 0 0;
                li {
                  padding: 4px 10px;
                  background-color: #f6f6f6;
                  color: #666;
                  cursor: pointer;
                }
              }
            }

            .pcontent-body {
              min-height: 300px;
            }
            .pcontent-operat {
              padding: 15px 0 10px;

              .operat-button {
                margin: 10px 0;
                border-radius: 5px;
                line-height: 32px;
                font-size: 12px;
                text-align: center;
                color: white;
                background-color: #39bcf3;
                background-color: var(--theme-color);

                .iconfont2 {
                  color: white;
                  font-size: 14px;
                }
              }

              .operat-foot {
                display: flex;
                justify-content: space-between;
                color: #888;

                .iconfont2 {
                  color: #888 !important;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
  }

  .card-right {
    // display: none;
    width: 343px;
    min-width: 343px;
    position: relative;
    overflow: hidden;
    margin: 0;

    .other-setting {
      .el-table .cell {
        padding-left: 0;
        padding-right: 5px;
      }

      ol {
        margin: 0;
      }
    }
    .upload-demo {
      width: 220px;
      .el-upload {
        width: 100%;
        height: 176px;
        margin-top: 5px;
        .el-upload-dragger {
          width: 100%;
          height: 100%;

          .el-icon-upload {
            margin: 43px 0 16px;
          }
        }
      }
    }
  }

  .card-middle {
    min-width: 620px;
    // width: calc(100% - 355px);
    margin: 0 15px;
    position: relative;
    overflow: hidden;

    .card-curBody {
      width: 600px;
      min-width: 600px;
      margin: 0 auto;
    }
  }

  .el-card__header {
    position: absolute;
    z-index: 89;
    top: 0;
    width: 100%;
    background-color: #ffffff;
  }

  .el-collapse-item__content {
    padding-bottom: 10px;
  }

  .el-collapse-item__header {
    font-size: 14px;
  }
  .el-tabs__item {
    font-size: 13px;
  }
}
//  element ui
.el-select-dropdown__wrap {
  margin-bottom: 0 !important;
}

.preview-content .el-form-item__content {
  padding-left: 2em;
}

/* 投票评选布局 -end- */

.flex-between-wrap {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.flex-start-wrap {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
/* 必填项 * */
.red {
  display: inline-block;
  margin-left: -2px;
  color: red;
}
/* 三角形 */
.css-triangle {
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 4px solid #39bcf3;
  border-top: 4px solid var(--theme-color);
  border-right: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 4px solid transparent;
}

.diy-item .el-input-number .el-input__inner {
  text-align: left;
}

/* 社区报纸 */
.sheQuBao-body {
  .el-collapse-item__content {
    padding: 0 10px 10px;
  }

  .el-collapse-item__header {
    font-size: 15px;
    color: #000;
  }
  .el-tabs__item {
    font-size: 13px;
  }

  /* 编辑器 */
  .edui-ws .edui-editor {
    overflow: hidden;
  }
  .edui-ws .edui-editor-toolbarbox,
  .edui-ws .edui-editor-toolbarboxinner {
    width: 100%;
  }

  .edui-ws .edui-editor {
    height: auto;
  }
  .edui-ws .edui-editor-iframeholder {
    top: 105px;
  }
  .ck-editor__editable {
    min-height: 200px;
  }

  .mce-panel{
    border: 0 solid #f3f3f3;
  }
}
// 单选框垂直排版
.el-radio-vertical {
  .el-radio-group {
    width: 80px;
  }
  .el-radio {
    line-height: 2;
    margin-left: 30px;
  }
}
</style>

