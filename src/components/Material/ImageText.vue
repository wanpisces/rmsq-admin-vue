<template>
  <div v-loading="loading" class="page_box">
    <div class="material_header">
      <el-form :inline="true" :model="formSearch" class="demo-form-inline clearfix">
        <el-form-item label="标题">
          <el-input v-model="formSearch.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item class="add_img_article">
          <el-button type="primary" @click="addImgArticle">新建图文消息</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="state==1">
      <div class="material_box" style="overflow-y:hidden;height:auto;">
        <div v-for="(items,index) in dataList" :key="index" class="material_item">

          <div style="height:auto;" v-if="items.content.news_item.length ==1">

            <div class="material_img_box">
              <p class="ellipsos" style="padding-top:10px;font-size:16px;color:#666;"> {{items.content.news_item[0].title}}</p>
              <div class="material_img" :style="{backgroundImage: 'url(' + items.content.news_item[0].loc_url  + ')'}">

              </div>
              <p class="word_wrap" style="padding-top:15px;font-size:14px;color:#9a9a9a;">
                {{items.content.news_item[0].digest}}
              </p>
              <div class="material_filter_mask" @click="toPreview(items.content.news_item[0].url)">
                <p>预览文章</p>
              </div>
            </div>

          </div>
          <div v-else>
            <div v-for="(item,index2) in items.content.news_item" :key="index2">
              <div class="material_img_box" v-if="index2==0">
                <div class="material_img" :style="{backgroundImage: 'url(' + item.loc_url  + ')'}">
                  <div class="material_img_mask">
                    {{item.title}}
                  </div>
                </div>
                <div class="material_filter_mask" @click="toPreview(item.url)">
                  <p>预览文章</p>
                </div>
              </div>

              <div v-else class="material_samrt  border_top">
                <p> {{item.title}}</p>
                <div class="material_img_smart" :style="{backgroundImage: 'url(' + item.loc_url  + ')'}">
                </div>
                <div class="material_filter_mask" @click="toPreview(item.url)">
                  <p>预览文章</p>
                </div>
              </div>
            </div>
          </div>

          <div class="material_box_header" style="padding: 15px 15px 20px;">
            <span>更新于 {{items.update_time|dateFormat}}</span>
            <div>
              <i @click="toModify(1,items.media_id)" class="wx-manage-bianji"></i>
              <i @click="toModify(0,items.media_id)" class="wx-manage-delete icon_del"></i>
            </div>
          </div>
        </div>

        <div v-if="dataList.length==0 && !loading" style="text-align:center;margin:50px 0">
          <img src="https://img.sqydt.darongshutech.com/FssON4FZTDmclZI0Ty9e9kXzEaCb" alt="">
          <div style="margin:20px 0;color: #8493B3;">您还没有素材，点击新建图文消息创建素材</div>
        </div>
      </div>
      <div align="right" style="margin:20px 0">
        <el-pagination background layout="prev, pager, next" @current-change="currentChange" :current-page="formSearch.current_page" :page-size="formSearch.page_size" :total="formSearch.total">
        </el-pagination>
      </div>
    </div>
    <div v-if="state==2">
      <div class="material_box">
        <div v-for="(items,index) in dataList" :key="index" class="material_item material_item_hover" @click="handleShow(items,index)">
          <div class="material_box_header clearfix">
            <span>更新于 {{items.update_time|dateFormat}}</span>
          </div>
          <div v-for="(item,index2) in items.content.news_item" :key="index2">
            <div class="material_img_box" v-if="index2==0">
              <div class="material_img" :style="{backgroundImage: 'url(' + item.loc_url  + ')'}">
                <div class="material_img_mask">
                  {{item.title}}
                </div>
              </div>
            </div>

            <div v-else class="material_samrt  border_top">
              <p> {{item.title}}</p>
              <div class="material_img_smart" :style="{backgroundImage: 'url(' + item.loc_url  + ')'}">
              </div>
            </div>
          </div>

          <div class="material_filter" :class="[showIndex== items.media_id? 'material_filter_active':'material_filter_none']">
            <span class="material_xuan">
              <i class="wx-manage-xuanzhong"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- 分页第三方接口有误 -->
      <div align="right" style="margin:20px 0">
        <el-pagination background layout="prev, pager, next" @current-change="currentChange" :current-page="formSearch.current_page" :page-size="formSearch.page_size" :total="formSearch.total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import { RequestMenuList, RequestDeleteMenu } from "@/fetch/modules/material.js";

