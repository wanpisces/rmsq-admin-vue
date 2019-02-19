<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>搜索关键字：</span>
          <el-input style="width:200px" placeholder="手机号/微信昵称" v-model="objSearch.q"></el-input>
        </div>
        <div class="search">
          <span>注册时间：</span>
          <el-date-picker unlink-panels v-model="objSearch.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
          </el-date-picker>
        </div>

      </div>
      <div class="search-box">
        <div class="search search-address">
          <span>所在地：</span>
          <el-select v-model="objSearch.province_id" placeholder="省" @change="handleSelect(1)">
            <el-option v-for="item in provinceData" :key="item.id" :label="item.region_name_c" :value="item.id">
            </el-option>
          </el-select>
          <!-- v-if="cityData.length!=0" -->
          <el-select v-model="objSearch.city_id" placeholder="市" @change="handleSelect(2)">
            <el-option v-for="item in cityData" :key="item.id" :label="item.region_name_c" :value="item.id">
            </el-option>
          </el-select>
          <!-- v-if="areaData.length!=0" -->
          <el-select v-model="objSearch.area_id" placeholder="区/县" @change="handleSelect(3)">
            <el-option v-for="item in areaData" :key="item.id" :label="item.region_name_c" :value="item.id">
            </el-option>
          </el-select>
          <!-- v-if="streetData.length!=0" -->
          <el-select v-model="objSearch.street_id" placeholder="街道" @change="handleSelect(4)">
            <el-option v-for="item in streetData" :key="item.id" :label="item.region_name_c" :value="item.id">
            </el-option>
          </el-select>
          <!-- v-if="communityData.length!=0" -->
          <el-select v-model="objSearch.community_id" placeholder="社区">
            <el-option v-for="item in communityData" :key="item.id" :label="item.region_name_c" :value="item.id">
            </el-option>
          </el-select>

        </div>
        <div class="search search-address">
          <el-button type="primary" icon="el-icon-search" @click="searchKeyword">搜索</el-button>
        </div>
      </div>
    </el-card>
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <div class="table-title">
          <div>
            <el-select v-model="objSearch.sort" placeholder="街道" @change="handleRegisterTime()">
              <el-option :key="1" label="按注册时间由远到近" value="ASC"> </el-option>
              <el-option :key="2" label="按注册时间由近到远" value="DESC"> </el-option>
            </el-select>
            <el-select v-model="objSearch.source" placeholder="用户来源" @change="handleRegisterTime()">
              <el-option :key="0" label="全部来源" :value="0"> </el-option>
              <el-option :key="1" label="条形码/二维码/小程序码" :value="1"> </el-option>
              <el-option :key="2" label="公众号跳转" :value="2"> </el-option>
              <el-option :key="4" label="小程序" :value="4"> </el-option>
              <el-option :key="5" label="微信聊天" :value="5"> </el-option>
              <el-option :key="6" label="主入口" :value="6"> </el-option>
              <el-option :key="7" label="搜索栏" :value="7"> </el-option>
              <el-option :key="8" label="微信场景" :value="8"> </el-option>
              <el-option :key="9" label="其他" :value="3"> </el-option>
            </el-select>
          </div>
          <div>

          </div>
          <div>
            <!-- <el-button style="margin-left:10px" icon="el-icon-download" @click="exportVoteList(1)">全部导出</el-button> -->
            <el-button style="margin-left:10px" :disabled="deleteMark" icon="el-icon-download" @click="exportVoteList(2)">批量导出</el-button>
          </div>
        </div>
        <el-table :data="tableData" border @selection-change="selectionChange" height="500" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="用户ID" width="100" prop="user_id">
          </el-table-column>
          <el-table-column label="注册时间" prop="create_time">
          </el-table-column>
          <!-- <el-table-column label="微信号" prop="unionid"> -->
          <!-- </el-table-column> -->
          <el-table-column label="微信昵称" prop="user_nickname">
          </el-table-column>
          <el-table-column label="性别" prop="user_gender">
          </el-table-column>
          <el-table-column label="手机号" prop="user_phone">
          </el-table-column>
          <el-table-column label="所在地" prop="address">
          </el-table-column>
          <el-table-column label="用户来源" prop="source">
          </el-table-column>

          <!-- <el-table-column fixed="right" label="操作" width="150" v-if="perm.accountDetail==1||perm.accountEdit==1||perm.accountDel==1">
            <template slot-scope="scope">
              <el-button v-if="perm.accountDetail==1" type="text" @click="checkDetail(scope.row)">查看</el-button>
              <el-button v-if="perm.accountDetail==1" type="text" @click="checkDetail(scope.row)">禁用</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="table-footer">
          <div style="margin-left: 20px;">
            <!-- <mo-paging :page-index="objSearch.current_page" :total="total_num" :page-size="objSearch.page_size" @change="pageChange">
            </mo-paging> -->
            <el-pagination background @current-change="pageChange" @size-change="handleSizeChange" :page-sizes="[15, 30, 45, 60]" :current-page.sync="objSearch.current_page" :page-size="objSearch.page_size" layout="sizes,total,prev, pager, next, jumper" :total="total_num">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>

    <!--  详情 -->
    <!-- <el-dialog title="详情" :visible.sync="dialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import MoPaging from "@/components/Paginations.vue";
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue";
import { RequestUserList } from "@/fetch/modules/user";
import { RequestArea } from "@//fetch/modules/public.js";
import { getRole, removeRole } from "@/utils/auth";
import config from "@/fetch/config.js";
import { getToken } from "@/utils/auth";
const rules = {
  name: [{ required: true, message: "请输入资讯标题", trigger: "blur" }, { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }]
};
export default {
  components: { MoPaging, ChooseTab },
  beforeRouteEnter(to, from, next) {
    // next(vm => {
    //   to.meta.perm.forEach((item, index) => {
    //     vm.perm[item.perm_name] = item.is_select;
    //   });
    // });
    next(vm => {});
  },
  data() {
    return {
      rules,
      perm: {
        accountDetail: 1,
        accountAdd: 1,
        accountEdit: 1,
        accountDel: 1
      },
      formTitle: "添加分类",
      select: "全部",
      value: "",
      tableData: [],
      total_num: 0,
      // 发布编辑
      releaseDialog: false,
      objSearch: {
        role: 0,
        q: "",
        order_time: 2,
        current_page: 1,
        page_size: 15,
        time: [],
        province_id: "", // 省
        city_id: "", // 市
        area_id: "", // 区
        street_id: "", //街道
        community_id: "", // 社区,
        sort: "DESC",
        source: 0, // 来源,
        starttime: "",
        enttime: ""
      },
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      provinceData: [], //省
      cityData: [], // 市
      areaData: [], // 区
      streetData: [], //街道
      communityData: [], // 社区
      dialogVisible: false,
      pickerOptions: {
        disabledDate(time) {
          //  console.log('ssss',time)
          return time.getTime() >= Date.now();
        }
      }
    };
  },
  created() {
    this.handleChangeVue();
    var role_type = getRole("role_type");
    this.getArea({ upper_region: 0 });
  },
  methods: {
    //获取资讯分类列表
    getClassfiyList(args) {
      RequestUserList(args).then(res => {
        this.tableData = res.data.list;
        this.total_num = res.data.total_num;
      });
    },
    // 获取 地区
    getArea(obj) {
      let args = obj;
      RequestArea(args).then(res => {
        if (res.length != 0) {
          if (res[0].level == 1) {
            let _all = [
              {
                id: "",
                region_name_c: "全部省"
              }
            ];
            this.provinceData = [..._all, ...res];
          } else if (res[0].level == 2) {
            this.cityData = res;
            this.areaData = [];
            this.streetData = [];
            this.communityData = [];
          } else if (res[0].level == 3) {
            this.areaData = res;
            this.streetData = [];
            this.communityData = [];
          } else if (res[0].level == 4) {
            this.streetData = res;
            this.communityData = [];
          } else if (res[0].level == 5 && res.length != 0) {
            this.communityData = res;
          }
        }
      });
    },

    handleRegisterTime(val) {
      this.handleChangeVue();
    },
    handleSelect(val) {
      let _uppeRegion = "";
      if (val == 1) {
        this.cityData = [];
        this.areaData = [];
        this.streetData = [];
        this.communityData = [];
        this.objSearch.city_id = this.objSearch.area_id = this.objSearch.street_id = this.objSearch.community_id = "";
        _uppeRegion = this.objSearch.province_id;
      } else if (val == 2) {
        this.objSearch.area_id = this.objSearch.street_id = this.objSearch.community_id = "";
        _uppeRegion = this.objSearch.city_id;
      } else if (val == 3) {
        this.objSearch.street_id = this.objSearch.community_id = "";
        _uppeRegion = this.objSearch.area_id;
      } else if (val == 4) {
        this.objSearch.community_id = "";
        _uppeRegion = this.objSearch.street_id;
      }
      _uppeRegion ? this.getArea({ upper_region: _uppeRegion }) : "";
    },
    // 查看详情
    checkDetail(val) {
      this.dialogVisible = true;
    },
    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      this.handleChangeVue();
    },
    // 数据导出
    exportVoteList(val) {
      let _userId = this.selectionValues.toString();

      window.location.href = "api/admin/exportUsers" + "?token=" + getToken() + "&user_id=" + _userId + "&sort=" + this.objSearch.sort;
      // if (val == 1) {

      // } else {
      // }
    },
    handleSizeChange(pageSize) {
      this.objSearch.page_size = pageSize;
      this.handleChangeVue();
    },
    // 搜索关键词
    searchKeyword() {
      this.objSearch.current_page = 1;
      this.handleChangeVue();
    },
    handleChangeVue() {
      let _args = JSON.parse(JSON.stringify(this.objSearch));

      _args["starttime"] = this.objSearch.time ? this.objSearch.time[0] : "";
      _args["endtime"] = this.objSearch.time ? this.objSearch.time[1] : "";
      for (let i in _args) {
        i == "time" ? delete _args[i] : "";
        !_args[i] ? delete _args[i] : "";
      }
      this.getClassfiyList(_args);
    },
    // 批量选中
    selectionChange(vals) {
      this.selectionValues = vals.map((items, index) => {
        return items.user_id;
      });
      // console.log("ddddd", this.selectionValues);
      if (vals.length <= 0) {
        this.deleteMark = true;
      } else {
        this.deleteMark = false;
      }
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .search-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .el-icon-wrapper {
    font-size: 20px;
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
  .search-address {
    margin-top: 25px;
  }
  .search-address span {
    margin-right: 27px;
  }
}
</style>

