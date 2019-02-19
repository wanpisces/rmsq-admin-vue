<template>
  <div class="info-container">

    <div v-if="!releaseDialog">
      <el-card class="box-card">
        <!-- 查询 -->
        <div class="search-box">
          <div class="search">
            <span>输入搜索：</span>
            <el-input style="width:200px" v-model="search.qt" placeholder="资讯名称"></el-input>
          </div>
          <!-- <div class="search">
                  <span>投放区域：</span>
                  <el-select v-model="search.run_in" placeholder="请选择资讯模块">
                        <el-option
                        v-for="item in runInData"
                        :key="item.run_in"
                        :label="item.run_name"
                        :value="item.run_in">
                        </el-option>
                  </el-select>
              </div> -->

          <!-- <div class="search"> -->
          <!-- <span>资讯 ：</span> -->
          <!-- <el-input style="width:200px" v-model="search.qa"  placeholder="资讯来源"></el-input> -->
          <!-- <el-select v-model="qa" placeholder="请选择资讯来源">
                        <el-option
                        v-for="item in AuthorOptions"
                        :key="item.qa"
                        :label="item.label"
                        :value="item.qa">
                        </el-option>
                  </el-select> -->
          <!-- </div> -->
          <!-- <div class="search">
            <span>资讯模块：</span>
            <el-select v-model="search.category_id" placeholder="请选择资讯模块">
              <el-option v-for="item in modulesOptions" :key="item.category_id" :label="item.category_name" :value="item.category_id">
              </el-option>
            </el-select>
          </div> -->
          <div class="search">
            <span>展示位置：</span>
            <el-select v-model="search.run_in" placeholder="请选择展示位置">
              <el-option key="0" label="全部" value=""> </el-option>
              <el-option key="1" label="栏目资讯" :value="1"> </el-option>
              <el-option key="5" label="服务资讯" :value="5"></el-option>
              <el-option key="2" label="轮播" :value="2"></el-option>
              <el-option key="3" label="官方快报" :value="3" v-if="adminType==0"></el-option>
              <el-option key="4" label="推荐" :value="4"></el-option>
              <el-option key="6" label="最热" :value="6" v-if="adminType==0"></el-option>
              <el-option key="7" label="新时代" :value="7" v-if="adminType==0"></el-option>
              <el-option key="8" label="全视界" :value="8" v-if="adminType==0"></el-option>
              <el-option key="9" label="洞鉴" :value="9" v-if="adminType==0"></el-option>
            </el-select>
          </div>
          <div class="search">
            <span>文章类型：</span>
            <el-select v-model="search.news_type" placeholder="请选择文章类型">
              <el-option key="" label="全部" value=""> </el-option>
              <el-option key="1" label="图文资讯" :value="1"> </el-option>
              <el-option key="2" label="图片资讯" :value="2"> </el-option>
              <el-option key="3" label="视频资讯" :value="3"> </el-option>
            </el-select>
          </div>
          <div class="search ">
            <el-button type="primary" icon="el-icon-search" @click="selectionCotent()">搜索</el-button>
          </div>
        </div>
      </el-card>
      <!-- tabelList -->
      <el-card class="box-card">
        <div class="table-list">

          <div class="table-title">
            <div>
              <!-- <el-button type="danger" plain  :disabled="selectionValues.length===0" @click="tabelDelete()">删除</el-button> -->
              <!-- <switch-table @switchFn="switchFn" :switchData="switchData"></switch-table> -->
              <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
            </div>
            <div>
              <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->
              <choose-tab @handleShowDliog="handleShowDliog" @TimeOn="timeOn">
              </choose-tab>
            </div>

          </div>
          <el-table :data="tableData" border style="width: 100%" ref="table" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading" @row-click="handleCurrentChange" @selection-change="selectionChange">
            <!-- <el-table-column
                type="selection"
                width="55" >
                </el-table-column> -->
            <el-table-column prop="news_title" label="资讯名称" align="center">
              <template slot-scope="scope">
                <span v-if="search.audit_status==2|| search.audit_status==3" style="color:#409eff">
                  <router-link class="news-link" :to="{ name: 'inforExamineDetail', query: { news_id: scope.row.news_id }}">{{scope.row.news_title}}</router-link>
                </span>
                <span v-else>{{scope.row.news_title}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
                prop="news_source"
                label="资讯来源"
                width="180" >
                </el-table-column> -->
            <el-table-column label="展示位置" align="center">
              <template slot-scope="scope">
                <span>{{{1:'栏目资讯',2:'轮播',3:'官方快报',4:'推荐',5:'服务资讯',6:'最热',7:'新时代',8:"全视界",9:'洞鉴'}[scope.row.run_in]}}</span>
              </template>
            </el-table-column>

            <el-table-column label="栏目资讯" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.run_in==1?scope.row.category_name:''}}</span>
              </template>
            </el-table-column>
            <el-table-column label="服务资讯" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.run_in==5?scope.row.category_name:''}}</span>
              </template>
            </el-table-column>
            <el-table-column label="服务资讯分类" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.attr_name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="文章类型" align="center">
              <template slot-scope="scope">
                <span>{{{1:'图文资讯',2:"图片资讯",3:'视频资讯'}[scope.row.news_type]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="资讯封面图" align="center">
              <template slot-scope="scope">
                <img v-if="scope.row.news_pic && scope.row.news_pic_type!=0" :src="scope.row.news_pic" class="img-resopnse" alt="">
                <span v-else>无图</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
                label="投放区域" >
                  <template slot-scope="scope">
                       <span >{{scope.row.run_in==2?'轮播':scope.row.run_in==3?'官方快报':'推荐'}}</span>
                  </template>
                </el-table-column> -->
            <el-table-column label="发布人" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.editor_name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="提交时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.update_time}}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100" align="center" v-if="search.audit_status!=3">
              <template slot-scope="scope">
                <!-- <el-button type="text" size="small" @click="handlePass(scope.row.news_id,1)"> 通过 </el-button>
                        <el-button type="text" size="small" @click="handlePass(scope.row.news_id,2)"> 驳回 </el-button> -->
                <el-button type="text" size="small" v-if="active==2" @click="handExamine(scope.row)"> 审核 </el-button>
                <el-button type="text" size="small" v-if="scope.row.audit_status==4" @click="refuseCase(scope.row.audit_remark)">
                  <span>查看原因</span>
                </el-button>
                <!-- <div class="el-icon-wrapper">
                  <i v-if="scope.row.audit_status==4" class="el-icon-view" title="查看原因" @click="refuseCase(scope.row.audit_remark)"></i>
                  <i class="icon-shenhe" v-if="active==2 && perm.newsCheck==1" title='审核' @click="handExamine(scope.row)"></i>
                </div> -->
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div style="margin-left: 20px;">
              <!-- <mo-paging :page-index="current_page" :total="count" :page-size="page_size" @change="pageChange">
              </mo-paging> -->
              <el-pagination background @current-change="pageChange" :current-page.sync="current_page" :page-size="page_size" layout="total,prev, pager, next, jumper" :total="count">
              </el-pagination>
              <!-- <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="count"  @current-change="pageChange"
                    :current-page="current_page"
                    :page-size="5">
                </el-pagination> -->
            </div>

          </div>
        </div>
      </el-card>
    </div>

    <!-- 审核 -->
    <div v-else>
      <el-card>
        <!-- <el-button icon="el-icon-arrow-left" @click="releaseDialog=false" style="margin-left:10%;margin-bottom:30px"> 返回审核列表 </el-button> -->
        <div v-if="tmpExamineData" style="width:750px;margin:0 auto">
          <h3> 是否关联公众号：{{{1:'是',2:'否'}[tmpExamineData.to_mp]}}</h3>
          <h3>资讯名称：{{tmpExamineData.news_title}}</h3>
          <h3>资讯来源：{{tmpExamineData.news_source || '本地'}}</h3>
          <h3 v-if="tmpExamineData.to_mp==1">原文链接：{{tmpExamineData.news_link}}</h3>
          <h3>资讯类型：{{{1:'图文',2:'图片',3:'视频'}[tmpExamineData.news_type]}}</h3>
          <h3 v-if="tmpExamineData.news_type==3 || tmpExamineData.news_type==2">资讯描述： {{tmpExamineData.news_intro}}</h3>
          <h3>资讯内容：</h3>

          <div v-if="tmpExamineData.news_type==1" style="width:750px" v-html="tmpExamineData.news_content" id="news-content" class="news-content"></div>
          <div v-if="tmpExamineData.news_type==2">
            <img :src="baseUrl+item.url" v-for="(item,index) in tmpExamineData.news_content" :key="index" width="240px" height="120px" alt="">
          </div>
          <div v-if="tmpExamineData.news_type==3">
            <video :src="baseUrl+tmpExamineData.news_content[0].url" width="400" controls></video>
          </div>
          <h3>
            <span>投放区域: </span>
            <span>{{{5:'服务资讯',2:'轮播',3:'官方快报',4:'推荐',1:'栏目资讯',6:'最热',7:'新时代',8:"全视界",9:'洞鉴'}[tmpExamineData.run_in]}}</span>
          </h3>
          <h3>
            <span>展现形式: </span>
            <span>{{tmpExamineData.news_pic_type=='0'?'无图':tmpExamineData.news_pic_type=='1' ?'小图':tmpExamineData.news_pic_type=='2'?'大图':'视频'}}</span>
          </h3>
          <div v-if="tmpExamineData.run_in==2">
            <h3>轮播标题：{{tmpExamineData.banner_title}}</h3>
            <h4 v-if="tmpExamineData.banner_pic">banner图:</h4>
            <img :src="tmpExamineData.banner_pic" v-if="tmpExamineData.banner_pic" width="240px" alt="">
          </div>
          <h3> 展示方式：{{{1:'原生',2:'H5'}[tmpExamineData.show_at]}}</h3>
          <!-- <h3> 是否显示封面：{{{1:'是',2:'否'}[tmpExamineData.show_pic]}}</h3> -->
          <!-- <h3> 是否关联活动：{{{1:'是',2:'否'}[tmpExamineData.link_miniprogram]}}</h3> -->
          <h3> 是否关联活动：{{{1:'是',2:'否'}[tmpExamineData.link_miniprogram]}}</h3>
          <div v-if="tmpExamineData.run_in==4 && tmpExamineData.is_top==2">
            <!--  0当前级 1全国 2全省 3全市 4全区 5全街道 -->
            <h3>置顶类型:{{{0:'当前级', 1:'全国', 2:'全省', 3:'全市', 4:'全区', 5:'全街道'}[tmpExamineData.to_top_type]}}</h3>
            <h3 v-if="tmpExamineData.to_top_type>=3">到期时间：{{{2:'全省', 3:'全市', 4:'全区/县', 5:'全街道'}[tmpExamineData.to_top_type]}}{{newsTop[{2:'province', 3:'city', 4:'area', 5:'street'}[tmpExamineData.to_top_type]].expiredate}}</h3>
          </div>
          <h3> 小程序发布时间：{{tmpExamineData.put_time}}</h3>
          <h3 v-if="tmpExamineData.to_mp==1">公众号发布时间：{{tmpExamineData.put_mp_time}}</h3>
          <h3 v-if="tmpExamineData.to_weibo==1">微博发布时间：{{tmpExamineData.put_weibo_time}}</h3>
          <h3 v-if="tmpExamineData.to_toutiao==1">头条发布时间：{{tmpExamineData.put_toutiao_time}}</h3>
          <h3 v-if="tmpExamineData.to_kuaichuan==1">快传发布时间：{{tmpExamineData.put_kuaichuan_time}}</h3>
          <h3 v-if="tmpExamineData.to_baijia==1">百家号发布时间：{{tmpExamineData.put_baijia_time}}</h3>
          <div class="examine-btn">
            <el-button type="primary" @click="handlePass(tmpExamineData.news_id,1)"> 通过 </el-button>
            <el-button type="danger" @click="handlePass(tmpExamineData.news_id,2)"> 驳回 </el-button>
            <el-button icon="el-icon-arrow-left" @click="releaseDialog=false"> 返回审核列表 </el-button>
          </div>

        </div>
      </el-card>
    </div>
    <!-- <div >
         <el-card>
             <el-button  icon="el-icon-arrow-left"  @click="releaseDialog=false" style="margin-left:10%;margin-bottom:30px"> 返回审核列表 </el-button>
             <div v-if="tmpExamineData">
              <h3 style="text-align:center">{{tmpExamineData.news_title}}</h3>
              <h4 style="text-align:center">资讯来源：{{tmpExamineData.news_source}}</h4>
              <div v-html="tmpExamineData.news_content" class="news-content"></div>
              <h3 style="margin-left:10%;margin-bottom:30px;margin-top:30px">
                  <span>投放区域: </span><span>{{tmpExamineData.run_in==1?'模块区':tmpExamineData.run_in==2?'轮播':tmpExamineData.run_in==3?'官方快报':'推荐'}}</span>
              </h3>
              <h3 style="margin-left:10%;margin-bottom:30px;margin-top:30px">
                  <span>展现形式: </span><span>{{tmpExamineData.news_pic_type==0?'无图':tmpExamineData.run_in==1?'小图':tmpExamineData.run_in==2?'大图':'视频'}}</span>
              </h3>
              <div class="examine-btn">
                   <el-button type="primary"   @click="handlePass(tmpExamineData.news_id,1)"> 通过 </el-button>
                   <el-button type="danger"   @click="handlePass(tmpExamineData.news_id,2)"> 驳回 </el-button>
                   <el-button  icon="el-icon-arrow-left"  @click="releaseDialog=false"> 返回审核列表 </el-button>
              </div>

             </div>
         </el-card>
    </div> -->

    <el-dialog title="拒绝原因" :visible.sync="refuseDialogVisible" width="30%">
      <p style="width:100%;word-break:break-all">{{refuseContent}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="refuseDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MoPaging from "../../components/Paginations.vue";
import Tinymce from "../../components/Tinymce/index.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
// import SwitchTable from "../../components/Switchtable/index.vue"
// 数据service接口
import { RequestUploads } from "../../fetch/modules/public.js";
import { RequestQiNiutoken } from "../../fetch/tool";
import { RequestModuleList, RequestNewAuditList, RequestNewAudit, RequestMpNewsDetail } from "../../fetch/modules/info.js";
import { getAdminType } from "@/utils/auth";
import { checkURL } from "@/fetch/tool";
// 正则匹配
const rules = {
  news_title: [{ required: true, message: "请输入资讯标题", trigger: "blur" }, { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }]
};
export default {
  components: { MoPaging, Tinymce, ChooseTab },
  beforeRouteEnter(to, from, next) {
    console.log(to);
    next(vm => {
      to.meta.perm.forEach((item, index) => {
        if (vm.perm[item.perm_name]) {
          vm.perm[item.perm_name] = item.is_select; // 2-不显示 1-显示
        }
      });
    });
  },
  data() {
    return {
      perm: {
        newsCheck: 2
      },
      rules,
      search: {
        // 搜索条件
        qt: "", // 搜索资讯标题的关键字
        qa: "", // 搜索资讯发布者的关键字
        category_id: "", // 搜索资讯模块id
        order_time: 2, // 时间排序
        // status:1, // 上下线，
        audit_status: 2,
        run_in: "",
        audit_status: "",
        news_type: ""
      },
      adminType: getAdminType() || "",
      runInData: [
        {
          run_in: "",
          run_name: "全部"
        },
        {
          run_in: "2",
          run_name: "轮播"
        },
        {
          run_in: "3",
          run_name: "官方快报"
        },
        {
          run_in: "4",
          run_name: "推荐"
        }
      ],
      modulesOptions: [{ category_id: "", category_name: "全部" }],
      tableData: [],
      current_page: 1,
      count: 0,
      page_size: 5,
      releaseDialog: false,
      tmpExamineData: "",
      formLabelWidth: "120px",
      selectionValues: [],
      switchData: [{ name: "待审核", active: "2" }, { name: "已审核", active: "3" }, { name: "已驳回", active: "4" }], // 上线下线,
      active: 2,
      loading: false,
      refuseDialogVisible: false,
      refuseContent: "", //拒绝原因
      baseUrl: "https://img.sqydt.darongshutech.com/",
      newsTop: {}
    };
  },
  created() {
    this.moduleList();
  },
  mounted() {
    this.newList();
    if (localStorage.loginPermissionData) {
      this.newsTop = JSON.parse(localStorage.loginPermissionData).customer_conf.cross_recom_news_top_conf;
    }
  },
  updated() {
    // if (this.releaseDialog == true && document.getElementById("news-content")) {
    //   var tagP = document.getElementById("news-content").getElementsByTagName("p");
    //   var tagImg = document.getElementById("news-content").getElementsByTagName("img");
    //   for (var i = 0; i < tagP.length; i++) {
    //     tagP[i].style.textIndent = "20px";
    //   }
    //   for (var j = 0; j < tagImg.length; j++) {
    //     tagImg[j].style.display = "block";
    //     tagImg[j].style.textAlign = "center";
    //     tagImg[j].style.margin = "auto";
    //     // tagImg[j].style.width = "100%";
    //   }
    // }
  },

  methods: {
    // 审核列表
    newList(_obj) {
      this.loading = true;
      let _data = Object.assign(JSON.parse(JSON.stringify(this.search)), _obj);
      for (const key in _data) {
        // 去除对象内多余的空值key
        if (_data[key] === "") {
          delete _data[key];
        }
      }
      let page = { page_size: this.page_size, current_page: 1 };
      let args = Object.assign(page, _data) || {};
      let self = this;
      RequestNewAuditList(args).then(res => {
        if (res) {
          self.tableData = res.list;
          self.count = res.total_num;
          this.loading = false;
        }
      });
    },
    // 模块列表
    moduleList() {
      RequestModuleList({}).then(res => {
        this.modulesOptions = this.modulesOptions.concat(res.list);
      });
    },
    // 查询
    selectionCotent() {
      this.current_page = 1;
      let args = {
        qt: this.search.qt,
        qa: this.search.qa,
        category_id: this.search.category_id
      };
      this.newList(args);
    },
    // 时间切换
    timeOn(value) {
      this.search.order_time = value;
      let args = { order_time: value };
      this.newList(args);
    },
    // 分页选择
    pageChange(current) {
      this.current_page = current;
      this.newList({ current_page: current });
    },
    // 批量选中
    selectionChange(selectionValues) {
      this.selectionValues = selectionValues;
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },

    handleShowDliog() {
      this.listShowDialog = true;
    },
    // 拒绝原因
    refuseCase(mark) {
      this.refuseContent = "";
      this.refuseContent = mark;
      this.refuseDialogVisible = true;
    },
    // 上下线切换
    switchFn(active) {
      this.current_page = 1;
      this.active = active;
      this.search.audit_status = active;
      this.newList({ audit_status: JSON.parse(active) });
    },
    // 审核
    handExamine(row) {
      RequestMpNewsDetail({ news_id: row.news_id }).then(res => {
        res.banner_pic = res.IMAGE_HOST + res.banner_pic;
        this.tmpExamineData = res;
        this.releaseDialog = true;
      });
    },
    // 通过审核
    handlePass(newsId, passId) {
      let self = this;
      if (passId == 2) {
        this.$prompt("驳回原因（不超过300个字符）", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^[\s\S]{1,300}$/,
          inputErrorMessage: "输入长度不超过300个字符"
        })
          .then(({ value }) => {
            RequestNewAudit({
              news_id: newsId,
              is_pass: passId,
              audit_remark: value
            }).then(res => {
              self.current_page = 1;
              self.newList({});
              self.releaseDialog = false;
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "驳回失败"
            });
          });
      } else {
        RequestNewAudit({ news_id: newsId, is_pass: passId }).then(res => {
          this.current_page = 1;
          self.newList({});
          self.releaseDialog = false;
        });
      }
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  margin: 30px 15px;
  font-size: 14px;
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
    // border: 1px #dcdfe6 solid;
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
  margin: 30px 15px;
  font-size: 14px;
  .info-footer {
    margin-left: 120px;
    padding: 50px 0;
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
  .info-title {
    padding: 10px;
    margin-bottom: 30px;
    font-size: 16px;
    color: #1890ff;
    border-bottom: 5px solid rgb(247, 246, 252);
  }
  .avatar-uploader,
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 178px;
    width: 178px;
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
  .news-content {
    // border: 1px #d9d9d9 solid;
    margin: 0 auto;
    // width: 80%;
    padding: 15px;
    border-radius: 5px;
    overflow: hidden;
  }
  .news-title {
    text-align: center;
  }
  .examine-btn {
    margin: 30px auto;
    text-align: center;
  }

  .img-resopnse {
    width: 100%;
    height: 100px;
  }
  @media (min-width: 1562px) and (max-width: 1920px) {
    .img-resopnse {
      width: 80%;
    }
  }

  @media (min-width: 1920px) {
    .img-resopnse {
      width: 50%;
      text-align: center;
    }
  }
}
</style>