import { parseTime } from "@/utils/index.js";

export default {
  props: {
    /**
     * 1 1.是列表显示 2是弹框勾选
     */
    state: {
      type: Number,
      default: 1
    },
    /**
     * 1.media_id
     */
    showIndexDefault: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      formSearch: {
        title: "",
        current_page: 1,
        page_size: 10,
        total: 0
      },
      dataList: [],
      showIndex: this.showIndexDefault,
      loading: true
    };
  },
  filters: {
    dateFormat(val) {
      return parseTime(val);
    }
  },
  watch: {
    showIndexDefault() {
      this.showIndex = this.showIndexDefault;
    }
  },
  created() {
    this.getMaterialList();
  },
  methods: {
    getMaterialList() {
      RequestMenuList({
        type: 4,
        current_page: this.formSearch.current_page,
        page_size: this.formSearch.page_size
      }).then(res => {
        this.loading = false;
        this.dataList = res.list;
        this.formSearch.current_page = parseInt(res.current_page);
        this.formSearch.total = res.total_count;
      });
    },
    onSubmit() {
      this.$message({
        message: "暂未开通此功能！",
        type: "warning"
      });
    },
    addImgArticle() {
      this.$router.push({
        name: "addImgArticle",
        query: {
          media_id: ""
        }
      });
    },
    toModify(type, media_id) {
      if (type == 0) {
        this.$confirm("此操作将永久删除该消息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.loading = true;
            RequestDeleteMenu({ media_id: media_id }).then(res => {
              if (res.code === 2000) {
                this.getMaterialList();
              } else {
                this.$message.error(res.msg);
                this.loading = false;
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else if (type == 1) {
        this.$router.push({
          name: "editImgArticle",
          query: {
            media_id: media_id
          }
        });
      }
    },
    toPreview(url) {
      var getTimestamp = new Date().getTime();
      url = url.replace("&", "&t=" + getTimestamp + "&");
      window.open(url);
    },
    /**
     * 分页
     */
    currentChange(val) {
      this.formSearch.current_page = val;
      this.getMaterialList();
    },
    /**
     * 勾选
     */
    handleShow(item, index) {
      this.showIndex = item.media_id;
      console.log("ssss", item);
      this.$emit("onSuccess", item);
    }
  }
};
</script>

<style scoped>
.page_box {
  padding: 20px;
}
.add_img_article {
  float: right;
}
.material_header {
  padding: 20px 30px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #cecdcd;
}
.material_box {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: space-between;
  overflow-y: scroll;
  height: 40vh;
}

.material_box_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 15px 5px;
  border-bottom: 1px solid #ebeef5;
  font-size: 0;
}
.material_box_header span {
  font-size: 14px;
  color: #9a9a9a;
}
.material_box_header i {
  padding: 2px;
  font-size: 16px;
  color: #999;
  cursor: pointer;
}
.material_box_header i:hover {
  color: #000;
}
.material_box_header i:last-child {
  margin-left: 8px;
  font-size: 17px;
}
.material_item {
  position: relative;
  width: 328px;
  margin: 10px 10px;
  border: 1px #f2f2f2 solid;
  border-radius: 3px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  background-color: #fff;
}

.border_top {
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
}
.material_img_box,
.material_samrt {
  width: 100%;
  padding: 15px;
  position: relative;
}
.material_img_box:hover > .material_filter_mask {
  opacity: 1;
}
.material_samrt:hover > .material_filter_mask {
  opacity: 1;
}

.material_img,
.material_img_smart {
  background-image: url("");
  background-size: cover;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  background-repeat: no-repeat;
}
.material_img {
  width: 100%;
  height: 169px;
  position: relative;
}
.material_img_smart {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
}

.material_img_mask {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 8px 12px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.55);
  color: whitesmoke;
  word-wrap: break-word;
  font-size: 14px;
  letter-spacing: 1px;
}

.material_samrt {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 14px;
  line-height: 22px;
}
.material_samrt > p {
  margin: 0;
  color: #666;
  word-wrap: break-word;
  word-break: break-all;
}

.material_item_hover:hover > .material_filter {
  display: flex;
}
.material_filter {
  position: absolute;
  left: 0%;
  top: 0px;
  bottom: 0px;
  right: 0;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.wx-manage-xuanzhong {
  color: #fff;
  font-size: 50px;
}
.material_filter_active {
  display: flex;
}
.material_filter_none {
  display: none;
}
.material_filter_mask {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s linear;
}
</style>

