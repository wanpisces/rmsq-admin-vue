<template>
  <div class="info-container">
    <div v-if="!releaseDialog">
      <el-card class="box-card">
        <!-- 查询 -->
        <div class="search-box">
          <div class="search">
            <span>爆料内容：</span>
            <el-input style="width:200px" v-model="search.q" placeholder="请输入爆料内容"></el-input>
          </div>
          <div class="search" v-if="needAudit==1">
            <span>主题分类：</span>
            <el-select v-model="search.attr_id" placeholder="请选择">
              <el-option v-for="item in searchAtrr" :key="item.attr_id" :label="item.attr_value" :value="item.attr_id">
              </el-option>
            </el-select>
          </div>
          <div class="search ">
            <el-button type="primary" icon="el-icon-search" @click="selectionCotent()">搜索</el-button>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="table-list">
          <div class="table-title">
            <div>
              <div v-if="needAudit==1">
                <el-button type="danger" plain :disabled="selectionValues.length===0" @click="tabelDelete()">删除</el-button>
                <!-- <switch-table @switchFn="switchFn" :switchData="switchData"></switch-table> -->
                <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
              </div>
              <div v-if="needAudit==2">
                <el-button type="danger" plain :disabled="selectionValues.length===0" @click="tabelDelete()">删除</el-button>
                <el-button type="primary" plain @click="handleIntroShow">添加活动介绍</el-button>
                <el-button type="success" plain @click="getMpactivity();">关联活动</el-button>
              </div>
            </div>

            <div class="table-title-right">
              <el-button type="primary" plain @click="shareSet" style="margin-right:10px;">分享设置</el-button>
              <div style="padding-right:15px;">
                是否在用户端显示
                <el-switch @change="changeShowInUser" v-model="isShowUser">
                </el-switch>
              </div>

              <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->
              <choose-tab @handleShowDliog="handleShowDliog" @TimeOn="timeOn">
              </choose-tab>
            </div>
          </div>
          <el-table :data="tableData" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading" ref="table" @row-click="handleCurrentChange" @selection-change="selectionChange">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column prop="news_title" label="提交用户" align="center">
              <template slot-scope="scope">
                {{scope.row.user_nickname}}
              </template>
            </el-table-column>
            <el-table-column label="主题分类" align="center" v-if="needAudit==1">
              <template slot-scope="scope">

                <span>{{scope.row.attr_value}}</span>
              </template>
            </el-table-column>
            <el-table-column label="爆料内容" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.case_content}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发生地点" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.case_addr}}</span>
              </template>
            </el-table-column>
            <el-table-column label="办理时间" align="center" v-if="active==2">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
            <el-table-column label="跟踪人" align="center" v-if="active==2">
              <template slot-scope="scope">
                <span>{{scope.row.case_tracer}}</span>
              </template>
            </el-table-column>
            <el-table-column label="提交时间" align="center" v-if="active==1">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150" align="center">
              <template slot-scope="scope">
                <div class="el-icon-wrapper">
                  <span v-if="needAudit==1">
                    <router-link v-if="scope.row.case_state ==3" :to="{name:'revolveDetail'+urlLastId,query:{case_id:JSON.stringify(scope.row.case_id),lng:scope.row.lng,lat:scope.row.lat}}">
                      <el-button type="text" size="small">查看</el-button>
                      <!-- <i class="el-icon-view" title="查看"></i> -->
                    </router-link>
                    <router-link v-if="scope.row.case_state == 1" :to="{name:'revolveThing'+urlLastId,query:{case_id:JSON.stringify(scope.row.case_id),lng:scope.row.lng,lat:scope.row.lat}}">
                      <el-button type="text" size="small">办理</el-button>
                      <!-- <i class="icon-banli" title="办理"></i> -->
                    </router-link>
                    <!-- <i class="icon-jiean" v-if="scope.row.case_state ==2" @click="handleCase(scope.row.case_id,scope.row.node_num)" title="结案"></i> -->
                    <el-button type="text" size="small" v-if="scope.row.case_state ==2" @click="handleCase(scope.row.case_id,scope.row.node_num)">结案</el-button>
                    <router-link v-if="scope.row.case_state ==2" :to="{name:'nodeList'+urlLastId,query:{case_id:JSON.stringify(scope.row.case_id)}}">
                      <el-button type="text" size="small">节点</el-button>
                      <!-- <i class="icon-jiedian" title="节点"></i> -->
                    </router-link>
                    <router-link :to="{name:'brokeList'+urlLastId,query:{case_id:JSON.stringify(scope.row.case_id)}}">
                      <el-button type="text" size="small">查看评论</el-button>
                      <!-- <i class="icon-jiedian" title="节点"></i> -->
                    </router-link>
                  </span>
                  <span v-else>
                    <router-link :to="{name:'revolveDetail'+urlLastId,query:{case_id:JSON.stringify(scope.row.case_id),lng:scope.row.lng,lat:scope.row.lat}}">
                      <el-button type="text" size="small">查看</el-button>
                      <!-- <i class="el-icon-view" title="查看"></i> -->
                    </router-link>
                    <router-link :to="{name:'brokeList'+urlLastId,query:{case_id:JSON.stringify(scope.row.case_id)}}">
                      <el-button type="text" size="small">查看评论</el-button>
                      <!-- <i class="icon-jiedian" title="节点"></i> -->
                    </router-link>
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div style="margin-left: 20px;">
              <!-- <mo-paging :page-index="current_page" :total="count" :page-size="page_size" @change="pageChange">
              </mo-paging> -->
              <el-pagination background @current-change="pageChange" :current-page.sync="current_page" :page-size="page_size" layout="total,prev, pager, next, jumper" :total="count">
              </el-pagination>
            </div>
          </div>

          <p style="color:#F9A7A7;">
            {{needAudit==1?'提示：处理的随手拍指需要工作人员在后台办理完成后才能在用户端展示的随手拍':"提示：无需处理的随手拍是指用户拍照发布后可直接在用户端展示的随手拍，工作人员可以根据用户所发布的内容是否符合活动主题来对用户所发布的随手拍进行删除"}}
          </p>
        </div>
      </el-card>
      <!-- 活动添加弹框 -->
      <el-dialog title="活动添加/编辑" :visible.sync="dialogVisibleActive" width="50%" :before-close="handleActiveClose">
        <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm">
          <!-- <el-form-item label="活动标题:" prop="ssp_title" :rules="[{ required: true, message: '请输入活动标题', trigger: 'blur' },]">
            <el-input v-model="form.ssp_title" maxlength="30" placeholder="请输入活动标题，最多可输入30字" style="position:relative"></el-input>
            <div align="right" class="number">{{form.ssp_title.length}}/30</div>
          </el-form-item> -->
          <el-form-item label="活动主办方:" prop="ssp_sponsor" :rules="[{ required: true, message: '请输入活动主办方', trigger: 'blur' },]">
            <el-input v-model="form.ssp_sponsor" maxlength="30" placeholder="请输入活动主办方，最多可输入30字" style="position:relative"></el-input>
            <div align="right" class="number">{{form.ssp_sponsor.length}}/30</div>
          </el-form-item>
          <el-form-item label="活动介绍:" prop="ssp_desc" :rules="[{ required: true, message: '请输入活动介绍', trigger: 'blur' },]">
            <el-input type="textarea" rows="6" maxlength="300" placeholder="请输入活动介绍，最多可输入300字" v-model="form.ssp_desc" style="position:relative"></el-input>
            <div align="right" class="number-textarea">{{form.ssp_desc.length}}/300</div>
          </el-form-item>
          <el-form-item label="活动时效:" prop="ssp_expiredate" :rules="[{ required: true, message: '请输入活动时效', trigger: 'blur' }]">
            <el-input v-model="form.ssp_expiredate" placeholder="请输入活动时效"></el-input>
            <span style="font-size:12px;color:#999">温馨提示:" 您可输入：长期有效或特定时间内有效，特定时间格式为年-月-日至年-月-日，例如2018-06-06至2019-06-06。"</span>
          </el-form-item>
          <el-form-item label="活动奖励:" prop="ssp_award">
            <el-input type="textarea" rows="10" v-model="form.ssp_award" maxlength="800" placeholder="请输入活动奖励，最多可输入800字" style="position:relative"></el-input>
            <div align="right" class="number-textarea">{{form.ssp_award.length}}/800</div>
          </el-form-item>
          <el-form-item label="展示样式:" prop="desc">
            <img src="https://img.sqydt.darongshutech.com/FoiAZQxVIXnw3vMQ8-X1n2cPbXPV" width="50%" alt="">
          </el-form-item>
          <el-form-item>
            <div align="right">
              <el-button type="primary" @click="submitForm('form')" :disabled="btnMark">确定</el-button>
              <el-button @click="resetForm('form')">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="关联活动" :visible.sync="dialogRelateActive" width="50%">
        <div style="margin-bottom:10px">
          <el-input v-model="activeSearch.q" placeholder="请输入活动名称" style="width:200px"></el-input>
          <el-select v-model="activeSearch.type" placeholder="请选择">
            <el-option key="0" label="全部" :value="0"></el-option>
            <el-option key="1" label="社区活动" :value="1"></el-option>
            <el-option key="3" label="随手拍（不审核）" :value="3"></el-option>
            <el-option key="4" label="投票" :value="4"></el-option>
            <el-option key="5" label="评选" :value="5"></el-option>
            <el-option key="6" label="问卷调查" :value="6"></el-option>
          </el-select>
          <el-button @click="handleSearch(2)" type="primary"> 搜索</el-button>
        </div>
        <el-table ref="multipleTable" height="400" :data="mpActiveData" tooltip-effect="dark" @selection-change="handleSelectionChangeMpActive">
          <el-table-column type="selection" :selected="true" width="55">
          </el-table-column>
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label="类型" width="120">
            <template slot-scope="scope">{{{1:'社区活动',2:'随手拍（审核）',3:"随手拍（不审核）",4:'投票',5:'评选',6:'问卷调查'}[scope.row.type] }}</template>
          </el-table-column>
          <el-table-column prop="service_title" label="活动名称" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div align="right" style="margin-top:20px;">
          <el-button type="primary" @click="addActivityList" :disabled="btnMark">确定</el-button>
          <el-button @click="cancelActivity">取消</el-button>
        </div>
      </el-dialog>
      <div v-if="dialogVisible">
        <el-dialog title="分享样式设置" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
          <el-form label-width="150px" :close-on-click-modal="false" :rules="rules">
            <share-template v-if="templateData.length>0" :share_desc="form1.share_desc" :share_pic="form1.share_pic" :markBtn='true' :curTitle="curTitle" :templateData="templateData" @submitForm="submitFormShare" @cancleForm="cancleForm"></share-template>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import MoPaging from "@/components/Paginations.vue";
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue";
import ShareTemplate from "@/components/ShareTemplate/index.vue";
const rules = {
  share_pic: [{ required: true, message: "请上传分享封面图", trigger: "blur" }]
};
// 数据service接口
// import { searchGov,searchGovChildren } from "../../fetch/tool";
import { RequestServiceCaseList, RequestServiceCaseAtrrList, RequestServiceCase, RequestRevolveDelete, RequestServiceCaseIntroducation, RequestServiceCaseIntroducationList, RequestServiceState, RequestServicePublicDetail } from "@/fetch/modules/service";
import { RequestMpActive, RequestMapActive, RequestActivityInformation } from "@/fetch/modules/public.js";
import { RequestShareActivityEdit, RequestShareTheme, RequestSspShare } from "@/fetch/modules/share.js";
export default {
  components: { MoPaging, ChooseTab, ShareTemplate },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.urlLastId = to.meta.id;
      vm.needAudit = to.meta.need_audit;
      vm.search.service_id = to.meta.service_id;
      vm.addForm.service_id = to.meta.service_id;
      vm.search.need_audit = to.meta.need_audit;
      vm.form.service_id = to.meta.service_id;
      vm.newList();
      vm.getClass();
      vm.getServiceDetail();
    });
  },
  data() {
    return {
      rules,
      curTitle: "",
      dialogVisible: false,
      isShowUser: true,
      dialogRelateActive: false,
      urlLastId: "",
      search: {
        // 搜索条件
        q: "", // 搜索关键字
        order_time: 2, // 时间排序
        case_state: 1, // 办理状态,
        attr_id: "",
        service_id: "",
        pid: "",
        need_audit: ""
      },
      needAudit: "",
      labelTitle: "上线时间",
      tableData: [],
      current_page: 1,
      count: 0,
      page_size: 5,
      // 发布编辑
      releaseDialog: false,
      formLabelWidth: "120px",
      editorData: [],
      selectionValues: [],
      switchData: [{ name: "待办理", active: "1" }, { name: "办理中", active: "2" }, { name: "已结案", active: "3" }], // 上线下线,
      active: 1,
      loading: false,
      searchAtrr: [
        {
          attr_id: "",
          attr_value: "全部"
        }
      ],
      /**
       * 活动添加
       */
      dialogVisibleActive: false,
      form: {
        service_id: "",
        ssp_title: "",
        ssp_sponsor: "",
        ssp_desc: "",
        ssp_expiredate: "",
        ssp_award: ""
      },
      form1: {
        id: "",
        theme_type: 2,
        share_pic: "",
        share_desc: ""
      },
      btnMark: false,
      mpActiveData: [],
      activeSearch: {
        q: "",
        type: 0
      },
      addForm: {
        service_id: "",
        activity_list: []
      },
      rowActivity: [],
      templateData: []
    };
  },
  created() {
    // this.getMpactivity();
    // this.getShareTheme();
  },
  methods: {
    getShareTheme() {
      RequestShareTheme({ theme_type: 2 }).then(res => {
        this.templateData = res;
        this.form1.share_pic = res[0].share_pic;
      });
    },
    cancleForm() {
      this.dialogVisible = false;
    },
    shareSet() {
      this.form1.share_desc = "";
      this.form1.share_pic = "";
      if (this.templateData.length > 0 && this.form1.share_pic) {
        this.dialogVisible = true;
      } else {
        RequestShareTheme({ theme_type: 2 }).then(obj => {
          this.templateData = obj;
          RequestServiceCaseIntroducationList({
            service_id: this.search.service_id
          }).then(res => {
            this.form1.share_desc = res.data.share_desc;
            this.form1.share_pic = res.data.share_pic || obj[0].share_pic;
            this.dialogVisible = true;
          });
        });
      }
    },
    submitFormShare(obj) {
      var args = {
        service_id: this.search.service_id,
        share_pic: obj.share_pic,
        share_desc: obj.share_desc
      };
      RequestSspShare(args).then(res => {
        if (res.code == 2000) {
          this.dialogVisible = false;
        }
      });
    },
    // 获取活动列表
    getMpactivity() {
      RequestMpActive({
        current_page: 1,
        page_size: 1000,
        q: this.activeSearch.q,
        type: this.activeSearch.type
      }).then(res => {
        if (res) {
          var service_id = this.search.service_id;
          this.mpActiveData = res.filter(item => {
            return item.service_id != service_id;
          });
          this.getActivityDetail();
        }
      });
    },
    cancelActivity() {
      this.dialogRelateActive = false;
      this.activeSearch = {
        q: "",
        type: 0
      };
      // this.getMpactivity();
    },

    showActivity() {
      this.dialogRelateActive = true;
      this.rowActivity.forEach(row => {
        setTimeout(() => {
          this.$refs.multipleTable.toggleRowSelection(row);
        }, 1);
      });
    },
    //获取活动详情
    getActivityDetail() {
      RequestActivityInformation({ service_id: this.addForm.service_id }).then(res => {
        this.dialogRelateActive = true;
        setTimeout(() => {
          this.$refs.multipleTable.clearSelection();
        }, 1);
        if (res.link_third_miniprogram) {
          res.link_third_miniprogram.forEach((item, index) => {
            this.mpActiveData.forEach((child, num) => {
              if (item.service_id == child.service_id && item.branch_id == child.branch_id) {
                setTimeout(() => {
                  this.$refs.multipleTable.toggleRowSelection(child);
                }, 1);
              }
            });
          });
        }
      });
    },
    addActivityList() {
      var args = this.addForm;
      RequestMapActive(args).then(res => {
        if (res.code == 2000) {
          this.dialogRelateActive = false;
          this.activeSearch = {
            q: "",
            type: 0
          };
          // this.getMpactivity();
        }
      });
    },
    //选取数据
    handleSelectionChangeMpActive(val) {
      // console.log(val);
      if (val.length > 4) {
        this.$message.error("关联活动个数不得超过4个");
        // val.length = 4;
        // console.log(val);
        // val.forEach(row => {
        //   this.$refs.multipleTable.toggleRowSelection(row);
        // });
        // console.log(val, "aaaa");
      }
      this.addForm.activity_list = val;
    },
    // 搜索
    handleSearch() {
      this.getMpactivity();
    },
    getServiceDetail() {
      let service_id = this.search.service_id;
      RequestServicePublicDetail({ service_id: service_id }).then(res => {
        this.curTitle = res.service_title;
        res.status == 1 ? (this.isShowUser = true) : (this.isShowUser = false);
      });
    },
    changeShowInUser(val) {
      if (val) {
        this.$confirm("开启后当前模块将在用户端显示?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            RequestServiceState({ service_id: this.search.service_id }).then(res => {
              if (res.code == 2000) {
                this.isShowUser = true;
              }
            });
          })
          .catch(() => {
            this.isShowUser = false;
          });
      } else {
        this.$confirm("关闭后当前模块不在用户端显示?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            RequestServiceState({ service_id: this.search.service_id }).then(res => {
              if (res.code == 2000) {
                this.isShowUser = false;
              }
            });
          })
          .catch(() => {
            this.isShowUser = true;
          });
      }
    },
    // 随手拍列表
    newList(_obj) {
      this.loading = true;
      let _data = Object.assign(JSON.parse(JSON.stringify(this.search)), _obj);
      for (const key in _data) {
        // 去除对象内多余的空值key
        if (_data[key] === "") {
          delete _data[key];
        }
      }
      let page = { page_size: this.page_size, current_page: this.current_page };
      let args = Object.assign(page, _data) || {};
      let self = this;
      RequestServiceCaseList(args).then(res => {
        if (res) {
          self.tableData = res.data.list;
          self.count = res.data.total_num;
          this.loading = false;
        }
      });
    },
    // 主题分类
    getClass() {
      RequestServiceCaseAtrrList({
        group_id: "482657160786870272",
        service_id: "482657160786870272"
      }).then(res => {
        for (let i in res.data) {
          this.searchAtrr.push(res.data[i]);
        }
      });
    },
    // 结案
    handleCase(case_id, node) {
      let self = this;
      let title = node != 0 ? "是否结案当前爆料？" : "当前爆料无节点记录,至少添加一个节点可结案是否跳转至添加节点页面？";
      this.$confirm(title, "结案", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          if (node != 0) {
            RequestServiceCase({ case_id }).then(res => {
              this.newList();
            });
          } else {
            self.$router.push({
              name: "nodeList" + this.urlLastId,
              query: { case_id: JSON.stringify(case_id) }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },

    // 查询
    selectionCotent() {
      this.current_page = 1;
      this.newList({});
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
      let args = { current_page: current };
      this.newList(args);
    },
    releaseClick() {
      this.$router.push({ name: "serviceGuidAdd", params: {} });
    },
    // 上下线

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
      var status = this.search.status;
      if (status == 1) {
        this.$alert("如需删除，请先取消发布!", "提示", {
          confirmButtonText: "取消",
          type: "error"
        });
        return;
      }
      for (let i in this.selectionValues) {
        selectionArr.push(this.selectionValues[i].case_id);
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestRevolveDelete({ case_id: selectionArr }).then(res => {
            if (res.code == 2000) {
              this.$Message({
                type: "success",
                text: "删除成功"
              });
              self.newList({ current_page: this.current_page });
            }
          });
        })
        .catch(() => {
          this.$Message({
            type: "info",
            text: "已取消删除"
          });
        });
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    // 上下线切换
    switchFn(active) {
      if (active == 1) {
        this.labelTitle = "上线时间";
      } else if (active == 2) {
        this.labelTitle = "下线时间";
      }
      this.current_page = 1;
      this.search.case_state = active;
      this.active = active;
      this.newList();
    },
    // 活动介绍
    handleIntroShow() {
      RequestServiceCaseIntroducationList({
        service_id: this.search.service_id
      }).then(res => {
        for (let i in res.data) {
          if (res.data[i] == null) {
            res.data[i] = "";
          }
        }
        this.form = Object.assign(this.form, res.data);
        this.dialogVisibleActive = true;
      });
    },
    handleActiveClose() {
      this.updatedActice();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnMark = true;
          RequestServiceCaseIntroducation(this.form).then(res => {
            this.btnMark = false;
            if (res.code == 2000) {
              this.$message.success("添加成功");
              this.updatedActice();
            } else {
              this.$message.success(res.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.updatedActice();
    },
    updatedActice() {
      this.$refs["form"].resetFields();
      this.dialogVisibleActive = false;
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .is-scroll-left a {
    color: #409eff;
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
  .table-title-right {
    display: flex;
    justify-content: space-around;
    align-items: center;
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
  .number {
    width: 30px;
    color: #999;
    text-align: right;
    padding-right: 10px;
    position: absolute;
    top: -0px;
    right: 10px;
  }
  .number-textarea {
    color: #999;
    text-align: right;
    padding-right: 10px;
    position: absolute;
    bottom: -5px;
    right: 5px;
  }
}
</style>

