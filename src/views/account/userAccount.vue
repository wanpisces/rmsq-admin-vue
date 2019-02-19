<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>用户：</span>
          <el-input style="width:200px" placeholder="用户账号/单位名称" v-model="objSearch.q"></el-input>
        </div>
        <div class="search">
          <span>行政级别：</span>
          <el-select v-model="objSearch.type" placeholder="行政级别筛选" @change="selectId">
            <el-option v-for="item in levelData" :key="item.level" :label="item.level_name" :value="item.level">
            </el-option>
          </el-select>
        </div>
        <div class="search">
          <span>账号类型：</span>
          <el-select v-model="objSearch.group" placeholder="账号类型筛选" @change="selectId">
            <el-option key="0" label="全部" value="0"></el-option>
            <el-option key="1" label="普通" value="1"></el-option>
            <el-option key="2" label="单位" value="2"></el-option>
            <el-option key="3" label="代理商" value="3"></el-option>
          </el-select>
        </div>
        <div class="search">
          <el-button type="primary" icon="el-icon-search" @click="searchKeyword">搜索</el-button>
        </div>
      </div>
    </el-card>
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <div class="table-title">
          <div>
            <el-button v-if="perm.customerDele==1" type="danger" plain @click="tabelDelete()" :disabled="deleteMark">删除</el-button>
            <el-button v-for="(item, index) in switchData" :key="index" :type="objSearch.status == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
          </div>
          <div>
            <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->
            <choose-tab v-if="perm.customerAdd==1" @handleShowDliog="handleShowDliog" add-title="新增用户" @handleAdd="releaseClick()" @TimeOn="TimeOn">
            </choose-tab>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="selectionChange" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="编号" width="100" type="index">
          </el-table-column>
          <el-table-column label="账号" prop="admin_account">
          </el-table-column>
          <el-table-column label="账号类型" prop="admin_account">
            <template slot-scope="scope">
              <span>{{{"1":"普通","2":'单位','3':'代理商'}[scope.row.group]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位名称" prop="group_name">
          </el-table-column>
          <el-table-column label="行政级别">
            <template slot-scope="scope">
              <span>{{{"1":"社区","2":'街道',"3":'区',"4":'市',"5":"省"}[scope.row.group_type]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位地址" prop="group_location">
          </el-table-column>
          <el-table-column label="联系方式" prop="admin_tel">
          </el-table-column>
          <el-table-column label="到期时间" prop="expiredate">
          </el-table-column>
          <el-table-column label="小程序接入链接" width="120px">
            <template slot-scope="scope">
              <div @click="copyText($event)" style="cursor:pointer;border:1px  solid #e6e6e6;padding:2px;text-align:center;font-size:14px" :data-text="scope.row.wechat_connect_wxapp_link">
                复制链接
              </div>
            </template>
          </el-table-column>
          <el-table-column label="小程序备用链接" width="120px">
            <template slot-scope="scope">
              <div @click="copyText($event)" style="cursor:pointer;border:1px  solid #e6e6e6;padding:2px;text-align:center;font-size:14px" :data-text="scope.row.wechat_connect_wxapp_link_spare">
                复制链接
              </div>
            </template>
          </el-table-column>
          <el-table-column label="电子屏接入链接" width="120px">
            <template slot-scope="scope">
              <div @click="copyText($event)" style="cursor:pointer;border:1px  solid #e6e6e6;padding:2px;text-align:center;font-size:14px" :data-text="scope.row.wechat_connect_wxapp_link_digital">
                复制链接
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" v-if="perm.customerDetail==1||perm.customerEdit==1||perm.customerDele==1">
            <template slot-scope="scope">
              <el-button type="text" v-if="perm.customerDetail==1" @click="checkDetail(scope.row)">查看</el-button>
              <el-button type="text" v-if="perm.customerEdit==1" @click="handEditor(scope.row)">编辑</el-button>
              <el-button type="text" v-if="perm.customerDele==1" @click="deleteClassfiy(scope.row)">删除</el-button>
              <!-- <div class="el-icon-wrapper">
                <i v-if="perm.customerDetail==1" class="el-icon-view" title="查看" @click="checkDetail(scope.row)"></i>
                <i v-if="perm.customerEdit==1" class="el-icon-edit" title="编辑" @click="handEditor(scope.row)"></i>
                <i v-if="perm.customerDele==1" class="el-icon-delete" title="删除" @click="deleteClassfiy(scope.row)"></i>
              </div> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="margin-left: 20px;">
            <!-- <mo-paging :page-index="ruleForm.current_page" :total="total_num" :page-size="ruleForm.page_size" @change="pageChange">
            </mo-paging> -->
            <el-pagination background @current-change="pageChange" :current-page.sync="ruleForm.current_page" :page-size="ruleForm.page_size" layout="total,prev, pager, next, jumper" :total="total_num">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <textarea id="input">这是幕后黑手</textarea>
  </div>
</template>

<script>
import MoPaging from "@/components/Paginations.vue";
import Tinymce from "@/components/Tinymce/index.vue";
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue";
// import { RequestClassfiyList,RequestModuleList, DeleteNewsClassfiy,RequestClassfiyEdit,RequestClassfiyAdd,RequestClassfiyDetail} from '../../fetch/modules/info'
import { RequestCustomerList, RequestCustomerDelete } from "@/fetch/modules/account";
import { levelData } from "@/fetch/tool";
const rules = {
  name: [{ required: true, message: "请输入资讯标题", trigger: "blur" }, { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }]
};
export default {
  components: { MoPaging, ChooseTab },
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
        customerDetail: 2,
        customerAdd: 2,
        customerEdit: 2,
        customerDele: 2
      },
      rules,
      formTitle: "添加分类",
      select: "全部",
      modulesOptions: [], //选择搜索
      value: "",
      tableData: [],
      total_num: 0,
      levelData: levelData,
      // 发布编辑
      releaseDialog: false,
      objSearch: {
        role: 1,
        q: "",
        type: "",
        type: 0,
        group: "0",
        order_time: 2,
        current_page: 1,
        page_size: 10,
        status: "1"
      },
      ruleForm: {
        category_id: "",
        attr_id: "",
        attr_value: "",
        extra: "",
        pid: 0
      },
      switchData: [{ name: "全部", active: "1" }, { name: "快到期账号", active: "2" }], // 上线下线,
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true
    };
  },
  created() {
    // this. getListData();
    const args = this.objSearch;
    this.getCustomerList(args);
  },
  methods: {
    //获取栏目id
    getListData() {
      return new Promise((resolve, reject) => {
        RequestModuleList({}).then(res => {
          this.modulesOptions = [{ category_id: 0, category_name: "全部" }].concat(res.list);
        });
      });
    },
    //获取列表
    getCustomerList(args) {
      if (args.status == 2) {
        args.near_expiredate = 1;
      } else {
        args.near_expiredate = "";
      }
      for (let i in args) {
        if (args[i] === "") {
          delete args[i];
        }
      }
      RequestCustomerList(args).then(res => {
        this.tableData = res.list;
        this.total_num = res.total_num;
      });
    },
    //更改Id
    selectId(e) {
      this.objSearch.category_id = e;
      // var args = this.objSearch;
      // this.getClassfiyList(args);
    },
    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      var args = this.objSearch;
      this.getCustomerList(args);
    },
    // 搜索关键词
    searchKeyword() {
      this.objSearch.current_page = 1;
      var args = this.objSearch;
      this.getCustomerList(args);
    },
    //排序
    TimeOn(sort) {
      this.objSearch.order_time = sort;
      var args = this.objSearch;
      this.getCustomerList(args);
    },
    // 添加
    releaseClick() {
      this.$router.push({ name: "userAdd", query: {} });
    },
    //编辑信息
    handEditor(row) {
      const admin_id = row.admin_id;
      this.$router.push({ name: "userEdit", query: { admin_id: admin_id } });
    },
    // 查看信息
    checkDetail(row) {
      const admin_id = row.admin_id;
      this.$router.push({ name: "userDetail", query: { admin_id: admin_id } });
    },
    // 复制链接
    copyText(event) {
      // console.log("aaaa", event.target.getAttribute("data-text"));
      // console.log('aaaa',event.currentTarget.lastChild.lastChild.innerText)
      // let text = event.currentTarget.lastChild.lastChild.innerText;
      let text = event.target.getAttribute("data-text");
      var input = document.getElementById("input");
      input.value = text; // 修改文本框的内容
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      if (document.execCommand("copy")) {
        this.$message({
          message: "复制成功",
          type: "success"
        });
      }
      //   alert("复制成功");
    },
    // 批量选中
    selectionChange(vals) {
      this.selectionValues = vals;
      if (vals.length <= 0) {
        this.deleteMark = true;
      } else {
        this.deleteMark = false;
      }
    },
    //删除
    deleteClassfiy(row) {
      var admin_id = row.admin_id;
      this.deleteFn(admin_id);
    },
    //  批量删除
    tabelDelete() {
      const selectionValues = this.selectionValues;
      if (selectionValues.length == 0) {
        this.$message({
          showClose: true,
          message: "未选中任何选项！",
          type: "error"
        });
        return;
      }
      var admin_id = "";
      for (var i = 0; i < selectionValues.length; i++) {
        admin_id += selectionValues[i].admin_id + ",";
      }
      this.deleteFn(admin_id);
    },

    handleShowDliog() {
      this.listShowDialog = true;
    },
    switchFn(active) {
      this.current_page = 1;
      this.objSearch.status = active;
      this.active = active;
      this.getCustomerList(this.objSearch);
    },
    //删除请求
    deleteFn(admin_id) {
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestCustomerDelete({ id: admin_id }).then(res => {
            // console.log()
            var args = this.objSearch;
            this.getCustomerList(args);
            this.$Message({
              type: "success",
              text: "删除成功!"
            });
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .el-icon-wrapper {
    font-size: 20px;
    color: #409eff;
  }
  #input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -10;
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
  hr {
    color: #eee;
    background: #eee;
  }
  .detail-title {
    text-align: center;
    font-size: 26px;
    color: #353535;
  }
  .small-text {
    padding-right: 15px;
    text-align: right;
    font-size: 14px;
    color: #5d5d5d;
  }
  .detail-text {
    margin-top: 30px;
    text-indent: 25px;
    font-size: 16px;
    line-height: 28px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}
</style>

