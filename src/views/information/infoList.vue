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
          <div class="search" v-if="active==2">
            <span>状态：</span>
            <el-select v-model="search.audit_status" placeholder="请选择状态">
              <el-option key="" label="全部" value=""> </el-option>
              <el-option key="1" label="待提审" :value="1"> </el-option>
              <el-option key="2" label="审核中" :value="2"> </el-option>
              <el-option key="3" label="已下线" :value="3"> </el-option>
              <el-option key="4" label="被驳回" :value="4"> </el-option>
            </el-select>
          </div>
          <div class="search">
            <span>时间：</span>
            <el-date-picker unlink-panels v-model="search.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
            </el-date-picker>
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
              <el-button type="danger" v-if="perm.newsDele ==1" plain :disabled="selectionValues.length===0" @click="tabelDelete()">删除</el-button>
              <!-- <switch-table @switchFn="switchFn" :switchData="switchData"></switch-table> -->
              <!-- <el-button v-for="(item, index) in switchData" :key="index"   :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button> -->
              <el-button :type="active == 1?'primary':''" @click="switchFn(1)">已上线</el-button>
              <el-button :type="active == 2?'primary':''" @click="switchFn(2)">已下线</el-button>
              <el-button v-if="adminType==0" :type="active == 3?'primary':''" @click="switchFn(3)">网络来源</el-button>
            </div>
            <div>
              <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->

              <choose-tab @handleShowDliog="handleShowDliog" @TimeOn="timeOn" add-title="新增资讯" @handleAdd="releaseClick" v-if="perm.newsAdd==1">
              </choose-tab>
            </div>
          </div>
          <el-table :data="tableData" :border="border" style="width: 100%" element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading" ref="table" @row-click="handleCurrentChange" @selection-change="selectionChange">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column prop="news_title" label="资讯名称" align="center" width="150">
              <template slot-scope="scope">
                <router-link class="news-link line_ellipsis_2" :to="{ name: 'infoDetail', query: { news_id: scope.row.news_id,active:active,currentPage:current_page }}" style="color:#61c9f5">
                  {{scope.row.news_title}}
                </router-link>
              </template>
            </el-table-column>
            <!-- <el-table-column
                prop="news_source"
                label="资讯来源">
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
            <el-table-column label="资讯封面图" align="center" width="140">
              <template slot-scope="scope">

                <img v-if="scope.row.news_pic && scope.row.news_pic_type!=0" :src="scope.row.news_pic" class="img-resopnse" alt="">
                <span v-else>无图</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="editor_name" label="发布者" align="center">
            </el-table-column>
            <el-table-column label="真实浏览量" align="center" prop="visit_real_num">
            </el-table-column>
            <el-table-column label="浏览量" align="center" v-if="perm.newsView==1">
              <template slot-scope="scope">
                <div class="newsView">
                  <el-input style="max-width:100px;" v-model.number="scope.row.visit_num" :precision="0" @change="setViews(scope.row.news_id,$event)" controls-position="right" :min="0" :max="99999999" size="mini"></el-input>
                </div>

              </template>
            </el-table-column>
            <el-table-column label="状态" v-if="search.status!=1" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.audit_status==1?"待提审":scope.row.audit_status==2?"审核中":scope.row.audit_status==3?"已下线":"被驳回"}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center" v-if="perm.newsCancel==1||perm.newsTop==1||perm.newsOut==1||perm.newsEdit||1">
              <template slot-scope="scope">

                <!-- <div class="el-icon-wrapper" v-if="search.status==1">
                  <i :class="scope.row.status==1?'icon-quxiaofabu':'icon-fabu'" :title='scope.row.status==1?"取消发布":"发布"' v-if="(scope.row.status==1 && perm.newsCancel==1) || (scope.row.status!=1 && perm.newsOut==1)" @click="handleOnline(scope.row.news_id)"></i>
                  <i v-if="scope.row.run_in != 2 && ((scope.row.is_top==1 && perm.newsTop==1) || (scope.row.is_top!=1 && perm.newsTop==1))" :class="scope.row.is_top==1?'icon-quxiaozhiding':'icon-zhiding'" :title="scope.row.is_top==2?'取消置顶':'置顶'" @click="handleTop(scope.row.news_id)"></i>
                </div>
                <div class="el-icon-wrapper" v-if="search.status==2">
                  <router-link class="news-link" v-if="scope.row.audit_status==2||scope.row.audit_status==3" :to="{ name: 'infoDetail', query: { news_id: scope.row.news_id }}">
                    <i class="el-icon-view" title="查看资讯"></i>
                  </router-link>
                  <i class="icon-tijiaoshenhe" v-if="scope.row.audit_status==1 && perm.newsAudit==1" title='提交审核' @click="tableSubmitExamine(scope.row)"></i>
                  <i v-if="scope.row.audit_status==3 && perm.newsOut==1" class="icon-fabu" title="发布资讯" @click="handleOnline(scope.row.news_id)"></i>
                  <i v-if="scope.row.audit_status==4" class="el-icon-search" title="查看原因" @click="refuseCase(scope.row.audit_remark)"></i>
                  <router-link v-if="(scope.row.audit_status !=3 ||scope.row.status) &&  perm.newsEdit==1" :to="{name:'editImgArticle',query:{news_id:scope.row.news_id}}">
                    <i class="el-icon-edit" title="编辑资讯"></i>
                  </router-link>
                </div> -->

                <p v-if="search.status==1">
                  <el-button v-if="(scope.row.status==1 && perm.newsCancel==1) || (scope.row.status!=1 && perm.newsOut==1)" style="width:50px" type="text" size="small" @click.native="handleOnline(scope.row)">{{scope.row.status==1?"取消发布":"发布"}}</el-button>
                  <el-button v-if="scope.row.run_in != 2 && ((scope.row.is_top==1 && perm.newsTop==1) || (scope.row.is_top!=1 && perm.newsTop==1))" style="width:50px" type="text" size="small" @click.native="handleTop(scope.row.news_id)">{{scope.row.is_top==1?'置顶':'取消置顶'}}</el-button>
                </p>
                <p v-if="search.status==2||search.status==3">
                  <el-button type="text" size="small" @click.native="tableSubmitExamine(scope.row,1)" v-if="scope.row.audit_status==1 && perm.newsAudit==1"> 提交审核 </el-button>
                  <el-button type="text" size="small" v-if="scope.row.audit_status==3 && perm.newsOut==1" @click.native="handleOnline(scope.row)"> 发布资讯 </el-button>
                  <router-link class="news-link" :to="{ name: 'infoDetail', query: { news_id: scope.row.news_id }}" v-if="scope.row.audit_status==2||scope.row.audit_status==3">
                    <el-button type="text" size="small">
                      查看资讯
                    </el-button>
                  </router-link>
                  <el-button type="text" size="small" v-if="scope.row.audit_status==4" @click.native="refuseCase(scope.row.audit_remark)">
                    <span>查看原因</span>
                  </el-button>
                  <span v-if="(scope.row.audit_status !=3 ||scope.row.status) &&  perm.newsEdit==1">
                    <router-link :to="{name:'editImgArticle',query:{news_id:scope.row.news_id,active:active}}">
                      <el-button type="text" size="small">编辑资讯</el-button>
                    </router-link>
                  </span>
                </p>
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
        </div>
      </el-card>
      <el-dialog title="拒绝原因" :visible.sync="refuseDialogVisible" width="30%">
        <p style="word-wrap: break-word ">
          {{refuseContent}}
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="refuseDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import MoPaging from '@/components/Paginations.vue';
import Tinymce from '@/components/Tinymce/index.vue';
import ChooseTab from '@/components/ChooseTab/ChooseTab.vue';
// import SwitchTable from "../../components/SwitchTable/index.vue"
// 数据service接口
import {RequestUploads} from '@/fetch/modules/public.js';
import {RequestQiNiutoken} from '@/fetch/tool';
import {
  RequestClassfiyList,
  RequestNewsList,
  RequestNewsAdd,
  RequestNewsEditor,
  RequestNewsDelete,
  RequestModuleList,
  RequestNewsOnline,
  RequestNewsTop,
  RequestNewsDetail,
  RequestNewsViewEdit,
  RequestNewsAudit,
  RequestCodeView,
} from '@/fetch/modules/info.js';
import {RequestCategory} from '@/fetch/modules/service';
import {getToken} from '@/fetch/modules/public';
import {getAdminType} from '@/utils/auth';
// 正则匹配
const rules = {
  news_title: [
    {required: true, message: '请输入资讯标题', trigger: 'blur'},
    {min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur'},
  ],
  news_content: [{required: true, message: '不能为空', trigger: 'blur'}],
  category_id: [{required: true, message: '不能为空', trigger: 'blur'}],
  banner_title: [
    {required: true, message: '请输入轮播标题', trigger: 'blur'},
    {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'},
  ],
};

export default {
  components: {MoPaging, Tinymce, ChooseTab},
  beforeRouteEnter(to, from, next) {
    // console.log("ssssssss", to);
    next(vm => {
      // console.log("zhixing", to.meta);
      to.meta.perm.forEach((item, index) => {
        if (vm.perm[item.perm_name]) {
          vm.perm[item.perm_name] = item.is_select; // 2-不显示 1-显示
        }
      });
    });
  },
  data() {
    return {
      // 按钮权限字段管理 2 不显示 ，1显示
      perm: {
        newsAdd: 2, // 新增资讯
        newsEdit: 2, // 编辑资讯
        newsCancel: 2, // 取消资讯
        newsOut: 2, // 发布资讯
        newsAudit: 2, // 提交审核
        newsView: 2, // 浏览量
        newsTop: 2, // 置顶
        newsDele: 2,
      },
      rules,
      codeUrl: '',
      codeDialogVisible: false,
      search: {
        // 搜索条件
        qt: '', // 搜索资讯标题的关键字
        qa: '', // 搜索资讯发布者的关键字
        category_id: '', // 搜索资讯模块id
        order_time: 2, // 时间排序
        status: 1, // 上下线,
        run_in: '',
        news_type: '',
        audit_status: '',
        time: '',
      },
      labelTitle: '上线时间',
      runInData: [],
      modulesOptions: [{category_id: '', category_name: '全部'}],
      tableData: [],
      current_page: +this.$route.query.currentPage || 1,
      count: 0,
      page_size: 6,
      // 发布编辑
      releaseDialog: false,
      formLabelWidth: '120px',
      editorData: [],
      selectionValues: [],
      switchData: [
        {name: '已上线', active: '1'},
        {name: '已下线', active: '2'},
        {name: '网络来源', active: '3'},
      ], // 上线下线,
      active: 1,
      loading: false,

      // 编辑部门
      form: {
        news_title: '',
        news_content: '',
        news_thumb: '',
        news_pic_type: 0,
        news_pic: '',
        category_id: null,
        attr_id: null,
        tags: [],
        run_in: 1,
        news_intro: '',
        news_source: '',
        news_media: '',
        news_link: '',
        news_author: '',
        // attach: [{title:'文件名',url:'文件地址'},{title:'文件名',url:'文件地址'}],
        is_comment: '',
        is_lock: 1, // 1=未锁定 2=锁定
        is_top: 1, // 1=未置顶 2=置顶
        sort: 1,
        banner_title: '',
        banner_pic: '',
        bsort: '',
      },
      formLabelWidth: '120px',
      inputVisible: false,
      inputValue: '',
      checked: false,
      // 投放区域
      regionData: 0,
      // 投放模块
      moduleData: [],
      // 获取投放分类
      classificationData: [],
      imageUrl: '',
      fileList: [],
      lunboImageUrl: '',
      news_pic: '',
      news_media: '',
      adminType: getAdminType() || '',
      groupData: [
        {
          group_type: '',
          group_name: '全部',
        },
        {
          group_type: '1',
          group_name: '社区',
        },
        {
          group_type: '2',
          group_name: '街道',
        },
        {
          group_type: '3',
          group_name: '区',
        },
        {
          group_type: '4',
          group_name: '市',
        },
        {
          group_type: '5',
          group_name: '省',
        },
      ],
      categoryData: [{category_id: '', category_name: '全部'}],
      refuseDialogVisible: false,
      refuseContent: '', //拒绝原因,
      baseUrl: 'https://img.sqydt.darongshutech.com/',
      border: true,
      pickerOptions: {
        disabledDate(time) {
          //  console.log('ssss',time)
          return time.getTime() >= Date.now();
        },
      },
    };
  },
  created() {
    this.active = this.$route.query.active || 1;
    this.search.status = this.$route.query.active || 1;
    this.moduleList();
    this.getModule();

    // this.getClassification();
  },
  mounted() {
    // this.current_page = +this.$route.query.currentPage || 1;
    this.newList();
    // console.log("this.current_page", this.current_page);
    // var box__message = document.getElementsByClassName('el-message-box__message')[0];
    // box__message.style.color = '#ff0000';

    if (
      !/Chrome/g.test(navigator.userAgent) &&
      /Safari/g.test(navigator.userAgent)
    ) {
      this.border = false;
    }
  },
  watch: {
    'form.category_id'() {
      let args = {category_id: this.form.category_id, pid: 0};
      this.getClassification(args);
    },
  },
  methods: {
    changeChoose() {
      this.form.attr_id = '';
    },
    // 修改浏览量（修订版本）
    setViews(id, e) {
      const self = this;
      let n = /^[1-9]\d*$/;
      if (!n.test(e)) {
        this.$message.error('请输入正确的浏览量');
        return false;
      }
      if (self.timer) clearTimeout(self.timer);
      self.timer = setTimeout(function() {
        RequestNewsViewEdit({
          news_id: id,
          num: +e,
        }).then(res => {});

        self.timer = null;
      }, 300);
    },
    //修改浏览量
    editNewsVisitorNum(row) {
      var tableData = this.tableData;
      for (var i = 0; i < tableData.length; i++) {
        if (tableData[i].visit_num < 0) {
          tableData[i].visit_num = 0;
          row.visit_num = 0;
        } else {
          tableData[i].visit_num = parseInt(tableData[i].visit_num);
          row.visit_num = parseInt(row.visit_num);
        }
      }
      this.tableData = tableData;
      var args = {
        news_id: row.news_id,
        num: row.visit_num,
      };
      RequestNewsViewEdit(args).then(res => {});
    },
    // 获取投放模块
    getModule() {
      RequestModuleList().then(res => {
        this.moduleData = res.list;
      });
    },
    // 资讯列
    newList(_obj) {
      this.loading = true;
      let _data = Object.assign(JSON.parse(JSON.stringify(this.search)), _obj);
      _data['starttime'] = this.search.time ? this.search.time[0] : '';
      _data['endtime'] = this.search.time ? this.search.time[1] : '';
      for (const key in _data) {
        // 去除对象内多余的空值key
        if (_data[key] === '') {
          delete _data[key];
        }
      }
      let page = {page_size: this.page_size, current_page: this.current_page};
      // console.log(page, "page", this.current_page);
      let args = Object.assign(page, _data) || {};
      let self = this;
      RequestNewsList(args).then(res => {
        if (res) {
          if (res.list.length == 0 && this.current_page > 1) {
            this.current_page = +this.current_page - 1;
            this.newList();
          } else {
            self.tableData = res.list;
            self.count = res.total_num;
            this.loading = false;
          }
        }
      });
    },
    // 服务分类
    categoryList() {
      const self = this;
      RequestCategory({category_type: 1}).then(res => {
        //    console.log(res)
        if (res) {
          self.categoryData = self.categoryData.concat(res);
        }
      });
    },

    // 模块列表
    moduleList() {
      RequestModuleList({}).then(res => {
        var modulesOptions = this.modulesOptions;
        this.modulesOptions = modulesOptions.concat(res.list);
      });
    },
    // 查询
    selectionCotent() {
      this.current_page = 1;
      let args = {
        qt: this.search.qt,
        qa: this.search.qa,
        category_id: this.search.category_id,
      };
      this.newList(args);
    },
    // 时间切换
    timeOn(value) {
      this.search.order_time = value;
      let args = {order_time: value};
      this.newList(args);
    },
    // 分页选择
    pageChange(current) {
      // console.log("执行");
      this.current_page = current;
      let args = {current_page: current};
      this.newList(args);
    },
    releaseClick() {
      this.$router.push({
        name: 'addImgArticle',
        query: {news_id: '', active: this.active},
      });
    },
    // 编辑
    handEditor(row) {
      // if (typeof row.tags == "string") {
      //   row.tags = JSON.parse(row.tags);
      // }
      RequestNewsDetail({news_id: row.news_id}).then(res => {
        res.is_top == 1 ? (this.checked = false) : (this.checked = true);
        res.run_in = JSON.parse(res.run_in);
        res.news_pic_type = JSON.parse(res.news_pic_type);
        this.form = res;
        res.banner_pic
          ? (this.lunboImageUrl = res.IMAGE_HOST + res.banner_pic)
          : (this.lunboImageUrl = '');
        res.news_pic
          ? (this.news_pic = res.IMAGE_HOST + res.news_pic)
          : (this.news_pic = '');
        res.news_media
          ? (this.news_media = res.IMAGE_HOST + res.news_media)
          : (res.news_media = '');
        this.releaseDialog = true;
      });
    },
    backList() {
      this.newList({current_page: this.current});
      this.releaseDialog = false;
    },
    // 上下线
    handleOnline(row) {
      RequestNewsOnline({news_id: row.news_id, status: row.status}).then(
        res => {
          this.newList();
        }
      );
    },
    // z置顶
    handleTop(news_id) {
      RequestNewsTop({news_id}).then(res => {
        this.newList();
      });
    },
    tableSubmitExamine(row, type) {
      let _data = row;
      _data['submit_type'] = type;
      this.checked == false ? (_data.is_top = 1) : (_data.is_top = 2);
      for (const key in _data) {
        // 去除对象内多余的空值key
        if (_data[key] === '') {
          delete _data[key];
        }
        if (key == 'tags') {
          _data[key] = JSON.stringify(_data[key]);
        }
      }
      let args = _data;
      RequestNewsAudit({news_id: args.news_id}).then(res => {
        if (res.code == 2000) {
          this.newList({current_page: this.current_page});
        }
      });
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
      var status = this.search.status;
      if (status == 1) {
        this.$alert('如需删除，请先取消发布!', '提示', {
          confirmButtonText: '确定',
          type: 'error',
        });
        return;
      }
      for (let i in this.selectionValues) {
        selectionArr.push(this.selectionValues[i].news_id);
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          RequestNewsDelete({news_id: selectionArr.toString()}).then(res => {
            self.newList({current_page: this.current_page});
          });
          // this.$Message({
          //     type: 'success',
          //     text: '删除成功!'
          // });
        })
        .catch(() => {
          this.$Message({
            type: 'info',
            text: '已取消删除',
          });
        });
    },
    handleShowDliog() {
      this.listShowDialog = true;
    },
    // 上下线切换
    switchFn(active) {
      if (active == 1) {
        this.labelTitle = '上线时间';
        this.search.audit_status = '';
      } else if (active == 2) {
        this.labelTitle = '下线时间';
      }
      this.current_page = 1;
      this.search.status = active;
      this.active = active;
      this.newList({status: JSON.parse(active)});
    },
    // 拒绝原因
    refuseCase(mark) {
      this.refuseContent = '';
      this.refuseContent = mark;
      this.refuseDialogVisible = true;
    },
  },
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
    padding: 10px 0;
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
    margin-top: 10px;
    width: 100%;
    height: 90px;
  }
  // @media (min-width: 1562px) and (max-width: 1920px) {
  //   .img-resopnse {
  //     width: 80%;
  //   }
  // }

  // @media (min-width: 1920px) {
  //   .img-resopnse {
  //     width: 50%;
  //     text-align: center;
  //   }
  // }
}
</style>

